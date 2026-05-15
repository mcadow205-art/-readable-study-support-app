import { useState } from "react";
import "./index.css";

export default function App() {
  const [fontSize, setFontSize] = useState(20);
  const [chunkMode, setChunkMode] = useState(false);

  const text = `
  Digital reading is important for university students.
  However, many students with dyslexia struggle with
  visual stress and concentration while reading large
  amounts of text on screen.
  `;

  const chunks = text.match(/.{1,45}/g);

  const speakText = () => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="app">
      <header className="hero">
        <h1>ReadAble</h1>
        <p>Accessibility support for dyslexia and ADHD</p>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h2>Tools</h2>

          <button onClick={speakText}>
            Read Aloud
          </button>

          <button onClick={() => setChunkMode(!chunkMode)}>
            Toggle Chunking
          </button>

          <label>Font Size</label>

          <input
            type="range"
            min="16"
            max="32"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </aside>

        <main className="reader">
          <div
            className="text-box"
            style={{ fontSize: `${fontSize}px` }}
          >
            {chunkMode ? (
              chunks.map((chunk, index) => (
                <p key={index}>{chunk}</p>
              ))
            ) : (
              <p>{text}</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}