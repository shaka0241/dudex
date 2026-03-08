"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Semaphore from "@/components/Semaphore";
import ReportForm from "@/components/ReportForm";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"SEARCH" | "REPORT">("SEARCH");

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Dudex</h1>
        <p className={styles.subtitle}>El Semáforo de Confianza</p>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === "SEARCH" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("SEARCH")}
          >
            Consultar
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "REPORT" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("REPORT")}
          >
            Reportar
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "SEARCH" ? <Semaphore /> : <ReportForm />}
        </div>
      </div>
    </main>
  );
}
