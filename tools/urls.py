from django.urls import path
from . import views

app_name = 'tools'

urlpatterns = [
    path('', views.index, name='index'),
    path('tool/<slug:slug>/', views.tool_page, name='tool_page'),
    path('api/modular-calc/', views.modular_calc_api, name='modular_calc_api'),
]
