import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // placeholder: luego lo conectamos a backend si hay endpoint
    setReports([]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h1 className="text-lg font-semibold text-slate-900">Reportes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Módulo en construcción (pantalla base).
          </p>
        </div>

        <div className="p-6">
          {reports.length === 0 ? (
            <div className="text-sm text-slate-600">
              No hay reportes disponibles todavía.
            </div>
          ) : (
            <ul className="space-y-2">
              {reports.map((r, idx) => (
                <li
                  key={idx}
                  className="p-3 border border-slate-200 rounded-xl bg-slate-50"
                >
                  {r.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
