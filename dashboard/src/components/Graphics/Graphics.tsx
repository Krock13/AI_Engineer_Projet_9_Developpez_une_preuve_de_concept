import { Line, Bar } from "react-chartjs-2";
import Card from "../ui/Card/Card";
import "../../../utils/chartConfig";
import { ChartData } from "chart.js";
import "./Graphics.css";

interface GraphicsProps {
  data: {
    dates: string[];
    sales: number[];
    salesBins: string[];
    salesFrequencies: number[];
    kdeValues: number[];
  };
}

const Graphics: React.FC<GraphicsProps> = ({ data }) => {
  return (
    <>
      <Card>
        <h2>📊 Évolution des ventes</h2>
        <Line
          data={{
            labels: data.dates,
            datasets: [
              {
                label: "Ventes",
                data: data.sales,
                borderColor: "orange",
                backgroundColor: "rgba(255,165,0,0.2)",
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 16, // Taille minimale 14
                  },
                  color: "#007BFF",
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
                    weight: "bold",
                  },
                },
                ticks: {
                  font: {
                    size: 14, // Taille des étiquettes conforme
                  },
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Nombre de ventes",
                  font: {
                    size: 14,
                    weight: "bold",
                  },
                },
                ticks: {
                  font: {
                    size: 12,
                  },
                },
              },
            },
          }}
        />
      </Card>

      <Card>
        <h2>📊 Distribution des ventes</h2>
        <Bar
          data={
            {
              labels: data.salesBins.map((bin) => Number(bin).toFixed(2)),
              datasets: [
                {
                  label: "Histogramme",
                  data: data.salesFrequencies,
                  backgroundColor: "rgba(0, 0, 255, 0.5)",
                  barPercentage: 1.0,
                  yAxisID: "y",
                  type: "bar" as const,
                },
                {
                  label: "KDE",
                  data: data.kdeValues,
                  borderColor: "blue",
                  borderWidth: 2,
                  fill: false,
                  yAxisID: "y1",
                  type: "line" as const,
                },
              ],
            } as ChartData<"bar", number[], string>
          }
          options={{
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 16,
                  },
                  color: "#007BFF",
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
                  text: "Nombre de camions vendus",
                  font: {
                    size: 14,
                    weight: "bold",
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
                  text: "Fréquence",
                  font: {
                    size: 14,
                    weight: "bold",
                  },
                },
                ticks: {
                  font: {
                    size: 12,
                  },
                },
              },
              y1: {
                beginAtZero: true,
                position: "right",
                title: {
                  display: true,
                  text: "Densité KDE",
                  font: {
                    size: 14,
                    weight: "bold",
                  },
                },
                ticks: {
                  font: {
                    size: 12,
                  },
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          }}
        />
      </Card>
    </>
  );
};

export default Graphics;
