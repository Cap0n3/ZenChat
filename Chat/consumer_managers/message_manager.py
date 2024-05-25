# chat/managers/message_manager.py

from asgiref.sync import async_to_sync
import json
import logging
from datetime import datetime
import random
from Chat.models import Message, CustomUser, Room

logger = logging.getLogger(__name__)

class ChatMessageManager:
    """
    Utility class to handle messages sent and received by a ChatConsumer.
    
    Parameters
    ----------
    consumer : ChatConsumer
        The ChatConsumer instance that will handle the message.
    """
    def __init__(self, consumer):
        self.consumer = consumer

    def handle_message(self, text_data):
        """ 
        Extract the message from the text data and handle it. 
        Check if it is a private message or a chat message and call the appropriate method. 
        """
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        reply_to_nonce = text_data_json.get("reply_to", None)

        if not self.consumer.user.is_authenticated:
            logger.warning(
                f"Unauthenticated user tried to send message to room {self.consumer.room_name}"
            )
            return

        if message.startswith("/pm"):
            self.handle_private_message(message)
        else:
            self.handle_chat_message(message, reply_to_nonce)

    def handle_private_message(self, message):
        """ Extract the target and message from the private message and send it to the target user. (Not fully implemented) """
        split = message.split(" ", 2)
        target = split[1]
        target_msg = split[2]
        timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")

        try:
            async_to_sync(self.consumer.channel_layer.group_send)(
                f"inbox_{target}",
                {
                    "type": "private_message",
                    "username": self.consumer.user.username,
                    "user_id": self.consumer.user.id,
                    "avatar": self.consumer.avatar.url,
                    "message": target_msg,
                    "timestamp": timestamp,
                },
            )
        except Exception as e:
            logger.error(f"Error while sending private message to {target}: {e}")
        else:
            logger.info(
                f"User {self.consumer.user.username} successfully sent private message ['{target_msg}'] to {target}"
            )

        self.consumer.send(
            json.dumps(
                {
                    "type": "private_message_delivered",
                    "target": target,
                    "message": target_msg,
                }
            )
        )

    def handle_chat_message(self, message, reply_to_nonce):
        """ Send the chat message to the room group and save it to the database. """
        timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")
        f_timestamp = datetime.now().timestamp()
        salt = random.random()
        message_hash = hash(f"{self.consumer.room.id}{f_timestamp}{self.consumer.user.id}{message}{salt}")
        message_nonce = f"msg_{self.consumer.room.id}_{self.consumer.user.id}_{message_hash}"
        
        reply_to_message = None
        if reply_to_nonce:
            reply_to_message = Message.objects.get(nonce=reply_to_nonce)

        async_to_sync(self.consumer.channel_layer.group_send)(
            self.consumer.room_group_name,
            {
                "type": "chat_message",
                "username": self.consumer.user.username,
                "user_id": self.consumer.user.id,
                "avatar": self.consumer.avatar.url,
                "message": message,
                "timestamp": timestamp,
                "nonce": message_nonce,
                "reply_to_username": reply_to_message.user.username if reply_to_message else "",
                "reply_to_message": reply_to_message.content if reply_to_message else "",
                "reply_to_nonce": reply_to_message.nonce if reply_to_message else "",
            },
        )

        # Save the message to the database
        Message.objects.create(user=self.consumer.user, room=self.consumer.room, content=message, nonce=message_nonce, reply_to=reply_to_message)
