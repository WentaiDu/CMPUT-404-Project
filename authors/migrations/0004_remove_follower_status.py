# Generated by Django 3.2.8 on 2021-10-29 08:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authors', '0003_auto_20211029_0107'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='follower',
            name='status',
        ),
    ]