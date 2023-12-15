from django.db.models.signals import m2m_changed
from django.dispatch import receiver

from .models import ChatServer


@receiver(m2m_changed, sender=ChatServer.members.through)
def remove_owner_from_members(sender, instance, action, **kwargs):
    """
    Removes the owner from the members list when they create a new chat server.
    """
    if action == "post_add":
        instance.members.remove(instance.owner)
