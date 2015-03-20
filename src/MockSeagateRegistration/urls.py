from django.conf.urls import patterns, include, url
from django.contrib import admin
from MockSeagateRegistration.view import *

urlpatterns = patterns('',
    url(r'^hello/$', hello),
    url(r'^$', root),
    url(r'^(?P<serialNum>\w+)/$', registration),
#     url(r'^registration/(\d{4})/$', registration),
)