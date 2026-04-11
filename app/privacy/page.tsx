import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] p-6 md:p-24 font-sans text-stone-800">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-stone-100">
        <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-8 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Torna alla Home
        </Link>
        
        <h1 className="text-4xl font-serif text-stone-900 mb-8">Informativa sulla Privacy</h1>
        <p className="text-sm text-stone-500 mb-12 uppercase tracking-widest font-mono">Ultimo aggiornamento: Aprile 2026</p>

        <div className="space-y-8 text-lg leading-relaxed text-stone-600">
          <section>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 font-sans">1. Premessa</h2>
            <p>
              La presente informativa descrive le modalità di gestione del sito web del Progetto Botanico "Vivo" in riferimento al trattamento dei dati personali degli utenti che lo consultano. Il nostro obiettivo è la piena conformità alla legislazione italiana ed europea (Regolamento UE 2016/679 - GDPR).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 font-sans">2. Titolare del Trattamento</h2>
            <p>
              Il progetto ha pura valenza didattico-formativa per la Classe 4B dell'I.T. Evangelista Torricelli. Qualsiasi richiesta può essere inoltrata ai recapiti istituzionali presenti a fondo pagina.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 font-sans">3. Dati Raccolti</h2>
            <p>
              Questo portale web è progettato come un <strong>archivio visivo e telematico statico</strong> a fini consultativi. Pertanto:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Non vengono richiesti, raccolti o memorizzati dati personali degli utenti visitatori.</li>
              <li>Non sono presenti form di registrazione pubblica, newsletter o sezioni commenti aperti.</li>
              <li>La piattaforma di "AI Chat" integrata processa le query formulate dall'utente in maniera anonima unicamente per erogare la risposta, senza conservare log associati all'identità o all'IP del visitatore, che rimangono ignoti.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 font-sans">4. Utilizzo dei Cookie (Cookie Policy)</h2>
            <p className="mb-4">
              Ai sensi del Provvedimento del Garante della Privacy dell'8 maggio 2014 e successive linee guida:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cookie di Profilazione:</strong> Il sito <strong>NON</strong> utilizza in alcun modo cookie di profilazione o tracciamento a fini pubblicitari, né propri né di terze parti.</li>
              <li><strong>Cookie Tecnici:</strong> Il sito utilizza esclusivamente, in modo limitato e sicuro, cookie tecnici di sessione necessari per memorizzare le scelte relative alla navigazione (es. accettazione del banner informativo sulle condizioni d'uso) e per la gestione del backend limitata in via esclusiva agli amministratori autorizzati.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 font-sans">5. Diritti dell'Interessato</h2>
            <p>
              Dato che la piattaforma in questione non raccoglie né processa dati personali dei visitatori, le disposizioni in merito ai diritti di accesso, rettifica o cancellazione decadono de facto per la tipologia di interazione offerta al visitatore.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
