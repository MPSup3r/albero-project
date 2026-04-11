import Link from "next/link";

export default function TerminiECondizioni() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] p-6 md:p-24 font-sans text-stone-800">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-stone-100">
        <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-8 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Torna alla Home
        </Link>
        
        <h1 className="text-4xl font-serif text-stone-900 mb-8">Termini e Condizioni</h1>
        <p className="text-sm text-stone-500 mb-12 uppercase tracking-widest font-mono">Ultimo aggiornamento: Aprile 2026</p>

        <div className="space-y-8 text-lg leading-relaxed text-stone-600">
          <section>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 font-sans">1. Accettazione dei Termini</h2>
            <p>
              L'accesso e la navigazione sul sito web del Progetto Botanico "Vivo" costituiscono accettazione implicita dei presenti Termini e Condizioni di utilizzo. In caso di mancata accettazione, l'utente è invitato a interrompere la navigazione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 font-sans">2. Scopo Telematico</h2>
            <p>
              Il presente sito web è un archivio didattico realizzato dalla Classe 4B dell'I.T. Evangelista Torricelli. I contenuti ivi riportati rientrano in un'attività scolastica a scopo di sensibilizzazione ecologica e rendicontazione tecnico-scientifica. Il sito non ha, in alcun modo o forma, natura commerciale, giornalistica o di lucro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 font-sans">3. Limitazione di Responsabilità</h2>
            <p>
              Nonostante il rigore con cui la documentazione (inclusi dati biometrici degli alberi, referti fotografici e telemetria) venga compilata, ci esimiamo da qualsiasi garanzia relativa all'esattezza o tempestività scientifica assoluta. Qualsiasi utilizzo di questi dati per scopi estranei al presente ambito formativo è da ritenersi ad esclusivo rischio e pericolo dell'utente. Il sito si solleva da ogni responsabilità circa malfunzionamenti o errori temporanei del sistema di intelligenza artificiale integrato.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 font-sans">4. Proprietà Intellettuale</h2>
            <p>
              Tale portale formativo espone contenuti fotografici, modelli 3D e resoconti testuali di titolarità degli studenti del Progetto e dei docenti preposti. Tali materiali sono rilasciati per scopi educativi ed è severamente vietata la riproduzione, distribuzione o manipolazione da parte di terzi per finalità commerciali senza un espresso consenso scritto.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 font-sans">5. Modifiche e Legislazione Applicabile</h2>
            <p>
              Gli amministratori si riservano la facoltà di modificare in qualsiasi momento le seguenti disposizioni al fine di adeguamenti normativi o funzionali. Il progetto fa legalmente capo all'ordinamento della Repubblica Italiana e le controversie faranno in ultima istanza riferimento alla normativa scolastica e al Foro ordinario competente.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
