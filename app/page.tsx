"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { getImages, getMeasurements } from "./actions";
import TreeChart from "@/components/TreeChart";

type GalleryImage = {
  id: string | number;
  url: string;
  caption?: string;
};

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
  const [isLauncherHovered, setIsLauncherHovered] = useState(false);
  const [showHintBubble, setShowHintBubble] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [measurements, setMeasurements] = useState<any[]>([]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const HINT_TIMER_MS = 10000;
  const HINT_DURATION_MS = 3200;

  const TREE_LOGO_SIZE = "clamp(50px, 7vw, 75px)";
  const LAUNCHER_INSET = "clamp(16px, 3vw, 32px)";
  const HINT_BUBBLE_GAP = "12px";

  const BACKEND_URL = "https://treesitetorricellirelay.onrender.com/api/chat";

  useEffect(() => {
  getImages()
    .then((data) => {
      const normalized: GalleryImage[] = Array.isArray(data)
        ? data
            .filter(
              (item): item is Record<string, unknown> =>
                typeof item === "object" && item !== null
            )
            .map((item, index) => ({
              id:
                typeof item.id === "string" || typeof item.id === "number"
                  ? item.id
                  : index,
              url: typeof item.url === "string" ? item.url : "",
              caption:
                typeof item.caption === "string" ? item.caption : undefined,
            }))
            .filter((item) => item.url.length > 0)
        : [];

      setImages(normalized);
    })
    .catch(console.error);

  getMeasurements()
    .then((data) => setMeasurements(data))
    .catch(console.error);

  const intervalId = setInterval(() => {
    if (!isChatOpen) {
      setShowHintBubble(true);

      setTimeout(() => {
        setShowHintBubble(false);
      }, HINT_DURATION_MS);
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

  const handleMascotClick = () => {
    handleOpenChat();
  };

  const showPrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => {
      if (prev === null || images.length === 0) return prev;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  };

  const showNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => {
      if (prev === null || images.length === 0) return prev;
      return prev === images.length - 1 ? 0 : prev + 1;
    });
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

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Aggressive stagger animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const popInItem = {
    hidden: { opacity: 0, y: 50, scale: 0.9, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any, // Very snappy spring-like ease
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] relative overflow-hidden font-sans text-slate-800">
      {/* Sfondi decorativi animati */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/50 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -25, 35, 0],
          y: [0, 30, -25, 0],
          scale: [1, 0.9, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-green-100/60 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -20, 40, 0],
          scale: [1, 1.08, 0.92, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Hero Section */}
      <header ref={heroRef} className="max-w-5xl mx-auto mb-16 relative pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: heroY, scale: heroScale }}
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

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center mt-8 h-[500px] md:h-[600px] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.h1
            initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-7xl md:text-9xl font-extrabold tracking-tight mb-4 text-emerald-900 drop-shadow-sm"
          >
            Vivo
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="bg-white/50 backdrop-blur-md border border-white/60 shadow-sm px-6 py-2 rounded-full"
          >
            <p className="text-xl md:text-2xl font-medium text-emerald-800 tracking-wide">
              Il nostro Pioppo Bianco
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 1, ease: [0.25, 0.4, 0.25, 1] }}
            className="mt-8 h-[1px] w-32 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
          />
        </motion.div>

      </header>

      {/* Quadro Generale del Progetto */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto px-6 relative z-10 cursor-default mb-8"
      >
        <motion.div 
          variants={popInItem}
          className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 md:p-12 transition-all duration-300 hover:bg-white/80 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-900/10"
        >
          <motion.h2 variants={popInItem} className="text-3xl font-bold mb-8 text-center text-emerald-900">
            Il Progetto &quot;Vivo&quot; 🌱
          </motion.h2>
          <motion.p variants={popInItem} className="text-slate-600 leading-relaxed font-medium text-center max-w-3xl mx-auto mb-6">
            Il progetto &quot;Vivo&quot; rappresenta l&apos;impegno concreto della classe 4B Informatica
            dell&apos;I.T. Evangelista Torricelli nell&apos;ambito dell&apos;iniziativa ambientale{" "}
            <strong className="text-emerald-800">Green School – &quot;Coloriamo di Verde&quot;</strong>.
          </motion.p>
          <motion.p variants={popInItem} className="text-slate-600 leading-relaxed text-center max-w-3xl mx-auto mb-8">
            L&apos;obiettivo primario è la riqualificazione arborea dell&apos;area di via Ulisse Dini a Milano,
            attraverso la messa a dimora e il monitoraggio costante di un esemplare di Pioppo Bianco
            (<em>Populus alba</em>). L&apos;intervento si configura come un laboratorio scientifico a cielo 
            aperto per lo studio della crescita vegetativa in ambiente urbano.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={popInItem} className="flex gap-3 items-start bg-white/50 p-4 rounded-xl border border-white/50 shadow-sm hover:-translate-y-1 transition-transform">
              <span className="text-2xl mt-0.5">🌿</span>
              <div>
                <strong className="text-emerald-800">Portiamo il verde in classe</strong>
                <p className="text-sm text-slate-600 mt-1">Prima fase curata dal primo biennio.</p>
              </div>
            </motion.div>
            <motion.div variants={popInItem} className="flex gap-3 items-start bg-white/50 p-4 rounded-xl border border-white/50 shadow-sm hover:-translate-y-1 transition-transform">
              <span className="text-2xl mt-0.5">🌳</span>
              <div>
                <strong className="text-emerald-800">Adottiamo un albero</strong>
                <p className="text-sm text-slate-600 mt-1">Seconda fase curata dal triennio, per legare ogni classe a una pianta.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Note Botaniche */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 px-6 cursor-default mb-8"
      >
        <motion.section
          variants={popInItem}
          className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-all duration-300 hover:bg-white/80 hover:scale-[1.02] hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10"
        >
          <h2 className="text-2xl font-bold mb-4 border-b border-emerald-100 pb-3 text-emerald-900">
            Note Botaniche 🔬
          </h2>
          <p className="text-sm font-semibold text-emerald-700 bg-emerald-50/50 inline-block px-3 py-1 rounded-lg border border-emerald-100/50 mb-4">
            Populus alba · Famiglia: Salicaceae
          </p>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-emerald-800 mb-1">Morfologia</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Caratterizzato da una corteccia chiara e foglie decidue con pagina inferiore
                tomentosa (bianca e vellutata), l&apos;albero offre un suggestivo contrasto cromatico
                sotto l&apos;azione del vento.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-emerald-800 mb-1">Ruolo Ecologico</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Grazie alla sua imponenza (può superare i 30 metri), funge da naturale barriera
                frangivento e contribuisce in modo significativo al sequestro della CO₂.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={popInItem}
          className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-all duration-300 hover:bg-white/80 hover:scale-[1.02] hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10"
        >
          <h2 className="text-2xl font-bold mb-4 border-b border-emerald-100 pb-3 text-emerald-900">
            Varietà Correlate 🌿
          </h2>
          <ul className="space-y-4">
            <li>
              <h4 className="font-bold text-emerald-800">Populus alba &quot;Bolleana&quot;</h4>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                Dal portamento slanciato, cresce dritta e stretta con foglie piccole e argentate. Molto elegante.
              </p>
            </li>
            <li>
              <h4 className="font-bold text-emerald-800">Pyramidalis</h4>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                Forma slanciata e verticale, utilizzata spesso come barriera frangivento naturale.
              </p>
            </li>
            <li>
              <h4 className="font-bold text-emerald-800">Pioppo Canescente</h4>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                Ibrido naturale con il Pioppo Nero, noto per l&apos;estrema robustezza e le foglie più rotonde.
              </p>
            </li>
          </ul>
        </motion.section>
      </motion.div>

      {/* Cronaca Operativa della Piantumazione */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto px-6 relative z-10 cursor-default mb-8"
      >
        <motion.div 
          variants={popInItem}
          className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 md:p-12 transition-all duration-300 hover:bg-white/80 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-900/10"
        >
          <motion.h2 variants={popInItem} className="text-3xl font-bold mb-8 text-center text-emerald-900">
            Cronaca della Piantumazione 🪴
          </motion.h2>
          <motion.p variants={popInItem} className="text-center text-sm font-semibold text-emerald-700 bg-emerald-50/50 inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-emerald-100/50 mb-8 mx-auto block w-fit">
            📅 3 Dicembre 2025 — con supervisione di un esperto botanico
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div variants={popInItem}>
              <h3 className="text-xl font-bold mb-4 text-emerald-800">
                Logistica e Trasporto
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                L&apos;esemplare è stato consegnato in prossimità del sito d&apos;intervento. La movimentazione
                finale verso il punto di scavo è stata gestita manualmente dalla classe tramite
                l&apos;ausilio di un carrello per carichi pesanti, prestando la massima attenzione
                all&apos;integrità del vaso e dell&apos;apparato radicale, nonostante le condizioni del terreno
                reso fangoso dalle precipitazioni stagionali.
              </p>
            </motion.div>

            <motion.div variants={popInItem}>
              <h3 className="text-xl font-bold mb-4 text-emerald-800">
                Messa a Dimora
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Sotto la direzione dell&apos;esperto, la classe ha proceduto allo scavo manuale della buca
                utilizzando pale e vanghe, seguendo rigidi standard tecnici:
              </p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-3 items-start bg-white/50 p-3 rounded-xl border border-white/50 shadow-sm">
                  <span className="text-lg mt-0.5">💧</span>
                  <span>
                    <strong>Drenaggio:</strong> strato di cocci di vaso sul fondo della buca per favorire
                    il deflusso idrico e prevenire ristagni radicali.
                  </span>
                </li>
                <li className="flex gap-3 items-start bg-white/50 p-3 rounded-xl border border-white/50 shadow-sm">
                  <span className="text-lg mt-0.5">🛡️</span>
                  <span>
                    <strong>Protezione:</strong> recinzione in legno assemblata sul posto per preservare
                    la giovane pianta durante la fase critica di attecchimento.
                  </span>
                </li>
                <li className="flex gap-3 items-start bg-white/50 p-3 rounded-xl border border-white/50 shadow-sm">
                  <span className="text-lg mt-0.5">✏️</span>
                  <span>
                    <strong>Identificazione:</strong> installazione di una <strong>matita di legno gigante arancione</strong>,
                    elemento distintivo scelto dalla 4B per segnalare la posizione di &quot;Vivo&quot;.
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Sezione Grafici di Crescita */}
      <motion.section
        initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="max-w-5xl mx-auto px-6 py-8 relative z-10"
        id="crescita"
      >
        <div className="bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 md:p-10 transition-all duration-300 hover:bg-white/80 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10">
          <h2 className="text-3xl font-bold mb-2 text-center text-emerald-900">
            Dati Biometrici e Monitoraggio 📈
          </h2>
          <p className="text-sm text-slate-500 text-center mb-8">
            Monitoraggio sistematico avviato ad aprile 2026 tramite la piattaforma dedicata
          </p>
          <TreeChart data={measurements} />
          {measurements.length === 0 && (
            <p className="text-sm text-slate-400 mt-4 text-center font-medium">
              *Nessun dato ancora inserito. Vai su /admin per aggiungere le misurazioni!
            </p>
          )}
          {measurements.length > 0 && (
            <div className="mt-8 bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-emerald-800 mb-3">📊 Interpretazione dei Risultati</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                I dati raccolti mostrano un incremento dell&apos;altezza del <strong>25% in soli sei giorni</strong>.
                Ancora più rilevante è l&apos;aumento della circonferenza, che suggerisce una stabilità
                strutturale in rapido consolidamento. Tali parametri confermano il successo delle
                tecniche di piantumazione adottate e l&apos;ottimale adattamento del Pioppo Bianco al
                terreno del Parco Dini.
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Galleria immagini */}
      {images.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16 relative z-10">
          <h2 className="text-3xl font-bold text-emerald-900 mb-8 text-center">
            Galleria Fotografica 📸
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                className="bg-white p-3 rounded-[2rem] shadow-xl border border-white hover:-translate-y-2 transition-transform duration-300"
              >
                <div
                  className="aspect-square overflow-hidden rounded-[1.5rem] cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={img.url}
                    alt={img.caption || "Immagine galleria"}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                {img.caption && (
                  <p className="py-4 px-2 text-center text-slate-600 font-medium text-sm italic">
                    &quot;{img.caption}&quot;
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Map Banner */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto px-6 py-8 relative z-10"
      >
        <a 
          href="https://www.google.com/maps/place/45%C2%B025'41.2%22N+9%C2%B010'47.6%22E/@45.428113,9.179875,17z/data=!3m1!4b1!4m4!3m3!8m2!3d45.428113!4d9.179875?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
        >
          {/* Sfondo animato hover */}
          <div className="absolute inset-0 bg-black/5 opacity-10 mix-blend-overlay group-hover:opacity-20 transition-opacity duration-500" />
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-400 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-green-300 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
                Vieni a trovarmi 📍
              </h2>
              <div className="text-emerald-100/90 text-lg font-medium flex flex-wrap justify-center md:justify-start items-center gap-2">
                <span>Parco Ulisse Dini, Milano</span>
                <span className="opacity-50 hidden md:inline">•</span>
                <span className="font-mono text-sm bg-black/20 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">45.428113, 9.179875</span>
              </div>
            </div>
            
            <div className="flex-shrink-0 bg-white text-emerald-700 font-bold px-8 py-4 rounded-full flex items-center gap-3 group-hover:bg-emerald-50 transition-colors shadow-lg group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              Apri in Maps
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </a>
      </motion.section>

      {/* Conclusioni */}
      <motion.section
        initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="max-w-5xl mx-auto px-6 py-8 relative z-10"
      >
        <div className="bg-emerald-900/90 backdrop-blur-2xl border border-emerald-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.15)] rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Conclusioni 🎓
          </h2>
          <p className="text-emerald-100 leading-relaxed max-w-3xl mx-auto mb-6">
            L&apos;adozione di &quot;Vivo&quot; rappresenta per la 4B un&apos;importante esperienza di cittadinanza attiva
            e analisi scientifica. La sinergia tra l&apos;esperienza pratica sul campo, guidata da
            professionisti del settore, e la successiva fase di analisi informatica dei dati,
            costituisce un esempio di come le competenze tecniche possano essere applicate con
            successo alla tutela del patrimonio verde urbano.
          </p>
          <p className="text-sm text-emerald-300 font-medium italic">
            Relazione tecnica a cura della Classe 4B info — I.T. Torricelli
          </p>
        </div>
      </motion.section>

      {/* Spazio finale */}
      <div className="h-24" />

      {/* Launcher / Chat */}
      <div
        className="fixed z-40 flex flex-col items-end"
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
              className="mb-3 w-[min(92vw,380px)] rounded-[28px] border border-emerald-200 bg-white/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(16,185,129,0.22)] p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-emerald-900">
                    Chat con Vivo
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Fai una domanda sull&apos;albero o sul progetto
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
                    className="pointer-events-none absolute right-0 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 text-sm font-bold text-emerald-900 shadow-2xl mb-3 whitespace-nowrap"
                    style={{ bottom: `calc(100% + ${HINT_BUBBLE_GAP})` }}
                  >
                    Se hai domande chiedi pure a me
                    <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-emerald-200 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={handleMascotClick}
                onHoverStart={() => setIsLauncherHovered(true)}
                onHoverEnd={() => setIsLauncherHovered(false)}
                onFocus={() => setIsLauncherHovered(true)}
                onBlur={() => setIsLauncherHovered(false)}
                className="group relative bg-transparent hover:scale-110 active:scale-95 transition-transform"
                style={{ width: TREE_LOGO_SIZE, height: TREE_LOGO_SIZE }}
                aria-label="Apri chat con Vivo AI"
              >
                <div className="w-full h-full bg-emerald-500 rounded-full shadow-[0_8px_25px_rgba(16,185,129,0.4)] border-[3px] border-white overflow-hidden flex items-center justify-center">
                  <img
                    src="/logo_vivo.png"
                    alt="Logo Vivo"
                    className="h-full w-full object-cover group-hover:rotate-12 transition-transform duration-300"
                  />
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox fullscreen */}
      <AnimatePresence>
        {selectedImageIndex !== null && images[selectedImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-white text-4xl hover:text-emerald-400 transition-colors z-[60]"
              onClick={() => setSelectedImageIndex(null)}
            >
              &times;
            </button>

            {images.length > 1 && (
              <button
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white text-4xl md:text-6xl hover:text-emerald-400 transition-colors z-[60] p-4"
                onClick={showPrevImage}
              >
                &#10094;
              </button>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-full max-h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].caption || "Immagine fullscreen"}
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
              {images[selectedImageIndex].caption && (
                <p className="text-white mt-6 text-xl font-medium italic text-center drop-shadow-lg">
                  &quot;{images[selectedImageIndex].caption}&quot;
                </p>
              )}
            </motion.div>

            {images.length > 1 && (
              <button
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white text-4xl md:text-6xl hover:text-emerald-400 transition-colors z-[60] p-4"
                onClick={showNextImage}
              >
                &#10095;
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
