# Generated by Django 4.2.4 on 2023-08-08 21:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0005_completejob_program_required'),
    ]

    operations = [
        migrations.RenameField(
            model_name='job',
            old_name='needs_CMM',
            new_name='program_required',
        ),
    ]
