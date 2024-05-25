from channels.layers import get_channel_layer
from ZenChat.settings import logger
from Chat.models import Room, CustomUser
import json
from asgiref.sync import async_to_sync

class ChatConnectionManager:
    def __init__(self, consumer):
        self.consumer = consumer
        self.channel_layer = get_channel_layer()

    def initialize_room_and_user(self):
        try:
            self.consumer.room_name = self.consumer.scope["url_route"]["kwargs"]["room_name"]
            self.consumer.room_group_name = f"chat_{self.consumer.room_name}"
            self.consumer.room = Room.objects.get(name=self.consumer.room_name)
            self.consumer.user = self.consumer.scope["user"]
            self.consumer.avatar = CustomUser.objects.get(username=self.consumer.user.username).avatar
            self.consumer.user_inbox = f"inbox_{self.consumer.user.username}"
            logger.debug(f"Room and user initialized: {self.consumer.room_name}, {self.consumer.user.username}")
        except Room.DoesNotExist:
            logger.error(f"Room {self.consumer.room_name} does not exist.")
            raise
        except CustomUser.DoesNotExist:
            logger.error(f"User {self.consumer.user.username} does not exist.")
            raise

    def accept_connection(self):
        self.consumer.accept()
        if not self.consumer.user.is_authenticated:
            logger.warning(f"Unauthenticated user tried to join room {self.consumer.room_name}")
        else:
            logger.info(f"User {self.consumer.user.username} successfully connected to room {self.consumer.room_name}")

    def join_room_group(self):
        async_to_sync(self.channel_layer.group_add)(self.consumer.room_group_name, self.consumer.channel_name)
        logger.info(f"User {self.consumer.user.username} successfully joined room group {self.consumer.room_group_name}")

    def send_user_list(self):
        self.consumer.send(json.dumps({
            "type": "user_list",
            "users": [user.username for user in self.consumer.room.online.all()],
            "current_user_id": self.consumer.user.id,
        }))

    def setup_private_messaging(self):
        if self.consumer.user.is_authenticated:
            async_to_sync(self.channel_layer.group_add)(self.consumer.user_inbox, self.consumer.channel_name)
            logger.info(f"Private messaging setup for user {self.consumer.user.username}")

    def notify_room_join(self):
        if self.consumer.user.is_authenticated:
            async_to_sync(self.channel_layer.group_send)(
                self.consumer.room_group_name,
                {
                    "type": "user_join",
                    "username": self.consumer.user.username,
                },
            )
            self.consumer.room.online.add(self.consumer.user)
            logger.info(f"User {self.consumer.user.username} join event sent to room {self.consumer.room_name}")
