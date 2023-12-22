import django.db.models.signals
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .models import ChatServer, Membership
from ZenChat.settings import logger


# When a user created a new server, he is automatically added as a member and an admin
@receiver(m2m_changed, sender=ChatServer.members.through)
def add_owner_to_server(sender, instance, action, **kwargs):
    if action == "post_add":
        membership = Membership(user=instance.owner, server=instance, role="admin")
        membership.save()
        logger.info(f"[ChatServer m2m_changed()] Owner {instance.owner.username} added to new server {instance.name} as admin and member")