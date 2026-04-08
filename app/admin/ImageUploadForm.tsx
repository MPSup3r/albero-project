"use client";

import { useState, useRef } from "react";
import { addImage } from "../actions";

export default function ImageUploadForm() {
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleUpload(formData: FormData) {
    const file = formData.get("image") as File;
    
    // Controllo del peso del file (1MB = 1024 * 1024 bytes)
    if (file && file.size > 1024 * 1024) {
      setError("⚠️ L'immagine è troppo grande! Il limite è 1 MB.");
      return;
    }

    setError("");
    setIsUploading(true);
    
    try {
      await addImage(formData);
      formRef.current?.reset(); // Svuota il form dopo aver caricato
    } catch (err: any) {
      setError(err.message || "Si è verificato un errore di caricamento.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form ref={formRef} action={handleUpload} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Seleziona Foto (dal PC o Telefono)
        </label>
        <input 
          type="file" 
          name="image" 
          accept="image/*" 
          required 
          className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Didascalia</label>
        <input type="text" name="caption" placeholder="Es: Vito con la prima foglia!" className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      
      {/* Mostra l'errore se presente */}
      {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

      <button 
        type="submit" 
        disabled={isUploading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center"
      >
        {isUploading ? "Caricamento in corso... ⏳" : "Carica Foto 📸"}
      </button>
    </form>
  );
}