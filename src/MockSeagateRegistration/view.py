from django.shortcuts import render,render_to_response
from django.http import HttpResponse

def hello(request):
    return HttpResponse("Hello world ! ")

def registration(request, serialNum):
    return_value = "Serial Number Received >> %s" %(serialNum)
    print return_value
    
#     return HttpResponse(return_value)
    return render_to_response('index.html',{
                                            'serialNum':serialNum,
                                            })

def root(request):
    return HttpResponse('ok') 