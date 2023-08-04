from django.db import models


class Job(models.Model):
    job_number = models.CharField(max_length=10)
    created = models.DateTimeField('time created')
