import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { requestOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState(""); // opcional para primer registro
  const [code, setCode] = useState("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const isInstitutional = useMemo(() => {
    const e = email.trim().toLowerCase();
    return e.endsWith("@ufide.ac.cr");
  }, [email]);

  const handleRequest = async (e) => {
    e.preventDefault();
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
      // Redirigir por rol
      if (u?.role === "COORD") navigate("/admin");
      else navigate("/student");
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4 border border-slate-200">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Iniciar sesión
          </h1>
          <p className="text-sm text-slate-500">
            Acceso con correo institucional (modo demo)
          </p>
        </div>

        {err && (
          <div className="text-sm bg-red-50 text-red-700 border border-red-200 rounded-xl p-3">
            {err}
          </div>
        )}
        {msg && (
          <div className="text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-xl p-3">
            {msg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequest} className="space-y-3">
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
              disabled={busy}
              className="w-full bg-[rgba(2,14,159,1)] text-white p-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {busy ? "Enviando..." : "Enviar código"}
            </button>

            <p className="text-xs text-slate-500">
              * En modo demo, el código se imprime en la consola del backend.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
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
    </div>
  );
}
