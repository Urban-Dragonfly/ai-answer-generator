import { useState } from "react";
import type { FormEvent } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

import lotekRoboGuideFull from "./assets/lotek-robo-guide-full.png";
import lotekTourist from "./assets/lotek-tourist.png";
import lotekRoboGuideCell from "./assets/lotek-robo-guide-cell.png";


import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [city, setCity] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [durationHours, setDurationHours] = useState(1);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await amplifyClient.queries.askBedrock({
        city: city,
        startPoint: startPoint,
        durationHours: durationHours,
      });

      if (response.data?.error) {
        console.error("Błąd Bedrock:", response.data.error);
      }

      if (!response.data?.body) {
        throw new Error("Brak odpowiedzi z serwera.");
      }

      const planText = response.data.body;

      setResult(planText ?? "Brak danych");
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas generowania planu.");
    } finally {
      setLoading(false);
    }
  };

  const isGoogleMaps = (url: string) =>
    /https:\/\/www\.google\.com\/maps/.test(url);

  return (
    <div className="app-container">
      <div className="header-container top-content">
        <div className="text-content">
          <h1 className="main-header">
            Witaj w Projekcie
            <br />
            <span className="highlight">Layover AI Guide</span>
          </h1>
          <p className="description">
            Chciałbym umilić Ci Twój krótki pobyt!
          </p>
          <p className="description">
            Powiedz jakie miasto odwiedzasz i gdzie chciałbyś zacząć spacer.
          </p>
          <p className="description">
            Daj znać ile czasu masz na zwiedzanie.
          </p>
          <p className="description">
            Ja zaplanuję dla Ciebie wspaniałą wycieczkę! *map included 😉
          </p>
          <img src={lotekRoboGuideFull} alt="Lotek Android pokazuje mapę" className="illustration left-image" />
          <img src={lotekTourist} alt="Lotek Turysta" className="illustration right-image" />
        </div>
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            name="city"
            placeholder="Miasto"
            className="wide-input"
            required
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            name="startPoint"
            placeholder="Punkt startowy"
            className="wide-input"
            required
            onChange={(e) => setStartPoint(e.target.value)}
          />
          <div className="slider-field">
            <label htmlFor="durationHours">Czas trwania:</label>{" "}
            <span className="slider-value">{durationHours} godz.</span>
            <br />{/* opcjonalnie: łamanie linii, aby suwak był poniżej etykiety */}
            <input 
              type="range" 
              id="durationHours" 
              name="durationHours" 
              min="1" max="12" step="1"
              value={durationHours}
              onChange={e => setDurationHours(Number(e.target.value))}
              className="slider-input" 
            />
          </div>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Generowanie…' : 'Generuj przechadzkę'}
          </button>
        </div>
      </form>
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">
            {result.split(/(https?:\/\/\S+)/).map((frag, i) => {
              const key = `${frag}-${i}`;
              if (RegExp(/^https?:\/\//).exec(frag)) {
                return isGoogleMaps(frag) ? (
                  <a
                    key={key}
                    href={frag}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined map-icon">
                      map
                    </span>
                  </a>
                ) : (
                  <a
                    key={key}
                    href={frag}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {frag}
                  </a>
                )
              }
              return <span key={key}>{frag}</span>
            })}
          </p>
        )}
      </div>
      <img src={lotekRoboGuideCell} alt="Lotek android pokazuje mapę" className="illustration bottom-image" />
    </div>
  );
}

export default App;