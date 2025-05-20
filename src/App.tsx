import { useState } from "react";
import type { FormEvent } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";


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

      if (!response.data?.body) {
        throw new Error("Brak odpowiedzi z serwera.");
      }

      const res = JSON.parse(response.data.body);

      const planText = res.content[0].text;

      setResult(planText ?? "Brak danych");
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd podczas generowania planu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header-container">
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
          <button type="submit" className="search-button">
            Generuj przechadzkę
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
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
  );
}

export default App;