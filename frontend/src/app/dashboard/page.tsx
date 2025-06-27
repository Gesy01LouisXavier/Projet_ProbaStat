"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles.module.css";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { apiUrls } from "../../lib/config";

const PIE_COLORS = ["#6366f1", "#38bdf8", "#f472b6", "#34d399"];

type Reserves = {
  lambda_hat: number;
  mu_hat: number;
  sigma2_hat: number;
  E_X: number;
  Var_X: number;
  E_Y: number;
  Var_Y: number;
  RBNS: number;
  IBNR: number;
  IBNER: number;
  Total: number;
};

// Fonction pour formater les labels du pie chart
const renderPieLabel = (props: { value?: number }) =>
  props.value !== undefined
    ? `${Number(props.value).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
    : "";

export default function DashboardPage() {
  const [reserves, setReserves] = useState<Reserves | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReserves = async () => {
      try {
        const res = await fetch(apiUrls.calculReserves);
        if (!res.ok) throw new Error("Erreur lors de la récupération des réserves");
        const data = await res.json();
        setReserves(data);
      } catch {
        setError("Impossible de récupérer les réserves.");
      } finally {
        setLoading(false);
      }
    };
    fetchReserves();
  }, []);

  // Préparation des données pour le pie chart
  const pieData = reserves
    ? [
        { name: "RBNS", value: reserves.RBNS },
        { name: "IBNR", value: reserves.IBNR },
        { name: "IBNER", value: reserves.IBNER },
        { name: "Total", value: reserves.Total },
      ]
    : [];

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ marginBottom: 24 }}>Dashboard - Réserves nécessaires</h1>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {reserves && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 32 }}>
          {/* Colonne gauche : cards réserves */}
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              {["RBNS", "IBNR", "IBNER", "Total"].map((key, i) => (
                <div
                  key={key}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 2px 12px rgba(44,62,80,0.07)",
                    padding: "1.2rem 1.5rem",
                    minWidth: 120,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 13, color: "#6b6b8d", marginBottom: 6 }}>{key}</div>
                  <div style={{ fontWeight: 700, fontSize: 22, color: PIE_COLORS[i] }}>
                    {Number(reserves[key as keyof Reserves] ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} Ar
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(44,62,80,0.07)", padding: "1.5rem", marginBottom: 24 }}>
              <h2 className={styles.sectionTitle}>Statistiques du modèle</h2>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td>λ (Fréquence sinistres/assuré)</td>
                    <td>{reserves.lambda_hat.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td>μ (log-moyenne coût sinistre)</td>
                    <td>{reserves.mu_hat.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td>σ² (log-variance coût sinistre)</td>
                    <td>{reserves.sigma2_hat.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td>E[X] (Espérance coût sinistre)</td>
                    <td>{reserves.E_X.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} Ar</td>
                  </tr>
                  <tr>
                    <td>Var[X] (Variance coût sinistre)</td>
                    <td>{reserves.Var_X.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td>E[Y] (Espérance coût total/assuré)</td>
                    <td>{reserves.E_Y.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} Ar</td>
                  </tr>
                  <tr>
                    <td>Var[Y] (Variance coût total/assuré)</td>
                    <td>{reserves.Var_Y.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Colonne droite : pie chart et synthèse */}
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(44,62,80,0.07)", padding: "1.5rem", minHeight: 400 }}>
            <h2 className={styles.sectionTitle}>Répartition des réserves</h2>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.slice(0, 3)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={renderPieLabel}
                  >
                    {pieData.slice(0, 3).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 32 }}>
              <div style={{ background: "#f4f4f8", borderRadius: 12, padding: "1rem 1.5rem", flex: 1 }}>
                <div style={{ color: "#6b6b8d", fontSize: 13 }}>Espérance totale</div>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#6366f1" }}>{reserves.E_Y.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} Ar</div>
              </div>
              <div style={{ background: "#f4f4f8", borderRadius: 12, padding: "1rem 1.5rem", flex: 1 }}>
                <div style={{ color: "#6b6b8d", fontSize: 13 }}>Total Réserves</div>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#f472b6" }}>{reserves.Total.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} Ar</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 