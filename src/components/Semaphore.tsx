"use client";

import { useState } from "react";
import styles from "./Semaphore.module.css";
import { checkSemaphoreStatus, SemaphoreStatus } from "@/app/actions/reports";

type Status = "IDLE" | "LOADING" | SemaphoreStatus;

export default function Semaphore() {
  const [docId, setDocId] = useState("");
  const [status, setStatus] = useState<Status>("IDLE");
  const [message, setMessage] = useState<string>("");
  const [totalReports, setTotalReports] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId.trim()) return;

    setStatus("LOADING");
    setMessage("");

    try {
      const result = await checkSemaphoreStatus(docId);
      setStatus(result.status);
      setMessage(result.message || "");
      setTotalReports(result.totalReports);
    } catch (error) {
      console.error(error);
      setMessage("Error al consultar la base de datos");
      setStatus("IDLE");
    }
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
            placeholder="Ej. V-12345678"
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

      {status === "UNKNOWN" && (
        <div className={`${styles.resultCard} ${styles.green}`}>
          <div className={styles.resultHeader}>
            <div className={styles.statusIcon}>?</div>
            <h3 className={styles.statusTitle}>Sin Historial</h3>
          </div>
          <p className={styles.statusMessage}>
            {message}
          </p>
        </div>
      )}

      {status === "GREEN" && (
        <div className={`${styles.resultCard} ${styles.green}`}>
          <div className={styles.resultHeader}>
            <div className={styles.statusIcon}>✓</div>
            <h3 className={styles.statusTitle}>Buen Pagador</h3>
          </div>
          <p className={styles.statusMessage}>
            {message} (Basado en {totalReports} reportes)
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
            {message} (Basado en {totalReports} reportes)
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
             {message} (Basado en {totalReports} reportes)
          </p>
        </div>
      )}
    </div>
  );
}
