import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import StudentPortal from "./pages/StudentPortal.jsx";
import InstitutionsPage from "./pages/InstitutionsPage.jsx";

import { SolicitudProvider } from "./contexts/SolicitudContext.jsx";

import logoTechSeed from "./assets/logo-techseed.png";

function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10">
        {/* Encabezado principal */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 mb-3">
            <span className="w-2 h-2 rounded-full bg-[rgba(2,14,159,1)]" />
            Proyecto TCU · Universidad Fidélitas
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 mb-1">
            Fidélitas <span className="text-[#FFCA00]">TechSeed</span>
          </h1>

          <p className="text-center text-slate-600 text-sm md:text-base">
            Plataforma web para gestionar los proyectos de Trabajo Comunal
            Universitario (TCU) de forma clara, ordenada y digital.
          </p>
        </div>

        {/* Contenido en dos columnas */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Columna izquierda: texto + botones + pasos */}
          <div className="flex flex-col gap-6">
            {/* Subtítulo corto */}
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Elegí cómo querés ingresar
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Si sos parte del personal del TCU, ingresá al dashboard de
                administración. Si sos estudiante, accedé al portal para enviar
                y revisar el estado de tu proyecto.
              </p>
            </div>

            {/* Botones principales */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/admin"
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white shadow-lg
                           text-center bg-[rgba(2,14,159,1)] hover:bg-indigo-900
                           transition-transform hover:scale-[1.03]"
              >
                🛠 Dashboard Admin
              </Link>

              <Link
                to="/portal"
                className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-900
                           bg-[#FFCA00] hover:bg-yellow-500 text-center shadow-md
                           transition-transform hover:scale-[1.03]"
              >
                🎓 Portal Estudiante
              </Link>
            </div>

            {/* Pasos del proceso */}
            <div className="bg-slate-50 rounded-2xl p-5 shadow-inner border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-3">
                ¿Cómo funciona el sistema?
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📝</span>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">1.</span> El estudiante
                    completa la información de su TCU y adjunta los documentos
                    requeridos.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔎</span>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">2.</span> El personal del
                    TCU recibe la solicitud en el dashboard, la revisa y puede
                    agregar observaciones.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">📬</span>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">3.</span> El estudiante
                    recibe el resultado de la revisión y el estado actualizado
                    de su proyecto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: logo + descripción */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-6">
              <div className="w-40 h-40 mb-4 flex items-center justify-center">
                <img
                  src={logoTechSeed}
                  alt="Logo Fidélitas TechSeed"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-center text-sm md:text-base font-medium text-slate-800 leading-snug">
                <span className="text-[rgba(2,14,159,1)] font-semibold">
                  Fidélitas TechSeed
                </span>{" "}
                es un proyecto TCU que busca conectar a estudiantes de la
                Universidad Fidélitas con iniciativas que generan impacto real
                en la comunidad.
              </p>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Este sistema es un proyecto académico desarrollado por estudiantes
              de Ingeniería en Desarrollo de Software para optimizar la gestión
              del Trabajo Comunal Universitario (TCU) y modernizar los procesos
              internos del departamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SolicitudProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/portal" element={<StudentPortal />} />
          <Route path="/instituciones" element={<InstitutionsPage />} />
        </Routes>
      </BrowserRouter>
    </SolicitudProvider>
  );
}
