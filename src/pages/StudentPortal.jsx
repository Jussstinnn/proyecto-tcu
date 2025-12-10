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

  // Institución
  institucion_id: "",
  institucion: "",

  // Campos del anteproyecto (formato U)
  tituloProyecto: "",
  justificacion: "",
  objetivoGeneral: "",
  objetivosEspecificos: "",
  beneficiarios: "",
  estrategiaSolucion: "",
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
          "error"
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

  const handleBack = () => {
    if (currentStep > 1) {
      setFlash(null);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setFlash(null);
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (!formData.institucion_id || !formData.objetivoGeneral) {
      showMessage(
        "Por favor, selecciona una institución y escribe al menos el objetivo general.",
        "error"
      );
      return;
    }

    const payload = {
      ...formData,
      titulo_proyecto: formData.tituloProyecto,
      descripcion_problema: formData.justificacion,
      objetivo_general: formData.objetivoGeneral,
      objetivos_especificos: formData.objetivosEspecificos,
      beneficiario: formData.beneficiarios,
      estrategia_solucion: formData.estrategiaSolucion,
    };

    try {
      await addSolicitud(payload);
      showMessage("¡Solicitud de TCU enviada con éxito!", "success");

      if (onCompleted) {
        onCompleted();
      }
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      showMessage(
        "Ocurrió un error al enviar tu solicitud. Inténtalo de nuevo en unos minutos.",
        "error"
      );
    }
  };

  const steps = [
    { id: 1, name: "Datos Personales", icon: LuUser },
    { id: 2, name: "Institución", icon: LuBuilding },
    { id: 3, name: "Proyecto y objetivos", icon: LuTarget },
    { id: 4, name: "Confirmación", icon: LuFileText },
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
        {currentStep === 4 && <Step4_Resumen formData={formData} />}
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
      console.error("Error cargando mi solicitud:", err)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName =
    mySolicitud?.estudiante_nombre || "Estudiante Universidad Fidélitas";
  const displayCareer = mySolicitud?.carrera || "Ingeniería de Software";

  const handleCompletedWizard = async () => {
    await fetchMySolicitud().catch((err) =>
      console.error("Error recargando mi solicitud:", err)
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

function Step1_DatosPersonales({ formData }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Paso 1: Datos Personales y Académicos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="nombre"
          value={formData.nombre}
          type="text"
          placeholder="Nombre Completo"
          className="p-2 border rounded-md bg-slate-100 text-slate-700"
          readOnly
        />
        <input
          name="cedula"
          value={formData.cedula}
          type="text"
          placeholder="Cédula"
          className="p-2 border rounded-md bg-slate-100 text-slate-700"
          readOnly
        />
        <input
          name="carrera"
          value={formData.carrera}
          type="text"
          placeholder="Carrera"
          className="p-2 border rounded-md bg-slate-100 text-slate-700 md:col-span-2"
          readOnly
        />
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
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newType, setNewType] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSelect = (e) => {
    const id = e.target.value;

    if (id === "__new__") {
      setShowNewForm(true);
      // limpiamos selección anterior
      handleChange({ target: { name: "institucion_id", value: "" } });
      handleChange({ target: { name: "institucion", value: "" } });
      return;
    }

    setShowNewForm(false);
    const inst = instituciones.find((i) => String(i.id) === String(id));

    handleChange({ target: { name: "institucion_id", value: id } });
    handleChange({
      target: { name: "institucion", value: inst ? inst.nombre : "" },
    });
  };

  const handleSubmitNew = async () => {
    if (!newName || !newEmail || !newType) {
      onNotify &&
        onNotify(
          "Por favor, completá nombre, correo y tipo de servicio para la institución.",
          "error"
        );
      return;
    }

    try {
      setSaving(true);
      const res = await api.post("/instituciones/solicitar", {
        nombre: newName,
        contacto_email: newEmail,
        tipo_servicio: newType,
      });

      const nueva = res.data;

      onNotify &&
        onNotify(
          "Institución enviada para aprobación. Quedará en estado Pendiente para la coordinación.",
          "success"
        );

      if (onNewInstitution) {
        onNewInstitution(nueva);
      }

      // Dejamos seleccionada la institución recién creada en el formulario
      handleChange({
        target: { name: "institucion_id", value: nueva.id },
      });
      handleChange({
        target: { name: "institucion", value: nueva.nombre },
      });

      setShowNewForm(false);
      setNewName("");
      setNewEmail("");
      setNewType("");
    } catch (err) {
      console.error("Error registrando nueva institución:", err);
      onNotify &&
        onNotify(
          "No se pudo registrar la institución. Intenta de nuevo o contacta a coordinación.",
          "error"
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

      {loading && (
        <p className="text-sm text-slate-500 mb-3">
          Cargando instituciones disponibles...
        </p>
      )}

      <select
        name="institucion_select"
        value={formData.institucion_id || ""}
        onChange={handleSelect}
        className="p-2 border rounded-md w-full mb-4"
      >
        <option value="">
          {loading
            ? "Cargando..."
            : "Selecciona una institución habilitada desde la BD"}
        </option>
        {instituciones.map((inst) => (
          <option key={inst.id} value={inst.id}>
            {inst.nombre}
          </option>
        ))}
        <option value="__new__">[NUEVA] Registrar otra institución</option>
      </select>

      {!loading && instituciones.length === 0 && !showNewForm && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
          Aún no hay instituciones aprobadas en el sistema. Podés registrar una
          nueva institución para que sea revisada.
        </p>
      )}

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
      <h3 className="text-lg font-semibold mb-4">
        Paso 3: Datos del proyecto y objetivos
      </h3>
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
          name="objetivosEspecificos"
          value={formData.objetivosEspecificos}
          onChange={handleChange}
          placeholder="Objetivos específicos (puedes separarlos por líneas)"
          className="w-full p-2 border rounded-md h-20"
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

function Step4_Resumen({ formData }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Paso 4: Confirmación rápida
      </h3>
      <p className="text-sm text-slate-600 mb-3">
        Al finalizar se enviará tu anteproyecto para revisión. Podrás seguir su
        estado desde el panel “Estado del anteproyecto”.
      </p>
      <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
        <li>Institución: {formData.institucion || "No seleccionada"}</li>
        <li>Título: {formData.tituloProyecto || "Sin título"}</li>
        <li>Justificación: {formData.justificacion || "Sin objetivo"}</li>
        <li>Objetivo general: {formData.objetivoGeneral || "Sin objetivo"}</li>
        <li>
          Objetivos específicos:{" "}
          {formData.objetivosEspecificos || "Sin objetivo"}
        </li>
        <li>Beneficiario: {formData.beneficiarios || "Sin objetivo"}</li>
        <li>
          Estrategia de solución:{" "}
          {formData.estrategiaSolucion || "Sin objetivo"}
        </li>
      </ul>
    </div>
  );
}
