import React from "react";
import Card from "../../components/ui/Card/Card";

interface AnalyseProps {
  headRows: { [key: string]: string }[];
  data: {
    mean?: number;
    median?: number;
    min?: number;
    max?: number;
    stdDev?: number;
  } | null;
}

const Analyse: React.FC<AnalyseProps> = ({ headRows, data }) => {
  return (
    <Card>
      <h2>📊 Analyse exploratoire</h2>
      <div className="analysis-table">
        {/* Tableau des 5 premières lignes */}
        <div className="table-section">
          <h3>📄 Aperçu des données</h3>
          <div className="container-table">
            <table className="data-table">
              <thead>
                <tr>
                  {headRows.length > 0 &&
                    Object.keys(headRows[0]).map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {headRows.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((val, i) => (
                      <td key={i}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistiques */}
        <div className="table-section">
          <h3>📄 Statistiques globales</h3>
          <div className="container-table">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Statistique</th>
                  <th>Valeur</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Moyenne des ventes</td>
                  <td>{data?.mean ? data.mean.toFixed(2) : "N/A"}</td>
                </tr>
                <tr>
                  <td>Médiane des ventes</td>
                  <td>{data?.median ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Valeur minimale</td>
                  <td>{data?.min ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Valeur maximale</td>
                  <td>{data?.max ?? "N/A"}</td>
                </tr>
                <tr>
                  <td>Écart-type</td>
                  <td>{data?.stdDev ? data.stdDev.toFixed(2) : "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Analyse;
