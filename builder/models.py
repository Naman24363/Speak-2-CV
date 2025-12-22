from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


class Resume(models.Model):
    """
    Resume model storing both basic contact information and structured JSON sections.
    Timestamps track creation and last modification.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Basic info
    title = models.CharField(max_length=120, default="My Resume", help_text="Title for this resume")
    full_name = models.CharField(max_length=120, blank=True, help_text="Your full name")
    email = models.EmailField(blank=True, help_text="Contact email address")
    phone = models.CharField(max_length=40, blank=True, help_text="Contact phone number")
    location = models.CharField(max_length=120, blank=True, help_text="City, State or location")
    linkedin = models.URLField(blank=True, help_text="LinkedIn profile URL")
    github = models.URLField(blank=True, help_text="GitHub profile URL")
    summary = models.TextField(blank=True, help_text="Professional summary or objective")

    # Structured sections (stored as JSON)
    education = models.JSONField(
        default=list, 
        blank=True,
        help_text="List of education entries with degree, institution, dates, details"
    )
    experience = models.JSONField(
        default=list, 
        blank=True,
        help_text="List of experience entries with role, company, dates, bullets"
    )
    projects = models.JSONField(
        default=list, 
        blank=True,
        help_text="List of project entries with name, tech, bullets"
    )
    skills = models.JSONField(
        default=list, 
        blank=True,
        help_text="List of skill strings"
    )

    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['-updated_at']),
            models.Index(fields=['title']),
        ]
        verbose_name = "Resume"
        verbose_name_plural = "Resumes"

    def __str__(self):
        """Return a readable string representation of the resume."""
        name = self.full_name or 'Unnamed'
        return f"{self.title} — {name}"

    def clean(self):
        """Validate model data before saving."""
        if not self.title:
            raise ValidationError({'title': 'Title is required.'})
        if not self.full_name:
            raise ValidationError({'full_name': 'Full name is required.'})
        if not self.email:
            raise ValidationError({'email': 'Email is required.'})
        if not self.phone:
            raise ValidationError({'phone': 'Phone is required.'})

    def get_section_count(self):
        """Return count of education, experience, and project entries."""
        return {
            'education': len(self.education or []),
            'experience': len(self.experience or []),
            'projects': len(self.projects or []),
            'skills': len(self.skills or []),
        }

