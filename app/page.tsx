"use client";

import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { motion } from "framer-motion";

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
    </main>
  );
}