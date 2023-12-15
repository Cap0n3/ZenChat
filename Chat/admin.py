from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import UserCreationForm, UserChangeForm, AdminChatServerForm
from .models import CustomUser, ChatServer, Membership


class CustomUserAdmin(UserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["email", "username", "is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["username"]}),
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
    list_display = ["user", "server", "role"]
    ordering = ["server", "user"]


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(ChatServer, ChatServerAdmin)
admin.site.register(Membership, MembershipAdmin)
