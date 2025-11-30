import { useState } from "react";
import { LuX } from "react-icons/lu";

export default function SolicitudModal({
  isOpen,
  onClose,
  solicitudData,
  onApprove,
  onReject,
  onReturn,
}) {
  const [observation, setObservation] = useState("");

  if (!isOpen || !solicitudData) {
    return null;
  }

  const { formData, status } = solicitudData;

  const handleReturn = () => {
    if (!observation) {
      alert("Por favor, escriba una observación para devolver la solicitud.");
      return;
    }
    onReturn(observation);
  };

  const handleApprove = () => {
    onApprove(observation || "Aprobado sin comentarios.");
  };

  const handleReject = () => {
    if (!observation) {
      alert("Por favor, justifique el rechazo en las observaciones.");
      return;
    }
    onReject(observation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      {}
      <div className="relative w-full max-w-2x1 p-6 bg-white rounded-lg shadow-xl">
        {}
        <div className="flex items-center justify-between pb-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            Revisar Solicitud: {solicitudData.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <LuX size={24} />
          </button>
        </div>

        {}
        <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <h4 className="text-lg font-semibold">Datos del Estudiante</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Nombre:</strong> {formData.nombre}
            </div>
            <div>
              <strong>Cédula:</strong> {formData.cedula}
            </div>
            <div>
              <strong>Carrera:</strong> {formData.carrera}
            </div>
          </div>

          <h4 className="text-lg font-semibold mt-4">Detalles del Proyecto</h4>
          {}
          <div className="space-y-2 text-sm">
            <div>
              <strong>Institución:</strong> {formData.institucion}
            </div>
            <div>
              <strong>Justificación:</strong>
              <p className="p-2 bg-gray-50 rounded-md border">
                {formData.justificacion}
              </p>
            </div>
            <div>
              <strong>Objetivo General:</strong>
              <p className="p-2 bg-gray-50 rounded-md border">
                {formData.objetivoGeneral}
              </p>
            </div>
            <div>
              <strong>Objetivos Específicos:</strong>
              <pre className="p-2 bg-gray-50 rounded-md border font-sans whitespace-pre-wrap">
                {formData.objetivosEspecificos}
              </pre>
            </div>
          </div>

          {}
          <h4 className="text-lg font-semibold mt-4">
            Observaciones del Revisor
          </h4>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            rows="3"
            placeholder="Escribir observaciones para el estudiante..."
            readOnly={
              status !== "Enviado" &&
              status !== "Observado" &&
              status !== "En Revisión" &&
              status !== "Open"
            }
          ></textarea>
        </div>

        {}
        <div className="flex justify-end pt-6 mt-6 space-x-3 border-t">
          {}
          {status === "Enviado" ||
          status === "Observado" ||
          status === "En Revisión" ||
          status === "Open" ? (
            <>
              <button
                onClick={handleReturn}
                className="px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-md hover:bg-yellow-200"
              >
                Devolver con Observaciones
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md hover:bg-red-200"
              >
                Rechazar
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Aprobar
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
