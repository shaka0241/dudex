"use client";

import { useState } from "react";
import styles from "./Semaphore.module.css";

type Status = "IDLE" | "LOADING" | "GREEN" | "YELLOW" | "RED";

export default function Semaphore() {
  const [docId, setDocId] = useState("");
  const [status, setStatus] = useState<Status>("IDLE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId.trim()) return;

    setStatus("LOADING");

    // Simulate network request and logic based on input for demo purposes
    setTimeout(() => {
      const lastChar = docId.slice(-1);
      if (["0", "1", "2"].includes(lastChar)) {
        setStatus("RED");
      } else if (["3", "4", "5"].includes(lastChar)) {
        setStatus("YELLOW");
      } else {
        setStatus("GREEN");
      }
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <label htmlFor="docId" className={styles.label}>
            Documento de Identidad
          </label>
          <input
            id="docId"
            type="text"
            className={styles.input}
            placeholder="Ej. 12345678"
            value={docId}
            onChange={(e) => {
              setDocId(e.target.value);
              if (status !== "IDLE") setStatus("IDLE");
            }}
            disabled={status === "LOADING"}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={!docId || status === "LOADING"}
        >
          {status === "LOADING" ? "Consultando..." : "Consultar Semáforo"}
        </button>
      </form>

      {status === "GREEN" && (
        <div className={`${styles.resultCard} ${styles.green}`}>
          <div className={styles.resultHeader}>
            <div className={styles.statusIcon}>✓</div>
            <h3 className={styles.statusTitle}>Buen Pagador</h3>
          </div>
          <p className={styles.statusMessage}>
            Este cliente no tiene reportes negativos en la red Dudex. Es de
            confianza para fiar.
          </p>
        </div>
      )}

      {status === "YELLOW" && (
        <div className={`${styles.resultCard} ${styles.yellow}`}>
          <div className={styles.resultHeader}>
            <div className={styles.statusIcon}>!</div>
            <h3 className={styles.statusTitle}>Precaución</h3>
          </div>
          <p className={styles.statusMessage}>
            Tiene algunos atrasos leves reportados que ya fueron solventados, o
            es un perfil nuevo sin mucho historial crediticio local.
          </p>
        </div>
      )}

      {status === "RED" && (
        <div className={`${styles.resultCard} ${styles.red}`}>
          <div className={styles.resultHeader}>
            <div className={styles.statusIcon}>✕</div>
            <h3 className={styles.statusTitle}>Alto Riesgo</h3>
          </div>
          <p className={styles.statusMessage}>
            Este perfil tiene reportes activos de deuda o morosidad en otros
            comercios de la red Dudex. Sugerimos no fiar a plazo.
          </p>
        </div>
      )}
    </div>
  );
}
