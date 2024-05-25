from django.test import TestCase
from channels.testing import WebsocketCommunicator
from Chat.consumers import ChatConsumer
from Chat.models import ChatServer, CustomUser, Room, Message
from channels.layers import get_channel_layer
from unittest import skip


class ChatConsumerTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password", email="test@me.com")
        self.user.save()
        self.server = ChatServer.objects.create(name="testserver", owner=self.user)
        self.room = Room.objects.create(name="testroom", chat_server=self.server)
        self.message = Message.objects.create(user=self.user, room=self.room, content="hello, I'm an alien from outerspace !", nonce="msg_1_1_123456")
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
        self.assertEqual(response["username"], self.user.username)
        self.assertEqual(response["user_id"], self.user.id)
        self.assertEqual(response["avatar"], self.user.avatar.url)
        self.assertEqual(response["message"], "hello, this is a test message")
        self.assertIn("timestamp", response)
        self.assertIn("nonce", response)
        self.assertEqual(response["reply_to_username"], "")
        self.assertEqual(response["reply_to_message"], "")
        self.assertEqual(response["reply_to_nonce"], "")        
        
        await communicator.disconnect()
        
    @skip("Skip for now")
    async def test_reply_message(self):
        communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "ws/chat/testroom/")
        communicator.scope['user'] = self.user
        communicator.scope['url_route'] = {"kwargs": {"room_name": "testroom"}}

        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)

        response = await communicator.receive_json_from()
        self.assertEqual(response["type"], "user_list")
        
        response = await communicator.receive_json_from()
        self.assertEqual(response["type"], "user_join")
        
        # Send a reply message
        await communicator.send_json_to({"message": "No way ! Prove it !", "reply_to": self.message.nonce})
        response = await communicator.receive_json_from()
        print(response)
        self.assertEqual(response["type"], "chat_message")
        self.assertEqual(response["message"], "No way ! Prove it !")
        self.assertEqual(response["reply_to_username"], self.user.username)
        self.assertEqual(response["reply_to_nonce"], self.message.nonce)
        self.assertEqual(response["reply_to_message"], self.message.content)
        
        await communicator.disconnect()