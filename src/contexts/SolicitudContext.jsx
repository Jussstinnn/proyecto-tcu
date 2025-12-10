import { createContext, useContext, useState } from "react";
import api from "../api/apiClient";

const SolicitudContext = createContext(null);

function mapSolicitudFromApi(apiS) {
  if (!apiS) return null;

  const historyArray = Array.isArray(apiS.history) ? apiS.history : [];

  const history = historyArray.map((h) => ({
    date: h.fecha || h.date || new Date().toISOString(),
    action: h.accion || h.action || "",
    user: h.usuario || h.user || "",
    message: h.mensaje || h.message || "",
  }));

  const objetivoGeneral = apiS.objetivo_general || "";
  const subjectBase =
    objetivoGeneral.trim().length > 0
      ? objetivoGeneral.trim()
      : "Anteproyecto TCU";

  return {
    id: apiS.codigo_publico || `#${apiS.id}`, // código visible
    status: apiS.estado || "Enviado",
    prio:
      apiS.prioridad === "High" ||
      apiS.prioridad === "Medium" ||
      apiS.prioridad === "Low"
        ? apiS.prioridad
        : "Medium",
    due: apiS.vencimiento || null,
    owner: apiS.owner_email || "",
    assigned_to: apiS.assigned_to || null,
    assign_date: apiS.assign_date || null,

    req: apiS.estudiante_nombre || "",
    subj: apiS.subj || `Revisión: ${subjectBase.slice(0, 30)}...`,

    formData: {
      nombre: apiS.estudiante_nombre || "",
      cedula: apiS.estudiante_cedula || "",
      carrera: apiS.carrera || "",
      institucion: apiS.institucion_nombre || "",
      justificacion: apiS.justificacion || "",
      objetivoGeneral,
      objetivosEspecificos: apiS.objetivos_especificos || "",
    },

    history,
    _raw: apiS, // para tener el id interno si luego lo ocupamos
  };
}

export function SolicitudProvider({ children }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mySolicitud, setMySolicitud] = useState(null);
  const [loading, setLoading] = useState(false);

  // ADMIN – todas
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

  // ============================
  //   STUDENT: obtener la propia
  //   GET /api/solicitudes/me
  // ============================
  const fetchMySolicitud = async () => {
    setLoading(true);
    try {
      const res = await api.get("/solicitudes/me"); // 👈 OJO: /me
      const apiSolicitud = res.data && res.data[0] ? res.data[0] : null; // devuelve array
      const uiSolicitud = apiSolicitud
        ? mapSolicitudFromApi(apiSolicitud)
        : null;
      setMySolicitud(uiSolicitud);
      return uiSolicitud;
    } catch (err) {
      console.error("Error cargando mi solicitud:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  //   STUDENT: crear solicitud
  //   POST /api/solicitudes
  // ======================================================
  const addSolicitud = async (formData) => {
    setLoading(true);
    try {
      // vencimiento por defecto: hoy + 7 días
      const vencimientoPorDefecto = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10);

      const payload = {
        estudiante_nombre: formData.nombre,
        estudiante_cedula: formData.cedula,
        carrera: formData.carrera,
        institucion_id: formData.institucion_id || null,
        institucion_nombre: formData.institucion,
        justificacion: formData.justificacion,
        objetivo_general: formData.objetivoGeneral,
        objetivos_especificos: formData.objetivosEspecificos,
        prioridad: "Medium",
        vencimiento: vencimientoPorDefecto,
      };

      console.log("Payload enviado a /api/solicitudes:", payload);

      const res = await api.post("/solicitudes", payload);
      const nuevaUi = mapSolicitudFromApi(res.data);

      setMySolicitud(nuevaUi);
      setSolicitudes((current) => [nuevaUi, ...(current || [])]);

      return nuevaUi;
    } catch (err) {
      console.error("Error creando solicitud:", err?.response?.data || err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ADMIN – cambiar estado
  const updateSolicitudStatus = async (
    idInterno,
    newStatus,
    observation = ""
  ) => {
    try {
      await api.patch(`/solicitudes/${idInterno}/status`, {
        status: newStatus,
        observation,
      });

      // aquí podrías volver a cargar una sola solicitud desde el backend;
      // por simplicidad, de momento solo actualizamos el status localmente
      setSolicitudes((current) =>
        (current || []).map((s) =>
          s._raw && s._raw.id === idInterno ? { ...s, status: newStatus } : s
        )
      );
    } catch (err) {
      console.error("Error actualizando estado de solicitud:", err);
      throw err;
    }
  };

  // ADMIN – asignar revisor
  const assignReviewer = async (idInterno, reviewerEmail) => {
    try {
      await api.patch(`/solicitudes/${idInterno}/assign`, {
        reviewerEmail,
      });

      setSolicitudes((current) =>
        (current || []).map((s) =>
          s._raw && s._raw.id === idInterno
            ? { ...s, assigned_to: reviewerEmail }
            : s
        )
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
      "useSolicitudes debe ser usado dentro de un SolicitudProvider"
    );
  }
  return context;
}
