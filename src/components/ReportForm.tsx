"use client";

import { useState } from "react";
import styles from "./ReportForm.module.css";
import { createReport } from "@/app/actions/reports";

export default function ReportForm() {
  const [docId, setDocId] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState<"DEBT" | "PAYMENT" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReport = async (type: "DEBT" | "PAYMENT") => {
    if (!docId.trim()) return;
    
    setIsLoading(true);
    setError("");

    try {
      await createReport({
        nationalId: docId,
        description: reason || (type === "DEBT" ? "Deuda registrada" : "Buen pago registrado"),
        status: type === "DEBT" ? "DANGER" : "POSITIVE",
      });

      setSubmitted(type);
      
      // Reset form after a few seconds to demo
      setTimeout(() => {
        setSubmitted(null);
        setDocId("");
        setReason("");
      }, 4000);

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al guardar el reporte");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {submitted ? (
        <div className={styles.successMessage}>
          {submitted === "DEBT" 
            ? "⚠️ Reporte grabado. Dudex enviará una notificación SMS disuasiva al deudor para presionar el pago." 
            : "✨ Reporte grabado. Has mejorado el historial crediticio de este cliente en la red Dudex."}
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>Reportar Cliente</h2>
            <p className={styles.description}>
              Actualiza el historial de un cliente. Esto es visible para otros comerciantes.
            </p>
          </div>

          {error && <div style={{ color: 'red', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <label htmlFor="reportDocId" className={styles.label}>Cédula o Documento</label>
              <input
                id="reportDocId"
                type="text"
                className={styles.input}
                placeholder="Ej. V-12345678"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.inputWrapper}>
              <label htmlFor="reason" className={styles.label}>Monto / Detalle (Opcional)</label>
              <input
                id="reason"
                type="text"
                className={styles.input}
                placeholder="Ej. $15 por víveres"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>

            <div className={styles.actions}>
              <button 
                type="button" 
                onClick={() => handleReport("DEBT")}
                className={`${styles.button} ${styles.buttonDanger}`}
                disabled={!docId || isLoading}
              >
                {isLoading ? "Guardando..." : "Reportar Mora"}
              </button>
              <button 
                type="button" 
                onClick={() => handleReport("PAYMENT")}
                className={`${styles.button} ${styles.buttonSuccess}`}
                disabled={!docId || isLoading}
              >
               {isLoading ? "Guardando..." : "Sumar Crédito"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
