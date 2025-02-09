import "./Home.css";
import { useFetchData } from "../../../utils/fetchData";
import Analyse from "../../components/Analyze/Analyze";
import Graphics from "../../components/Graphics/Graphics";
import Forecast from "../../components/Forecasts/Forecasts";

function Home() {
  const { data, headRows, loading } = useFetchData();

  return (
    <div className="home-container">
      {loading ? (
        <p>Chargement des données...</p>
      ) : data ? (
        <>
          <Analyse headRows={headRows} data={data} />
          <Graphics data={data} />
          <Forecast data={data} />
        </>
      ) : (
        <p>Erreur lors du chargement des données.</p>
      )}
    </div>
  );
}

export default Home;
