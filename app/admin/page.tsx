import { neon } from '@neondatabase/serverless';
import { addMeasurement, deleteMeasurement } from '../actions';
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';

async function getMeasurements() {
  if (!process.env.DATABASE_URL) return [];
  const sql = neon(process.env.DATABASE_URL);
  return await sql`SELECT * FROM measurements ORDER BY date DESC`;
}

export default async function AdminPage() {
  const measurements = await getMeasurements();

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-10 bg-white/60 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Pannello di Controllo</h1>
            <p className="text-slate-500">Gestisci i dati di crescita di Vito</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-emerald-600 hover:underline text-sm font-medium">
              Vedi Grafici Pubblici
            </Link>
            <UserButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ... TUTTO IL RESTO DEL TUO CODICE (il form e la tabella con la bind) ... */}
          <div className="md:col-span-1">
            <div className="bg-white/80 backdrop-blur-2xl border border-white/80 shadow-lg rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-4 text-emerald-800">Nuova Misurazione</h2>
              <form action={addMeasurement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                  <input type="date" name="date" required className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Altezza (cm)</label>
                  <input type="number" step="0.1" name="height" required placeholder="es. 150" className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Circonferenza (cm)</label>
                  <input type="number" step="0.1" name="circumference" required placeholder="es. 15.5" className="w-full border border-slate-200 rounded-xl px-4 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-md">
                  Salva Dati 💾
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white/80 backdrop-blur-2xl border border-white/80 shadow-lg rounded-3xl p-6 overflow-hidden">
              <h2 className="text-xl font-bold mb-4 text-emerald-800">Storico Misurazioni</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-sm">
                      <th className="pb-3 font-medium">Data</th>
                      <th className="pb-3 font-medium">Altezza</th>
                      <th className="pb-3 font-medium">Circonferenza</th>
                      <th className="pb-3 font-medium text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400">Nessun dato inserito.</td>
                      </tr>
                    ) : (
                      measurements.map((m) => {
                        const deleteWithId = deleteMeasurement.bind(null, m.id);
                        return (
                          <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 text-slate-700">{new Date(m.date).toLocaleDateString('it-IT')}</td>
                            <td className="py-3 text-slate-700">{m.height_cm} cm</td>
                            <td className="py-3 text-slate-700">{m.circumference_cm} cm</td>
                            <td className="py-3 text-right">
                              <form action={deleteWithId}>
                                <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                                  Elimina
                                </button>
                              </form>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* ... FINE TABELLA ... */}

        </div>
      </div>
    </main>
  );
}