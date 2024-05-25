from django.test import TestCase
from channels.testing import WebsocketCommunicator
from Chat.consumers import ChatConsumer
from Chat.models import ChatServer, CustomUser, Room
from channels.layers import get_channel_layer
from unittest import skip


class ChatConsumerTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password", email="test@me.com")
        self.user.save()
        self.server = ChatServer.objects.create(name="testserver", owner=self.user)
        self.room = Room.objects.create(name="testroom", chat_server=self.server)
        self.channel_layer = get_channel_layer()

    @skip("Skip for now")
    async def test_connect(self):
        communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "ws/chat/testroom/")
        communicator.scope['user'] = self.user
        communicator.scope['url_route'] = {"kwargs": {"room_name": "testroom"}}

        # Test connection
        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)

        # Test if user list is received
        response = await communicator.receive_json_from()
        self.assertEqual(response["type"], "user_list")
        self.assertEqual(response["current_user_id"], self.user.id)
        
        # Test if user is notified of joining the room
        response = await communicator.receive_json_from()
        self.assertEqual(response["type"], "user_join")
        

        await communicator.disconnect()

    #@skip("Skip for now")
    async def test_receive_message(self):
        communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "ws/chat/testroom/")
        communicator.scope['user'] = self.user
        communicator.scope['url_route'] = {"kwargs": {"room_name": "testroom"}}

        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)

        response = await communicator.receive_json_from()
        self.assertEqual(response["type"], "user_list")
        
        response = await communicator.receive_json_from()
        self.assertEqual(response["type"], "user_join")
        
        await communicator.send_json_to({"message": "hello, this is a test message"})
        response = await communicator.receive_json_from()
        print(response)
        self.assertEqual(response["type"], "chat_message")
        self.assertEqual(response["message"], "hello, this is a test message")