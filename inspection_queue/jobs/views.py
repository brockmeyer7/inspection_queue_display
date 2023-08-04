from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
import datetime


@require_http_methods(['GET', 'POST'])
def index(request):
    date = datetime.datetime.now().isoformat()
    context = {'jobs_list': [
        {'idx': str(1), 'job_number': '17850-01', 'created': date}, {'idx': str(2), 'job_number': '17852-01', 'created': date}]}
    return render(request, 'index.html', context)


@require_http_methods(['GET', 'POST'])
def add_job(request):
    if request.method == 'POST':
        pass
    if request.method == 'GET':
        return render(request, 'add_job.html')