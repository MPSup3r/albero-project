"use client";

import { motion } from "framer-motion";

/* ── layout constants ─────────────────────── */
const R = 37; // card half-size

const nodes = [
  { id: "vercel",   label: "Client App",    sub: "Vercel",        cx: 250, cy: 90,  icon: "vercel", active: false, delay: 0.1 },
  { id: "supabase", label: "Database",      sub: "Supabase",      cx: 100, cy: 255, icon: "db",     active: false, delay: 0.3 },
  { id: "render",   label: "Node.js Relay", sub: "Render",        cx: 400, cy: 255, icon: "server", active: false, delay: 0.4 },
  { id: "ai",       label: "AI Locale",     sub: "Server Scuola", cx: 400, cy: 405, icon: "ai",     active: true,  delay: 0.6 },
];

// Paths connect bottom of source card → top of target card
// Vercel bottom: (250, 127)  Supabase top: (100, 218)  Render top: (400, 218)  AI top: (400, 368)
const edges = [
  { d: "M 250,127 C 250,175 100,175 100,218",   delay: 0.2 },
  { d: "M 250,127 C 250,175 400,175 400,218",   delay: 0.35 },
  { d: "M 400,292 C 400,340 400,340 400,368",   delay: 0.5 },
];

/* ── icons ────────────────────────────────── */
function NodeIcon({ type, active }: { type: string; active?: boolean }) {
  const s = active ? "#fff" : "#059669";
  if (type === "vercel")
    return <svg viewBox="0 0 24 24" width="26" height="26" fill={s}><polygon points="12,2 24,22 0,22" /></svg>;
  if (type === "db")
    return (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={s} strokeWidth="1.8">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
        <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      </svg>
    );
  if (type === "server")
    return (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={s} strokeWidth="1.8">
        <rect x="2" y="3"  width="20" height="7" rx="2" />
        <rect x="2" y="14" width="20" height="7" rx="2" />
        <circle cx="7" cy="6.5"  r="1" fill={s} />
        <circle cx="7" cy="17.5" r="1" fill={s} />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={s} strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" fill={s} />
      <line x1="12" y1="3"  x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="3"  y1="12" x2="7"  y2="12" />
      <line x1="17" y1="12" x2="21" y2="12" />
    </svg>
  );
}

/* ── main component ───────────────────────── */
export default function ArchitectureDiagram() {
  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#f9fafb] overflow-hidden">
      {/* grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
      {/* glows */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-100/60 rounded-full blur-[70px]" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-100/60 rounded-full blur-[70px]" />

      {/* Keyframes injected once at DOM level — no framer-motion conflict */}
      <style>{`
        @keyframes arch-dashflow {
          to { stroke-dashoffset: -24; }
        }
        .arch-edge {
          stroke-dasharray: 7 5;
          animation: arch-dashflow 1.2s linear infinite;
        }
      `}</style>

      <svg
        viewBox="0 0 500 490"
        className="w-full h-full relative z-10"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      >
        <defs>
          <linearGradient id="archEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="archGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/*
          ── EDGES ──
          Opacity only via framer-motion; dash-flow via CSS class.
          NO pathLength → no strokeDashoffset conflict → no flickering.
        */}
        {edges.map((e, i) => (
          <motion.path
            key={i}
            d={e.d}
            fill="none"
            stroke="url(#archEdgeGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="arch-edge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: e.delay }}
          />
        ))}

        {/* ── NODES ── */}
        {nodes.map((n) => (
          <motion.g
            key={n.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 22, delay: n.delay }}
            style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
          >
            {/* pulse ring for active node */}
            {n.active && (
              <motion.circle
                cx={n.cx}
                cy={n.cy}
                r={R + 3}
                fill="#34d399"
                animate={{ r: [R + 3, R + 16], opacity: [0.4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
            )}

            {/* card */}
            <rect
              x={n.cx - R} y={n.cy - R}
              width={R * 2} height={R * 2}
              rx={18}
              fill={n.active ? "#059669" : "#ffffff"}
              stroke={n.active ? "#047857" : "#bbf7d0"}
              strokeWidth="1.5"
              filter="url(#archGlow)"
            />

            {/* icon */}
            <foreignObject x={n.cx - 13} y={n.cy - 13} width={26} height={26}>
              <NodeIcon type={n.icon} active={n.active} />
            </foreignObject>

            {/* label */}
            <text
              x={n.cx} y={n.cy + R + 16}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="700"
              fill="#1a2e1a"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {n.label}
            </text>

            {/* sublabel */}
            <text
              x={n.cx} y={n.cy + R + 29}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="#059669"
              fontFamily="ui-monospace, 'Courier New', monospace"
              letterSpacing="0.1em"
            >
              {n.sub.toUpperCase()}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
