# Generated by Django 4.2.4 on 2023-08-08 19:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0004_completejob_delta'),
    ]

    operations = [
        migrations.AddField(
            model_name='completejob',
            name='program_required',
            field=models.BooleanField(default=False),
        ),
    ]
