// src/pages/StudentPortal.jsx
import { useEffect, useState } from "react";
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
import api from "../api/apiClient";

/* ============================================================
   FORM DATA INICIAL
   ============================================================ */
const initialFormData = {
  nombre: "",
  cedula: "",
  carrera: "",

  sede: "",
  estudiante_email: "",
  estudiante_phone: "",
  oficio: "",
  estado_civil: "",
  domicilio: "",

  institucion_id: "",
  institucion: "",

  tituloProyecto: "",
  justificacion: "",
  objetivoGeneral: "",

  objetivosEspecificosItems: [""],
  beneficiarios: "",
  estrategiaSolucion: "",

  cronogramaItems: [{ actividad: "", tarea: "", horas: "" }],
};

/* ============================================================
   WIZARD DE INSCRIPCIÓN
   ============================================================ */
function StudentWizard({ onCompleted }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  const { addSolicitud } = useSolicitudes();

  // Instituciones desde la BD
  const [instituciones, setInstituciones] = useState([]);
  const [loadingInstituciones, setLoadingInstituciones] = useState(false);

  // Mensaje tipo “toast” dentro del wizard
  const [flash, setFlash] = useState(null); // { text, type: 'success' | 'error' }

  const showMessage = (text, type = "success") => {
    setFlash({ text, type });
    // opcional: auto-ocultar en unos segundos
    setTimeout(() => {
      setFlash((prev) => (prev && prev.text === text ? null : prev));
    }, 4000);
  };

  /* === CARGAR DATOS DEL USUARIO DESDE BACKEND === */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/user", {
          params: { email: "esoto@ufidelitas.ac.cr" }, // DEMO
        });

        if (res.data) {
          const user = res.data;
          setFormData((prev) => ({
            ...prev,
            nombre: user.nombre || "",
            cedula: user.cedula || "",
            carrera: user.carrera || "",
          }));
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
        showMessage(
          "No se pudo cargar la información del estudiante.",
          "error",
        );
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* === CARGAR INSTITUCIONES APROBADAS === */
  useEffect(() => {
    const loadInstituciones = async () => {
      setLoadingInstituciones(true);
      try {
        const res = await api.get("/instituciones", {
          params: { estado: "Aprobada" },
        });
        const list = Array.isArray(res.data) ? res.data : [];
        setInstituciones(list);
      } catch (err) {
        console.error("Error cargando instituciones:", err);
        showMessage("No se pudieron cargar las instituciones.", "error");
      } finally {
        setLoadingInstituciones(false);
      }
    };

    loadInstituciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* === HANDLERS === */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ===============================
  // Objetivos específicos (dinámico)
  // ===============================
  const addObjetivo = () => {
    setFormData((prev) => ({
      ...prev,
      objetivosEspecificosItems: [...prev.objetivosEspecificosItems, ""],
    }));
  };

  const removeObjetivo = (index) => {
    setFormData((prev) => {
      const arr = [...prev.objetivosEspecificosItems];
      arr.splice(index, 1);
      return {
        ...prev,
        objetivosEspecificosItems: arr.length ? arr : [""],
      };
    });
  };

  const updateObjetivo = (index, value) => {
    setFormData((prev) => {
      const arr = [...prev.objetivosEspecificosItems];
      arr[index] = value;
      return { ...prev, objetivosEspecificosItems: arr };
    });
  };

  // ===============================
  // Cronograma (dinámico)
  // ===============================
  const addCronoRow = () => {
    setFormData((prev) => ({
      ...prev,
      cronogramaItems: [
        ...(prev.cronogramaItems || []),
        { actividad: "", tarea: "", horas: "" },
      ],
    }));
  };

  const removeCronoRow = (index) => {
    setFormData((prev) => {
      const arr = [...(prev.cronogramaItems || [])];
      arr.splice(index, 1);
      return {
        ...prev,
        cronogramaItems: arr.length
          ? arr
          : [{ actividad: "", tarea: "", horas: "" }],
      };
    });
  };

  const updateCronoRow = (index, field, value) => {
    setFormData((prev) => {
      const arr = [...(prev.cronogramaItems || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, cronogramaItems: arr };
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setFlash(null);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    // Ahora hay 6 steps
    if (currentStep < 6) {
      setFlash(null);
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Validación mínima antes de enviar (podés endurecerla)
    if (!formData.institucion_id || !formData.objetivoGeneral) {
      showMessage(
        "Por favor, selecciona una institución y escribe al menos el objetivo general.",
        "error",
      );
      return;
    }

    // ✅ Normalizar cronograma para BD
    const cronograma_items = (formData.cronogramaItems || [])
      .map((r) => ({
        actividad: String(r.actividad || "").trim(),
        tarea: String(r.tarea || "").trim(),
        horas: String(r.horas || "").trim(),
      }))
      .filter((r) => r.actividad && r.tarea && r.horas !== "");

    // ✅ objetivos específicos como lista (si tu BD los guarda en tabla)
    // si vos todavía lo manejás como texto, igual lo convertimos a array por líneas
    const objetivos_especificos_items = String(
      formData.objetivosEspecificos || "",
    )
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const payload = {
      // 👇 esto es lo que espera tu tabla solicitudes (snapshot del estudiante)
      estudiante_nombre: formData.nombre,
      estudiante_cedula: formData.cedula,
      carrera: formData.carrera,

      // si luego metés sede/email/teléfono/oficio/etc, los agregamos
      sede: formData.sede || null,
      estudiante_email: formData.estudiante_email || null,
      estudiante_phone: formData.estudiante_phone || null,
      oficio: formData.oficio || null,
      estado_civil: formData.estado_civil || null,
      domicilio: formData.domicilio || null,
      lugar_trabajo: formData.lugar_trabajo || null,

      // 👇 institución
      institucion_id: formData.institucion_id || null,
      institucion_nombre: formData.institucion || "",

      // 👇 anteproyecto
      titulo_proyecto: formData.tituloProyecto,
      descripcion_problema: formData.justificacion, // ✅ tu BD usa descripcion_problema
      objetivo_general: formData.objetivoGeneral,

      // legacy (si querés seguirlo guardando en solicitudes, opcional)
      objetivos_especificos: formData.objetivosEspecificos,

      beneficiario: formData.beneficiarios,
      estrategia_solucion: formData.estrategiaSolucion,

      // ✅ NUEVO: para tablas hijas (si ya metiste los steps nuevos)
      objetivos_especificos_items: String(formData.objetivosEspecificos || "")
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),

      cronograma_items: (formData.cronogramaItems || [])
        .map((r) => ({
          actividad: String(r.actividad || "").trim(),
          tarea: String(r.tarea || "").trim(),
          horas: String(r.horas || "").trim(),
        }))
        .filter((r) => r.actividad && r.tarea && r.horas !== ""),

      // 👇 owner_email (si no lo sacás del token en backend, mandalo aquí por ahora)
      owner_email: "esoto@ufidelitas.ac.cr", // DEMO (ideal: backend lo toma del token)
    };

    try {
      await addSolicitud(payload);
      showMessage("¡Solicitud de TCU enviada con éxito!", "success");

      if (onCompleted) onCompleted();
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      showMessage(
        "Ocurrió un error al enviar tu solicitud. Inténtalo de nuevo en unos minutos.",
        "error",
      );
    }
  };

  const steps = [
    { id: 1, name: "Datos Personales", icon: LuUser },
    { id: 2, name: "Institución", icon: LuBuilding },
    { id: 3, name: "Proyecto", icon: LuTarget },
    { id: 4, name: "Objetivos específicos", icon: LuFileText },
    { id: 5, name: "Cronograma", icon: LuFileText },
    { id: 6, name: "Confirmación", icon: LuFileText },
  ];

  const flashClasses =
    flash?.type === "error"
      ? "bg-red-50 text-red-700 border border-red-200"
      : "bg-emerald-50 text-emerald-700 border border-emerald-200";

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

        {/* Banner de mensajes */}
        {flash && (
          <div className={`mt-4 px-4 py-2 rounded-xl text-sm ${flashClasses}`}>
            {flash.text}
          </div>
        )}
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
          <Step2_Institucion
            formData={formData}
            handleChange={handleChange}
            instituciones={instituciones}
            loading={loadingInstituciones}
            onNewInstitution={(inst) =>
              setInstituciones((prev) => [...prev, inst])
            }
            onNotify={showMessage}
          />
        )}
        {currentStep === 3 && (
          <Step3_ProyectoU formData={formData} handleChange={handleChange} />
        )}
        {currentStep === 4 && (
          <Step4_ObjetivosEspecificos
            formData={formData}
            addObjetivo={addObjetivo}
            removeObjetivo={removeObjetivo}
            updateObjetivo={updateObjetivo}
          />
        )}
        {currentStep === 5 && (
          <Step5_Cronograma formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 6 && <Step6_Resumen formData={formData} />}
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

/* ============================================================
   DASHBOARD PRINCIPAL /PORTAL
   ============================================================ */

export default function StudentPortal() {
  const { mySolicitud, fetchMySolicitud } = useSolicitudes();
  const [activeTab, setActiveTab] = useState("overview");

  const [globalFlash, setGlobalFlash] = useState(null);

  // Cargar solicitud propia al entrar al portal
  useEffect(() => {
    fetchMySolicitud().catch((err) =>
      console.error("Error cargando mi solicitud:", err),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName =
    mySolicitud?.estudiante_nombre || "Estudiante Universidad Fidélitas";
  const displayCareer = mySolicitud?.carrera || "Ingeniería de Software";

  const handleCompletedWizard = async () => {
    await fetchMySolicitud().catch((err) =>
      console.error("Error recargando mi solicitud:", err),
    );
    setActiveTab("estado");

    setGlobalFlash({
      text: "¡Tu anteproyecto fue enviado exitosamente!",
      type: "success",
    });
  };

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
            <StudentWizard onCompleted={handleCompletedWizard} />
          )}

          {activeTab === "estado" && (
            <>
              {/* Banner global arriba del estado */}
              {globalFlash && (
                <div
                  className={
                    "mb-4 px-4 py-2 rounded-xl text-sm border " +
                    (globalFlash.type === "error"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200")
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{globalFlash.text}</span>
                    <button
                      type="button"
                      onClick={() => setGlobalFlash(null)}
                      className="text-[11px] px-2 py-1 rounded hover:bg-white/40"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

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

/* ============================================================
   COMPONENTES DE APOYO
   ============================================================ */

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
  const status = mySolicitud?.estado || "Sin anteproyecto";

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

/* ============================================================
   STEPS DEL WIZARD
   ============================================================ */

function Step1_DatosPersonales({ formData, handleChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">
        Paso 1: Datos Personales y Académicos
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-slate-700">
            Nombre Completo del estudiante
          </label>
          <input
            name="nombre"
            value={formData.nombre}
            type="text"
            className="p-2 border rounded-md bg-slate-100 text-slate-700"
            readOnly
          />
        </div>

        {/* Cédula */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-slate-700">
            Número de Identificación
          </label>
          <input
            name="cedula"
            value={formData.cedula}
            type="text"
            className="p-2 border rounded-md bg-slate-100 text-slate-700"
            readOnly
          />
        </div>

        {/* Carrera */}
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 font-medium text-slate-700">Carrera</label>
          <input
            name="carrera"
            value={formData.carrera}
            type="text"
            className="p-2 border rounded-md bg-slate-100 text-slate-700"
            readOnly
          />
        </div>

        {/* Sede */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-slate-700">Sede</label>
          <input
            name="sede"
            value={formData.sede}
            onChange={handleChange}
            type="text"
            placeholder="Ej: San Pedro"
            className="p-2 border rounded-md"
          />
        </div>

        {/* Correo */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-slate-700">
            Correo electrónico
          </label>
          <input
            name="estudiante_email"
            value={formData.estudiante_email}
            onChange={handleChange}
            type="email"
            placeholder="correo@ufidelitas.ac.cr"
            className="p-2 border rounded-md"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-slate-700">
            Número telefónico
          </label>
          <input
            name="estudiante_phone"
            value={formData.estudiante_phone}
            onChange={handleChange}
            type="tel"
            placeholder="8888-8888"
            className="p-2 border rounded-md"
          />
        </div>

        {/* Oficio */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-slate-700">Oficio</label>
          <input
            name="oficio"
            value={formData.oficio}
            onChange={handleChange}
            type="text"
            placeholder="Ej: Estudiante"
            className="p-2 border rounded-md"
          />
        </div>

        {/* Estado civil */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-slate-700">
            Estado Civil
          </label>
          <select
            name="estado_civil"
            value={formData.estado_civil}
            onChange={handleChange}
            className="p-2 border rounded-md"
          >
            <option value="">Seleccione</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viudo">Viudo</option>
          </select>
        </div>

        {/* Domicilio */}
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 font-medium text-slate-700">Domicilio</label>
          <input
            name="domicilio"
            value={formData.domicilio}
            onChange={handleChange}
            type="text"
            placeholder="Dirección completa"
            className="p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

function Step2_Institucion({
  formData,
  handleChange,
  instituciones,
  loading,
  onNewInstitution,
  onNotify,
}) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos");

  // Nuevo registro
  const [newName, setNewName] = useState("");
  const [newCedulaJuridica, setNewCedulaJuridica] = useState("");
  const [newSupervisor, setNewSupervisor] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newType, setNewType] = useState("");
  const [saving, setSaving] = useState(false);

  // 🔹 Opciones únicas del filtro tipo
  const tipos = [
    "Todos",
    ...Array.from(
      new Set(
        (instituciones || []).map((i) => i.tipo_servicio).filter(Boolean),
      ),
    ),
  ];

  // 🔹 Filtrado estilo tabla (nombre/cedula/supervisor/correo/tipo)
  const filtered = (instituciones || []).filter((inst) => {
    const q = search.trim().toLowerCase();

    const bySearch =
      !q ||
      String(inst.nombre || "")
        .toLowerCase()
        .includes(q) ||
      String(inst.cedula_juridica || "")
        .toLowerCase()
        .includes(q) ||
      String(inst.supervisor_nombre || "")
        .toLowerCase()
        .includes(q) ||
      String(inst.contacto_email || "")
        .toLowerCase()
        .includes(q) ||
      String(inst.tipo_servicio || "")
        .toLowerCase()
        .includes(q);

    const byTipo =
      tipoFilter === "Todos" || String(inst.tipo_servicio || "") === tipoFilter;

    return bySearch && byTipo;
  });

  const selectInstitution = (inst) => {
    setShowNewForm(false);

    handleChange({ target: { name: "institucion_id", value: inst.id } });
    handleChange({ target: { name: "institucion", value: inst.nombre } });

    // (Opcional) si querés guardarlo en formData para mostrarlo después:
    handleChange({
      target: { name: "institucion_cedula", value: inst.cedula_juridica || "" },
    });
    handleChange({
      target: {
        name: "institucion_supervisor",
        value: inst.supervisor_nombre || "",
      },
    });
    handleChange({
      target: { name: "institucion_correo", value: inst.contacto_email || "" },
    });
  };

  const handleSubmitNew = async () => {
    if (
      !newName ||
      !newCedulaJuridica ||
      !newSupervisor ||
      !newEmail ||
      !newType
    ) {
      onNotify &&
        onNotify(
          "Por favor, completá nombre, cédula jurídica, supervisor, correo y tipo de servicio para la institución.",
          "error",
        );
      return;
    }

    try {
      setSaving(true);
      const res = await api.post("/instituciones/solicitar", {
        nombre: newName,
        cedula_juridica: newCedulaJuridica,
        supervisor_nombre: newSupervisor,
        contacto_email: newEmail,
        tipo_servicio: newType,
      });

      const nueva = res.data;

      onNotify &&
        onNotify(
          "Institución enviada para aprobación. Quedará en estado Pendiente para la coordinación.",
          "success",
        );

      if (onNewInstitution) onNewInstitution(nueva);

      // seleccionarla automáticamente
      handleChange({ target: { name: "institucion_id", value: nueva.id } });
      handleChange({ target: { name: "institucion", value: nueva.nombre } });

      setShowNewForm(false);
      setNewName("");
      setNewCedulaJuridica("");
      setNewSupervisor("");
      setNewEmail("");
      setNewType("");
    } catch (err) {
      console.error("Error registrando nueva institución:", err);
      onNotify &&
        onNotify(
          "No se pudo registrar la institución. Intenta de nuevo o contacta a coordinación.",
          "error",
        );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Paso 2: Selección de Institución
      </h3>

      {/* Barra superior */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, cédula jurídica, supervisor o correo..."
            className="p-2 border rounded-md w-full md:max-w-lg"
          />

          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="p-2 border rounded-md w-full md:w-64"
          >
            {tipos.map((x) => (
              <option key={x} value={x}>
                {x === "Todos" ? "Todos los tipos" : x}
              </option>
            ))}
          </select>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2 text-xs bg-[rgba(2,14,159,1)] text-white rounded-md hover:bg-indigo-900"
          >
            No la encontré → Registrar
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3 border-b">Nombre institución</th>
                <th className="text-left p-3 border-b">Cédula jurídica</th>
                <th className="text-left p-3 border-b">Supervisor</th>
                <th className="text-left p-3 border-b">Correo</th>
                <th className="text-left p-3 border-b">Tipo de servicio</th>
                <th className="text-left p-3 border-b">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4 text-slate-500" colSpan={6}>
                    Cargando instituciones...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-4 text-slate-500" colSpan={6}>
                    No se encontraron instituciones con esos filtros. Podés
                    registrar una nueva.
                  </td>
                </tr>
              ) : (
                filtered.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-50">
                    <td className="p-3 border-b font-semibold text-slate-800">
                      {inst.nombre}
                    </td>
                    <td className="p-3 border-b text-slate-600">
                      {inst.cedula_juridica || "-"}
                    </td>
                    <td className="p-3 border-b text-slate-600">
                      {inst.supervisor_nombre || "-"}
                    </td>
                    <td className="p-3 border-b text-slate-600">
                      {inst.contacto_email || "-"}
                    </td>
                    <td className="p-3 border-b text-slate-600">
                      {inst.tipo_servicio || "-"}
                    </td>
                    <td className="p-3 border-b">
                      <button
                        type="button"
                        onClick={() => selectInstitution(inst)}
                        className="text-[rgba(2,14,159,1)] font-semibold hover:underline"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Selección actual */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-sm">
          <span className="font-semibold text-slate-800">Seleccionada: </span>
          <span className="text-slate-600">
            {formData.institucion || "Ninguna"}
          </span>
        </div>
      </div>

      {/* Formulario para registrar nueva */}
      {showNewForm && (
        <div className="mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3 text-sm">
          <p className="font-semibold text-slate-800">
            Registrar nueva institución para aprobación
          </p>

          <input
            type="text"
            placeholder="Nombre de la institución"
            className="w-full p-2 border rounded-md"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Cédula jurídica"
            className="w-full p-2 border rounded-md"
            value={newCedulaJuridica}
            onChange={(e) => setNewCedulaJuridica(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nombre del supervisor"
            className="w-full p-2 border rounded-md"
            value={newSupervisor}
            onChange={(e) => setNewSupervisor(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo de contacto"
            className="w-full p-2 border rounded-md"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tipo de servicio (Ej: Adulto mayor, Educación)"
            className="w-full p-2 border rounded-md"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          />

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="px-3 py-1.5 text-xs bg-slate-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmitNew}
              disabled={saving}
              className="px-4 py-1.5 text-xs bg-[rgba(2,14,159,1)] text-white rounded-md disabled:opacity-60"
            >
              {saving ? "Enviando..." : "Enviar para aprobación"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Step3_ProyectoU({ formData, handleChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Paso 3: Datos del proyecto</h3>
      <div className="space-y-4 text-sm">
        <textarea
          name="tituloProyecto"
          value={formData.tituloProyecto}
          onChange={handleChange}
          placeholder="Título del proyecto"
          className="w-full p-2 border rounded-md h-16"
        />
        <textarea
          name="justificacion"
          value={formData.justificacion}
          onChange={handleChange}
          placeholder="Descripción del problema"
          className="w-full p-2 border rounded-md h-20"
        />
        <textarea
          name="objetivoGeneral"
          value={formData.objetivoGeneral}
          onChange={handleChange}
          placeholder="Objetivo general"
          className="w-full p-2 border rounded-md h-16"
        />
        <textarea
          name="beneficiarios"
          value={formData.beneficiarios}
          onChange={handleChange}
          placeholder="¿A quién se beneficiará el proyecto?"
          className="w-full p-2 border rounded-md h-16"
        />
        <textarea
          name="estrategiaSolucion"
          value={formData.estrategiaSolucion}
          onChange={handleChange}
          placeholder="Estrategia y pertinencia de solución (actividades principales)"
          className="w-full p-2 border rounded-md h-20"
        />
      </div>
    </div>
  );
}

function Step4_ObjetivosEspecificos({
  formData,
  addObjetivo,
  removeObjetivo,
  updateObjetivo,
}) {
  const items = formData.objetivosEspecificosItems || [""];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Paso 4: Objetivos específicos
      </h3>

      <p className="text-sm text-slate-600 mb-3">
        Agregá tus objetivos específicos uno por uno. Podés agregar los que
        necesités.
      </p>

      <div className="space-y-3">
        {items.map((obj, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                value={obj}
                onChange={(e) => updateObjetivo(idx, e.target.value)}
                placeholder={`Objetivo específico #${idx + 1}`}
                className="w-full p-2 border rounded-md text-sm"
              />
              {!obj.trim() && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Escribí un objetivo para poder guardarlo.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeObjetivo(idx)}
              disabled={items.length === 1}
              className="px-3 py-2 text-xs bg-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-300"
              title="Quitar"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={addObjetivo}
          className="px-4 py-2 text-xs bg-[rgba(2,14,159,1)] text-white rounded-md hover:bg-indigo-900"
        >
          + Agregar objetivo
        </button>
      </div>
    </div>
  );
}

function Step5_Cronograma({ formData, setFormData }) {
  const items = formData.cronogramaItems || [
    { actividad: "", tarea: "", horas: "" },
  ];

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      cronogramaItems: [...items, { actividad: "", tarea: "", horas: "" }],
    }));
  };

  const removeRow = (idx) => {
    setFormData((prev) => {
      const next = [...items];
      next.splice(idx, 1);
      return {
        ...prev,
        cronogramaItems: next.length
          ? next
          : [{ actividad: "", tarea: "", horas: "" }],
      };
    });
  };

  const updateRow = (idx, field, value) => {
    setFormData((prev) => {
      const next = [...items];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, cronogramaItems: next };
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Paso 5: Cronograma</h3>

      <p className="text-sm text-slate-600 mb-3">
        Agregá actividades, tareas y horas estimadas.
      </p>

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="p-3 border-b">Actividad</th>
              <th className="p-3 border-b">Tarea</th>
              <th className="p-3 border-b w-28">Horas</th>
              <th className="p-3 border-b w-24"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx} className="bg-white">
                <td className="p-2 border-b">
                  <input
                    className="w-full p-2 border rounded-md"
                    value={row.actividad}
                    onChange={(e) =>
                      updateRow(idx, "actividad", e.target.value)
                    }
                    placeholder="Ej: Diagnóstico"
                  />
                </td>
                <td className="p-2 border-b">
                  <input
                    className="w-full p-2 border rounded-md"
                    value={row.tarea}
                    onChange={(e) => updateRow(idx, "tarea", e.target.value)}
                    placeholder="Ej: Recolección de información"
                  />
                </td>
                <td className="p-2 border-b">
                  <input
                    className="w-full p-2 border rounded-md"
                    value={row.horas}
                    onChange={(e) => updateRow(idx, "horas", e.target.value)}
                    placeholder="10"
                    inputMode="numeric"
                  />
                </td>
                <td className="p-2 border-b text-right">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    disabled={items.length === 1}
                    className="px-3 py-2 text-xs bg-slate-200 rounded-md disabled:opacity-50 hover:bg-slate-300"
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-3">
        <button
          type="button"
          onClick={addRow}
          className="px-4 py-2 text-xs bg-[rgba(2,14,159,1)] text-white rounded-md hover:bg-indigo-900"
        >
          + Agregar fila
        </button>
      </div>
    </div>
  );
}

function Step6_Resumen({ formData }) {
  // ✅ lee del array dinámico
  const objetivosItems = (formData.objetivosEspecificosItems || [])
    .map((x) => String(x || "").trim())
    .filter(Boolean);

  const cronogramaItems = (formData.cronogramaItems || []).filter(
    (r) => r.actividad || r.tarea || r.horas,
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Paso 6: Confirmación</h3>

      <p className="text-sm text-slate-600 mb-3">
        Al finalizar se enviará tu anteproyecto para revisión. Podrás seguir su
        estado desde el panel “Estado del anteproyecto”.
      </p>

      <div className="space-y-4 text-sm text-slate-700">
        <div className="bg-white border rounded-xl p-4">
          <p className="font-semibold mb-2">Datos principales</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Institución: {formData.institucion || "No seleccionada"}</li>
            <li>Título: {formData.tituloProyecto || "Sin título"}</li>
            <li>
              Descripción del problema:{" "}
              {formData.justificacion || "Sin descripción"}
            </li>
            <li>
              Objetivo general: {formData.objetivoGeneral || "Sin objetivo"}
            </li>
            <li>Beneficiarios: {formData.beneficiarios || "Sin dato"}</li>
            <li>
              Estrategia de solución:{" "}
              {formData.estrategiaSolucion || "Sin dato"}
            </li>
          </ul>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="font-semibold mb-2">Objetivos específicos</p>
          {objetivosItems.length ? (
            <ul className="space-y-1 list-disc list-inside">
              {objetivosItems.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">
              No agregaste objetivos específicos.
            </p>
          )}
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="font-semibold mb-2">Cronograma</p>
          {cronogramaItems.length ? (
            <ul className="space-y-1 list-disc list-inside">
              {cronogramaItems.map((r, i) => (
                <li key={i}>
                  <span className="font-semibold">
                    {r.actividad || "Actividad"}
                  </span>
                  {" — "}
                  {r.tarea || "Tarea"}
                  {" — "}
                  {r.horas || "0"} horas
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">No agregaste filas de cronograma.</p>
          )}
        </div>
      </div>
    </div>
  );
}
