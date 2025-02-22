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
import "./Forecasts.css";

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

interface ForecastData {
  dates: string[];
  sales: number[];
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  kdeValues: number[];
  salesBins: string[];
  salesFrequencies: number[];
}

interface ForecastProps {
  data: ForecastData;
}

export type { ForecastData };

const Forecast: React.FC<ForecastProps> = ({ data }) => {
  if (import.meta.env.MODE === "development") {
    console.log("Données reçues dans Forecast :", data);
  }
  // Génération des options de dates
  const generateDateOptions = () => {
    const options: string[] = [];
    const startDate = new Date("2015-01-01");
    const endDate = new Date("2016-12-01");

    for (
      let d = new Date(startDate);
      d <= endDate;
      d = new Date(d.setMonth(d.getMonth() + 1))
    ) {
      options.push(d.toISOString().split("T")[0]);
    }

    return options;
  };

  const dateOptions = generateDateOptions();
  const [startDate, setStartDate] = useState(dateOptions[0]);
  const [endDate, setEndDate] = useState(dateOptions[dateOptions.length - 1]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  // Gestion de la prédiction
  async function handlePrediction() {
    const URL =
      "https://appproof-crbfdufzeth9drev.francecentral-01.azurewebsites.net/predict";

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

  // Configuration des données pour Chart.js
  const chartData = {
    labels: predictions.map((p) => p.timestamp),
    datasets: [
      {
        label: "Prédiction (mean)",
        data: predictions.map((p) => parseFloat(p.mean.toFixed(2))),
        borderColor: "green",
        backgroundColor: "transparent",
        fill: false,
      },
      {
        label: "Intervalle de confiance",
        data: predictions.map((p) => parseFloat(p["0.8"].toFixed(2))),
        fill: 1,
        backgroundColor: "rgba(255,165,0,0.3)",
        borderColor: "transparent",
      },
      {
        data: predictions.map((p) => parseFloat(p["0.2"].toFixed(2))),
        fill: 1,
        backgroundColor: "rgba(255,165,0,0.3)",
        borderColor: "transparent",
        label: undefined,
        showLine: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Prédictions de ventes",
        font: {
          size: 18,
          weight: 700,
        },
      },
      legend: {
        labels: {
          font: {
            size: 14,
          },
          color: "#007BFF",
          filter: (legendItem: { text?: string }) => {
            return legendItem.text !== undefined;
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dates",
          font: {
            size: 14,
            weight: 700,
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Valeurs prédites",
          font: {
            size: 14,
            weight: 700,
          },
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <Card>
      <h2>🔮 Prédictions</h2>
      <div className="forecast-container">
        <div className="forecast-form">
          <label htmlFor="startDate">Date de début :</label>
          <select
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          >
            {dateOptions.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>

          <label htmlFor="endDate">Date de fin :</label>
          <select
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          >
            {dateOptions.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>

          <Button
            onClick={handlePrediction}
            disabled={loading}
            aria-label={
              loading ? "Chargement de la prédiction" : "Lancer la prédiction"
            }
            title={loading ? "Chargement..." : "Prédire les ventes"}
          >
            {loading ? "Chargement..." : "Prédire"}
          </Button>
        </div>
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
            <div
              role="img"
              aria-label="Graphique de prédiction des ventes"
              aria-describedby="chart-description"
            >
              <Line data={chartData} options={chartOptions} />
            </div>
            <p id="chart-description">
              Ce graphique représente les prévisions de ventes avec une moyenne
              et un intervalle de confiance.
            </p>
          </>
        )}
      </div>
    </Card>
  );
};

export default Forecast;
