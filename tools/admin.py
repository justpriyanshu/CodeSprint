from django.contrib import admin
from .models import ToolMetadata


@admin.register(ToolMetadata)
class ToolMetadataAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category', 'usage_count')
    list_filter = ('category',)
    search_fields = ('name', 'slug')
    readonly_fields = ('usage_count',)
