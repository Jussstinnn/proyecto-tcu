import { useState, useEffect } from "react";
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

  // Limpiar textarea cada vez que se abre con una solicitud nueva
  useEffect(() => {
    if (isOpen) setObservation("");
  }, [isOpen, solicitudData]);

  if (!isOpen || !solicitudData) return null;

  const { formData, status, id } = solicitudData;

  const handleReturn = () => {
    if (!observation.trim()) {
      alert("Por favor, escriba una observación para devolver la solicitud.");
      return;
    }
    onReturn(observation);
  };

  const handleApprove = () => {
    onApprove(observation.trim() || "Aprobado sin comentarios.");
  };

  const handleReject = () => {
    if (!observation.trim()) {
      alert("Por favor, justifique el rechazo en las observaciones.");
      return;
    }
    onReject(observation);
  };

  const isEditableStatus =
    status === "Enviado" ||
    status === "Observado" ||
    status === "En Revisión" ||
    status === "Open";

  const statusColor =
    status === "Aprobado" || status === "Closed"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Rechazado"
        ? "bg-red-100 text-red-700"
        : status === "Observado"
          ? "bg-amber-100 text-amber-700"
          : "bg-blue-100 text-blue-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {/* CARD PRINCIPAL) */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Revisión de anteproyecto
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              Solicitud {id}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
            >
              {status}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
            >
              <LuX size={20} />
            </button>
          </div>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Datos estudiante */}
          <section>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">
              Datos del estudiante
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm text-slate-700">
              <div>
                <span className="font-semibold">Nombre: </span>
                {formData.nombre}
              </div>
              <div>
                <span className="font-semibold">Cédula: </span>
                {formData.cedula}
              </div>
              <div>
                <span className="font-semibold">Carrera: </span>
                {formData.carrera}
              </div>
            </div>
          </section>

          {/* Detalles del proyecto */}
          <section className="pt-2">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">
              Detalles del proyecto
            </h4>
            <div className="space-y-3 text-xs md:text-sm text-slate-700">
              <div>
                <span className="font-semibold">Institución: </span>
                {formData.institucion}
              </div>

              <div>
                <p className="font-semibold mb-1">Justificación</p>
                <p className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  {formData.justificacion || "Sin justificación registrada."}
                </p>
              </div>

              <div>
                <p className="font-semibold mb-1">Objetivo general</p>
                <p className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  {formData.objetivoGeneral ||
                    "Sin objetivo general registrado."}
                </p>
              </div>

              <div>
                <p className="font-semibold mb-1">Objetivos específicos</p>
                <pre className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-sans whitespace-pre-wrap">
                  {formData.objetivosEspecificos ||
                    "Sin objetivos específicos registrados."}
                </pre>
              </div>
            </div>
          </section>

          {/* Observaciones */}
          <section className="pt-2">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">
              Observaciones del revisor
            </h4>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgba(2,14,159,1)] focus:border-[rgba(2,14,159,1)]"
              rows={3}
              placeholder="Escribir observaciones para el estudiante..."
              readOnly={!isEditableStatus}
            />
            {!isEditableStatus && (
              <p className="mt-1 text-[11px] text-slate-500">
                Esta solicitud ya fue cerrada. Las observaciones no se pueden
                editar.
              </p>
            )}
          </section>
        </div>

        {/* FOOTER ACCIONES */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs md:text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
          >
            Cerrar
          </button>

          {isEditableStatus && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleReturn}
                className="px-4 py-2 text-xs md:text-sm font-semibold text-amber-800 bg-amber-100 rounded-xl hover:bg-amber-200"
              >
                Devolver con observaciones
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-xs md:text-sm font-semibold text-red-800 bg-red-100 rounded-xl hover:bg-red-200"
              >
                Rechazar
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-xs md:text-sm font-semibold text-white rounded-xl shadow-sm bg-emerald-600 hover:bg-emerald-700"
              >
                Aprobar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
