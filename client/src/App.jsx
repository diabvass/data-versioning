import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [versions, setVersions] = useState([]);
  const [produits, setProduits] = useState([]);
  const [info, setInfo] = useState(null);

  const API = "http://localhost:8000";

  const loadVersions = () => {
    axios.get(`${API}/versions/`)
      .then(res => setVersions(res.data))
      .catch(() => setVersions(["v1","v2", "v3"]))
  };
  
  // GET /versions/:v -> une version
  const loadVersion = (v) => {
    axios.get(`${API}/versions/${v}`)
      .then(res => {
        setInfo(res.data.info);
        setProduits(res.data.data);
      })
      .catch(() => alert(`${v} introuvable`));
  };

  useEffect(() => {
    loadVersions();
    loadVersion("v1");
  }, []);

  return (
    <>
      <section id="center">
        <div>
          <h1>API Lakehouse</h1>
          <p>Versions disponibles : {versions.join(", ")}</p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px", justifyContent: "center" }}>        
          {versions.map(v => (
            <button key={v} className="counter" onClick={() => loadVersion(v)}>{v}</button>
          ))}
        </div>
      </section>

      <div className="ticks"></div>

      {/* RESULTATS */}
      <section id="next-steps" key={info?.version}>
        <div id="docs">
          <h2>Info version</h2>
          {info ? (
            <>
              <p><b>Version:</b> {info.version}</p>
              <p><b>Date:</b> {info.date}</p>
              <p><b>Action:</b> {info.action}</p>
              <p><b>Total:</b> {produits.length} produits</p>
              <p><b>CA:</b> {info.ca_total}</p>
            </>
          ) : <p>Aucune donnée</p>}
        </div>

        <div>
          <h2>Data (CSV → JSON)</h2>
          {produits.map(p => (
            <div key={p.id} style={{ padding: "6px 0", borderBottom: "1px solid #333" }}>
              {p.nom} — {p.prix} FCFA x{p.quantite}
            </div>
          ))}
        </div>
      </section>

  
    </>
  );
}

export default App;