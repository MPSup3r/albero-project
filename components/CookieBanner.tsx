"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Controlliamo se l'utente ha già accettato
    const consent = localStorage.getItem("vito_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("vito_cookie_consent", "true");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-stone-200 shadow-2xl rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
            <div className="text-stone-700 text-sm md:text-base leading-relaxed">
              <p>
                <strong>Informativa:</strong> Questo sito utilizza esclusivamente <strong>cookie tecnici</strong> necessari per il corretto funzionamento della piattaforma. Non usiamo tecnologie di tracciamento o profilazione a fini commerciali.
              </p>
              <p className="mt-1 text-stone-500 text-xs md:text-sm">
                Continuando la navigazione, confermi di aver preso visione della nostra{" "}
                <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 underline font-medium">Privacy Policy</Link> e dei{" "}
                <Link href="/termini" className="text-emerald-600 hover:text-emerald-700 underline font-medium">Termini e Condizioni</Link>.
              </p>
            </div>
            <button
              onClick={acceptCookies}
              className="whitespace-nowrap bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95"
            >
              Ho capito
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
