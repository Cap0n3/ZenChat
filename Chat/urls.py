from django.urls import path
from .views import (
    Home,
    Login,
    logout_view,
    Signup,
    Dashboard,
    ServerView,
)

urlpatterns = [
    path("", Home.as_view(), name="home"),
    path("signup/", Signup.as_view(), name="signup"),
    path("login/", Login.as_view(), name="login"),
    path("logout/", logout_view, name="logout"),
    path("dashboard/", Dashboard.as_view(), name="dashboard"),
    path("server/<int:pk>/", ServerView.as_view(), name="server"),
]
