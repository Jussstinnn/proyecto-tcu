import { useMemo, useState } from "react";
import {
  LuLayoutDashboard,
  LuTicket,
  LuBuilding,
  LuFileText,
  LuUserCheck,
  LuLogOut,
  LuSearch,
  LuDownload,
  LuClock3,
  LuFile,
  LuFileCheck,
} from "react-icons/lu";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ReportsPage() {
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const reports = [
    {
      id: 1,
      title: "Reporte general de solicitudes",
      description:
        "Resumen consolidado del flujo de anteproyectos registrados.",
      tipo: "General",
      estado: "Disponible",
      fecha: "07/03/2026",
    },
    {
      id: 2,
      title: "Solicitudes observadas",
      description: "Listado de anteproyectos devueltos con observaciones.",
      tipo: "Seguimiento",
      estado: "Disponible",
      fecha: "06/03/2026",
    },
    {
      id: 3,
      title: "Solicitudes por institución",
      description:
        "Distribución de solicitudes según institución seleccionada.",
      tipo: "Instituciones",
      estado: "Demo",
      fecha: "05/03/2026",
    },
    {
      id: 4,
      title: "Tiempo promedio de revisión",
      description: "Indicadores preliminares del proceso de revisión.",
      tipo: "Métricas",
      estado: "Próximamente",
      fecha: "04/03/2026",
    },
  ];

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();

    return reports.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tipo.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "Todos" || r.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  const total = reports.length;
  const disponibles = reports.filter((r) => r.estado === "Disponible").length;
  const demo = reports.filter((r) => r.estado === "Demo").length;
  const proximamente = reports.filter(
    (r) => r.estado === "Próximamente",
  ).length;

  const displayName = user?.nombre || "Coordinación TCU";
  const displayEmail = user?.email || "coordinacion.tcu@ufide.ac.cr";

  const getInitials = (nameOrEmail) => {
    const text = String(nameOrEmail || "").trim();
    if (!text) return "RP";

    if (text.includes("@")) return text.slice(0, 2).toUpperCase();

    const parts = text.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  };

  const getStatusClass = (estado) => {
    switch (estado) {
      case "Disponible":
        return "bg-emerald-100 text-emerald-700";
      case "Demo":
        return "bg-slate-100 text-slate-700";
      case "Próximamente":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-[rgba(2,14,159,1)] flex items-center justify-center text-white font-bold mr-3">
            A
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              TCU Administración
            </p>
            <p className="text-sm font-semibold text-slate-800">
              Panel de control
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm">
          <SidebarItem
            icon={LuLayoutDashboard}
            label="Dashboard Solicitudes"
            href="/admin"
          />
          <SidebarItem
            icon={LuBuilding}
            label="Instituciones"
            href="/instituciones"
          />
          <SidebarItem icon={LuFile} label="Reportes" href="/reportes" active />
          <SidebarItem
            icon={LuUserCheck}
            label="Coordinadores"
            href="/coordinadores"
          />
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            <LuLogOut className="text-lg" />
            Cerrar sesión
          </button>
        </div>

        <div className="p-4 border-t border-slate-200 text-[11px] text-slate-500">
          © {new Date().getFullYear()} Universidad Fidélitas
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Gestión de reportes TCU
            </p>
            <p className="text-sm md:text-base font-semibold text-slate-800">
              Vista demostrativa del módulo de reportes
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-700">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-500">{displayEmail}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
              {getInitials(displayName)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <SummaryCard
              title="Reportes visibles"
              value={total}
              color="blue"
              icon={<LuFile className="text-lg" />}
            />
            <SummaryCard
              title="Disponibles"
              value={disponibles}
              color="green"
              icon={<LuFileCheck className="text-lg" />}
            />
            <SummaryCard
              title="Demo"
              value={demo}
              color="slate"
              icon={<LuFileText className="text-lg" />}
            />
            <SummaryCard
              title="Próximamente"
              value={proximamente}
              color="yellow"
              icon={<LuClock3 className="text-lg" />}
            />
          </div>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Reportes
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Esta pantalla es una demostración visual del módulo de
                  reportes del sistema TCU.
                </p>
              </div>

              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#ffd600] text-slate-900">
                Demo
              </span>
            </div>

            <div className="p-6">
              <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between mb-5">
                <div className="flex flex-col md:flex-row gap-3 flex-1">
                  <div className="relative w-full md:max-w-md">
                    <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar reporte..."
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-3 py-2 text-sm"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-slate-300 rounded-xl px-3 py-2 text-sm w-full md:w-56"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Demo">Demo</option>
                    <option value="Próximamente">Próximamente</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-sm font-semibold cursor-not-allowed"
                    title="Funcionalidad demostrativa"
                  >
                    <LuDownload className="text-base" />
                    Exportar
                  </button>
                  <span className="text-[11px] text-slate-400">Solo demo</span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-4 text-left">Reporte</th>
                      <th className="p-4 text-left">Tipo</th>
                      <th className="p-4 text-left">Estado</th>
                      <th className="p-4 text-left">Fecha</th>
                      <th className="p-4 text-left">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-6 text-center text-sm text-slate-500"
                        >
                          No se encontraron reportes con los filtros
                          seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((report) => (
                        <tr
                          key={report.id}
                          className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                        >
                          <td className="p-4">
                            <p className="font-semibold text-slate-800">
                              {report.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {report.description}
                            </p>
                          </td>
                          <td className="p-4 text-slate-700">{report.tipo}</td>
                          <td className="p-4">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-[11px] font-semibold ${getStatusClass(
                                report.estado,
                              )}`}
                            >
                              {report.estado}
                            </span>
                          </td>
                          <td className="p-4 text-slate-700">{report.fecha}</td>
                          <td className="p-4">
                            <button
                              type="button"
                              className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-400 text-xs font-semibold cursor-not-allowed"
                              title="Vista demostrativa"
                            >
                              Ver reporte
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, href = "#", active = false }) {
  const base =
    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm transition-colors";
  const stateClasses = active
    ? "bg-[#ffd600] text-gray-800"
    : "text-slate-700 hover:bg-yellow-100";

  return (
    <a href={href} className={`${base} ${stateClasses}`}>
      {Icon && <Icon className="text-lg" />}
      <span>{label}</span>
    </a>
  );
}

function SummaryCard({ title, value, color = "blue", icon }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    yellow: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
