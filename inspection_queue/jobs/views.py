# pylint: disable=no-member
from django.shortcuts import render
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
    def split_time(avg: int):
        hours = avg // (60 * 60)
        minutes = (avg % (60 * 60)) // (60)
        seconds = (avg % (60))
        return hours, minutes, seconds

    tz = pytz.timezone('US/Central')
    context = {'jobs_list': [], 'average_pg': None, 'average_no_pg': None}
    jobs = list(Job.objects.all().order_by('created'))
    cj_avg_pg = CompleteJob.objects.filter(
        program_required=True).aggregate(Avg('delta'))['delta__avg']
    cj_avg_no_pg = CompleteJob.objects.filter(
        program_required=False).aggregate(Avg('delta'))['delta__avg']

    if cj_avg_pg != None:
        avg_pg = round(cj_avg_pg)
        hours, minutes, seconds = split_time(avg_pg)
        context['average_pg'] = str(hours) + 'h' + \
            str(minutes) + 'm' + str(seconds) + 's'

    if cj_avg_no_pg != None:
        avg_no_pg = round(cj_avg_no_pg)
        hours, minutes, seconds = split_time(avg_no_pg)
        context['average_no_pg'] = str(hours) + 'h' + \
            str(minutes) + 'm' + str(seconds) + 's'

    for i, job in enumerate(jobs):
        dt = job.created.astimezone(tz)
        context['jobs_list'].append({'idx': str(i + 1), 'job_number': job.job_number,
                                     'created': dt.isoformat(), 'program_required': job.program_required})

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
            program_required = json.loads(request.body)['program_required']
            cj = CompleteJob(job_number=job_number,
                             created=created, completed=now, delta=delta.total_seconds(), program_required=program_required)
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
def program_required(request):
    job_number = json.loads(request.body)['UPC']
    program_required = json.loads(request.body)['program_required']
    j = Job.objects.get(job_number=job_number)
