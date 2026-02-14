import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Iniciar sesión</h1>

        <input
          type="email"
          placeholder="Correo institucional"
          className="w-full p-2 border rounded-md"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded-md"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-[rgba(2,14,159,1)] text-white p-2 rounded-md">
          Entrar
        </button>
      </form>
    </div>
  );
}
