import { useEffect, useState } from "react";
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
  const {
    solicitudes,
    loading,
    fetchAllSolicitudes,
    updateSolicitudStatus,
    assignReviewer,
  } = useSolicitudes();

  // Cargar solicitudes al entrar al dashboard
  useEffect(() => {
    fetchAllSolicitudes().catch((err) =>
      console.error("Error cargando solicitudes:", err)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("AdminDashboard - total solicitudes:", solicitudes.length);
  console.log("AdminDashboard - solicitudes:", solicitudes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  // ====== FILTROS ======
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("all");

  // Lista de revisores demo (luego se puede cargar de BD)
  const reviewers = [
    "admin.revisor@ufidelitas.ac.cr",
    "coordinacion.tcu@ufidelitas.ac.cr",
    "revisor1@ufidelitas.ac.cr",
  ];

  const openModal = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSolicitud(null);
    setIsModalOpen(false);
  };

  const handleApprove = async (observation) => {
    if (!selectedSolicitud) return;
    await updateSolicitudStatus(selectedSolicitud.id, "Aprobado", observation);
    closeModal();
  };

  const handleReject = async (observation) => {
    if (!selectedSolicitud) return;
    await updateSolicitudStatus(selectedSolicitud.id, "Rechazado", observation);
    closeModal();
  };

  const handleReturn = async (observation) => {
    if (!selectedSolicitud) return;
    await updateSolicitudStatus(selectedSolicitud.id, "Observado", observation);
    closeModal();
  };

  const handleAssign = async (solicitudId, reviewer) => {
    if (!reviewer) return;
    await assignReviewer(solicitudId, reviewer);
  };

  // ====== HELPERS PARA CLASES ======
  const getStatusClass = (estado) => {
    switch (estado) {
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

  const getAssignedClass = (assigned_to) => {
    if (!assigned_to) return "bg-slate-100 text-slate-700";
    return "bg-purple-100 text-purple-700";
  };

  // ====== APLICAR FILTROS (usando campos de la BD) ======
  const filteredSolicitudes = solicitudes.filter((s) => {
    const searchText = search.toLowerCase();

    const subjectBase =
      s.objetivo_general ||
      s.subj ||
      "Anteproyecto de Trabajo Comunal Universitario";

    const matchesSearch =
      !searchText ||
      (s.codigo_publico || String(s.id)).toLowerCase().includes(searchText) ||
      (s.estudiante_nombre || "").toLowerCase().includes(searchText) ||
      subjectBase.toLowerCase().includes(searchText);

    const matchesPriority =
      priorityFilter === "all" || s.prioridad === priorityFilter;

    const matchesStatus = statusFilter === "all" || s.estado === statusFilter;

    const due = s.vencimiento; // DATE 'YYYY-MM-DD'
    const matchesFromDate = !fromDate || (due && due >= fromDate);
    const matchesToDate = !toDate || (due && due <= toDate);

    const matchesAssigned =
      assignedFilter === "all" ||
      (assignedFilter === "unassigned" && !s.assigned_to) ||
      (assignedFilter === "assigned" && !!s.assigned_to);

    return (
      matchesSearch &&
      matchesPriority &&
      matchesStatus &&
      matchesFromDate &&
      matchesToDate &&
      matchesAssigned
    );
  });

  // ====== RESÚMENES (usando estado de la BD) ======
  const total = solicitudes.length;
  const pendientes = solicitudes.filter(
    (s) => s.estado === "Enviado" || s.estado === "Open"
  ).length;
  const aprobadas = solicitudes.filter(
    (s) => s.estado === "Aprobado" || s.estado === "Closed"
  ).length;
  const rechazadas = solicitudes.filter((s) => s.estado === "Rechazado").length;

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex">
        {/* SIDEBAR ADMIN */}
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
            <SidebarItem icon={LuLayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={LuTicket} label="Solicitudes (Tickets)" />
            <SidebarItem
              icon={LuUsers}
              label="Instituciones"
              href="/instituciones"
            />
            <SidebarItem icon={LuFile} label="Reportes" />
            <SidebarItem icon={LuCalendar} label="Calendario" />
            <SidebarItem icon={LuSettings} label="Configuración" />
          </nav>

          <div className="p-4 border-t border-slate-200 text-[11px] text-slate-500">
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
                  Eddier Soto Vargas
                </p>
                <p className="text-[11px] text-slate-500">Coordinación TCU</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                ES
              </div>
            </div>
          </header>

          {/* CONTENIDO */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
            {/* TARJETAS RESUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                title="Total solicitudes"
                value={total}
                color="blue"
              />
              <SummaryCard
                title="Pendientes"
                value={pendientes}
                color="yellow"
              />
              <SummaryCard title="Aprobadas" value={aprobadas} color="green" />
              <SummaryCard title="Rechazadas" value={rechazadas} color="red" />
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
                    Filtra por estudiante, estado, prioridad, revisor o rango de
                    fechas.
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

                  <select
                    value={assignedFilter}
                    onChange={(e) => setAssignedFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm w-[160px]"
                  >
                    <option value="all">Todos los casos</option>
                    <option value="unassigned">Sin asignar</option>
                    <option value="assigned">Asignados</option>
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
                      <th className="p-3 text-left">Revisor</th>
                      <th className="p-3 text-left">Vencimiento</th>
                      <th className="p-3 text-left">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td
                          colSpan={8}
                          className="p-6 text-center text-sm text-slate-500"
                        >
                          Cargando solicitudes...
                        </td>
                      </tr>
                    )}

                    {!loading &&
                      filteredSolicitudes.map((ticket) => {
                        const subjectBase =
                          ticket.objetivo_general ||
                          ticket.subj ||
                          "Anteproyecto de Trabajo Comunal Universitario";

                        return (
                          <tr
                            key={ticket.id}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-3 font-medium text-slate-800">
                              {ticket.codigo_publico || ticket.id}
                            </td>
                            <td className="p-3 text-slate-700">
                              {ticket.estudiante_nombre}
                            </td>
                            <td className="p-3 text-slate-700">
                              {subjectBase}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-3 py-1 rounded-full font-medium text-[11px] ${getPriorityClass(
                                  ticket.prioridad
                                )}`}
                              >
                                {ticket.prioridad}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-3 py-1 rounded-full font-medium text-[11px] ${getStatusClass(
                                  ticket.estado
                                )}`}
                              >
                                {ticket.estado}
                              </span>
                            </td>
                            <td className="p-3 text-slate-700">
                              <div className="flex flex-col gap-1">
                                <span
                                  className={`inline-flex px-2 py-1 rounded-full text-[11px] font-medium ${getAssignedClass(
                                    ticket.assigned_to
                                  )}`}
                                >
                                  {ticket.assigned_to
                                    ? ticket.assigned_to
                                    : "Sin asignar"}
                                </span>
                                <select
                                  value={ticket.assigned_to || ""}
                                  onChange={(e) =>
                                    handleAssign(ticket.id, e.target.value)
                                  }
                                  className="mt-1 border border-slate-300 rounded-lg px-2 py-1 text-[11px] text-slate-700"
                                >
                                  <option value="">Asignar revisor...</option>
                                  {reviewers.map((rev) => (
                                    <option key={rev} value={rev}>
                                      {rev}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                            <td className="p-3 text-slate-700">
                              {ticket.vencimiento}
                            </td>
                            <td className="p-3 text-slate-700">
                              <button
                                onClick={() => openModal(ticket)}
                                className="text-[rgba(2,14,159,1)] hover:underline font-semibold text-xs"
                              >
                                Ver detalle
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                    {!loading && filteredSolicitudes.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
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
    ? " bg-[#ffd600] text-gray-800"
    : " text-slate-700 hover:bg-yellow-100";

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
