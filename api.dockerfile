# Dockerfile optimisé
FROM python:3.9-slim

# Répertoire de travail
WORKDIR /app

# Copier uniquement ce qui est nécessaire
COPY api/app.py /app/api/
COPY api/requirements.txt /app/api/
COPY api/model/ /app/api/model/
COPY api/data/ /app/api/data/

# Installer uniquement les dépendances nécessaires
RUN pip install --no-cache-dir -r /app/api/requirements.txt

# Exposer le port utilisé par FastAPI
EXPOSE 8000

# Commande par défaut
CMD ["uvicorn", "api.app:app", "--host", "0.0.0.0", "--port", "8000"]