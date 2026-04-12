"use client";

import { motion } from "framer-motion";

type Role = "capogruppo" | "capoprogetto" | "membro";

type Contributor = {
  name: string;
  role: Role;
};

type Group = {
  name: string;
  members: Contributor[];
};

const capoprogetto: Contributor = { name: "Morettini Marco", role: "capoprogetto" };

const groups: Group[] = [
  {
    name: "Foto / Multimedia",
    members: [
      { name: "Atienza Daniele", role: "capogruppo" },
      { name: "Mejiri Karim Luca", role: "membro" },
      { name: "Barreti Leandro", role: "membro" },
      { name: "Dell'Orto Lorenzo", role: "membro" },
      { name: "Bertolini Federico", role: "membro" },
      { name: "Pasquariello Lorenzo", role: "membro" },
      { name: "Bozzi Luca", role: "membro" }
    ]
  },
  {
    name: "Documentazione",
    members: [
      { name: "Sala Francesco", role: "capogruppo" },
      { name: "Gopce Kevin", role: "membro" },
      { name: "Carlini Mario Nicolò", role: "membro" },
      { name: "Vago Davide", role: "membro" },
      { name: "Gamboni Mattia", role: "membro" },
      { name: "Acerno Daniel", role: "membro" }
    ]
  },
  {
    name: "Portale Web WebApp",
    members: [
      { name: "Prati Manuel", role: "capogruppo" },
      { name: "Ebraico Lorenzo", role: "membro" }
    ]
  },
  {
    name: "Testing & QA",
    members: [
      { name: "Bonjean Alessandro", role: "capogruppo" },
      { name: "Candileno Francesco", role: "membro" },
      { name: "Jacinto Joshue Ranier", role: "membro" },
      { name: "Celesti Marco", role: "membro" },
      { name: "Arcuti Cristian", role: "membro" },
      { name: "Bermudez De La Cruz Gianstefano", role: "membro" },
      { name: "Rada Gabriele", role: "membro" }
    ]
  }
];

export default function Contributors() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const popInItem = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } 
    },
  };

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="max-w-7xl mx-auto px-6 mb-40 relative z-10"
    >
      <div className="flex flex-col items-center">
        <span className="font-mono text-emerald-500 text-xs tracking-widest uppercase mb-4 block text-center">
          [ TEAM DI PROGETTO ]
        </span>
        <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-emerald-950 tracking-tighter text-center">
          Contributori
        </h2>
        
        {/* Capoprogetto Standalone Card */}
        <motion.div variants={popInItem} className="mb-16 w-full max-w-sm">
          <div className="flex flex-col items-center bg-emerald-900 border border-emerald-800 p-6 rounded-3xl shadow-[0_15px_40px_rgba(4,47,46,0.3)] hover:-translate-y-2 transition-transform duration-300">
            <span className="text-[11px] font-mono tracking-widest uppercase bg-emerald-800/80 border border-emerald-600/50 px-3 py-1.5 rounded-lg text-emerald-300 shadow-sm mb-4">
              CAPOPROGETTO
            </span>
            <span className="text-2xl font-bold text-white tracking-tight">
              {capoprogetto.name}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full max-w-7xl">
          {groups.map((group, gIdx) => (
            <motion.div key={gIdx} variants={popInItem} className="flex flex-col">
              <h3 className="text-lg md:text-xl font-bold text-emerald-800 mb-6 border-b-2 border-emerald-100 pb-3 tracking-tight">
                {group.name}
              </h3>
              <div className="flex flex-col gap-3">
                {group.members.map((c, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3.5 rounded-[1rem] border transition-all cursor-default flex items-center justify-between hover:-translate-y-1 ${
                      c.role === "capogruppo" 
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] z-10" 
                        : "bg-white/80 border-slate-100 text-slate-700 hover:border-emerald-200 hover:bg-white shadow-sm"
                    }`}
                  >
                    <span className={`text-[15px] ${c.role === "capogruppo" ? "font-bold" : "font-medium"}`}>
                      {c.name}
                    </span>
                    {c.role === "capogruppo" && (
                      <span className="text-[10px] font-mono tracking-widest uppercase bg-white/20 border border-white/30 px-2 py-1 rounded text-white shadow-sm">
                        Capogruppo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
