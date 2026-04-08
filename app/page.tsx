"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { getImages } from "./actions"; 

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
  const [images, setImages] = useState<any[]>([]);
  
  // STATO PER LA MODALITA' FULLSCREEN
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const HINT_TIMER_MS = 10000;
  const HINT_DURATION_MS = 3200;

  const TREE_LOGO_SIZE = "clamp(50px, 7vw, 75px)";
  const LAUNCHER_INSET = "clamp(16px, 3vw, 32px)";

  useEffect(() => {
    getImages().then((data) => setImages(data)).catch(console.error);

    const intervalId = setInterval(() => {
      setShowHintBubble(true);
      setTimeout(() => setShowHintBubble(false), HINT_DURATION_MS);
    }, HINT_TIMER_MS);

    return () => clearInterval(intervalId);
  }, [HINT_DURATION_MS, HINT_TIMER_MS]);

  const handleMascotClick = () => {
    setShowHintBubble(true);
    setTimeout(() => setShowHintBubble(false), HINT_DURATION_MS);
  };

  // Funzioni per scorrere le immagini in fullscreen
  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] relative overflow-hidden font-sans text-slate-800">
      
      {/* Sfondi decorativi */}
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

      {/* Griglia Contenuti originale */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 px-6 cursor-default">
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
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

        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
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

        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
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

      {/* SEZIONE GALLERIA IMMAGINI */}
      {images.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
          <h2 className="text-3xl font-bold text-emerald-900 mb-8 text-center">Galleria Fotografica 📸</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img: any, index: number) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-3 rounded-[2rem] shadow-xl border border-white hover:-translate-y-2 transition-transform duration-300"
              >
                {/* 1. SE L'IMMAGINE VA IN ERRORE, NASCONDIAMO QUESTO DIV E RIMANE SOLO LA DIDASCALIA */}
                <div 
                  className="aspect-square overflow-hidden rounded-[1.5rem] cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img 
                    src={img.url} 
                    alt={img.caption} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                    onError={(e) => {
                      // Nasconde il contenitore dell'immagine se il link è rotto o inesistente
                      (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                {img.caption && (
                  <p className="py-4 px-2 text-center text-slate-600 font-medium text-sm italic">
                    "{img.caption}"
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Spazio finale */}
      <div className="h-24"></div>

      {/* MASCOTTE FLUTTUANTE */}
      <div className="fixed z-40 flex flex-col items-end" style={{ bottom: LAUNCHER_INSET, right: LAUNCHER_INSET }}>
        <AnimatePresence>
          {(isLauncherHovered || showHintBubble) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pointer-events-none rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 text-sm font-bold text-emerald-900 shadow-2xl relative mb-3"
            >
              Ciao! Sono Vito 🌱
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-emerald-200 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={handleMascotClick}
          onHoverStart={() => setIsLauncherHovered(true)}
          onHoverEnd={() => setIsLauncherHovered(false)}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="group relative bg-transparent hover:scale-110 active:scale-95 transition-transform"
          style={{ width: TREE_LOGO_SIZE, height: TREE_LOGO_SIZE }}
          aria-label="Saluta Vito"
        >
          <div className="w-full h-full bg-emerald-500 rounded-full shadow-[0_8px_25px_rgba(16,185,129,0.4)] border-[3px] border-white overflow-hidden flex items-center justify-center">
            <img
              src="/logo_vivo.png"
              alt="Logo Vivo"
              className="h-full w-full object-cover group-hover:rotate-12 transition-transform duration-300"
            />
          </div>
        </motion.button>
      </div>

      {/* 2. OVERLAY FULLSCREEN (LIGHTBOX) */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setSelectedImageIndex(null)} // Chiude cliccando lo sfondo
          >
            {/* Tasto Chiudi */}
            <button
              className="absolute top-6 right-6 text-white text-4xl hover:text-emerald-400 transition-colors z-[60]"
              onClick={() => setSelectedImageIndex(null)}
            >
              &times;
            </button>

            {/* Freccia Indietro */}
            {images.length > 1 && (
              <button
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white text-4xl md:text-6xl hover:text-emerald-400 transition-colors z-[60] p-4"
                onClick={showPrevImage}
              >
                &#10094;
              </button>
            )}

            {/* Immagine Principale */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-full max-h-full flex flex-col items-center justify-center" 
              onClick={(e) => e.stopPropagation()} // Impedisce la chiusura cliccando la foto
            >
              <img
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].caption}
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
              {images[selectedImageIndex].caption && (
                <p className="text-white mt-6 text-xl font-medium italic text-center drop-shadow-lg">
                  "{images[selectedImageIndex].caption}"
                </p>
              )}
            </motion.div>

            {/* Freccia Avanti */}
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