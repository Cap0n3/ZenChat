from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import UserCreationForm, UserChangeForm, AdminChatServerForm
from .models import CustomUser, ChatServer, Membership, Room, Message


class CustomUserAdmin(UserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["email", "username", "avatar", "is_admin"]
    list_filter = ["is_admin"]
    # Admin category headers
    fieldsets = [
        ("Login infos", {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["username", "avatar"]}),
        ("Permissions", {"fields": ["is_admin"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "username", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email"]
    filter_horizontal = []


class ChatServerAdmin(admin.ModelAdmin):
    form = AdminChatServerForm

    list_display = ["name", "owner", "get_members"]

    def get_members(self, obj):
        return "\n".join([m.username for m in obj.members.all()])


class MembershipAdmin(admin.ModelAdmin):
    list_display = ["server", "user", "role"]
    ordering = ["server", "user"]

class MessageAdmin(admin.ModelAdmin):
    # Get room server
    def server(self, obj):
        return obj.room.chat_server
    
    list_display = ["room", "server", "user", "timestamp"]
    ordering = ["room", "timestamp"]

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(ChatServer, ChatServerAdmin)
admin.site.register(Membership, MembershipAdmin)
admin.site.register(Room)
admin.site.register(Message, MessageAdmin)
