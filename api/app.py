import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from autogluon.timeseries import TimeSeriesPredictor, TimeSeriesDataFrame
from pydantic import BaseModel

# Configurer le logger
logger = logging.getLogger("prediction_api")
logger.setLevel(logging.INFO)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Création de l'application FastAPI
app = FastAPI()

logger.info("Démarrage de l'API...")

# Chargement du modèle
MODEL_PATH = "./model"
predictor = TimeSeriesPredictor.load(MODEL_PATH)
logger.info("Modèle chargé avec succès.")

# Chargement et préparation des données historiques
HISTORICAL_DATA_PATH = "data/truck_sales.csv"
historical_data = pd.read_csv(HISTORICAL_DATA_PATH)
historical_data["timestamp"] = pd.to_datetime(historical_data["Month-Year"], format="%y-%b")
historical_data = historical_data.rename(columns={"Number_Trucks_Sold": "target"})
historical_data = historical_data.drop(columns=["Month-Year"])
historical_data["item_id"] = "truck_sales"
historical_data = historical_data.sort_values(by="timestamp")

# Conversion en TimeSeriesDataFrame
historical_data = TimeSeriesDataFrame.from_data_frame(historical_data)
logger.info("Données historiques préparées.")

@app.post("/predict")
async def predict(request: Request):
    """
    Route FastAPI pour effectuer une prédiction sur une plage de dates.
    La requête doit contenir un JSON avec 2 objets :
        [
            {"timestamp": "2020-01-01"},
            {"timestamp": "2020-03-01"}
        ]
    """
    try:
        # Récupération du corps de la requête
        raw_data = await request.json()
        logger.info(f"Requête reçue : {raw_data}")

        # Vérification basique sur la structure des données
        if not isinstance(raw_data, list) or len(raw_data) != 2:
            logger.warning("Format de requête invalide.")
            raise HTTPException(status_code=400, detail="Input must be a list with exactly two objects")

        # Conversion des dates
        start_date = pd.to_datetime(raw_data[0]["timestamp"], errors="coerce")
        end_date = pd.to_datetime(raw_data[1]["timestamp"], errors="coerce")

        if pd.isnull(start_date) or pd.isnull(end_date):
            logger.warning("Format de date invalide.")
            raise HTTPException(status_code=400, detail="Invalid timestamp format")

        if end_date <= start_date:
            logger.warning("La date de fin est antérieure ou égale à la date de début.")
            raise HTTPException(status_code=400, detail="end_date must be after start_date")

        # Prédictions
        predictions = predictor.predict(historical_data)
        predictions.reset_index(inplace=True)
        predictions["timestamp"] = predictions["timestamp"].dt.strftime("%Y-%m-%d")

        # Filtrer selon les dates demandées
        predictions = predictions[
            (predictions["timestamp"] >= start_date.strftime("%Y-%m-%d")) &
            (predictions["timestamp"] <= end_date.strftime("%Y-%m-%d"))
        ]

        # Ajout de la colonne item_id
        predictions["item_id"] = "truck_sales"

        logger.info(f"Prédictions générées pour la période {start_date} - {end_date}")
        return predictions.to_dict(orient="records")

    except Exception as e:
        logger.error(f"Erreur interne : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    """Endpoint de vérification de l'état du service."""
    return {"status": "ok"}

# Point d'entrée (pour lancement avec python main.py)
# Sinon, utilisez uvicorn : uvicorn main:app --host 0.0.0.0 --port 8000 --reload
if __name__ == "__main__":
    import uvicorn
    logger.info("Lancement de l'API...")
    uvicorn.run(app, host="0.0.0.0", port=8000, debug=True)
