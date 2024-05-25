from ZenChat.settings import logger
from django.conf import settings
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import CustomUser, Room, Message
from datetime import datetime
import random


class ChatConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None
        self.avatar = None
        self.user_inbox = None  # For private messaging ()

        logger.debug("[***] ChatConsumer created [***]")

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        self.room = Room.objects.get(name=self.room_name)
        self.user = self.scope["user"]
        self.avatar = CustomUser.objects.get(username=self.user.username).avatar
        self.user_inbox = f"inbox_{self.user.username}"

        logger.debug(f"Received scope: {self.scope}")

        # Connextion has to be accepted
        self.accept()

        # Log the connection
        if not self.user.is_authenticated:
            logger.warning(f"Unauthenticated user tried to join room {self.room_name}")
        else:
            logger.info(
                f"User {self.user.username} successfully connected to room {self.room_name}"
            )

        # Join or create the room
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        logger.info(
            f"User {self.user.username} successfully joined room {self.room_name}"
        )

        # === Generate List Event === #
        # Send the user list to the newly joined user
        self.send(
            json.dumps(
                {
                    "type": "user_list",
                    "users": [user.username for user in self.room.online.all()],
                    "current_user_id": self.user.id, # Used to identify the current user in the frontend
                }
            )
        )

        if self.user.is_authenticated:
            # === Private Messaging === #
            # Create a user inbox for private messaging
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox, self.channel_name
            )

            # === Generate Join Event === #
            # Send the join event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "user_join",
                    "username": self.user.username,
                },
            )
            self.room.online.add(self.user)

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )

        logger.info(
            f"User {self.user.username} successfully left room {self.room_name}"
        )

        if self.user.is_authenticated:
            # === Private Messaging === #
            # Delete the user inbox for private messaging
            async_to_sync(self.channel_layer.group_discard)(
                self.user_inbox,
                self.channel_name,
            )
            logger.debug(
                f"User {self.user.username} successfully deleted inbox {self.user_inbox}"
            )

            # === Generate Leave Event === #
            # Send leave event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "user_leave",
                    "username": self.user.username,
                },
            )
            logger.debug(
                f"Sent leave event to room {self.room_name} for user {self.user.username}"
            )

            self.room.online.remove(self.user)

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")
        f_timestamp = datetime.now().timestamp() # Float timestamp for message hash (nonce)

        if not self.user.is_authenticated:
            logger.warning(
                f"Unauthenticated user tried to send message to room {self.room_name}"
            )
            return
        else:
            logger.info(
                f"User {self.user.username} successfully sent message ['{message}'] to room {self.room_name}"
            )

        # === Private Messaging === #
        if message.startswith("/pm"):
            split = message.split(" ", 2)
            target = split[1]
            target_msg = split[2]

            # Send private message event to the target user
            try:
                async_to_sync(self.channel_layer.group_send)(
                    f"inbox_{target}",
                    {
                        "type": "private_message",
                        "username": self.user.username,
                        "user_id": self.user.id,
                        "avatar": self.avatar.url,
                        "message": target_msg,
                        "timestamp": timestamp,
                    },
                )
            except Exception as e:
                logger.error(f"Error while sending private message to {target}: {e}")
                return
            else:
                logger.info(
                    f"User {self.user.username} successfully sent private message ['{target_msg}'] to {target}"
                )

            # Send private message delivered to the sender
            self.send(
                json.dumps(
                    {
                        "type": "private_message_delivered",
                        "target": target,
                        "message": target_msg,
                    }
                )
            )
            return

        # === Generate Message Event === #
        # Create unique int identifier for the message (nonce)
        salt = random.random()
        message_hash = hash(f"{self.room.id}{f_timestamp}{self.user.id}{message}{salt}")
        message_nonce = f"msg_{self.room.id}_{self.user.id}_{message_hash}"

        # Send chat message event to the room
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "username": self.user.username,
                "user_id": self.user.id,
                "avatar": self.avatar.url,
                "message": message,
                "timestamp": timestamp,
                "nonce": message_nonce,
            },
        )

        # Backup message in model
        Message.objects.create(user=self.user, room=self.room, content=message, nonce=message_nonce)

    # === Message Types ===
    def chat_message(self, event):
        self.send(text_data=json.dumps(event))

    def user_join(self, event):
        self.send(text_data=json.dumps(event))

    def user_leave(self, event):
        self.send(text_data=json.dumps(event))

    def private_message(self, event):
        self.send(text_data=json.dumps(event))

    def private_message_delivered(self, event):
        self.send(text_data=json.dumps(event))