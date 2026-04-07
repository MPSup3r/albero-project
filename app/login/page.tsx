import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Funzione Server Action
async function handleLogin(formData: FormData) {
  "use server";
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const isValidAdmin = username === "Admin" && password === "VitoAdmin2026!";
  const isValidAce = username === "Ace" && password === "VitoAce2026!";

  if (isValidAdmin || isValidAce) {
    const cookieStore = await cookies();
    cookieStore.set("vito_auth", "true", { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });
    redirect("/admin");
  } else {
    redirect("/login?error=true");
  }
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6 font-sans">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl border border-white/80 p-8 rounded-3xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Accesso Privato</h1>
          <p className="text-slate-500">Inserisci le credenziali per gestire Vito</p>
        </div>

        {searchParams?.error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100">
            Username o password non validi. Riprova.
          </div>
        )}

        <form action={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            {/* Aggiunto text-slate-900 per il testo scuro */}
            <input 
              type="text" 
              name="username" 
              required 
              className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="Inserisci username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            {/* Aggiunto text-slate-900 per il testo scuro */}
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4">
            Entra 🚀
          </button>
        </form>
      </div>
    </main>
  );
}