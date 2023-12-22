from Chat.models import CustomUser, ChatServer, Membership


# Get all the users
users = CustomUser.objects.all()

# Get all the chat servers
servers = ChatServer.objects.all()

# Table of chat servers and their members + roles
for server in servers:
    print()
    print(f"{'=' * 40}")
    print(f"SERVER : {server.name}")
    print(f"{'=' * 40}")
    print(f"| {'USERNAME':^20} | {'ROLE':^10} |")
    print(f"{'=' * 40}")
    for member in server.members.all():
        membership = Membership.objects.get(user=member, server=server)
        print(f"| {member.username:^20} | {membership.role:^10} |")
    print(f"{'-' * 40}")
    print()
