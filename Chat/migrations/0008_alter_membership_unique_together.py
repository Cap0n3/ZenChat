# Generated by Django 5.0 on 2023-12-15 14:43

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("Chat", "0007_alter_room_description"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="membership",
            unique_together={("user", "server")},
        ),
    ]