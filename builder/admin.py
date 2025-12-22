"""
Django admin configuration for Resume model.
"""

from django.contrib import admin
from django.utils.html import format_html
from .models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    """Admin interface for Resume model."""
    
    list_display = (
        'title',
        'full_name',
        'email',
        'section_count_display',
        'updated_at',
    )
    list_filter = (
        'created_at',
        'updated_at',
    )
    search_fields = (
        'title',
        'full_name',
        'email',
    )
    readonly_fields = (
        'created_at',
        'updated_at',
        'section_count_display',
    )
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'title',
                'full_name',
                'email',
                'phone',
                'location',
            )
        }),
        ('Links', {
            'fields': (
                'linkedin',
                'github',
            ),
            'classes': ('collapse',)
        }),
        ('Content', {
            'fields': (
                'summary',
            )
        }),
        ('Structured Sections', {
            'fields': (
                'education',
                'experience',
                'projects',
                'skills',
            ),
            'description': 'These fields store JSON data for structured resume sections.',
        }),
        ('Metadata', {
            'fields': (
                'created_at',
                'updated_at',
                'section_count_display',
            ),
            'classes': ('collapse',)
        }),
    )
    
    def section_count_display(self, obj):
        """Display count of entries in each section."""
        counts = obj.get_section_count()
        return format_html(
            '<strong>Education:</strong> {}<br>'
            '<strong>Experience:</strong> {}<br>'
            '<strong>Projects:</strong> {}<br>'
            '<strong>Skills:</strong> {}',
            counts['education'],
            counts['experience'],
            counts['projects'],
            counts['skills'],
        )
    section_count_display.short_description = 'Section Counts'
    
    date_hierarchy = 'updated_at'
    ordering = ('-updated_at',)
