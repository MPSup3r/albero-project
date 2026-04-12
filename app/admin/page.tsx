import { neon } from '@neondatabase/serverless';
import { addMeasurement, getImages } from '../actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Componenti Client per i form di aggiunta e modifica
import ImageUploadForm from './ImageUploadForm';
import EditableMeasurementList from './EditableMeasurementList';
import EditableImageList from './EditableImageList';

// Funzione Server Action di Logout (Tua originale)
async function handleLogout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("vito_auth");
  redirect("/login");
}

async function getMeasurements() {
  if (!process.env.DATABASE_URL) return [];
  const sql = neon(process.env.DATABASE_URL);
  return await sql`SELECT * FROM measurements ORDER BY date DESC`;
}

export default async function AdminPage() {
  // Recuperiamo sia le misurazioni che le immagini dal database
  const measurements = await getMeasurements();
  const images = await getImages();

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER (Tuo originale) */}
        <div className="flex justify-between items-center mb-10 bg-white/60 backdrop-blur-xl border border-white/80 p-6 rounded-3xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Pannello di Controllo</h1>
            <p className="text-slate-500">Gestisci i dati e le foto di Vivo</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-emerald-600 hover:underline text-sm font-medium">Vai al Sito</Link>
            <Link href="/#crescita" className="text-emerald-600 hover:underline text-sm font-medium">Vedi Grafici</Link>
            
            <form action={handleLogout}>
              <button type="submit" className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                Esci 👋
              </button>
            </form>
          </div>
        </div>

        {/* GRIGLIA MISURAZIONI (Tua originale) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
                      <th className="pb-3 font-medium text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    <EditableMeasurementList measurements={measurements} />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SEZIONE GESTIONE IMMAGINI (Con il nuovo componente) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white/80 backdrop-blur-2xl border border-white/80 shadow-lg rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-4 text-emerald-800">Aggiungi Foto</h2>
              
              {/* USIAMO IL COMPONENTE ESTERNO QUI PER EVITARE I CRASH */}
              <ImageUploadForm />

            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white/80 backdrop-blur-2xl border border-white/80 shadow-lg rounded-3xl p-6 overflow-hidden">
              <h2 className="text-xl font-bold mb-4 text-emerald-800">Galleria Attuale</h2>
              <EditableImageList images={images} />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
