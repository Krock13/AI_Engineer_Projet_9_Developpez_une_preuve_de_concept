from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from autogluon.timeseries import TimeSeriesPredictor, TimeSeriesDataFrame

app = Flask(__name__)
CORS(app)

# Charger le prédicteur
MODEL_PATH = "./model"
predictor = TimeSeriesPredictor.load(MODEL_PATH)

# Charger les données historiques
HISTORICAL_DATA_PATH = "data/truck_sales.csv"
historical_data = pd.read_csv(HISTORICAL_DATA_PATH)

# Préparer les données historiques
historical_data["timestamp"] = pd.to_datetime(historical_data["Month-Year"], format="%y-%b")
historical_data = historical_data.rename(columns={"Number_Trucks_Sold": "target"})
historical_data = historical_data.drop(columns=["Month-Year"])
historical_data["item_id"] = "truck_sales"
historical_data = historical_data.sort_values(by="timestamp")

# Convertir en TimeSeriesDataFrame
historical_data = TimeSeriesDataFrame.from_data_frame(historical_data)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Récupérer les données envoyées par le client
        raw_data = request.get_json()

        if not isinstance(raw_data, list) or len(raw_data) != 2:
            return jsonify({"error": "Input must be a list with exactly two objects"}), 400

        # Extraire start_date et end_date
        start_date = pd.to_datetime(raw_data[0]["timestamp"], errors="coerce")
        end_date = pd.to_datetime(raw_data[1]["timestamp"], errors="coerce")

        if pd.isnull(start_date) or pd.isnull(end_date):
            return jsonify({"error": "Invalid timestamp format"}), 400

        if end_date <= start_date:
            return jsonify({"error": "end_date must be after start_date"}), 400

        # Faire la prédiction
        predictions = predictor.predict(historical_data)

        # Convertir en DataFrame et réindexer
        predictions.reset_index(inplace=True)
        predictions["timestamp"] = predictions["timestamp"].dt.strftime("%Y-%m-%d")

        # Filtrer les prédictions entre start_date et end_date
        predictions = predictions[
            (predictions["timestamp"] >= start_date.strftime("%Y-%m-%d")) &
            (predictions["timestamp"] <= end_date.strftime("%Y-%m-%d"))
        ]

        # ✅ Ajout manuel de "item_id" pour éviter l'erreur
        predictions["item_id"] = "truck_sales"

        return jsonify(predictions.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
