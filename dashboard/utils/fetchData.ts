import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Data } from "./types";
import { gaussianKde } from "./kde";

export function useFetchData() {
  const [data, setData] = useState<Data | null>(null);
  const [headRows, setHeadRows] = useState<{ [key: string]: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Papa.parse("/data/truck_sales.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const parsedData = result.data as {
          "Month-Year": string;
          "Number_Trucks_Sold": string;
        }[];
        setHeadRows(parsedData.slice(0, 5));

        const sales = parsedData
          .map((row) => Number(row["Number_Trucks_Sold"]))
          .filter((value) => !isNaN(value));

        if (sales.length === 0) {
          setLoading(false);
          return; // Évite les calculs si vide
        }

        // Statistiques simples
        const mean = sales.reduce((a, b) => a + b, 0) / sales.length;
        const sortedSales = [...sales].sort((a, b) => a - b);
        const median = sortedSales[Math.floor(sortedSales.length / 2)];
        const min = Math.min(...sales);
        const max = Math.max(...sales);
        const stdDev = Math.sqrt(
          sales.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) /
            sales.length
        );

        // Histogramme avec 30 bins
        const binCount = 30;
        const binWidth = (max - min) / binCount;
        const salesBins = Array.from(
          { length: binCount },
          (_, i) => min + i * binWidth
        );
        const salesFrequencies = new Array(binCount).fill(0);

        sales.forEach((value) => {
          const index = Math.min(
            Math.floor((value - min) / binWidth),
            binCount - 1
          );
          salesFrequencies[index]++;
        });

        // Calcul de la densité KDE
        const kdeValues = gaussianKde(sales, salesBins);

        setData({
          dates: parsedData.map((row) => row["Month-Year"]),
          sales,
          mean,
          median,
          min,
          max,
          stdDev,
          salesBins: salesBins.map(String),
          salesFrequencies,
          kdeValues,
        });
        setLoading(false);
      },
    });
  }, []);

  return { data, headRows, loading };
}
