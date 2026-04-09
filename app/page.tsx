"use client";

import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";

function BasicTree() {
  return (
    <group position={[0, -2.5, 0]}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2, 16]} />
        <meshStandardMaterial color="#6B4423" roughness={0.9} />
      </mesh>
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

  const HINT_TIMER_MS = 10000;
  const HINT_DURATION_MS = 3200;

  const TREE_LOGO_SIZE = "clamp(88px, 14vw, 220px)";
  const LAUNCHER_INSET = "clamp(10px, 2.2vw, 28px)";
  const HINT_BUBBLE_GAP = "12px";

  const BACKEND_URL = "https://treesitetorricellirelay.onrender.com/api/chat";

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isChatOpen) {
        setShowHintBubble(true);

        const timeoutId = setTimeout(() => {
          setShowHintBubble(false);
        }, HINT_DURATION_MS);

        return () => clearTimeout(timeoutId);
      }
    }, HINT_TIMER_MS);

    return () => clearInterval(intervalId);
  }, [HINT_DURATION_MS, HINT_TIMER_MS, isChatOpen]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setShowHintBubble(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  async function sendPrompt() {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isLoading) return;

    setIsLoading(true);
    setResponse("Sto pensando...");

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
        }),
      });

      if (!res.ok) {
        throw new Error(`Errore HTTP ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response || data.reply || "Nessuna risposta ricevuta.");
      setPrompt("");
    } catch (error) {
      console.error(error);
      setResponse("Errore nel collegamento al server.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendPrompt();
  }

  function handlePromptKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      sendPrompt();
    }
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] relative overflow-hidden font-sans text-slate-800">
      {/* Sfondi decorativi */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-green-100/60 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero */}
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

      {/* CHAT + LAUNCHER */}
      <div
        className="fixed z-50"
        style={{ bottom: LAUNCHER_INSET, right: LAUNCHER_INSET }}
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-[min(92vw,380px)] rounded-[28px] border border-emerald-200 bg-white/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(16,185,129,0.22)] p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-emerald-900">
                    Chat con Vito
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Fai una domanda sull’albero o sul progetto
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseChat}
                  className="rounded-full px-3 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  aria-label="Chiudi chat"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={handlePromptKeyDown}
                  rows={5}
                  placeholder="Scrivi qui il tuo messaggio..."
                  className="w-full resize-none rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
                />

                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? "Invio..." : "Invia"}
                  </button>
                </div>
              </form>

              <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 text-sm text-slate-700 min-h-[120px] max-h-[280px] overflow-y-auto whitespace-pre-wrap">
                {response || "Ti ascolto! Premi Ctrl+Invio per inviare velocemente."}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="launcher"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative"
            >
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
                onClick={handleOpenChat}
                onHoverStart={() => setIsLauncherHovered(true)}
                onHoverEnd={() => setIsLauncherHovered(false)}
                onFocus={() => setIsLauncherHovered(true)}
                onBlur={() => setIsLauncherHovered(false)}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
