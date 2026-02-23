import { createContext, useContext, useState } from "react";
import api from "../api/apiClient";

const SolicitudContext = createContext(null);

/* ============================================================
   MAPPERS
   ============================================================ */

function mapSolicitudFromApi(apiS) {
  if (!apiS) return null;

  const historyArray = Array.isArray(apiS.history) ? apiS.history : [];

  const history = historyArray.map((h) => ({
    date: h.created_at || h.fecha || h.date || new Date().toISOString(),
    action: h.accion || h.action || "",
    user: h.usuario || h.user || "",
    message: h.mensaje || h.message || "",
  }));

  const objetivoGeneral = apiS.objetivo_general || "";
  const tituloProyecto = apiS.titulo_proyecto || "";
  const beneficiario = apiS.beneficiario || "";
  const estrategiaSolucion = apiS.estrategia_solucion || "";

  // ✅ BD nueva
  const justificacion = apiS.descripcion_problema || apiS.justificacion || "";

  const subjectBase =
    (tituloProyecto && tituloProyecto.trim()) ||
    (objetivoGeneral && objetivoGeneral.trim()) ||
    "Anteproyecto TCU";

  return {
    id: apiS.id,
    codigo_publico: apiS.codigo_publico,
    status: apiS.estado || "Enviado",
    estado: apiS.estado || "Enviado",

    prio:
      apiS.prioridad === "High" ||
      apiS.prioridad === "Medium" ||
      apiS.prioridad === "Low"
        ? apiS.prioridad
        : "Medium",

    prioridad: apiS.prioridad || "Medium",
    due: apiS.vencimiento || null,
    vencimiento: apiS.vencimiento || null,
    owner: apiS.owner_email || "",
    owner_email: apiS.owner_email || "",
    assigned_to: apiS.assigned_to || null,
    assign_date: apiS.assign_date || null,

    // Datos del estudiante
    estudiante_nombre: apiS.estudiante_nombre || "",
    estudiante_cedula: apiS.estudiante_cedula || "",
    carrera: apiS.carrera || "",
    sede: apiS.sede || "",
    estudiante_email: apiS.estudiante_email || "",
    estudiante_phone: apiS.estudiante_phone || "",
    oficio: apiS.oficio || "",
    estado_civil: apiS.estado_civil || "",
    domicilio: apiS.domicilio || "",
    lugar_trabajo: apiS.lugar_trabajo || "",

    institucion_id: apiS.institucion_id || null,
    institucion_nombre: apiS.institucion_nombre || "",

    tituloProyecto,
    beneficiario,
    estrategiaSolucion,
    objetivoGeneral,

    // legacy
    objetivosEspecificos: apiS.objetivos_especificos || "",

    // ✅ BD real
    justificacion,

    // ✅ arrays (por defecto vacíos, se llenan con detalle)
    objetivosEspecificosItems: Array.isArray(apiS.objetivosEspecificosItems)
      ? apiS.objetivosEspecificosItems
      : [],
    cronogramaItems: Array.isArray(apiS.cronogramaItems)
      ? apiS.cronogramaItems
      : [],

    req: apiS.estudiante_nombre || "",
    subj: `${subjectBase.slice(0, 30)}...`,

    formData: {
      nombre: apiS.estudiante_nombre || "",
      cedula: apiS.estudiante_cedula || "",
      carrera: apiS.carrera || "",

      sede: apiS.sede || "",
      estudiante_email: apiS.estudiante_email || "",
      estudiante_phone: apiS.estudiante_phone || "",
      oficio: apiS.oficio || "",
      estado_civil: apiS.estado_civil || "",
      domicilio: apiS.domicilio || "",
      lugar_trabajo: apiS.lugar_trabajo || "",

      institucion_id: apiS.institucion_id || null,
      institucion: apiS.institucion_nombre || "",

      tituloProyecto,
      justificacion,
      objetivoGeneral,

      // legacy
      objetivosEspecificos: apiS.objetivos_especificos || "",

      // ✅ arrays
      objetivosEspecificosItems: Array.isArray(apiS.objetivosEspecificosItems)
        ? apiS.objetivosEspecificosItems
        : [],
      cronogramaItems: Array.isArray(apiS.cronogramaItems)
        ? apiS.cronogramaItems
        : [],

      beneficiarios: beneficiario,
      estrategiaSolucion,
    },

    history,
    _raw: apiS,
  };
}

function mapSolicitudDetalleFromApi(apiDetalle) {
  if (!apiDetalle) return null;

  const base = apiDetalle.solicitud || apiDetalle; // por si viene plano
  const ui = mapSolicitudFromApi(base);

  const objetivos = Array.isArray(apiDetalle.objetivos)
    ? apiDetalle.objetivos
    : [];
  const cronograma = Array.isArray(apiDetalle.cronograma)
    ? apiDetalle.cronograma
    : [];
  const history = Array.isArray(apiDetalle.history)
    ? apiDetalle.history
    : ui.history;

  const objetivosItems = objetivos
    .map((o) => String(o.descripcion || "").trim())
    .filter(Boolean);

  const cronogramaItems = cronograma.map((c) => ({
    actividad: c.actividad || "",
    tarea: c.tarea || "",
    horas: c.horas ?? "",
  }));

  return {
    ...ui,
    objetivosEspecificosItems: objetivosItems,
    cronogramaItems,
    history: history.map((h) => ({
      date: h.created_at || h.fecha || h.date || new Date().toISOString(),
      action: h.accion || h.action || "",
      user: h.usuario || h.user || "",
      message: h.mensaje || h.message || "",
    })),
    formData: {
      ...(ui.formData || {}),
      objetivosEspecificosItems: objetivosItems,
      cronogramaItems,
    },
    _rawDetalle: apiDetalle,
  };
}

/* ============================================================
   PROVIDER
   ============================================================ */

export function SolicitudProvider({ children }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mySolicitud, setMySolicitud] = useState(null);
  const [loading, setLoading] = useState(false);

  // ADMIN – todas las solicitudes
  const fetchAllSolicitudes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/solicitudes");
      const listApi = Array.isArray(res.data) ? res.data : [];
      const listUi = listApi.map(mapSolicitudFromApi);
      setSolicitudes(listUi);
      return listUi;
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ESTUDIANTE – Mis solicitudes (solo tabla solicitudes)
  const fetchMySolicitud = async (emailDemo = "esoto@ufidelitas.ac.cr") => {
    setLoading(true);
    try {
      const res = await api.get(`/solicitudes/me`, {
        params: { email: emailDemo },
      });
      const listApi = Array.isArray(res.data) ? res.data : [];
      const last = listApi[0] || null;
      const ui = last ? mapSolicitudFromApi(last) : null;
      setMySolicitud(ui);
      return ui;
    } catch (err) {
      console.error("Error cargando mi solicitud:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVO – Detalle completo (incluye objetivos/cronograma reales)
  const fetchSolicitudDetalle = async (id) => {
    if (!id) return null;
    setLoading(true);
    try {
      const res = await api.get(`/solicitudes/${id}/detalle`);
      const ui = mapSolicitudDetalleFromApi(res.data);

      // si es mi solicitud, la actualizamos con detalle
      if (mySolicitud?.id === id) {
        setMySolicitud(ui);
      }

      // si está en lista admin, también la actualizamos
      setSolicitudes((current) =>
        (current || []).map((s) => (s?.id === id ? ui : s)),
      );

      return ui;
    } catch (err) {
      console.error("Error cargando detalle de solicitud:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ESTUDIANTE – Crear solicitud
  const addSolicitud = async (formData) => {
    setLoading(true);
    try {
      const vencimientoPorDefecto = new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .slice(0, 10);

      const objetivosItems = Array.isArray(formData.objetivosEspecificosItems)
        ? formData.objetivosEspecificosItems
            .map((x) => String(x || "").trim())
            .filter(Boolean)
        : [];

      const cronogramaItems = Array.isArray(formData.cronogramaItems)
        ? formData.cronogramaItems
            .map((r) => ({
              actividad: String(r?.actividad || "").trim(),
              tarea: String(r?.tarea || "").trim(),
              horas: String(r?.horas ?? "").trim(),
            }))
            .filter((r) => r.actividad && r.tarea && r.horas !== "")
        : [];

      const payload = {
        estudiante_nombre: formData.nombre,
        estudiante_cedula: formData.cedula,
        carrera: formData.carrera,

        sede: formData.sede || null,
        estudiante_email: formData.estudiante_email || null,
        estudiante_phone: formData.estudiante_phone || null,
        oficio: formData.oficio || null,
        estado_civil: formData.estado_civil || null,
        domicilio: formData.domicilio || null,
        lugar_trabajo: formData.lugar_trabajo || null,

        institucion_id: formData.institucion_id || null,
        institucion_nombre: formData.institucion || "",

        titulo_proyecto: formData.tituloProyecto || null,

        // ✅ BD: descripcion_problema
        descripcion_problema: formData.justificacion || "",

        objetivo_general: formData.objetivoGeneral || "",

        // legacy opcional (texto)
        objetivos_especificos: objetivosItems.join("\n"),

        beneficiario: formData.beneficiarios || null,
        estrategia_solucion: formData.estrategiaSolucion || null,

        // ✅ tablas hijas
        objetivos_especificos_items: objetivosItems,
        cronograma_items: cronogramaItems,

        // ✅ requerido por el backend
        vencimiento: formData.vencimiento || vencimientoPorDefecto,

        // demo
        owner_email: "esoto@ufidelitas.ac.cr",
      };

      const res = await api.post("/solicitudes", payload);
      const nuevaUi = mapSolicitudFromApi(res.data);

      setMySolicitud(nuevaUi);
      setSolicitudes((current) => [nuevaUi, ...(current || [])]);

      return nuevaUi;
    } catch (err) {
      console.error("Error creando solicitud:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ADMIN – Cambiar estado
  const updateSolicitudStatus = async (
    idInterno,
    newStatus,
    observation = "",
  ) => {
    try {
      await api.patch(`/solicitudes/${idInterno}/status`, {
        status: newStatus,
        observation,
      });

      setSolicitudes((current) =>
        (current || []).map((s) =>
          s?.id === idInterno
            ? { ...s, status: newStatus, estado: newStatus }
            : s,
        ),
      );

      if (mySolicitud?.id === idInterno) {
        setMySolicitud((prev) =>
          prev ? { ...prev, status: newStatus, estado: newStatus } : prev,
        );
      }
    } catch (err) {
      console.error("Error actualizando estado de solicitud:", err);
      throw err;
    }
  };

  // ADMIN – Asignar Revisor
  const assignReviewer = async (idInterno, reviewerEmail) => {
    try {
      await api.patch(`/solicitudes/${idInterno}/assign`, { reviewerEmail });

      setSolicitudes((current) =>
        (current || []).map((s) =>
          s?.id === idInterno ? { ...s, assigned_to: reviewerEmail } : s,
        ),
      );
    } catch (err) {
      console.error("Error asignando revisor:", err);
      throw err;
    }
  };

  const getMySolicitud = () => mySolicitud;

  return (
    <SolicitudContext.Provider
      value={{
        solicitudes,
        mySolicitud,
        loading,
        fetchAllSolicitudes,
        fetchMySolicitud,
        fetchSolicitudDetalle,
        addSolicitud,
        updateSolicitudStatus,
        assignReviewer,
        getMySolicitud,
      }}
    >
      {children}
    </SolicitudContext.Provider>
  );
}

export function useSolicitudes() {
  const context = useContext(SolicitudContext);
  if (!context) {
    throw new Error(
      "useSolicitudes debe ser usado dentro de un SolicitudProvider",
    );
  }
  return context;
}
