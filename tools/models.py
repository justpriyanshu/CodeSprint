from django.db import models


class ToolMetadata(models.Model):
    """Tracks page visits and metadata for each tool."""

    CATEGORY_CHOICES = [
        ('graph', 'Graph & Structural Parsers'),
        ('math', 'Algorithmic Math & Analytics'),
        ('syntax', 'Syntax Boilerplate & Macro Builders'),
    ]

    name = models.CharField(max_length=120, help_text="Display name of the tool")
    slug = models.SlugField(unique=True, help_text="URL-safe identifier")
    category = models.CharField(max_length=60, choices=CATEGORY_CHOICES)
    usage_count = models.PositiveIntegerField(default=0, help_text="Atomic visit counter")

    class Meta:
        ordering = ['category', 'name']
        verbose_name = 'Tool Metadata'
        verbose_name_plural = 'Tool Metadata'

    def __str__(self):
        return f"{self.name} ({self.usage_count} uses)"
