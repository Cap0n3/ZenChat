from django.views.generic.edit import FormView
from django.views.generic import ListView
from django.views import View
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from .models import CustomUser, ChatServer, Membership, Room
from .forms import LoginForm, SignupForm, CreateServerForm, CreateRoomForm
from ZenChat.settings import logger

# ================== #
# === Core Views === #
# ================== #

class Home(View):
    template_name = "Chat/home.html"

    def get(self, request):
        return render(request, self.template_name)


class Dashboard(LoginRequiredMixin, ListView):
    template_name = "Chat/dashboard.html"
    model = CustomUser
    # context_object_name = "servers"
    form_class = CreateServerForm
    redirect_field_name = "login"

    def handle_no_permission(self):
        messages.error(self.request, "You must be logged in to access your dashboard. Please login or signup.")
        print(messages.error)
        return super().handle_no_permission()

    def instanciate_form(self):
        """
        Create a new instance of the form with the current user (Stay DRY)
        """
        return CreateServerForm(user=self.request.user)

    def get_common_context(self):
        # Get the servers of which the user is a member
        current_user = CustomUser.objects.get(pk=self.request.user.pk)
        joined_servers = Membership.objects.filter(user=current_user)
        user_role = joined_servers.values_list("role", flat=True)

        for server in joined_servers:
            logger.debug(f"Server: {server.server.name}, Role: {server.role}")

        return {
            "servers": ChatServer.objects.all(),
            "joined_servers": joined_servers,
            "form": self.instanciate_form(),
        }

    def post(self, request, *args, **kwargs):
        form = CreateServerForm(request.POST)
        current_user = CustomUser.objects.get(pk=request.user.pk)

        if form.is_valid():
            logger.debug(f"Form is valid: {form.cleaned_data}")
            form.instance.owner = current_user
            form.save()
            form = self.instanciate_form()
        else:
            logger.warning(f"Form is invalid: {form.errors}")

        context = self.get_common_context()
        return render(request, self.template_name, context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        common_context = self.get_common_context()
        context.update(common_context)
        return context


class Signup(FormView):
    form_class = SignupForm
    success_url = reverse_lazy("home")
    template_name = "registration/signup.html"

    def form_valid(self, form):
        # Create the user
        user = form.save()

        # Log the user in
        login(self.request, user)

        return super().form_valid(form)


class Login(FormView):
    form_class = LoginForm
    success_url = reverse_lazy("dashboard")
    template_name = "registration/login.html"

    def form_valid(self, form):
        credentials = form.cleaned_data

        # Authenticate the user
        user = authenticate(
            self.request,
            username=credentials["email"],
            password=credentials["password"],
        )

        # Login the user and redirect to success page or display error
        if user is not None:
            login(self.request, user)
            return HttpResponseRedirect(self.success_url)
        else:
            # Return form with error
            print("Invalid credentials. Please try again.")
            form.add_error(None, "Invalid credentials. Please try again.")
            return self.form_invalid(form)


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse_lazy("home"))

# ================== #
# === Chat Views === #
# ================== #

class ServerView(LoginRequiredMixin, View):
    template_name = "Chat/chat_server.html"
    redirect_field_name = "login"

    def handle_no_permission(self):
        messages.error(self.request, "You must be logged in to access a server. Please login or signup.")
        return super().handle_no_permission()
    
    def get(self, request, *args, **kwargs):
        server = ChatServer.objects.get(id=self.kwargs["pk"])
        current_user = CustomUser.objects.get(pk=request.user.pk)
        chat_rooms = Room.objects.filter(chat_server=server)
        
        if current_user not in server.members.all():
            logger.info(f"User {current_user.username} is previewing {server.name} but is not a member")
            context = {
                "server": server,
                "rooms": chat_rooms,
                "warning": "You are in preview mode. Join the server to access all features.",
            }
        else:
            user_role = Membership.objects.get(user=current_user, server=server).role
            logger.info(f"User {current_user.username} is a member of {server.name}. Role: {user_role}")    
            context = {
                "server": server,
                "form": CreateRoomForm(user_role=user_role),
                "rooms": chat_rooms,
            }

        return render(request, self.template_name, context)
    
    def post(self, request, *args, **kwargs):
        server = ChatServer.objects.get(id=self.kwargs["pk"])
        current_user = CustomUser.objects.get(pk=request.user.pk)
        user_role = Membership.objects.get(user=current_user, server=server).role

        form = CreateRoomForm(request.POST, user_role=user_role)

        if form.is_valid():
            logger.debug(f"Form is valid: {form.cleaned_data}")
            form.instance.chat_server = server
            form.save()
            form = CreateRoomForm(user_role=user_role)
        else:
            logger.warning(f"Form is invalid: {form.errors}")

        context = {
            "server": server,
            "rooms": Room.objects.filter(chat_server=server),
            "form": form,
        }

        return render(request, self.template_name, context)
    
class RoomView(LoginRequiredMixin, View):
    """
    Get the room name from the URL and return the room object. If the room does not exist, it is created.
    """

    template_name = "chat/room.html"
    redirect_field_name = "login"

    def handle_no_permission(self):
        messages.error(self.request, "You must be logged in to access a room. Please login or signup.")
        return super().handle_no_permission()

    def get(self, request, *args, **kwargs):
        server_instance = ChatServer.objects.get(id=self.kwargs["pk"])
        room_name = self.kwargs["room_name"]
        chat_room = Room.objects.get(
            chat_server=server_instance, name=room_name
        )

        context = {"room": chat_room}

        return render(request, self.template_name, context)