import { useState } from "react";
import {
  LuLayoutDashboard,
  LuFilePlus2,
  LuFileSearch,
  LuUser,
  LuTarget,
  LuBuilding,
  LuFileText,
  LuCheck,
} from "react-icons/lu";

import { useSolicitudes } from "../contexts/SolicitudContext";
import StudentStatusPage from "./StudentStatusPage";

// Datos iniciales del formulario
const initialFormData = {
  nombre: "Justin Montoya",
  cedula: "1-1234-5678",
  carrera: "",
  institucion: "",
  justificacion: "",
  objetivoGeneral: "",
  objetivosEspecificos: "",
};

/* ===========================
   WIZARD DE INSCRIPCIÓN
   =========================== */

function StudentWizard({ onCompleted }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  const { addSolicitud } = useSolicitudes();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Validación mínima
    if (!formData.objetivoGeneral || !formData.institucion) {
      alert(
        "Por favor, complete al menos la institución y el objetivo general."
      );
      return;
    }

    addSolicitud(formData);
    alert("¡Solicitud enviada con éxito!");

    if (onCompleted) {
      onCompleted();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const steps = [
    { id: 1, name: "Datos Personales", icon: LuUser },
    { id: 2, name: "Institución", icon: LuBuilding },
    { id: 3, name: "Objetivos y Proyecto", icon: LuTarget },
    { id: 4, name: "Documentos", icon: LuFileText },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      {/* Header del wizard */}
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 mb-4">
          Inscripción de Trabajo Comunal Universitario (TCU)
        </h1>
        <nav className="flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const stepIndex = index + 1;
            const isCompleted = stepIndex < currentStep;
            const isActive = stepIndex === currentStep;

            let circleClasses =
              "w-10 h-10 rounded-full flex items-center justify-center text-lg";
            if (isCompleted) circleClasses += " bg-emerald-500 text-white";
            else if (isActive)
              circleClasses += " bg-[rgba(2,14,159,1)] text-white";
            else circleClasses += " bg-slate-200 text-slate-600";

            const labelClasses =
              "mt-2 text-[11px] font-semibold text-center " +
              (isActive ? "text-[rgba(2,14,159,1)]" : "text-slate-500");

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={circleClasses}>
                  {isCompleted ? <LuCheck /> : <step.icon />}
                </div>
                <p className={labelClasses}>{step.name}</p>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Contenido del paso */}
      <div className="p-6 md:p-8">
        {currentStep === 1 && (
          <Step1_DatosPersonales
            formData={formData}
            handleChange={handleChange}
          />
        )}
        {currentStep === 2 && (
          <Step2_Institucion formData={formData} handleChange={handleChange} />
        )}
        {currentStep === 3 && (
          <Step3_Objetivos formData={formData} handleChange={handleChange} />
        )}
        {currentStep === 4 && <Step4_Documentos />}
      </div>

      {/* Footer del wizard */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg shadow-sm disabled:opacity-50 hover:bg-slate-300 text-sm"
        >
          Atrás
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-[rgba(2,14,159,1)] text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-900 text-sm"
        >
          {currentStep === steps.length ? "Finalizar y Enviar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}

/* ===========================
   DASHBOARD PRINCIPAL /PORTAL
   =========================== */

export default function StudentPortal() {
  const { getMySolicitud } = useSolicitudes();
  const mySolicitud = getMySolicitud();

  const [activeTab, setActiveTab] = useState("overview");

  const displayName =
    mySolicitud?.formData?.nombre || "Estudiante Universidad Fidélitas";
  const displayCareer =
    mySolicitud?.formData?.carrera || "Ingeniería de Software";

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-[rgba(2,14,159,1)] flex items-center justify-center text-white font-bold mr-3">
            T
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              TCU Estudiantes
            </p>
            <p className="text-sm font-semibold text-slate-800">
              Panel de control
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm">
          <SidebarItem
            icon={LuLayoutDashboard}
            label="Resumen"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <SidebarItem
            icon={LuFilePlus2}
            label="Inscripción de anteproyecto"
            active={activeTab === "inscripcion"}
            onClick={() => setActiveTab("inscripcion")}
          />
          <SidebarItem
            icon={LuFileSearch}
            label="Estado del anteproyecto"
            active={activeTab === "estado"}
            onClick={() => setActiveTab("estado")}
          />
        </nav>

        <div className="p-4 border-t border-slate-200 text-[11px] text-slate-400">
          Proyecto académico – Universidad Fidélitas
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Panel del estudiante
            </p>
            <p className="text-sm md:text-base font-semibold text-slate-800">
              Bienvenido, {displayName}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-xs text-slate-500">
              Período TCU activo
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-700">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-500">{displayCareer}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center">
                <LuUser />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO CENTRAL */}
        <main className="flex-1 p-4 md:p-6 bg-slate-50 overflow-y-auto">
          {activeTab === "overview" && (
            <OverviewSection
              mySolicitud={mySolicitud}
              goToInscripcion={() => setActiveTab("inscripcion")}
              goToEstado={() => setActiveTab("estado")}
            />
          )}

          {activeTab === "inscripcion" && (
            <StudentWizard onCompleted={() => setActiveTab("estado")} />
          )}

          {activeTab === "estado" && (
            <>
              {mySolicitud ? (
                <StudentStatusPage solicitud={mySolicitud} />
              ) : (
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 max-w-xl">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3">
                    Aún no has enviado un anteproyecto
                  </h2>
                  <p className="text-sm text-slate-600 mb-6">
                    Para consultar el estado de tu TCU primero debes completar
                    la inscripción del anteproyecto.
                  </p>
                  <button
                    onClick={() => setActiveTab("inscripcion")}
                    className="px-5 py-2.5 bg-[rgba(2,14,159,1)] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-900"
                  >
                    Ir a inscripción de anteproyecto
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ===========================
   COMPONENTES DE APOYO
   =========================== */

function SidebarItem({ icon: Icon, label, active, onClick }) {
  const base =
    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm";
  const activeClasses = active
    ? " bg-[#ffd600] text-gray-800"
    : " text-slate-700 hover:bg-yellow-100";

  return (
    <button onClick={onClick} className={base + activeClasses}>
      {Icon && <Icon className="text-lg" />}
      <span>{label}</span>
    </button>
  );
}

function OverviewSection({ mySolicitud, goToInscripcion, goToEstado }) {
  const status = mySolicitud?.status || "Sin anteproyecto";

  let statusClasses = "bg-slate-100 text-slate-600";
  if (status === "Aprobado") statusClasses = "bg-emerald-100 text-emerald-700";
  else if (status === "En Revisión")
    statusClasses = "bg-amber-100 text-amber-700";
  else if (status === "Observado") statusClasses = "bg-red-100 text-red-700";

  return (
    <div className="space-y-6">
      {/* Tarjetas superiores */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Estado del anteproyecto</p>
          <p
            className={
              "inline-flex px-3 py-1 rounded-full text-xs font-semibold " +
              statusClasses
            }
          >
            {status}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">Progreso del proceso</p>
            <p className="text-sm font-semibold text-slate-800">
              {mySolicitud ? "En curso" : "Pendiente de iniciar"}
            </p>
          </div>
          <button
            onClick={goToInscripcion}
            className="mt-3 text-[11px] font-semibold text-[rgba(2,14,159,1)] hover:underline"
          >
            Ir a inscripción →
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Acceso rápido</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={goToInscripcion}
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-900 text-white"
            >
              Inscribir anteproyecto
            </button>
            <button
              onClick={goToEstado}
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700"
            >
              Ver estado
            </button>
          </div>
        </div>
      </div>

      {/* Bloques informativos */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">
            ¿Qué puedo hacer desde este panel?
          </h3>
          <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>Registrar tu anteproyecto de TCU en línea.</li>
            <li>Monitorear el estado de la revisión.</li>
            <li>Consultar el historial de observaciones y acciones.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">
            Próximos pasos
          </h3>
          <p className="text-sm text-slate-600 mb-3">
            Inicia la inscripción de tu anteproyecto y asegúrate de tener listos
            tus documentos: constancia de matrícula y copia de cédula.
          </p>
          <button
            onClick={goToInscripcion}
            className="px-4 py-2 bg-[rgba(2,14,159,1)] text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-indigo-900"
          >
            Comenzar inscripción ahora
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   STEPS DEL WIZARD
   =========================== */

function Step1_DatosPersonales({ formData, handleChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Paso 1: Datos Personales y Académicos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          type="text"
          placeholder="Nombre Completo"
          className="p-2 border rounded-md bg-slate-100"
          readOnly
        />
        <input
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          type="text"
          placeholder="Cédula"
          className="p-2 border rounded-md"
        />
        <select
          name="carrera"
          value={formData.carrera}
          onChange={handleChange}
          className="p-2 border rounded-md md:col-span-2"
        >
          <option value="">Selecciona tu carrera</option>
          <option value="Ingeniería de Software">Ingeniería de Software</option>
          <option value="Administración">Administración</option>
        </select>
      </div>
    </div>
  );
}

function Step2_Institucion({ formData, handleChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Paso 2: Selección de Institución
      </h3>
      <select
        name="institucion"
        value={formData.institucion}
        onChange={handleChange}
        className="p-2 border rounded-md w-full mb-4"
      >
        <option value="">Instituciones Habilitadas (Cargadas de la BD)</option>
        <option value="Hogar de Ancianos Luz y Vida">
          Hogar de Ancianos Luz y Vida
        </option>
        <option value="Escuela El Porvenir">Escuela El Porvenir</option>
        <option value="[NUEVA] Otra institución">
          [NUEVA] Otra institución (registrar)
        </option>
      </select>
    </div>
  );
}

function Step3_Objetivos({ formData, handleChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Paso 3: Objetivos y Justificación
      </h3>
      <div className="space-y-4">
        <textarea
          name="justificacion"
          value={formData.justificacion}
          onChange={handleChange}
          placeholder="Justificación del proyecto"
          className="w-full p-2 border rounded-md h-24"
        />
        <textarea
          name="objetivoGeneral"
          value={formData.objetivoGeneral}
          onChange={handleChange}
          placeholder="Objetivo General"
          className="w-full p-2 border rounded-md h-20"
        />
        <textarea
          name="objetivosEspecificos"
          value={formData.objetivosEspecificos}
          onChange={handleChange}
          placeholder="Objetivos Específicos (uno por línea)"
          className="w-full p-2 border rounded-md h-24"
        />
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="font-bold text-yellow-800">Asistente IA (mockup)</p>
          <p className="text-sm text-yellow-700">
            “Tu objetivo general no especifica la comunidad beneficiada. ¿Deseas
            mejorar esta redacción?”
          </p>
        </div>
      </div>
    </div>
  );
}

function Step4_Documentos() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Paso 4: Adjuntar Documentos Requeridos
      </h3>
      <div className="space-y-4">
        <div className="p-4 border-2 border-dashed rounded-md text-center">
          <label className="cursor-pointer">
            <span className="text-[rgba(2,14,159,1)] font-medium">
              Adjuntar Constancia de Matrícula (PDF)
            </span>
            <input type="file" className="hidden" />
          </label>
        </div>
        <div className="p-4 border-2 border-dashed rounded-md text-center">
          <label className="cursor-pointer">
            <span className="text-[rgba(2,14,159,1)] font-medium">
              Adjuntar Copia de Cédula (PDF o JPG)
            </span>
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
