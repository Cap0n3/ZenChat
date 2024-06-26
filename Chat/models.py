"""
CustomUser and ChatServer:

- A CustomUser can own multiple ChatServer instances (owner field).
- A ChatServer can have multiple members, linked via the Membership model.

CustomUser and Membership:

- The Membership model links CustomUser to ChatServer with roles.

ChatServer and Room:

- A ChatServer can have multiple Room instances.

CustomUser and Room:

- Users can join and leave rooms, tracked by the online field in Room.

CustomUser and Message:

- A CustomUser can send multiple messages, linked via the user field in Message.

Room and Message:

- A Room can have multiple messages, linked via the room field in Message.
"""

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import CustomUserManager
from django.utils import timezone
from ZenChat.settings import logger


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=40, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    avatar = models.ImageField(upload_to="media/avatars/", default="avatars/default.webp", blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    def get_user_servers(self):
        "Returns all servers that the user owns."
        return ChatServer.objects.filter(owner=self)


class ChatServer(models.Model):
    name = models.CharField(max_length=40, unique=True)
    description = models.CharField(max_length=400)
    owner = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="owner"
    )
    members = models.ManyToManyField(
        CustomUser, through="Membership", related_name="members"
    )
    # messages = models.ManyToManyField(Message, related_name="messages")
    date_of_creation = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name


class Membership(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    server = models.ForeignKey(ChatServer, on_delete=models.CASCADE)

    # Using a choices field for roles
    ROLE_CHOICES = [
        ("member", "Member"),
        ("admin", "Admin"),
        ("moderator", "Moderator"),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="member", blank=False)

    # Raise an error if the user is already a member of the server (avoid double membership)
    class Meta:
        unique_together = ["user", "server"]


    def __str__(self):
        return (
            f"{self.user.username} in {self.server.name} as {self.get_role_display()}"
        )


class Room(models.Model):
    chat_server = models.ForeignKey(ChatServer, on_delete=models.CASCADE)
    name = models.CharField(max_length=40, unique=True)
    description = models.CharField(max_length=400)
    admins_only = models.BooleanField(default=False)
    online = models.ManyToManyField(CustomUser, related_name="online", blank=True)

    def get_online_count(self):
        return self.online.count()

    def join(self, user):
        self.online.add(user)
        self.save()

    def leave(self, user):
        self.online.remove(user)
        self.save()

    def __str__(self):
        return f"{self.name} ({self.get_online_count()}"
    

class Message(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="messages")
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    nonce = models.CharField(max_length=250, blank=True)
    reply_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')


    def formatted_timestamp(self):
        return self.timestamp.strftime('%d/%m/%Y %H:%M')

    def __str__(self):
        return f"{self.user.username}: {self.content} [{self.timestamp}]"