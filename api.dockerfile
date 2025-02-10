# Dockerfile optimisé
FROM python:3.9-slim

# Répertoire de travail
WORKDIR /app

# Copier uniquement ce qui est nécessaire
COPY api /app

# Installer uniquement les dépendances nécessaires
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port utilisé par FastAPI
EXPOSE 8000

# Lancer l'API avec Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
