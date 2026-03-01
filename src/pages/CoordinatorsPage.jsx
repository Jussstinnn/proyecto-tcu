//CoordinatorsPage.jsx
import { useEffect, useState } from "react";

export default function CoordinatorsPage() {
  const [coordinators, setCoordinators] = useState([]);

  useEffect(() => {
    // placeholder: luego lo conectamos al backend si existe endpoint
    setCoordinators([]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h1 className="text-lg font-semibold text-slate-900">
            Coordinadores TCU
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Módulo en construcción (por ahora es una pantalla base).
          </p>
        </div>

        <div className="p-6">
          {coordinators.length === 0 ? (
            <div className="text-sm text-slate-600">
              No hay coordinadores cargados todavía.
            </div>
          ) : (
            <ul className="space-y-2">
              {coordinators.map((c, idx) => (
                <li
                  key={idx}
                  className="p-3 border border-slate-200 rounded-xl bg-slate-50"
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
