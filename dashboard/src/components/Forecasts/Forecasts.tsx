import { useState } from "react";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Prediction {
  timestamp: string;
  mean: number;
  "0.2": number;
  "0.8": number;
}

function Forecast() {
  const dateOptions = [];
  const currentDate = new Date("2015-01-01");
  const end = new Date("2016-12-01");

  while (currentDate <= end) {
    dateOptions.push(currentDate.toISOString().split("T")[0]);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const [startDate, setStartDate] = useState(dateOptions[0]);
  const [endDate, setEndDate] = useState(dateOptions[dateOptions.length - 1]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  async function handlePrediction() {
    const URL = "http://127.0.0.1:5000/predict";

    if (!startDate || !endDate) {
      alert("Sélectionnez une date de début et une date de fin !");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("La date de début doit être avant la date de fin.");
      return;
    }

    setLoading(true);
    try {
      const requestBody = [{ timestamp: startDate }, { timestamp: endDate }];

      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la requête API");
      }

      const predictionData = await response.json();
      setPredictions(predictionData);
    } catch (error) {
      console.error("Erreur API :", error);
      alert("Erreur lors de la prédiction.");
    } finally {
      setLoading(false);
    }
  }

  const chartData = {
    labels: predictions.map((p) => p.timestamp),
    datasets: [
      // Ligne verte pour "mean"
      {
        label: "Prédiction (mean)",
        data: predictions.map((p) => parseFloat(p.mean.toFixed(2))), // Convertir en nombre
        borderColor: "green",
        backgroundColor: "transparent",
        fill: false,
      },
      // Zone orange claire (0.2 à 0.8)
      {
        label: "Intervalle de confiance",
        data: predictions.map((p) => parseFloat(p["0.8"].toFixed(2))), // Convertir en nombre
        fill: 1,
        backgroundColor: "rgba(255,165,0,0.3)",
        borderColor: "transparent",
      },
      {
        data: predictions.map((p) => parseFloat(p["0.2"].toFixed(2))), // Convertir en nombre
        fill: 1,
        backgroundColor: "rgba(255,165,0,0.3)",
        borderColor: "transparent",
        label: undefined, // Supprimer de la légende
        showLine: false, // Pas de ligne affichée
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          filter: (legendItem: { text?: string }) => {
            // Exclure les datasets sans label
            return legendItem.text !== undefined;
          },
        },
      },
    },
  };

  return (
    <Card>
      <h2>🔮 Prédictions</h2>
      <div>
        <label>Date de début :</label>
        <select
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        >
          {dateOptions.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>

        <label>Date de fin :</label>
        <select value={endDate} onChange={(e) => setEndDate(e.target.value)}>
          {dateOptions.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>

        <Button onClick={handlePrediction} disabled={loading}>
          {loading ? "Chargement..." : "Prédire"}
        </Button>

        {predictions.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Prédiction (mean)</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, i) => (
                  <tr key={i}>
                    <td>{pred.timestamp}</td>
                    <td>{pred.mean.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Line data={chartData} options={chartOptions} />
          </>
        )}
      </div>
    </Card>
  );
}

export default Forecast;
