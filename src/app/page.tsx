"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Semaphore from "@/components/Semaphore";
import ReportForm from "@/components/ReportForm";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState<"SEARCH" | "REPORT">("SEARCH");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6b7280' }}>Cargando Dudex...</div>;
  if (!session) return null; // Prevenir un parpadeo de contenido mientras redirige

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <main className={styles.container}>
      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>
          {session.user.name}
        </span>
        <button 
          onClick={handleSignOut}
          style={{ background: 'transparent', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#374151' }}
        >
          Cerrar sesión
        </button>
      </div>

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
