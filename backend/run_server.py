#!/usr/bin/env python
"""
Script pour lancer Django sur le port 3100
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()
    
    # Remplacer les arguments pour spécifier le port
    sys.argv = ['manage.py', 'runserver', '127.0.0.1:3100']
    execute_from_command_line(sys.argv) 