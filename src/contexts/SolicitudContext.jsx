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
  const tituloProyecto = apiS.titulo_proyecto || "";
  const beneficiario = apiS.beneficiario || "";
  const estrategiaSolucion = apiS.estrategia_solucion || "";

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

    // datos estudiante
    estudiante_nombre: apiS.estudiante_nombre || "",
    estudiante_cedula: apiS.estudiante_cedula || "",
    carrera: apiS.carrera || "",

    institucion_id: apiS.institucion_id || null,
    institucion_nombre: apiS.institucion_nombre || "",

    tituloProyecto,
    beneficiario,
    estrategiaSolucion,
    objetivoGeneral,
    objetivosEspecificos: apiS.objetivos_especificos || "",
    justificacion: apiS.justificacion || "",

    req: apiS.estudiante_nombre || "",
    subj: `${subjectBase.slice(0, 30)}...`,

    formData: {
      nombre: apiS.estudiante_nombre || "",
      cedula: apiS.estudiante_cedula || "",
      carrera: apiS.carrera || "",
      institucion_id: apiS.institucion_id || null,
      institucion: apiS.institucion_nombre || "",
      justificacion: apiS.justificacion || "",
      objetivoGeneral,
      objetivosEspecificos: apiS.objetivos_especificos || "",
      tituloProyecto,
      beneficiarios: beneficiario,
      estrategiaSolucion,
    },

    history,
    _raw: apiS,
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

  // ESTUDIANTE – mis solicitudes (tomamos la más reciente)
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

  // ESTUDIANTE – crear solicitud
  const addSolicitud = async (formData) => {
    setLoading(true);
    try {
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
        titulo_proyecto: formData.tituloProyecto,
        beneficiario: formData.beneficiarios,
        estrategia_solucion: formData.estrategiaSolucion,
        prioridad: "Medium",
        vencimiento: vencimientoPorDefecto,
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

      setSolicitudes((current) =>
        (current || []).map((s) =>
          s._raw && s._raw.id === idInterno
            ? { ...s, status: newStatus, estado: newStatus }
            : s
        )
      );

      if (
        mySolicitud &&
        mySolicitud._raw &&
        mySolicitud._raw.id === idInterno
      ) {
        setMySolicitud((prev) =>
          prev ? { ...prev, status: newStatus, estado: newStatus } : prev
        );
      }
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
