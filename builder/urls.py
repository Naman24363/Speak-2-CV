from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("new/", views.resume_create, name="resume_create"),
    path("r/<int:resume_id>/edit/", views.resume_edit, name="resume_edit"),
    path("r/<int:resume_id>/preview/", views.resume_preview, name="resume_preview"),
    path("r/<int:resume_id>/export/pdf/", views.export_pdf, name="export_pdf"),
    path("r/<int:resume_id>/export/docx/", views.export_docx, name="export_docx"),
    path("r/<int:resume_id>/delete/", views.delete_resume, name="delete_resume"),
]
