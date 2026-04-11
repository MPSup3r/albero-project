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
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
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

// Carousel Auto-play logic
useEffect(() => {
  if (images.length === 0) return;
  const carouselInterval = setInterval(() => {
    setCurrentCarouselIndex((prev) => (prev + 1) % images.length);
  }, 4000);
  return () => clearInterval(carouselInterval);
}, [images.length]);

const nextCarouselImage = () => {
  setCurrentCarouselIndex((prev) => (prev + 1) % images.length);
};

const prevCarouselImage = () => {
  setCurrentCarouselIndex((prev) => (prev - 1 + images.length) % images.length);
};

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

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  
  // Exergy3-style gentle zoom in the background without side-to-side jerks
  const treeScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Gentle fade up from the void
  const popInItem = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <main className="min-h-[500vh] bg-[#FCFDFD] relative overflow-hidden font-sans text-slate-800">
      {/* Decals and environmental lighting for Solarpunk feel */}
      <div className="absolute top-0 left-0 w-full h-[150vh] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto mb-40 relative pt-32 px-6">
        <div className="relative z-10 flex flex-col justify-center h-[500px] pointer-events-none items-center text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="mb-6">
            <span className="font-mono text-emerald-500 text-sm tracking-widest border border-emerald-200/50 bg-white/50 px-3 py-1 rounded-full uppercase shadow-sm">
              [ PROGETTO BOTANICO VIVO ]
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-7xl md:text-[12rem] tracking-tighter font-extrabold mb-4 text-slate-900 drop-shadow-sm"
          >
            VIVO
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p className="text-xl md:text-2xl font-medium text-emerald-600 tracking-widest uppercase">
              Urban Thermal & Carbon Sink
            </p>
          </motion.div>
        </div>
      </header>

      {/* Static background container for the tree */}
      <div className="absolute top-0 left-0 w-full h-[150vh] pointer-events-none z-0" />
      
      <div
        className="absolute top-0 inset-x-0 h-[80vh] md:h-[100vh] z-0 pointer-events-auto cursor-grab active:cursor-grabbing opacity-100 mix-blend-multiply flex items-center justify-center mask-image-[linear-gradient(to_bottom,black_40%,transparent)]"
      >
        <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />
          <Environment preset="city" />
          <BasicTree />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2.5} />
        </Canvas>
      </div>

      {/* Quadro Generale del Progetto */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 relative z-10 mb-60 mt-[20vh]"
      >
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 mt-32">
          {/* Box testo */}
          <div className="w-full md:w-1/2 bg-white/70 backdrop-blur-2xl border border-emerald-100 shadow-[0_32px_80px_rgba(16,185,129,0.07)] p-8 md:p-12 rounded-[2rem]">
            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-4 block">
              [ SINTESI PROGETTUALE ]
            </span>
            <motion.h2 variants={popInItem} className="text-4xl md:text-5xl font-semibold mb-8 text-emerald-950 tracking-tighter">
              Ecosistema &ldquo;Vivo&rdquo;
            </motion.h2>
            <motion.p variants={popInItem} className="text-slate-600 text-xl leading-relaxed mb-8">
              Sviluppato dalla classe 4B Informatica, il progetto costituisce un framework didattico di riqualificazione arborea urbana. 
              Tramite il monitoraggio sistematico di un esemplare di <span className="text-emerald-700 font-semibold">Populus Alba</span>, gli studenti analizzano 
              il ciclo di sequestro della CO₂ e la termoregolazione micro-ambientale nel Parco Dini.
            </motion.p>
          </div>
          
          {/* Immagine Sintesi */}
          <motion.div 
            variants={popInItem}
            className="w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border-[4px] border-white bg-slate-100 relative group"
          >
             <img src="/Ecosistema.jpg" alt="Ecosistema" className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105" />
          </motion.div>
        </div>
      </motion.section>

      {/* Note Botaniche */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 relative z-10 mb-60"
      >
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
          {/* Immagine Botanica */}
          <motion.div 
            variants={popInItem}
            className="w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border-[4px] border-white bg-slate-100 relative group"
          >
             <img src="/Populus_Alba.jpg" alt="Botanica" className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105" />
          </motion.div>

          {/* Box Testo */}
          <div className="w-full md:w-1/2 bg-white/70 backdrop-blur-2xl border border-emerald-100 shadow-[0_32px_80px_rgba(16,185,129,0.07)] p-8 md:p-12 rounded-[2rem]">
            <motion.div variants={popInItem} className="mb-8 text-left">
              <p className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-4">
                [ SPECIE: SALICACEAE ]
              </p>
              <h2 className="text-5xl md:text-6xl font-semibold mb-12 text-emerald-950 tracking-tighter">
                Populus Alba
              </h2>
              <div className="space-y-12">
                <div>
                  <h4 className="font-mono text-emerald-700 text-sm tracking-widest uppercase mb-3">/ Proprietà Riflettenti</h4>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Caratterizzato da corteccia chiara e fogliame deciduo. La pagina inferiore, tomentosa 
                    e spiccatamente bianca, incrementa l&apos;albedo locale riflettendo la radiazione solare urbana.
                  </p>
                </div>
                <div>
                  <h4 className="font-mono text-emerald-700 text-sm tracking-widest uppercase mb-3">/ Ruolo Infrastrutturale</h4>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Raggiungendo i 30 metri di altezza, l&apos;albero agisce da infrastruttura verde attiva, 
                    fornendo uno schermo frangivento e ottimizzando il potenziale di filtrazione del particolato.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Cronaca Operativa della Piantumazione */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 relative z-10 mb-60"
      >
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Box Testo */}
          <motion.div 
            variants={popInItem}
            className="w-full md:w-1/2 bg-white/70 backdrop-blur-2xl border border-emerald-100 shadow-[0_32px_80px_rgba(16,185,129,0.07)] p-8 md:p-12 rounded-[2rem]"
          >
            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-4 block">
              [ ESECUZIONE OPERATIVA ]
            </span>
            <motion.h2 variants={popInItem} className="text-4xl md:text-6xl font-semibold mb-4 text-emerald-950 tracking-tighter">
              Piantumazione
            </motion.h2>
            <motion.p variants={popInItem} className="text-slate-500 font-medium mb-12 text-sm tracking-widest uppercase">
              03 DIC 2025 // Torricelli Deployment
            </motion.p>

            <div className="space-y-10">
              <motion.div variants={popInItem}>
                <h3 className="font-mono text-emerald-700 text-sm tracking-widest uppercase mb-2">
                  01. Logistica //
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Movimentazione a ridotto impatto ambientale. L&apos;intervento ha impiegato attrezzature 
                  manuali per preservare la totale integrità dell&apos;apparato radicale sul suolo compromesso dalle precipitazioni.
                </p>
              </motion.div>

              <motion.div variants={popInItem}>
                <h3 className="font-mono text-emerald-700 text-sm tracking-widest uppercase mb-2">
                  02. Messa a dimora //
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Scavo strutturato su standard tecnici rigorosi: predisposizione di uno strato drenante per 
                  minimizzare i ristagni clivi e applicazione di una recinzione protettiva per la fase di attecchimento.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Immagine Operativa */}
          <motion.div 
            variants={popInItem}
            className="w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border-[4px] border-white bg-slate-100 relative group"
          >
             <img src="/Piantumazione.png" alt="Operativa" className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105" />
          </motion.div>
        </div>
      </motion.section>

      {/* Sezione Grafici di Crescita */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 relative z-10 mb-40"
        id="crescita"
      >
        <motion.div variants={popInItem} className="w-full max-w-5xl flex flex-col items-center mx-auto bg-white/70 backdrop-blur-2xl p-8 md:p-14 rounded-[2.5rem] border border-emerald-100 shadow-[0_32px_80px_rgba(16,185,129,0.07)]">
          <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-4 block">
            [ ANALISI BIOMETRICA ONLINE ]
          </span>
          <h2 className="text-4xl md:text-6xl font-semibold mb-12 text-emerald-950 tracking-tighter text-center">
            Dati di Accrescimento
          </h2>
          <div className="w-full pt-6">
            <TreeChart data={measurements} />
          </div>
          {measurements.length === 0 && (
            <p className="text-sm font-mono text-slate-400 mt-4 text-center">
              // ATTESA DATI: MODULO TELEMETRIA NON AGGIORNATO //
            </p>
          )}
          {measurements.length > 0 && (
            <div className="mt-16 text-center w-full bg-emerald-50/50 rounded-2xl p-8 border border-emerald-100">
              <h3 className="font-mono text-emerald-700 text-sm tracking-widest uppercase mb-4">/ Esito Analisi</h3>
              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                Lo sviluppo vegetativo registra un incremento assiale pari al <strong className="text-emerald-800 font-semibold">25% dalla posa iniziale</strong>.
                L&apos;associata espansione della circonferenza rileva un efficiente attecchimento radicale, validando i parametri 
                funzionali del suolo ricevente.
              </p>
            </div>
          )}
        </motion.div>
      </motion.section>

      {/* Galleria immagini Carousel */}
      {images.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 relative z-10 w-full mb-32">
          <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-4 block text-center">
            [ ARCHIVIO VISIVO ]
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-emerald-950 mb-12 text-center tracking-tighter">
            Documentazione Fotografica
          </h2>

          <div className="relative w-full aspect-square md:aspect-[21/9] bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_80px_rgba(16,185,129,0.07)] border border-emerald-100 overflow-hidden group">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={currentCarouselIndex}
                initial={{ opacity: 0, x: 100, filter: "blur(10px)", scale: 0.95 }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, x: -100, filter: "blur(10px)", scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6"
              >
                <div 
                  className="w-full h-full relative rounded-3xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImageIndex(currentCarouselIndex)}
                >
                  <img
                    src={images[currentCarouselIndex].url}
                    alt={images[currentCarouselIndex].caption || "Immagine galleria"}
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  {/* Sfumatura in basso per il testo */}
                  {images[currentCarouselIndex].caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent pb-6 pt-24 px-6 md:pb-12">
                      <p className="text-center text-white font-medium text-lg md:text-xl drop-shadow-md">
                        {images[currentCarouselIndex].caption}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controlli del carosello */}
            <button 
              onClick={prevCarouselImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/60 hover:bg-white backdrop-blur-md text-emerald-900 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={nextCarouselImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/60 hover:bg-white backdrop-blur-md text-emerald-900 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            
            {/* Indicatori (Dots) */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentCarouselIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-400/60'}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Map Banner */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-6 mb-40 relative z-10"
      >
        <div className="flex flex-col md:flex-row items-end justify-between border-t border-emerald-100 pt-16">
          <div className="mb-8 md:mb-0">
            <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-4 block">
              [ COORDINATE GEOGRAFICHE ]
            </span>
            <h2 className="text-4xl md:text-6xl font-semibold mb-6 text-emerald-950 tracking-tighter uppercase">
              Rilevamento Sito
            </h2>
            <div className="flex items-center gap-4 text-emerald-700 font-medium text-xl">
              <span>Parco Ulisse Dini, Milano</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-mono tracking-widest text-slate-500">45.428113, 9.179875</span>
            </div>
          </div>
          
          <a 
            href="https://www.google.com/maps/place/45%C2%B025'41.2%22N+9%C2%B010'47.6%22E/@45.428113,9.179875,17z/data=!3m1!4b1!4m4!3m3!8m2!3d45.428113!4d9.179875?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-6 px-12 py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] shadow-lg shadow-emerald-500/20 transition-all duration-300 ease-[0.16,1,0.3,1]"
          >
            <span className="font-bold tracking-widest uppercase">Visualizza Telemetria</span>
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </motion.section>

      {/* Conclusioni */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration: 1.5 }}
        className="max-w-7xl mx-auto px-6 mb-32 relative z-10 text-center"
      >
        <div className="md:w-8/12 mx-auto pt-24 pb-16">
          <p className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-4">
            [ TERMINE REPORT ]
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-emerald-950 tracking-tighter">
            Progetto Culturale Classe 4B
          </h2>
          <p className="text-slate-500 text-lg uppercase tracking-widest">
            I.T. Evangelista Torricelli
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
