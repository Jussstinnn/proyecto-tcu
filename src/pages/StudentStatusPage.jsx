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
  const activeStep = getActiveStepIndex(solicitud.status);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      {/* Encabezado + timeline */}
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 mb-4">
          Estado de tu Solicitud (ID: {solicitud.id})
        </h1>

        <nav className="flex items-center justify-between text-xs sm:text-sm gap-2">
          {timelineSteps.map((step, index) => {
            const stepIndex = index + 1;
            const isCompleted = stepIndex < activeStep;
            const isActive = stepIndex === activeStep;
            const isWarning =
              solicitud.status === "Observado" && step.name === "En Revisión";

            return (
              <div
                key={step.id}
                className="flex flex-col items-center flex-1 min-w-0"
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-lg
                    ${isCompleted ? "bg-emerald-500 text-white" : ""}
                    ${isActive && !isWarning ? "bg-[rgba(2,14,159,1)] text-white" : ""}
                    ${isWarning ? "bg-yellow-500 text-white animate-pulse" : ""}
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
                  className={`mt-2 font-semibold text-center text-[11px] ${
                    isActive ? "text-[rgba(2,14,159,1)]" : "text-slate-500"
                  }`}
                >
                  {step.name}
                </p>
              </div>
            );
          })}
        </nav>

        {solicitud.status === "Observado" && (
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
            <p className="font-bold">
              ¡Atención! Tu solicitud tiene observaciones.
            </p>
            <p className="text-sm">
              Revisa la bitácora para ver los comentarios del revisor.
            </p>
          </div>
        )}
      </div>

      {/* Historial / bitácora */}
      <div className="p-6 md:p-8">
        <h3 className="text-lg font-semibold mb-4">Historial y Bitácora</h3>
        <div className="max-h-60 overflow-y-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 sticky top-0">
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
              {solicitud.history
                .slice()
                .reverse()
                .map((entry, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="p-3 text-slate-700 whitespace-nowrap">
                      {new Date(entry.date).toLocaleString("es-CR")}
                    </td>
                    <td className="p-3 text-slate-800 font-medium">
                      {entry.action}
                    </td>
                    <td className="p-3 text-slate-700">{entry.user}</td>
                    <td className="p-3 text-slate-700">
                      {entry.message || "Sin observaciones"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
