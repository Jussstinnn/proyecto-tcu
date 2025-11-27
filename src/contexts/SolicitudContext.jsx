import { createContext, useContext, useState } from "react";

const CURRENT_USER = "Justin Montoya";

// Semilla de solicitudes de ejemplo para el dashboard de admin
const initialSolicitudes = [
  {
    id: "#98765",
    req: "Ana Rojas",
    subj: "Proyecto en Guardería",
    prio: "Medium",
    status: "Enviado",
    due: "2025-11-16",
    owner: "ana@ucorreo.cr",
    formData: {
      nombre: "Ana Rojas",
      cedula: "1-1111-1111",
      carrera: "Psicología",
      institucion: "Guardería Caritas Felices",
      justificacion: "Apoyo en el desarrollo motriz de infantes.",
      objetivoGeneral: "Implementar 3 talleres lúdicos.",
      objetivosEspecificos:
        "1. Diagnóstico.\n2. Preparar materiales.\n3. Ejecutar talleres.",
    },
    history: [
      {
        date: "2025-11-16T12:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Ana Rojas",
      },
    ],
  },
  {
    id: "#98770",
    req: "Luis Vega",
    subj: "Apoyo en escuela",
    prio: "Low",
    status: "Enviado",
    due: "2025-11-16",
    owner: "luis@ucorreo.cr",
    formData: {
      nombre: "Luis Vega",
      cedula: "1-2222-3333",
      carrera: "Enseñanza",
      institucion: "Escuela El Porvenir",
      justificacion: "Reforzamiento de materias básicas.",
      objetivoGeneral: "Dar apoyo en matemáticas a niños de tercer grado.",
      objetivosEspecificos:
        "1. Identificar debilidades.\n2. Crear guías de práctica.",
    },
    history: [
      {
        date: "2025-11-16T10:30:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Luis Vega",
      },
    ],
  },
  {
    id: "#98771",
    req: "Sofia Fernandez",
    subj: "Plan de marketing ONG",
    prio: "High",
    status: "Enviado",
    due: "2025-11-15",
    owner: "sofia@ucorreo.cr",
    formData: {
      nombre: "Sofia Fernandez",
      cedula: "1-4444-5555",
      carrera: "Mercadeo",
      institucion: "Fundación Salva un Animal",
      justificacion: "Mejorar la visibilidad de la ONG.",
      objetivoGeneral:
        "Crear una estrategia de redes sociales para la adopción.",
      objetivosEspecificos:
        "1. Analizar RRSS actuales.\n2. Proponer calendario de contenido.",
    },
    history: [
      {
        date: "2025-11-15T14:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Sofia Fernandez",
      },
    ],
  },

  {
    id: "#98766",
    req: "Carlos Mora",
    subj: "Revisión Objetivos (Devuelto)",
    prio: "High",
    status: "Observado",
    due: "2025-11-15",
    owner: "carlos@ucorreo.cr",
    formData: {
      nombre: "Carlos Mora",
      cedula: "2-2222-2222",
      carrera: "Ingeniería de Software",
      institucion: "Hogar de Ancianos Luz y Vida",
      justificacion: "Proyecto de alfabetización digital.",
      objetivoGeneral: "Ayudar a los adultos mayores.",
      objetivosEspecificos: "1. Enseñarles a usar la computadora.",
    },
    history: [
      {
        date: "2025-11-15T10:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Carlos Mora",
      },
      {
        date: "2025-11-15T16:30:00Z",
        action: "Estado cambiado a: Observado",
        user: "Admin Revisor",
        message:
          "El objetivo general es muy vago. Favor reestructurar usando la metodología SMART.",
      },
    ],
  },
  {
    id: "#98772",
    req: "Laura Jimenez",
    subj: "Falta Justificación",
    prio: "Medium",
    status: "Observado",
    due: "2025-11-14",
    owner: "laura@ucorreo.cr",
    formData: {
      nombre: "Laura Jimenez",
      cedula: "1-6666-7777",
      carrera: "Administración",
      institucion: "Municipalidad de Curridabat",
      justificacion: "",
      objetivoGeneral: "Apoyar al departamento de patentes.",
      objetivosEspecificos: "1. Ordenar archivos.",
    },
    history: [
      {
        date: "2025-11-14T08:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Laura Jimenez",
      },
      {
        date: "2025-11-14T11:30:00Z",
        action: "Estado cambiado a: Observado",
        user: "Admin Revisor",
        message: "La solicitud no incluye una justificación del proyecto.",
      },
    ],
  },

  {
    id: "#98767",
    req: "Elena Solano",
    subj: "Proyecto Comedor (Aprobado)",
    prio: "Low",
    status: "Aprobado",
    due: "2025-06-10",
    owner: "elena@ucorreo.cr",
    formData: {
      nombre: "Elena Solano",
      cedula: "3-3333-3333",
      carrera: "Nutrición",
      institucion: "Comedor Infantil La Esperanza",
      justificacion: "Mejora de la dieta infantil.",
      objetivoGeneral: "Diseñar 3 menús balanceados.",
      objetivosEspecificos: "N/A",
    },
    history: [
      {
        date: "2025-06-01T09:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Elena Solano",
      },
      {
        date: "2025-06-03T14:00:00Z",
        action: "Estado cambiado a: Aprobado",
        user: "Admin Revisor",
        message: "Excelente propuesta.",
      },
    ],
  },
  {
    id: "#98773",
    req: "David Guzman",
    subj: "TCU Aprobado",
    prio: "Medium",
    status: "Aprobado",
    due: "2025-08-20",
    owner: "david@ucorreo.cr",
    formData: {
      nombre: "David Guzman",
      cedula: "1-8888-9999",
      carrera: "Ingeniería de Software",
      institucion: "Refugio Animal de Cartago",
      justificacion: "Creación de sistema de adopciones.",
      objetivoGeneral: "Desarrollar una landing page de adopción.",
      objetivosEspecificos:
        "1. Levantar requisitos.\n2. Diseñar mockups.\n3. Programar.",
    },
    history: [
      {
        date: "2025-08-15T10:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "David Guzman",
      },
      {
        date: "2025-08-16T15:00:00Z",
        action: "Estado cambiado a: Aprobado",
        user: "Admin Revisor",
        message: "Aprobado.",
      },
    ],
  },
  {
    id: "#98774",
    req: "Valeria Chaves",
    subj: "TCU Aprobado",
    prio: "Low",
    status: "Aprobado",
    due: "2025-09-01",
    owner: "valeria@ucorreo.cr",
    formData: {
      nombre: "Valeria Chaves",
      cedula: "9-0000-1111",
      carrera: "Psicología",
      institucion: "Hogar de Ancianos Luz y Vida",
      justificacion: "Talleres de memoria.",
      objetivoGeneral: "Realizar 3 talleres de estimulación cognitiva.",
      objetivosEspecificos: "1. Investigar dinámicas.\n2. Ejecutar.",
    },
    history: [
      {
        date: "2025-08-28T13:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Valeria Chaves",
      },
      {
        date: "2025-09-01T10:00:00Z",
        action: "Estado cambiado a: Aprobado",
        user: "Admin Revisor",
        message: "Aprobado.",
      },
    ],
  },
  {
    id: "#98775",
    req: "Oscar Salas",
    subj: "TCU Aprobado",
    prio: "Low",
    status: "Aprobado",
    due: "2025-10-10",
    owner: "oscar@ucorreo.cr",
    formData: {
      nombre: "Oscar Salas",
      cedula: "1-1212-3434",
      carrera: "Administración",
      institucion: "Municipalidad de Curridabat",
      justificacion: "Apoyo en gestión.",
      objetivoGeneral: "Digitalizar actas municipales.",
      objetivosEspecificos: "1. Escanear 500 actas.",
    },
    history: [
      {
        date: "2025-10-05T09:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Oscar Salas",
      },
      {
        date: "2025-10-06T11:00:00Z",
        action: "Estado cambiado a: Aprobado",
        user: "Admin Revisor",
        message: "Recuerde presentar el informe final.",
      },
    ],
  },

  {
    id: "#98768",
    req: "Miguel Avila",
    subj: "Institución no válida",
    prio: "Medium",
    status: "Rechazado",
    due: "2025-11-14",
    owner: "miguel@ucorreo.cr",
    formData: {
      nombre: "Miguel Avila",
      cedula: "4-4444-4444",
      carrera: "Ingeniería Industrial",
      institucion: "La empresa de mi papá S.A.",
      justificacion: "Quiero hacer la práctica ahí.",
      objetivoGeneral: "Optimizar procesos.",
      objetivosEspecificos: "N/A",
    },
    history: [
      {
        date: "2025-11-14T11:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Miguel Avila",
      },
      {
        date: "2025-11-14T17:00:00Z",
        action: "Estado cambiado a: Rechazado",
        user: "Admin Revisor",
        message:
          "La institución seleccionada es una empresa privada con fines de lucro. No califica para TCU.",
      },
    ],
  },
  {
    id: "#98776",
    req: "Karla Solis",
    subj: "Proyecto duplicado",
    prio: "Low",
    status: "Rechazado",
    due: "2025-11-10",
    owner: "karla@ucorreo.cr",
    formData: {
      nombre: "Karla Solis",
      cedula: "1-5656-7878",
      carrera: "Nutrición",
      institucion: "Comedor Infantil La Esperanza",
      justificacion: "N/A",
      objetivoGeneral: "Diseñar 3 menús balanceados.",
      objetivosEspecificos: "N/A",
    },
    history: [
      {
        date: "2025-11-10T10:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Karla Solis",
      },
      {
        date: "2025-11-10T14:00:00Z",
        action: "Estado cambiado a: Rechazado",
        user: "Admin Revisor",
        message:
          "Este proyecto ya fue realizado por la estudiante Elena Solano (ID #98767). No se aceptan proyectos duplicados.",
      },
    ],
  },

  {
    id: "#98777",
    req: "Esteban Arias",
    subj: "Taller de finanzas",
    prio: "Medium",
    status: "Enviado",
    due: "2025-11-13",
    owner: "esteban@ucorreo.cr",
    formData: {
      nombre: "Esteban Arias",
      cedula: "1-9898-7676",
      carrera: "Contaduría",
      institucion: "Fundación Pro-Jóvenes",
      justificacion: "Enseñar a jóvenes en riesgo social sobre finanzas.",
      objetivoGeneral: "Impartir un taller de finanzas personales.",
      objetivosEspecificos: "1. Preparar material.\n2. Impartir 3 charlas.",
    },
    history: [
      {
        date: "2025-11-13T16:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Esteban Arias",
      },
    ],
  },
  {
    id: "#98778",
    req: "Fernanda Ureña",
    subj: "Apoyo legal",
    prio: "High",
    status: "Enviado",
    due: "2025-11-12",
    owner: "fernanda@ucorreo.cr",
    formData: {
      nombre: "Fernanda Ureña",
      cedula: "1-1234-9876",
      carrera: "Derecho",
      institucion: "Consultorio Jurídico Gratuito",
      justificacion: "Apoyo a personas de bajos recursos.",
      objetivoGeneral: "Asistir en la redacción de 20 documentos legales.",
      objetivosEspecificos: "1. Revisar casos.\n2. Redactar borradores.",
    },
    history: [
      {
        date: "2025-11-12T15:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Fernanda Ureña",
      },
    ],
  },
  {
    id: "#98779",
    req: "Roberto Brenes",
    subj: "Diseño de logo",
    prio: "Low",
    status: "Enviado",
    due: "2025-11-12",
    owner: "roberto@ucorreo.cr",
    formData: {
      nombre: "Roberto Brenes",
      cedula: "1-4567-1234",
      carrera: "Diseño Gráfico",
      institucion: "Fundación Salva un Animal",
      justificacion: "Rediseño de identidad gráfica.",
      objetivoGeneral: "Diseñar un nuevo logo y manual de marca.",
      objetivosEspecificos:
        "1. Presentar 3 propuestas.\n2. Entregar artes finales.",
    },
    history: [
      {
        date: "2025-11-12T10:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Roberto Brenes",
      },
    ],
  },
  {
    id: "#98780",
    req: "Silvia Castro",
    subj: "Charlas de salud",
    prio: "Medium",
    status: "Enviado",
    due: "2025-11-11",
    owner: "silvia@ucorreo.cr",
    formData: {
      nombre: "Silvia Castro",
      cedula: "1-7777-8888",
      carrera: "Medicina",
      institucion: "EBAIS de Pavas",
      justificacion: "Promoción de la salud.",
      objetivoGeneral: "Impartir 5 charlas sobre prevención de diabetes.",
      objetivosEspecificos: "1. Preparar material.\n2. Agendar charlas.",
    },
    history: [
      {
        date: "2025-11-11T14:00:00Z",
        action: "Solicitud Creada y Enviada",
        user: "Silvia Castro",
      },
    ],
  },
];

const SolicitudContext = createContext(null);

export function SolicitudProvider({ children }) {
  const [solicitudes, setSolicitudes] = useState(initialSolicitudes);

  const addSolicitud = (formData) => {
    const newId = `#${Math.floor(Math.random() * 90000) + 10000}`;

    const newSolicitud = {
      id: newId,
      req: formData.nombre || CURRENT_USER,
      subj: `Revisión: ${formData.objetivoGeneral.substring(0, 20)}...`,
      prio: "Medium",
      status: "Enviado",
      due: new Date().toLocaleDateString("en-CA"),
      owner: CURRENT_USER,
      formData,
      history: [
        {
          date: new Date().toISOString(),
          action: "Solicitud Creada y Enviada",
          user: CURRENT_USER,
        },
      ],
    };

    setSolicitudes((current) => [newSolicitud, ...current]);
  };

  const updateSolicitudStatus = (id, newStatus, observation = "") => {
    setSolicitudes((current) =>
      current.map((s) => {
        if (s.id === id) {
          const newHistoryEntry = {
            date: new Date().toISOString(),
            action: `Estado cambiado a: ${newStatus}`,
            message: observation,
            user: "Admin Revisor",
          };
          return {
            ...s,
            status: newStatus,
            history: [...s.history, newHistoryEntry],
          };
        }
        return s;
      })
    );
  };

  const getMySolicitud = () => {
    return solicitudes.find((s) => s.owner === CURRENT_USER) || null;
  };

  return (
    <SolicitudContext.Provider
      value={{
        solicitudes,
        addSolicitud,
        updateSolicitudStatus,
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
