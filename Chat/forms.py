from .models import CustomUser
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from .models import CustomUser, ChatServer, Room, Membership


# ========================= #
# ====== Admin forms ====== #
# ========================= #


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""

    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(
        label="Password confirmation", widget=forms.PasswordInput
    )

    class Meta:
        model = CustomUser
        fields = ["email", "username"]

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    disabled password hash display field.
    """

    password = ReadOnlyPasswordHashField()

    class Meta:
        model = CustomUser
        fields = ["email", "password", "username", "is_active", "is_admin"]


class AdminChatServerForm(forms.ModelForm):
    class Meta:
        model = ChatServer
        fields = "__all__"
        widgets = {
            "description": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter server description",
                    "rows": 3,
                }
            ),
        }


# ================================== #
# ====== Login & Signup forms ====== #
# ================================== #


class LoginForm(forms.Form):   
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={"class": "form-control"}),
        label="Email"
    )
    
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control"}),
        label="Password"
    )

class SignupForm(forms.ModelForm):
    # Add password confirmation field
    password2 = forms.CharField(
        label="Password confirmation", widget=forms.PasswordInput
    )

    class Meta:
        model = CustomUser
        fields = ["email", "username", "password", "password2"]
        widgets = {"password": forms.PasswordInput()}  # Password should be hidden

    # Check that the two password entries match
    def clean_password2(self):
        password1 = self.cleaned_data.get("password")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    # Hash the password
    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        user.save()
        return user


# ======================== #
# ====== Chat forms ====== #
# ======================== #


class CreateServerForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        # Get the user from the kwargs (passed from the view)
        self.user = kwargs.pop("user", None)
        super(CreateServerForm, self).__init__(*args, **kwargs)

        if self.user:
            # Exclude the current user from the list of users to invite
            registered_users = CustomUser.objects.exclude(pk=self.user.pk)
            self.fields["members"].queryset = registered_users

    class Meta:
        model = ChatServer
        fields = ["name", "description", "members"]
        labels = {
            "name": "Server Name",
            "members": "Invite registered users",
        }
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter server name",
                }
            ),
            "description": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter server description",
                    "rows": 3,
                }
            ),
            "members": forms.SelectMultiple(
                attrs={
                    "class": "form-control selectpicker",
                    "data-live-search": "true",
                },
                choices=CustomUser.objects.all(),
            ),
            "isPublic": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }

class CreateRoomForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        # Extract user_role from kwargs and pop it to prevent it from being passed to the parent class
        user_role = kwargs.pop('user_role', None)
        super(CreateRoomForm, self).__init__(*args, **kwargs)
        
        if user_role != "admin":
            # If the user is not an admin, remove the admins_only field
            self.fields.pop("admins_only")

    class Meta:
        model = Room
        fields = ["name", "description", "admins_only"]        
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter room name'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Enter room description', 'rows': 3}),
            'admins_only': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }