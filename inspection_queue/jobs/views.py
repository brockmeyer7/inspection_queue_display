# pylint: disable=no-member
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Avg
import datetime
from .models import Job, CompleteJob
import json
import pytz


@require_http_methods(['GET', 'POST'])
def index(request):
    tz = pytz.timezone('US/Central')
    context = {'jobs_list': [], 'average': None}
    jobs = list(Job.objects.all().order_by('created'))
    cj = CompleteJob.objects.aggregate(Avg('delta'))

    if cj['delta__avg'] != None:
        avg = round(cj['delta__avg'])
        hours = avg // (60 * 60)
        minutes = (avg % (60 * 60)) // (60)
        seconds = (avg % (60))
        context['average'] = str(hours) + 'h' + \
            str(minutes) + 'm' + str(seconds) + 's'

    for i, job in enumerate(jobs):
        dt = job.created.astimezone(tz)
        context['jobs_list'].append({'idx': str(i + 1), 'job_number': job.job_number,
                                     'created': dt.isoformat(), 'need_CMM': job.needs_CMM})

    return render(request, 'index.html', context)


@require_http_methods(['POST'])
@csrf_exempt
def update_jobs(request):
    if request.method == 'POST':
        tz = pytz.timezone('US/Central')
        active_jobs = list(Job.objects.all())
        jobs_list = [job.job_number for job in active_jobs]
        now = datetime.datetime.now().astimezone(
            pytz.timezone('US/Central')).isoformat()
        job_number = json.loads(request.body)['UPC']

        if job_number in jobs_list:
            j = Job.objects.get(job_number=job_number)
            created = j.created.astimezone(tz)
            completed = datetime.datetime.now().astimezone(tz)
            delta = completed - created
            cj = CompleteJob(job_number=job_number,
                             created=created, completed=now, delta=delta.total_seconds())
            cj.save()
            j.delete()
            return HttpResponse('Success')
        else:
            j = Job(job_number=job_number,
                    created=now)
            j.save()
            return HttpResponse('Success')


@require_http_methods(['POST'])
@csrf_exempt
def archive_job(request):
    if request.method == 'POST':
        job_number = json.loads(request.body)['UPC']
        job = Job.objects.filter(job_number=job_number)
        print(len(job))
        return HttpResponse('Success')
