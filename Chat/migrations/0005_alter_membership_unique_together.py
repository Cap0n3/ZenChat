# Generated by Django 5.0 on 2023-12-22 11:18

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("Chat", "0004_alter_membership_unique_together"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="membership",
            unique_together={("user", "server")},
        ),
    ]
