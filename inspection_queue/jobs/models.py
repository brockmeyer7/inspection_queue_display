from django.db import models


class Job(models.Model):
    job_number = models.CharField(max_length=10, unique=True)
    created = models.DateTimeField()
    program_required = models.BooleanField(default=False)


class CompleteJob(models.Model):
    job_number = models.CharField(max_length=10)
    created = models.DateTimeField()
    completed = models.DateTimeField()
    delta = models.FloatField(default=0)
    program_required = models.BooleanField(default=False)
