// src/pages/LoginPage.jsx
import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { requestOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [code, setCode] = useState("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const isInstitutional = useMemo(() => {
    const e = email.trim().toLowerCase();
    return e.endsWith("@ufide.ac.cr");
  }, [email]);

  const handleMicrosoftClick = async () => {
    setErr("");
    setMsg("");

    const eclean = email.trim().toLowerCase();
    if (!eclean) return setErr("Ingresá tu correo institucional.");
    if (!isInstitutional) return setErr("Usá tu correo @ufide.ac.cr.");

    try {
      setBusy(true);
      const res = await requestOtp(eclean);
      setMsg(
        res?.message ||
          "Código enviado (modo demo). Revisá la consola del backend.",
      );
      setStep(2);
    } catch (error) {
      setErr(error?.response?.data?.message || "No se pudo enviar el código.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    const eclean = email.trim().toLowerCase();
    const cclean = code.trim();

    if (!cclean) return setErr("Ingresá el código de 6 dígitos.");

    try {
      setBusy(true);
      const u = await verifyOtp(eclean, cclean, nombre.trim());

      // 🔥 IMPORTANTE: tus rutas son /admin y /portal
      if (u?.role === "COORD") navigate("/admin");
      else navigate("/portal");
    } catch (error) {
      setErr(error?.response?.data?.message || "Código incorrecto o expirado.");
    } finally {
      setBusy(false);
    }
  };

  const backToEmail = () => {
    setStep(1);
    setCode("");
    setMsg("");
    setErr("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[rgba(2,14,159,1)]">
      <div className="w-full max-w-sm">
        {/* “pantalla estilo U” */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-white/90 text-xs font-semibold">
            TechSeed · TCU
          </div>
          <h1 className="text-white text-2xl font-extrabold mt-3">
            Universidad Fidélitas
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Acceso institucional (modo demo)
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-white/30 p-6">
          <h2 className="text-center text-lg font-bold text-slate-900">
            Hola, Bienvenido a TechSeed
          </h2>
          <p className="text-center text-sm text-slate-500 mt-1">
            Ingresá con tu correo institucional
          </p>

          {err && (
            <div className="mt-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-xl p-3">
              {err}
            </div>
          )}
          {msg && (
            <div className="mt-4 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-xl p-3">
              {msg}
            </div>
          )}

          {step === 1 ? (
            <div className="mt-5 space-y-3">
              <input
                type="email"
                placeholder="Correo institucional (ej: esoto50484@ufide.ac.cr)"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <input
                type="text"
                placeholder="Nombre (opcional para primer ingreso)"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <button
                onClick={handleMicrosoftClick}
                disabled={busy}
                className="w-full border border-slate-300 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-slate-50 disabled:opacity-60"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100">
                  {/* “logo” simple tipo Microsoft */}
                  <span className="grid grid-cols-2 gap-[2px]">
                    <span className="w-[8px] h-[8px] bg-red-500 block" />
                    <span className="w-[8px] h-[8px] bg-green-500 block" />
                    <span className="w-[8px] h-[8px] bg-blue-500 block" />
                    <span className="w-[8px] h-[8px] bg-yellow-400 block" />
                  </span>
                </span>

                <span className="text-sm font-semibold text-slate-700">
                  {busy ? "Enviando..." : "Correo institucional"}
                </span>
              </button>

              <p className="text-[11px] text-slate-500">
                * En modo demo, el código se imprime en la consola del backend.
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="mt-5 space-y-3">
              <div className="text-sm text-slate-700">
                Código enviado a:{" "}
                <span className="font-semibold">
                  {email.trim().toLowerCase()}
                </span>
              </div>

              <input
                inputMode="numeric"
                placeholder="Código de 6 dígitos"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200 tracking-widest text-center text-lg"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />

              <button
                disabled={busy}
                className="w-full bg-[rgba(2,14,159,1)] text-white p-3 rounded-xl font-semibold disabled:opacity-60"
              >
                {busy ? "Verificando..." : "Ingresar"}
              </button>

              <button
                type="button"
                onClick={backToEmail}
                className="w-full p-3 rounded-xl font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cambiar correo
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-white/70 text-xs mt-4">
          Proyecto académico — Universidad Fidélitas
        </p>
      </div>
    </div>
  );
}
