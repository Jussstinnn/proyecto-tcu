import { useState } from "react";
import {
  LuLayoutDashboard,
  LuCalendar,
  LuTicket,
  LuFile,
  LuUsers,
  LuSettings,
} from "react-icons/lu";
import { useSolicitudes } from "../contexts/SolicitudContext";
import SolicitudModal from "../components/SolicitudModal";

export default function AdminDashboard() {
  const { solicitudes, updateSolicitudStatus } = useSolicitudes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  // ====== FILTROS ======
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const openModal = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSolicitud(null);
    setIsModalOpen(false);
  };

  const handleApprove = (observation) => {
    if (selectedSolicitud) {
      updateSolicitudStatus(selectedSolicitud.id, "Aprobado", observation);
      closeModal();
    }
  };

  const handleReject = (observation) => {
    if (selectedSolicitud) {
      updateSolicitudStatus(selectedSolicitud.id, "Rechazado", observation);
      closeModal();
    }
  };

  const handleReturn = (observation) => {
    if (selectedSolicitud) {
      updateSolicitudStatus(selectedSolicitud.id, "Observado", observation);
      closeModal();
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Enviado":
      case "En Revisión":
      case "Open":
        return "bg-blue-100 text-blue-700";
      case "Observado":
        return "bg-yellow-100 text-yellow-700";
      case "Aprobado":
      case "Closed":
        return "bg-green-100 text-green-700";
      case "Rechazado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityClass = (prio) => {
    switch (prio) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ====== APLICAR FILTROS ======
  const filteredSolicitudes = solicitudes.filter((s) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      !searchText ||
      s.id.toLowerCase().includes(searchText) ||
      s.req.toLowerCase().includes(searchText) ||
      (s.subj || "").toLowerCase().includes(searchText);

    const matchesPriority =
      priorityFilter === "all" || s.prio === priorityFilter;

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;

    // formato de fecha "YYYY-MM-DD"
    const matchesFromDate = !fromDate || s.due >= fromDate;
    const matchesToDate = !toDate || s.due <= toDate;

    return (
      matchesSearch &&
      matchesPriority &&
      matchesStatus &&
      matchesFromDate &&
      matchesToDate
    );
  });

  return (
    <>
      {/* LAYOUT PRINCIPAL */}
      <div className="min-h-screen bg-slate-100 flex">
        {/* SIDEBAR ADMIN */}
        <aside className="w-64 bg-[rgba(2,14,159,1)] text-slate-100 flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-blue-900/40">
            <div className="w-9 h-9 rounded-xl bg-[#FFCA00] flex items-center justify-center text-slate-900 font-bold mr-3">
              A
            </div>
            <div>
              <p className="text-xs text-blue-100 uppercase tracking-wide">
                TCU Administración
              </p>
              <p className="text-sm font-semibold">Panel de control</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 text-sm">
            <SidebarItem icon={LuLayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={LuTicket} label="Solicitudes (Tickets)" />
            <SidebarItem
              icon={LuUsers}
              label="Instituciones"
              href="/instituciones"
            />
            <SidebarItem icon={LuFile} label="Reportes" />
            <SidebarItem icon={LuCalendar} label="Calendario" />

            <hr className="border-blue-900/50 my-4" />

            <SidebarItem icon={LuSettings} label="Configuración" />
          </nav>

          <div className="p-4 border-t border-blue-900/40 text-[11px] text-blue-100/80">
            © {new Date().getFullYear()} Universidad Fidélitas
          </div>
        </aside>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex-1 flex flex-col">
          {/* TOPBAR */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Panel administrativo
              </p>
              <p className="text-sm md:text-base font-semibold text-slate-800">
                Bandeja de solicitudes TCU
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-700">
                  Justin Montoya
                </p>
                <p className="text-[11px] text-slate-500">
                  Coordinación TCU (demo)
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                JM
              </div>
            </div>
          </header>

          {/* CONTENIDO */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
            {/* TARJETAS RESUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                title="Total solicitudes"
                value={solicitudes.length}
                color="blue"
              />
              <SummaryCard
                title="Pendientes"
                value={
                  solicitudes.filter(
                    (s) => s.status === "Enviado" || s.status === "Open"
                  ).length
                }
                color="yellow"
              />
              <SummaryCard
                title="Aprobadas"
                value={
                  solicitudes.filter(
                    (s) => s.status === "Aprobado" || s.status === "Closed"
                  ).length
                }
                color="green"
              />
              <SummaryCard
                title="Rechazadas"
                value={
                  solicitudes.filter((s) => s.status === "Rechazado").length
                }
                color="red"
              />
            </div>

            {/* TABLA PRINCIPAL */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Encabezado + filtros */}
              <div className="px-5 pt-4 pb-3 border-b border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Solicitudes recibidas
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Filtra por estudiante, estado, prioridad o rango de fechas.
                  </p>
                </div>

                {/* BARRA DE FILTROS */}
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por ID, estudiante o asunto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-full md:w-64"
                  />

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm w-[140px]"
                  >
                    <option value="all">Todas las prioridades</option>
                    <option value="High">Alta</option>
                    <option value="Medium">Media</option>
                    <option value="Low">Baja</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm w-[160px]"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="Enviado">Enviado</option>
                    <option value="En Revisión">En Revisión</option>
                    <option value="Observado">Observado</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Vencimiento:</span>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm"
                    />
                    <span>-</span>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* TABLA */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Estudiante</th>
                      <th className="p-3 text-left">Asunto</th>
                      <th className="p-3 text-left">Prioridad</th>
                      <th className="p-3 text-left">Estado</th>
                      <th className="p-3 text-left">Vencimiento</th>
                      <th className="p-3 text-left">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSolicitudes.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-3 font-medium text-slate-800">
                          {ticket.id}
                        </td>
                        <td className="p-3 text-slate-700">{ticket.req}</td>
                        <td className="p-3 text-slate-700">{ticket.subj}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full font-medium text-[11px] ${getPriorityClass(
                              ticket.prio
                            )}`}
                          >
                            {ticket.prio}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full font-medium text-[11px] ${getStatusClass(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700">{ticket.due}</td>
                        <td className="p-3 text-slate-700">
                          <button
                            onClick={() => openModal(ticket)}
                            className="text-[rgba(2,14,159,1)] hover:underline font-semibold text-xs"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredSolicitudes.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-6 text-center text-sm text-slate-500"
                        >
                          No se encontraron solicitudes con los filtros
                          seleccionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* MODAL DE SOLICITUD */}
      <SolicitudModal
        isOpen={isModalOpen}
        onClose={closeModal}
        solicitudData={selectedSolicitud}
        onApprove={handleApprove}
        onReject={handleReject}
        onReturn={handleReturn}
      />
    </>
  );
}

/* ========= SIDEBAR ITEM ========= */

function SidebarItem({ icon: Icon, label, active = false, href = "#" }) {
  const base =
    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm transition-colors";
  const stateClasses = active
    ? " bg-slate-900/30 text-white"
    : " text-blue-100/90 hover:bg-slate-900/20";

  return (
    <a href={href} className={base + " " + stateClasses}>
      {Icon && <Icon className="text-lg" />}
      <span>{label}</span>
    </a>
  );
}

/* ========= SUMMARY CARD ========= */

function SummaryCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    yellow: "bg-yellow-50 text-yellow-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
      <div
        className={`px-3 py-2 rounded-xl text-xs font-semibold ${colors[color]}`}
      >
        {title}
      </div>
      <div>
        <p className="text-xs text-slate-500">Total</p>
        <p className="text-2xl font-bold text-slate-900 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
