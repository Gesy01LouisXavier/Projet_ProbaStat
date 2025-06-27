# Dockerfile pour le backend Django
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances
COPY requirements.txt ./

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code du projet
COPY . .

# Exposer le port
EXPOSE 3100

# Commande de démarrage : appliquer les migrations puis lancer gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn backend.wsgi:application --bind 0.0.0.0:3100"]