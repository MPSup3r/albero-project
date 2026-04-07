"use client";

import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";

function BasicTree() {
  return (
    <group position={[0, -2.5, 0]}>
      {/* Tronco */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2, 16]} />
        <meshStandardMaterial color="#6B4423" roughness={0.9} />
      </mesh>
      {/* Chioma */}
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[1.5, 4, 16]} />
        <meshStandardMaterial color="#3CB371" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLauncherHovered, setIsLauncherHovered] = useState(false);
  const [showHintBubble, setShowHintBubble] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Timer in millisecondi per far comparire il messaggio automatico.
  const HINT_TIMER_MS = 10000;
  const HINT_DURATION_MS = 3200;

  // Grandezza responsive del logo: cresce su monitor grandi e si riduce su mobile.
  const TREE_LOGO_SIZE = "clamp(88px, 14vw, 220px)";

  // Distanza responsive dai bordi per evitare che copra contenuti su schermi piccoli.
  const LAUNCHER_INSET = "clamp(10px, 2.2vw, 28px)";

  // Distanza verticale responsive tra albero e nuvoletta suggerimento.
  const HINT_BUBBLE_GAP = "clamp(0px, -1vw, 22px)";

  const BACKEND_URL = "https://treesitetorricellirelay.onrender.com/api/chat";

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowHintBubble(true);
      setTimeout(() => setShowHintBubble(false), HINT_DURATION_MS);
    }, HINT_TIMER_MS);

    return () => clearInterval(intervalId);
  }, [HINT_DURATION_MS, HINT_TIMER_MS]);

  async function sendPrompt() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) {
      if (!trimmedPrompt) {
        setResponse("Scrivi qualcosa prima di inviare.");
      }
      return;
    }

    setIsLoading(true);
    setResponse("Sto pensando...");

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setResponse("Errore dal server: " + (err.detail || res.status));
        return;
      }

      const data = await res.json();
      setResponse(data.response || "(nessuna risposta)");
    } catch (e) {
      setResponse("Errore di rete: " + String(e));
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendPrompt();
  }

  function handlePromptKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void sendPrompt();
    }
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] relative overflow-hidden font-sans text-slate-800">
      
      {/* Sfondi decorativi (Macchie di colore sfocate) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-green-100/60 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto mb-16 relative pt-10">
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0 h-[500px] md:h-[600px] w-full pointer-events-auto cursor-grab active:cursor-grabbing"
        >
          <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />
            <Environment preset="city" />
            <BasicTree />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
          </Canvas>
        </motion.div>

        {/* Testo in primo piano */}
        <div className="relative z-10 text-center mt-8 h-[500px] md:h-[600px] flex flex-col items-center justify-center pointer-events-none">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-7xl md:text-9xl font-extrabold tracking-tight mb-4 text-emerald-900 drop-shadow-sm"
          >
            Vivo
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="bg-white/50 backdrop-blur-md border border-white/60 shadow-sm px-6 py-2 rounded-full"
          >
            <p className="text-xl md:text-2xl font-medium text-emerald-800 tracking-wide">
              Il nostro Pioppo Bianco
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-center mt-[-40px] relative z-20"
        >
          <Link 
            href="/dashboard" 
            className="bg-emerald-600/90 backdrop-blur-md border border-emerald-500/50 hover:bg-emerald-500 text-white font-semibold text-lg py-4 px-10 rounded-full transition-all duration-300 shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.4)] hover:-translate-y-1 inline-block"
          >
            Guarda la crescita 📈
          </Link>
        </motion.div>
      </header>

      {/* Griglia Contenuti */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 px-6 pb-20 cursor-default">
        
        {/* Card 1 */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          // Qui abbiamo aggiunto gli effetti hover!
          className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-all duration-300 hover:bg-white/80 hover:scale-[1.02] hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10"
        >
          <h2 className="text-2xl font-bold mb-4 border-b border-emerald-100 pb-3 text-emerald-900">
            Che cos'è un Pioppo Bianco?
          </h2>
          <p className="mb-4 text-slate-600 leading-relaxed font-medium">
            È un albero alto e slanciato, può arrivare anche a 30 metri. Si chiama “bianco” siccome la parte sotto delle foglie è chiara, vicino al colore argento, e quando il vento le muove dà l'illusione che brillino.
          </p>
          <p className="text-sm font-semibold text-emerald-700 bg-emerald-50/50 inline-block px-3 py-1 rounded-lg border border-emerald-100/50">
            Famiglia: Salicaceae
          </p>
        </motion.section>

        {/* Card 2: Varietà */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          // Effetti hover anche qui
          className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-all duration-300 hover:bg-white/80 hover:scale-[1.02] hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10"
        >
          <h2 className="text-2xl font-bold mb-4 border-b border-emerald-100 pb-3 text-emerald-900">
            Le Varietà
          </h2>
          <ul className="space-y-4">
            <li>
              <h4 className="font-bold text-emerald-800">Populus alba "Bolleana"</h4>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">Cresce dritta e stretta, con foglie piccole e argentate. Molto elegante.</p>
            </li>
            <li>
              <h4 className="font-bold text-emerald-800">Pyramidalis</h4>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">Forma slanciata e verticale, utilizzata spesso come barriera frangivento.</p>
            </li>
            <li>
              <h4 className="font-bold text-emerald-800">Pioppo Canescente</h4>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">Incrocio naturale col Pioppo Nero. Foglie più rotonde, molto robusto.</p>
            </li>
          </ul>
        </motion.section>

        {/* Card 3: Il Progetto */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          // Effetti hover anche qui per la card grande
          className="md:col-span-2 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 md:p-12 transition-all duration-300 hover:bg-white/80 hover:scale-[1.02] hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-900/10"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-emerald-900">Il Progetto 4B</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-bold mb-4 text-emerald-800">L'Iniziativa Torricelli</h3>
              <p className="mb-4 text-slate-600 leading-relaxed">
                Siamo i ragazzi della 4B dell'Istituto Tecnico Informatico Evangelista Torricelli. Partecipiamo al Progetto Green School – “Coloriamo di Verde”, diviso in due fasi:
              </p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-3 items-center bg-white/50 p-3 rounded-xl border border-white/50 shadow-sm">
                  <span className="text-xl">🌿</span> 
                  <span><strong>Portiamo il verde in classe:</strong> curato dal primo biennio.</span>
                </li>
                <li className="flex gap-3 items-center bg-white/50 p-3 rounded-xl border border-white/50 shadow-sm">
                  <span className="text-xl">🌳</span> 
                  <span><strong>Adottiamo un albero:</strong> curato dal triennio, per legare ogni classe a una pianta.</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-emerald-800">La Piantumazione</h3>
              <p className="text-slate-600 leading-relaxed">
                Abbiamo recuperato 5 Pioppi Bianchi dal Parco Agricolo Ticinello con un portapacchi e li abbiamo piantumati al Parco Dini. <br/><br/>
                Usando pale e una trivella, abbiamo scavato le buche, inserito gli alberi, recintati e riempiti alla base con cocci di vaso. Infine, abbiamo affondato nel terreno una <strong>matita di legno gigante</strong> per identificare Vito come l'albero ufficiale della nostra 4B!
              </p>
            </div>
          </div>
        </motion.section>

      </div>

      <div className="fixed z-50" style={{ bottom: LAUNCHER_INSET, right: LAUNCHER_INSET }}>
        {isChatOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[320px] max-w-[calc(100vw-2.5rem)] bg-white/95 backdrop-blur-xl border border-emerald-200 shadow-[0_18px_50px_rgba(16,185,129,0.25)] rounded-3xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-emerald-900">Parla con Vito AI</p>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="text-sm text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                Chiudi
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={handlePromptKeyDown}
                rows={5}
                placeholder="Scrivi qui il tuo messaggio..."
                className="w-full resize-none rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-emerald-600 text-white font-semibold py-2.5 hover:bg-emerald-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Invio in corso..." : "Invia"}
              </button>
            </form>

            <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 text-sm text-slate-700 min-h-[120px] max-h-[280px] overflow-y-auto whitespace-pre-wrap">
              {response || "Ti ascolto! Premi Ctrl+Invio per inviare velocemente."}
            </div>
          </motion.div>
        ) : (
          <div className="relative">
            <AnimatePresence>
              {(isLauncherHovered || showHintBubble) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="pointer-events-none absolute right-0 rounded-2xl border border-emerald-200 bg-white/95 px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-semibold text-emerald-900 shadow-[0_14px_35px_rgba(16,185,129,0.24)] whitespace-nowrap"
                  style={{ bottom: `calc(100% + ${HINT_BUBBLE_GAP})` }}
                >
                  Se hai domande chiedi pure a me
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={() => setIsChatOpen(true)}
              onHoverStart={() => setIsLauncherHovered(true)}
              onHoverEnd={() => setIsLauncherHovered(false)}
              onFocus={() => setIsLauncherHovered(true)}
              onBlur={() => setIsLauncherHovered(false)}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="group relative bg-transparent hover:scale-105 active:scale-95 transition-transform"
              style={{ width: TREE_LOGO_SIZE, height: TREE_LOGO_SIZE }}
              aria-label="Apri chat con Vito AI"
            >
              <img
                src="/logo_vivo.png"
                alt="Logo Vivo"
                className="h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
              />
            </motion.button>
          </div>
        )}
      </div>
    </main>
  );
}
