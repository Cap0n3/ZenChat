from ZenChat.settings import logger
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .consumer_managers.connection_manager import ChatConnectionManager
from .consumer_managers.message_manager import ChatMessageManager

class ChatConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None
        self.avatar = None
        self.user_inbox = None  # For private messaging
        self.connection_manager = ChatConnectionManager(self)
        self.message_manager = ChatMessageManager(self)

        logger.debug("[***] ChatConsumer created [***]")

    def connect(self):
        try:
            self.connection_manager.initialize_room_and_user()
            self.connection_manager.accept_connection()
            self.connection_manager.join_room_group()
            self.connection_manager.send_user_list()
            self.connection_manager.setup_private_messaging()
            self.connection_manager.notify_room_join()
        except Exception as e:
            logger.error(f"Error during connection: {e}")
            self.close()

    def disconnect(self, close_code):
        try:
            self.connection_manager.leave_room_group()
            self.connection_manager.delete_private_inbox()
            self.connection_manager.notify_room_leave()
        except Exception as e:
            logger.error(f"Error during disconnection: {e}")
            self.close()

    def receive(self, text_data=None, bytes_data=None):
        """ Called when a message is received from the WebSocket."""
        self.message_manager.handle_message(text_data)

    # === Message Types === #
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