"""
Management command to create sample resume for testing/demo purposes.

Usage:
    python manage.py create_sample_resume
"""

from django.core.management.base import BaseCommand
from builder.models import Resume


class Command(BaseCommand):
    help = 'Create a sample resume for testing and demonstration'

    def handle(self, *args, **options):
        """Create sample resume with test data."""
        resume = Resume.objects.create(
            title="Sample Resume",
            full_name="John Doe",
            email="john@example.com",
            phone="+1 (555) 123-4567",
            location="San Francisco, CA",
            linkedin="https://linkedin.com/in/johndoe",
            github="https://github.com/johndoe",
            summary="Experienced software engineer with 5+ years building web applications.",
            education=[
                {
                    "degree": "B.S. Computer Science",
                    "institution": "Stanford University",
                    "dates": "2018–2020",
                    "details": "GPA: 3.8"
                }
            ],
            experience=[
                {
                    "role": "Senior Software Engineer",
                    "company": "Tech Corp",
                    "dates": "2022–Present",
                    "bullets": [
                        "Led development of microservices architecture",
                        "Mentored 3 junior engineers",
                        "Reduced API latency by 40%"
                    ]
                },
                {
                    "role": "Software Engineer",
                    "company": "StartupXYZ",
                    "dates": "2020–2022",
                    "bullets": [
                        "Built core platform features using Django and React",
                        "Implemented CI/CD pipeline"
                    ]
                }
            ],
            projects=[
                {
                    "name": "Resume Builder",
                    "tech": "Django, Web Speech API, ReportLab",
                    "bullets": [
                        "Voice-powered resume creation tool",
                        "Exports to PDF and DOCX formats"
                    ]
                }
            ],
            skills=["Python", "Django", "JavaScript", "React", "PostgreSQL", "Docker", "AWS"]
        )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created sample resume (ID: {resume.id})')
        )
