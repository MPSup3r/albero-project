"use client";

import { useState } from "react";
import { editImage, deleteImage } from "../actions";

export default function EditableImageList({ images }: { images: any[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (images.length === 0) {
    return <p className="py-6 text-center text-slate-400">Nessuna foto caricata.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img: any) => {
        const isEditing = editingId === img.id;

        if (isEditing) {
          return (
            <div key={img.id} className="relative bg-emerald-50/80 p-4 rounded-2xl border border-emerald-300 shadow-sm flex flex-col gap-3">
              <form action={async (formData) => {
                await editImage(formData);
                setEditingId(null);
              }} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={img.id} />
                
                <div>
                  <label className="text-xs font-bold text-emerald-800">Didascalia</label>
                  <input type="text" name="caption" defaultValue={img.caption} className="w-full text-sm border border-emerald-200 rounded-lg p-2 bg-white" required />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-emerald-800">Descrizione</label>
                  <textarea name="description" defaultValue={img.description} className="w-full text-sm border border-emerald-200 rounded-lg p-2 h-16 resize-none bg-white" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Sostituisci Immagine (opzionale)</label>
                  <input type="file" name="image" accept="image/png, image/jpeg, image/webp" className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200" />
                </div>

                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-slate-300 text-slate-700 py-2 rounded-lg text-sm font-bold hover:bg-slate-400 transition-colors">Annulla</button>
                  <button type="submit" className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors">Salva</button>
                </div>
              </form>
            </div>
          );
        }

        return (
          <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white pb-2 flex flex-col">
            <img src={img.url} alt={img.caption} className="w-full h-32 object-cover" />
            <div className="p-3 mb-8">
              <h3 className="font-bold text-slate-800 text-sm truncate">{img.caption}</h3>
              <p className="text-xs text-slate-500 truncate mt-1">{img.description}</p>
            </div>
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
              <button type="button" onClick={() => setEditingId(img.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 w-3/4">Modifica</button>
              <form action={deleteImage.bind(null, img.id)} className="w-3/4">
                <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105">Elimina</button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
