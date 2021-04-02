import logo from "./logo.svg";
import "./App.css";

// Import Packages
import * as tf from "@tensorflow/tfjs";
import * as speech from "@tensorflow-models/speech-commands";
import { useState, useEffect } from "react";

function App() {
  // 1. Create model and action states
  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState(null);

  // 2. Create Recognizer

  const loadelModel = async () => {
    const recognizer = await speech.create("BROWSER_FFT");
    console.log("Model loaded");
    await recognizer.ensureModelLoaded();
    console.log(recognizer.wordLabels());
    setModel(recognizer);
    setLabels(recognizer.wordLabels());
  };

  useEffect(() => {
    loadelModel();
  }, []);

  // 3. Listen for actions

  function argMax(arr) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  const recognizeCommands = async () => {
    console.log("Listening for commands");
    model.listen(
      (result) => {
        console.log(result.spectrogram);
        setAction(labels[argMax(Object.values(result.scores))]);
      },
      { includeSpectrogram: true, probabilityThreshold: 0.9 }
    );
    setTimeout(() => model.stopListening(), 10e5);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={recognizeCommands}>Command</button>
        {action ? <div>{action}</div> : <div>No Action Detected</div>}
      </header>
    </div>
  );
}

export default App;
