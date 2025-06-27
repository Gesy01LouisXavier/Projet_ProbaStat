"use client";
import React, { useEffect, useState } from "react";
import { config, apiUrls } from "../../lib/config";

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<{
    calculReserves: { status: string; url: string; error?: string };
    importCsv: { status: string; url: string; error?: string };
  }>({
    calculReserves: { status: "pending", url: apiUrls.calculReserves },
    importCsv: { status: "pending", url: apiUrls.importCsv },
  });

  useEffect(() => {
    const testApis = async () => {
      // Test calcul-reserves
      try {
        const res = await fetch(apiUrls.calculReserves);
        setApiStatus(prev => ({
          ...prev,
          calculReserves: {
            status: res.ok ? "success" : "error",
            url: apiUrls.calculReserves,
            error: res.ok ? undefined : `HTTP ${res.status}`
          }
        }));
      } catch (error) {
        setApiStatus(prev => ({
          ...prev,
          calculReserves: {
            status: "error",
            url: apiUrls.calculReserves,
            error: error instanceof Error ? error.message : "Erreur inconnue"
          }
        }));
      }

      // Test import-csv (OPTIONS request pour tester CORS)
      try {
        const res = await fetch(apiUrls.importCsv, { method: "OPTIONS" });
        setApiStatus(prev => ({
          ...prev,
          importCsv: {
            status: res.ok ? "success" : "error",
            url: apiUrls.importCsv,
            error: res.ok ? undefined : `HTTP ${res.status}`
          }
        }));
      } catch (error) {
        setApiStatus(prev => ({
          ...prev,
          importCsv: {
            status: "error",
            url: apiUrls.importCsv,
            error: error instanceof Error ? error.message : "Erreur inconnue"
          }
        }));
      }
    };

    testApis();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🔧 Page de Debug - Configuration API</h1>
      
      <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h2>Configuration actuelle</h2>
        <pre style={{ background: "#fff", padding: "1rem", borderRadius: "4px", overflow: "auto" }}>
{JSON.stringify({
  apiBaseUrl: config.apiBaseUrl,
  envVar: process.env.NEXT_PUBLIC_API_BASE_URL,
  nodeEnv: process.env.NODE_ENV,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  isProduction: typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
}, null, 2)}
        </pre>
      </div>

      <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h2>Test des APIs</h2>
        
        <div style={{ marginBottom: "1rem" }}>
          <h3>Calcul des réserves</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ 
              padding: "0.25rem 0.5rem", 
              borderRadius: "4px", 
              background: apiStatus.calculReserves.status === "success" ? "#d4edda" : 
                         apiStatus.calculReserves.status === "error" ? "#f8d7da" : "#fff3cd",
              color: apiStatus.calculReserves.status === "success" ? "#155724" : 
                     apiStatus.calculReserves.status === "error" ? "#721c24" : "#856404"
            }}>
              {apiStatus.calculReserves.status === "success" ? "✅ Succès" : 
               apiStatus.calculReserves.status === "error" ? "❌ Erreur" : "⏳ En cours..."}
            </span>
            <code style={{ fontSize: "0.9rem" }}>{apiStatus.calculReserves.url}</code>
          </div>
          {apiStatus.calculReserves.error && (
            <div style={{ color: "#721c24", fontSize: "0.9rem", marginTop: "0.5rem" }}>
              Erreur: {apiStatus.calculReserves.error}
            </div>
          )}
        </div>

        <div>
          <h3>Import CSV</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ 
              padding: "0.25rem 0.5rem", 
              borderRadius: "4px", 
              background: apiStatus.importCsv.status === "success" ? "#d4edda" : 
                         apiStatus.importCsv.status === "error" ? "#f8d7da" : "#fff3cd",
              color: apiStatus.importCsv.status === "success" ? "#155724" : 
                     apiStatus.importCsv.status === "error" ? "#721c24" : "#856404"
            }}>
              {apiStatus.importCsv.status === "success" ? "✅ Succès" : 
               apiStatus.importCsv.status === "error" ? "❌ Erreur" : "⏳ En cours..."}
            </span>
            <code style={{ fontSize: "0.9rem" }}>{apiStatus.importCsv.url}</code>
          </div>
          {apiStatus.importCsv.error && (
            <div style={{ color: "#721c24", fontSize: "0.9rem", marginTop: "0.5rem" }}>
              Erreur: {apiStatus.importCsv.error}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: "#e7f3ff", padding: "1rem", borderRadius: "8px" }}>
        <h2>💡 Solutions</h2>
        <ul>
          <li>Si l&apos;URL est encore locale, modifiez la ligne 18 dans <code>src/lib/config.ts</code></li>
          <li>Vérifiez que votre backend est accessible à l&apos;URL configurée</li>
          <li>Assurez-vous que CORS est configuré sur votre backend</li>
          <li>Redéployez après modification des variables d&apos;environnement</li>
        </ul>
      </div>
    </div>
  );
} 