import { Line, Bar } from "react-chartjs-2";
import Card from "../ui/Card/Card";
import "../../../utils/chartConfig";
import { ChartData } from "chart.js";

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
          options={{ responsive: true }}
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
                  type: "bar" as const, // On force bien ce dataset à être un "bar"
                },
                {
                  label: "KDE",
                  data: data.kdeValues,
                  borderColor: "blue",
                  borderWidth: 2,
                  fill: false,
                  yAxisID: "y1",
                  type: "line" as const, // On force bien ce dataset à être une "line"
                },
              ],
            } as ChartData<"bar", number[], string>
          }
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Distribution des ventes",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Nombre de camions vendus",
                },
              },
              y: {
                beginAtZero: true,
                position: "left",
                title: {
                  display: true,
                  text: "Fréquence",
                },
              },
              y1: {
                beginAtZero: true,
                position: "right",
                title: {
                  display: true,
                  text: "Densité KDE",
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
