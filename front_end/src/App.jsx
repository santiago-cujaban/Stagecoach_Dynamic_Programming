import { useState } from "react";
import style from "./styles/App.module.css";

function App() {
  const [etapas, setEtapas] = useState("");
  const [conexiones, setConexiones] = useState("");

  function sendInfo() {
    const conexionesObj = JSON.parse(conexiones);
    const etapasObj = JSON.parse(etapas);

    fetch("http://localhost:8000/data", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conexiones: conexionesObj, etapas: etapasObj }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Respuesta del servidor:", data))
      .catch((error) => console.error("Error al enviar la solicitud:", error));
  }

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Modelos Dinamicos - Problema de la Diligencia
      </h1>
      <hr />

      <div className={style.container}>
        <div className={style.mini}>
          <label>Ingrese nodos y sus conexiones</label>
          <input
            type="text"
            onChange={(e) => setConexiones(e.target.value)}
            placeholder='{"1":{"2":2, "3":4, "4":3}, ...}'
          />
        </div>
        <div className={style.mini}>
          <label>Ingrese las etapas de los nodos</label>
          <input
            type="text"
            onChange={(e) => setEtapas(e.target.value)}
            placeholder='{"1":1, "2":2, ...}'
          />
        </div>
        <button onClick={sendInfo}>Solucionar!</button>
      </div>
      <hr />
    </>
  );
}

export default App;
