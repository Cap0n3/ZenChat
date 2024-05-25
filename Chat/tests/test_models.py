from django.test import TestCase
from unittest import skip
from django.contrib.auth import get_user_model
from Chat.models import ChatServer, Membership, Room, Message

CustomUser = get_user_model()

@skip("Skip for now")
class CustomUserModelTest(TestCase):
    """ Test the CustomUser model, if users can be created and authenticated. """
    def test_user_creation(self):
        user = CustomUser.objects.create_user(username="testuser", email="test@example.com", password="password")
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("password"))
        self.assertTrue(user.is_authenticated)

@skip("Skip for now")
class ChatServerModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", email="test@example.com", password="password")
        self.chat_server = ChatServer.objects.create(name="Test Server", description="A test server", owner=self.user)

    def test_server_creation(self):
        self.assertEqual(self.chat_server.name, "Test Server")
        self.assertEqual(self.chat_server.description, "A test server")
        self.assertEqual(self.chat_server.owner, self.user)

@skip("Skip for now")
class MembershipModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", email="test@example.com", password="password")
        self.user2 = CustomUser.objects.create_user(username="testuser2", email="test2@example.com", password="password")
        self.user3 = CustomUser.objects.create_user(username="testuser3", email="test3@example.com", password="password")
        self.chat_server = ChatServer.objects.create(name="Test Server", description="A test server", owner=self.user)
        self.membership = Membership.objects.create(user=self.user, server=self.chat_server, role="admin")
        self.membership2 = Membership.objects.create(user=self.user2, server=self.chat_server, role="member")
        self.membership3 = Membership.objects.create(user=self.user3, server=self.chat_server, role="moderator")

    def test_membership_creation(self):
        self.assertEqual(self.membership.user, self.user)
        self.assertEqual(self.membership.server, self.chat_server)
        self.assertEqual(self.membership.role, "admin")
        self.assertEqual(self.membership2.role, "member")
        self.assertEqual(self.membership3.role, "moderator")

@skip("Skip for now")
class RoomModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", email="test@example.com", password="password")
        self.chat_server = ChatServer.objects.create(name="Test Server", description="A test server", owner=self.user)
        self.room = Room.objects.create(chat_server=self.chat_server, name="Test Room", description="A test room")

    def test_room_creation(self):
        self.assertEqual(self.room.chat_server, self.chat_server)
        self.assertEqual(self.room.name, "Test Room")
        self.assertEqual(self.room.description, "A test room")

    def test_user_join_and_leave(self):
        self.room.join(self.user)
        self.assertIn(self.user, self.room.online.all())
        self.room.leave(self.user)
        self.assertNotIn(self.user, self.room.online.all())

#@skip("Skip for now")
class MessageModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", email="test@example.com", password="password")
        self.chat_server = ChatServer.objects.create(name="Test Server", description="A test server", owner=self.user)
        self.room = Room.objects.create(chat_server=self.chat_server, name="Test Room", description="A test room")
        self.message = Message.objects.create(user=self.user, room=self.room, content="Hello World")

    def test_message_creation(self):
        self.assertEqual(self.message.user, self.user)
        self.assertEqual(self.message.room, self.room)
        self.assertEqual(self.message.content, "Hello World")
        self.assertIsNotNone(self.message.timestamp)
    
    def test_message_reply(self):
        reply_message = Message.objects.create(user=self.user, room=self.room, content="Hello World 2", reply_to=self.message)
        self.assertEqual(reply_message.reply_to, self.message)
