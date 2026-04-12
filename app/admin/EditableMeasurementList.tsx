"use client";

import { useState } from "react";
import { editMeasurement, deleteMeasurement } from "../actions";

export default function EditableMeasurementList({ measurements }: { measurements: any[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (measurements.length === 0) {
    return (
      <tr>
        <td colSpan={3} className="py-6 text-center text-slate-400">
          Nessun dato.
        </td>
      </tr>
    );
  }

  // Funzione per estrarre YYYY-MM-DD dall'oggetto Date per l'input type="date"
  const parseDateForInput = (dateObj: any) => {
    try {
      const d = new Date(dateObj);
      // Evita fusi orari sfasati usando i metodi UTC o locali corretti
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch(e) {}
    return "2025-01-01";
  };

  return (
    <>
      {measurements.map((m) => {
        const isEditing = editingId === m.id;

        return (
          <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
            {isEditing ? (
              <td colSpan={3} className="py-3 px-2 bg-emerald-50/70 rounded-xl relative">
                <form 
                  action={async (formData) => {
                    await editMeasurement(formData);
                    setEditingId(null);
                  }}
                  className="flex flex-col md:flex-row gap-3 items-center"
                >
                  <input type="hidden" name="id" value={m.id} />
                  <input 
                    type="date" 
                    name="date" 
                    defaultValue={parseDateForInput(m.date)} 
                    className="border border-emerald-200 rounded-lg px-2 py-1 text-sm bg-white" 
                    required 
                  />
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      step="0.1" 
                      name="height" 
                      defaultValue={m.height_cm} 
                      className="border border-emerald-200 rounded-lg px-2 py-1 text-sm w-20 bg-white" 
                      required 
                    />
                    <span className="text-xs text-slate-500">cm (Altezza)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      step="0.1" 
                      name="circumference" 
                      defaultValue={m.circumference_cm} 
                      className="border border-emerald-200 rounded-lg px-2 py-1 text-sm w-20 bg-white" 
                      required 
                    />
                    <span className="text-xs text-slate-500">cm (Circonferenza)</span>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto justify-end md:ml-auto">
                    <button type="button" onClick={() => setEditingId(null)} className="text-slate-600 bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded-lg text-sm font-medium transition-colors">Annulla</button>
                    <button type="submit" className="text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-lg text-sm font-medium transition-colors">Salva</button>
                  </div>
                </form>
              </td>
            ) : (
              <>
                <td className="py-3 text-slate-700">{new Date(m.date).toLocaleDateString('it-IT')}</td>
                <td className="py-3 text-slate-700">{m.height_cm} cm / Circ. {m.circumference_cm} cm</td>
                <td className="py-3 pr-2">
                  <div className="flex justify-end gap-2 text-right">
                    <button 
                      onClick={() => setEditingId(m.id)}
                      className="text-emerald-600 hover:text-emerald-800 text-sm font-medium px-3 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      Modifica
                    </button>
                    <form action={deleteMeasurement.bind(null, m.id)}>
                      <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Elimina</button>
                    </form>
                  </div>
                </td>
              </>
            )}
          </tr>
        );
      })}
    </>
  );
}
