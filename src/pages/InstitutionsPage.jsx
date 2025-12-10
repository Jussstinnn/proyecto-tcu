import { useEffect, useState } from "react";
import {
  LuLayoutDashboard,
  LuTicket,
  LuUsers,
  LuFile,
  LuCalendar,
  LuSettings,
} from "react-icons/lu";
import InstitutionModal from "../components/InstitutionModal";
import api from "../api/apiClient";

const getStatusClass = (status) => {
  switch (status) {
    case "Aprobada":
      return "bg-emerald-100 text-emerald-700";
    case "Pendiente":
      return "bg-yellow-100 text-yellow-700";
    case "Rechazada":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  // ====== FILTROS ======
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Cargar instituciones desde el backend
  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/instituciones");
      setInstitutions(res.data); // se espera [{id, nombre, contacto_email, tipo_servicio, estado}, ...]
    } catch (err) {
      console.error("Error cargando instituciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const openModal = (institution) => {
    setSelectedInstitution(institution);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInstitution(null);
    setIsModalOpen(false);
  };

  const handleApprove = async (id) => {
    try {
      const res = await api.patch(`/instituciones/${id}/status`, {
        estado: "Aprobada",
      });
      const updated = res.data;
      setInstitutions((current) =>
        current.map((inst) => (inst.id === updated.id ? updated : inst))
      );
    } catch (err) {
      console.error("Error aprobando institución:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.patch(`/instituciones/${id}/status`, {
        estado: "Rechazada",
      });
      const updated = res.data;
      setInstitutions((current) =>
        current.map((inst) => (inst.id === updated.id ? updated : inst))
      );
    } catch (err) {
      console.error("Error rechazando institución:", err);
    }
  };

  // Guardar desde el modal (crear / editar)
  const handleSave = async (formData, id) => {
    try {
      if (id) {
        // editar
        const payload = {
          nombre: formData.nombre,
          contacto_email: formData.contacto_email,
          tipo_servicio: formData.tipo_servicio,
        };
        const res = await api.put(`/instituciones/${id}`, payload);
        const updated = res.data;
        setInstitutions((current) =>
          current.map((inst) => (inst.id === updated.id ? updated : inst))
        );
      } else {
        // crear
        const payload = {
          nombre: formData.nombre,
          contacto_email: formData.contacto_email,
          tipo_servicio: formData.tipo_servicio,
        };
        const res = await api.post("/instituciones", payload);
        const nueva = res.data;
        setInstitutions((current) => [nueva, ...current]);
      }
      closeModal();
    } catch (err) {
      console.error("Error guardando institución:", err);
      alert("No se pudo guardar la institución. Intente de nuevo.");
    }
  };

  // ====== APLICAR FILTROS ======
  const filteredInstitutions = institutions.filter((inst) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      !searchText ||
      inst.nombre.toLowerCase().includes(searchText) ||
      inst.contacto_email.toLowerCase().includes(searchText) ||
      (inst.tipo_servicio || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || inst.estado === statusFilter;

    const matchesType =
      typeFilter === "all" ||
      (inst.tipo_servicio || "").toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  // tipos únicos para el combo
  const uniqueTypes = Array.from(
    new Set(institutions.map((i) => i.tipo_servicio).filter(Boolean))
  );

  // ====== RESÚMENES ======
  const total = institutions.length;
  const approved = institutions.filter((i) => i.estado === "Aprobada").length;
  const pending = institutions.filter((i) => i.estado === "Pendiente").length;
  const rejected = institutions.filter((i) => i.estado === "Rechazada").length;

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex">
        {/* SIDEBAR (igual estilo que AdminDashboard) */}
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
              label="Dashboard"
              href="/admin"
            />
            <SidebarItem
              icon={LuTicket}
              label="Solicitudes (Tickets)"
              href="/admin"
            />
            <SidebarItem
              icon={LuUsers}
              label="Instituciones"
              href="/instituciones"
              active
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
                Gestión de instituciones TCU
              </p>
              <p className="text-sm md:text-base font-semibold text-slate-800">
                Catálogo de instituciones aliadas
              </p>
            </div>

            <button
              onClick={() => openModal(null)}
              className="px-4 py-2 bg-[rgba(2,14,159,1)] text-white text-xs md:text-sm font-semibold rounded-xl shadow-sm hover:bg-indigo-900"
            >
              + Registrar institución
            </button>
          </header>

          {/* CONTENIDO */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
            {/* TARJETAS RESUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                title="Total instituciones"
                value={total}
                color="blue"
              />
              <SummaryCard title="Aprobadas" value={approved} color="green" />
              <SummaryCard title="Pendientes" value={pending} color="yellow" />
              <SummaryCard title="Rechazadas" value={rejected} color="red" />
            </div>

            {/* TABLA + FILTROS */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Header + filtros */}
              <div className="px-5 pt-4 pb-3 border-b border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Instituciones registradas
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Filtra por nombre, tipo de servicio o estado.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, contacto o tipo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-full md:w-72"
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm w-[160px]"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="Aprobada">Aprobadas</option>
                    <option value="Pendiente">Pendientes</option>
                    <option value="Rechazada">Rechazadas</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm w-[180px]"
                  >
                    <option value="all">Todos los tipos</option>
                    {uniqueTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TABLA */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-3 text-left">Nombre de institución</th>
                      <th className="p-3 text-left">Contacto</th>
                      <th className="p-3 text-left">Tipo de servicio</th>
                      <th className="p-3 text-left">Estado</th>
                      <th className="p-3 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-6 text-center text-sm text-slate-500"
                        >
                          Cargando instituciones...
                        </td>
                      </tr>
                    )}

                    {!loading &&
                      filteredInstitutions.map((inst) => (
                        <tr
                          key={inst.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-3 text-slate-800 font-medium">
                            {inst.nombre}
                          </td>
                          <td className="p-3 text-slate-700">
                            {inst.contacto_email}
                          </td>
                          <td className="p-3 text-slate-700">
                            {inst.tipo_servicio}
                          </td>
                          <td className="p-3 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full font-medium text-[11px] ${getStatusClass(
                                inst.estado
                              )}`}
                            >
                              {inst.estado}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-slate-700 space-x-3">
                            {inst.estado === "Pendiente" && (
                              <>
                                <button
                                  onClick={() => handleApprove(inst.id)}
                                  className="text-emerald-600 hover:text-emerald-800 font-semibold text-xs"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => handleReject(inst.id)}
                                  className="text-red-600 hover:text-red-800 font-semibold text-xs"
                                >
                                  Rechazar
                                </button>
                              </>
                            )}
                            {inst.estado !== "Pendiente" && (
                              <button
                                onClick={() => openModal(inst)}
                                className="text-[rgba(2,14,159,1)] hover:underline font-semibold text-xs"
                              >
                                Ver / editar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}

                    {!loading && filteredInstitutions.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-6 text-center text-sm text-slate-500"
                        >
                          No se encontraron instituciones con los filtros
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

      {/* MODAL */}
      <InstitutionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        institutionData={selectedInstitution}
      />
    </>
  );
}

/* ========= COMPONENTES DE APOYO ========= */

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
