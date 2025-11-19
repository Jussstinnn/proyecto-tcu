
import { 
  LuCheck, LuFileText, LuBuilding, LuTarget, LuUser, 
  LuLoader, LuInfo, LuFileClock 
} from "react-icons/lu";


const timelineSteps = [
  { id: 1, name: "Datos Personales", icon: LuUser, statuses: [] },
  { id: 2, name: "Institución", icon: LuBuilding, statuses: [] },
  { id: 3, name: "Objetivos", icon: LuTarget, statuses: [] },
  { id: 4, name: "Documentos", icon: LuFileText, statuses: [] },
  { id: 5, name: "Enviado", icon: LuFileClock, statuses: ['Enviado'] },
  
  { id: 6, name: "En Revisión", icon: LuLoader, statuses: ['En Revisión', 'Observado'] },
  { id: 7, name: "Aprobado", icon: LuCheck, statuses: ['Aprobado'] },
];


const getActiveStepIndex = (status) => {
  if (status === 'Aprobado') return 7;
  if (status === 'En Revisión' || status === 'Observado') return 6;
  if (status === 'Enviado') return 5;
  return 5; 
};

export default function StudentStatusPage({ solicitud }) {
  
  const activeStep = getActiveStepIndex(solicitud.status);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
        
        {}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Estado de tu Solicitud (ID: {solicitud.id})
          </h1>
          
          {}
          <nav className="flex items-center justify-between text-xs sm:text-sm">
            {timelineSteps.map((step, index) => {
              const stepIndex = index + 1;
              const isCompleted = stepIndex < activeStep;
              const isActive = stepIndex === activeStep;
              const isWarning = solicitud.status === 'Observado' && step.name === 'En Revisión';

              return (
                <div key={step.id} className="flex flex-col items-center flex-1 min-w-0">
                  <div
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${isActive && !isWarning ? 'bg-blue-600 text-white' : ''}
                      ${isWarning ? 'bg-yellow-500 text-white animate-pulse' : ''}
                      ${!isCompleted && !isActive ? 'bg-gray-200 text-gray-600' : ''}
                    `}
                  >
                    {isCompleted ? <LuCheck /> : (isWarning ? <LuInfo /> : <step.icon />)}
                  </div>
                  <p className={`mt-2 font-semibold text-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.name}
                  </p>
                </div>
              );
            })}
          </nav>

          {}
          {solicitud.status === 'Observado' && (
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
              <p className="font-bold">¡Atención! Tu solicitud tiene observaciones.</p>
              <p>Revisa la bitácora para ver los comentarios del revisor.</p>
            </div>
          )}
        </div>

        {}
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-4">Historial y Bitácora</h3>
          <div className="max-h-60 overflow-y-auto border rounded-md">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Fecha</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Acción</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Usuario</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Observación</th>
                </tr>
              </thead>
              <tbody>
                {solicitud.history.slice().reverse().map((entry, index) => ( 
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {new Date(entry.date).toLocaleString('es-CR')}
                    </td>
                    <td className="p-3 text-sm text-gray-800 font-medium">{entry.action}</td>
                    <td className="p-3 text-sm text-gray-700">{entry.user}</td>
                    <td className="p-3 text-sm text-gray-700">{entry.message || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}