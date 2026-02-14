import { useMemo } from "react";
import {
  LuCheck,
  LuFileText,
  LuBuilding,
  LuTarget,
  LuUser,
  LuLoader,
  LuInfo,
  LuFileClock,
} from "react-icons/lu";

const timelineSteps = [
  { id: 1, name: "Datos Personales", icon: LuUser, statuses: [] },
  { id: 2, name: "Institución", icon: LuBuilding, statuses: [] },
  { id: 3, name: "Objetivos", icon: LuTarget, statuses: [] },
  { id: 4, name: "Documentos", icon: LuFileText, statuses: [] },
  { id: 5, name: "Enviado", icon: LuFileClock, statuses: ["Enviado"] },
  {
    id: 6,
    name: "En Revisión",
    icon: LuLoader,
    statuses: ["En Revisión", "Observado"],
  },
  { id: 7, name: "Aprobado", icon: LuCheck, statuses: ["Aprobado"] },
];

const getActiveStepIndex = (status) => {
  if (status === "Aprobado") return 7;
  if (status === "En Revisión" || status === "Observado") return 6;
  if (status === "Enviado") return 5;
  return 5;
};

export default function StudentStatusPage({ solicitud }) {
  const status = solicitud.status;
  const activeStep = getActiveStepIndex(status);

  // Datos del formulario normalizados desde el contexto
  const { nombre, carrera, institucion, tituloProyecto, objetivoGeneral } =
    solicitud.formData || {};

  const assignedTo = solicitud.assigned_to;
  const due = solicitud.due;

  const statusColor =
    status === "Aprobado"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Rechazado"
        ? "bg-red-100 text-red-700"
        : status === "Observado"
          ? "bg-amber-100 text-amber-700"
          : "bg-blue-100 text-blue-700";

  // History normalizado
  const history = (solicitud.history || []).slice().reverse();

  // Código de 6 caracteres, temporal (A futuro fijo en BD)
  const approvalCode = useMemo(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      const idx = Math.floor(Math.random() * chars.length);
      code += chars[idx];
    }
    return code;
  }, [solicitud.id, status]);

  return (
    <div className="bg-white rounded-3x1 shadow-2xl border border-slate-200 overflow-hidden">
      {/* HEADER + RESUMEN */}
      <div className="p-6 md:p-7 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Seguimiento de anteproyecto
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Estado de tu solicitud
              <span className="text-sm font-semibold text-slate-500 ml-2">
                #{solicitud.id}
              </span>
            </h1>

            {/* mini resumen estudiante */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              {nombre && (
                <span className="px-2 py-1 rounded-full bg-slate-100 font-medium">
                  👤 {nombre}
                </span>
              )}
              {carrera && (
                <span className="px-2 py-1 rounded-full bg-slate-100">
                  🎓 {carrera}
                </span>
              )}
              {institucion && (
                <span className="px-2 py-1 rounded-full bg-slate-100">
                  🏢 {institucion}
                </span>
              )}
              {assignedTo && (
                <span className="px-2 py-1 rounded-full bg-slate-100">
                  🧑‍🏫 Revisor: {assignedTo}
                </span>
              )}
              {due && (
                <span className="px-2 py-1 rounded-full bg-slate-100">
                  ⏰ Vencimiento:{" "}
                  {new Date(due).toLocaleDateString("es-CR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
            >
              Estado: {status}
            </span>
            <p className="text-[11px] text-slate-500 max-w-xs text-right">
              Desde este panel puedes ver en qué paso va tu anteproyecto y
              revisar el historial de cambios.
            </p>
          </div>
        </div>

        {/* TIMELINE */}
        <nav className="flex items-center justify-between text-xs sm:text-sm gap-2">
          {timelineSteps.map((step, index) => {
            const stepIndex = index + 1;
            const isCompleted = stepIndex < activeStep;
            const isActive = stepIndex === activeStep;
            const isWarning =
              status === "Observado" && step.name === "En Revisión";

            return (
              <div
                key={step.id}
                className="flex flex-col items-center flex-1 min-w-0"
              >
                {/* barra de conexión */}
                {index > 0 && (
                  <div className="hidden sm:block w-full h-[2px] bg-slate-200 mb-[-1.1rem] -z-10" />
                )}

                <div
                  className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg shadow-sm
                    ${isCompleted ? "bg-emerald-500 text-white" : ""}
                    ${
                      isActive && !isWarning
                        ? "bg-[rgba(2,14,159,1)] text-white"
                        : ""
                    }
                    ${isWarning ? "bg-amber-500 text-white animate-pulse" : ""}
                    ${
                      !isCompleted && !isActive && !isWarning
                        ? "bg-slate-200 text-slate-600"
                        : ""
                    }`}
                >
                  {isCompleted ? (
                    <LuCheck />
                  ) : isWarning ? (
                    <LuInfo />
                  ) : (
                    <step.icon />
                  )}
                </div>
                <p
                  className={`mt-2 font-semibold text-center text-[10px] sm:text-[11px] truncate px-1
                    ${isActive ? "text-[rgba(2,14,159,1)]" : "text-slate-500"}`}
                >
                  {step.name}
                </p>
              </div>
            );
          })}
        </nav>

        {status === "Observado" && (
          <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 flex gap-3 text-sm">
            <span className="mt-0.5">
              <LuInfo />
            </span>
            <div>
              <p className="font-bold mb-1">
                ¡Atención! Tu solicitud tiene observaciones.
              </p>
              <p className="text-xs sm:text-sm">
                Revisa la bitácora para ver los comentarios del revisor y
                realiza los ajustes recomendados.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* “DOCUMENTO” DE APROBACIÓN (solo cuando está Aprobado) */}
      {status === "Aprobado" && (
        <div className="px-6 md:px-8 pt-4">
          <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                Comprobante de aprobación
              </p>
              <h2 className="text-sm md:text-base font-bold text-slate-900 mt-1">
                Trabajo Comunal Universitario – Aprobado
              </h2>

              <div className="mt-2 text-xs text-slate-700 space-y-1">
                <p>
                  <span className="font-semibold">Estudiante:</span>{" "}
                  {nombre || "—"}
                </p>
                <p>
                  <span className="font-semibold">Título del proyecto:</span>{" "}
                  {tituloProyecto || "Sin título registrado"}
                </p>
                <p>
                  <span className="font-semibold">Objetivo general:</span>{" "}
                  {objetivoGeneral || "Sin objetivo registrado"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-emerald-700">
                    Estado:
                  </span>{" "}
                  Aprobado por la coordinación de TCU.
                </p>
              </div>

              <div className="mt-3">
                <p className="text-[11px] uppercase font-semibold text-slate-500">
                  Código de aprobación
                </p>
                <p className="mt-1 inline-block font-mono text-lg tracking-[0.35em] bg-slate-900 text-white px-3 py-2 rounded-lg">
                  {approvalCode}
                </p>
              </div>
            </div>

            <div className="flex md:flex-col items-end md:items-center gap-3">
              {/* Botón solo visual */}
              <button
                type="button"
                className="px-4 py-2 text-xs md:text-sm font-semibold rounded-xl bg-[rgba(2,14,159,1)] text-white shadow-sm hover:bg-indigo-900"
              >
                Descargar documento
              </button>
              <p
                className="text-[10px] text-gray-800 font-semibold max-w-[220px] 
               text-right md:text-center border border-[#ffd600] 
               rounded-lg p-2"
              >
                Este documento, debe ser subido al sistema universitario para
                continuar con el proceso.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BODY: HISTORIAL / BITÁCORA */}
      <div className="p-6 md:p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Historial y bitácora de cambios
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Aquí se registran las acciones realizadas sobre tu anteproyecto:
          envíos, revisiones, observaciones y aprobaciones.
        </p>

        <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50/60">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left font-semibold text-slate-600">
                  Fecha
                </th>
                <th className="p-3 text-left font-semibold text-slate-600">
                  Acción
                </th>
                <th className="p-3 text-left font-semibold text-slate-600">
                  Usuario
                </th>
                <th className="p-3 text-left font-semibold text-slate-600">
                  Observación
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => {
                const fecha = entry.date || entry.fecha;
                const accion = entry.action || entry.accion;
                const usuario = entry.user || entry.usuario;
                const mensaje = entry.message || entry.mensaje;

                return (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 border-slate-200 hover:bg-white"
                  >
                    <td className="p-3 text-slate-700 whitespace-nowrap align-top">
                      {fecha ? new Date(fecha).toLocaleString("es-CR") : "-"}
                    </td>
                    <td className="p-3 text-slate-800 font-medium align-top">
                      {accion}
                    </td>
                    <td className="p-3 text-slate-700 align-top">
                      {usuario || "-"}
                    </td>
                    <td className="p-3 text-slate-700 align-top">
                      {mensaje || "Sin observaciones"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
