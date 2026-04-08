import { neon } from '@neondatabase/serverless';
import TreeChart from '@/components/TreeChart';
import Link from 'next/link';

async function getData() {
  if (!process.env.DATABASE_URL) return [];
  
  const sql = neon(process.env.DATABASE_URL);
  const data = await sql`SELECT date, height_cm, circumference_cm FROM measurements ORDER BY date ASC`;
  
  return data.map((row: any) => ({
    ...row,
    // CONVERTI IN NUMERO QUI 👇
    height_cm: Number(row.height_cm),
    circumference_cm: Number(row.circumference_cm),
    // ----------------------
    date: new Date(row.date).toLocaleDateString('it-IT')
  }));
}

export default async function DashboardPage() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-6 md:p-12 text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-900">Analisi di Crescita</h1>
          <Link href="/" className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-2 rounded-lg transition-all font-medium">
            ← Torna alla Home
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl p-6 md:p-10 mb-8">
          <h2 className="text-xl font-bold mb-6 text-emerald-800">Dati Biometrici: Altezza e Circonferenza</h2>
          
          <TreeChart data={data} />
          
          {data.length === 0 && (
            <p className="text-sm text-slate-400 mt-4 text-center font-medium">
              *Nessun dato ancora inserito. Vai su /admin per aggiungere le misurazioni!
            </p>
          )}
        </div>

      </div>
    </main>
  );
}