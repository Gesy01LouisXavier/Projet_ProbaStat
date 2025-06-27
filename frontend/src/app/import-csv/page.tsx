"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "../styles.module.css";
import { apiUrls } from "../../lib/config";

export default function ImportCSVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      setMessage("");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] } });

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleCancel = () => {
    setFile(null);
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Veuillez sélectionner un fichier CSV.");
      return;
    }
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(apiUrls.importCsv, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Importation réussie !");
        setFile(null);
      } else {
        setMessage(data.error || "Erreur lors de l'importation.");
      }
    } catch {
      setMessage("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "2.5rem 2rem", minWidth: 400, maxWidth: 420 }}>
        <h2 className={styles.sectionTitle} style={{ textAlign: "center", marginBottom: 24 }}>Importer un fichier</h2>
        <form onSubmit={handleSubmit}>
          <div {...getRootProps()} style={{ border: "2px dashed #bdbdfc", borderRadius: 12, background: isDragActive ? "#e0e7ff" : "#f9f9f9", padding: "2.2rem 1rem", textAlign: "center", cursor: "pointer", marginBottom: 18 }}>
            <input {...getInputProps()} />
            <div style={{ fontSize: 36, color: "#bdbdfc", marginBottom: 8 }}>☁️</div>
            {file ? (
              <div style={{ color: "#6366f1", fontWeight: 600 }}>{file.name}</div>
            ) : (
              <>
                <div style={{ color: "#6b6b8d", fontWeight: 500, marginBottom: 4 }}>Déposez le fichier ici</div>
                <div style={{ color: "#bdbdfc", fontSize: 13, marginBottom: 6 }}>Format supporté : CSV</div>
                <span style={{ color: "#6366f1", fontWeight: 600, fontSize: 15, textDecoration: "underline", cursor: "pointer" }}>Parcourir</span>
              </>
            )}
          </div>
          <input type="file" accept=".csv" onChange={handleBrowse} className={styles.fileInput} style={{ display: "none" }} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
            <button type="button" className={styles.button} style={{ background: "#f4f4f8", color: "#6366f1" }} onClick={handleCancel} disabled={loading}>Annuler</button>
            <button type="submit" className={styles.button} disabled={loading || !file}>
              {loading ? "Importation en cours..." : "Importer"}
            </button>
          </div>
        </form>
        {message && <p className={styles.message} style={{ textAlign: "center" }}>{message}</p>}
      </div>
    </div>
  );
} 