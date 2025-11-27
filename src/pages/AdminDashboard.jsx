import { useState } from "react";
import {
  LuLayoutDashboard,
  LuMail,
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

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {}
        <aside
          className="w-64 text-gray-100 p-6 flex flex-col"
          style={{ backgroundColor: "rgba(2, 14, 159, 1)" }}
        >
          {}
          <h1 className="text-white text-2xl font-bold mb-8">TCU Admin</h1>
          <nav className="flex-1">
            <ul className="space-y-3">
              <li>
                <a
                  href="/admin"
                  className="flex items-center space-x-3 p-2 rounded-md bg-yellow-500 text-white"
                >
                  <LuLayoutDashboard /> <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="flex items-center space-x-3 p-2 rounded-md hover:text-[#ffd600]"
                >
                  <LuTicket /> <span>Solicitudes (Tickets)</span>
                </a>
              </li>
              <li>
                <a
                  href="/instituciones"
                  className="flex items-center space-x-3 p-2 rounded-md hover:text-[#ffd600]"
                >
                  <LuUsers /> <span>Instituciones</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 p-2 rounded-md hover:text-[#ffd600]"
                >
                  <LuFile /> <span>Reportes</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 p-2 rounded-md hover:text-[#ffd600]"
                >
                  <LuCalendar /> <span>Calendario</span>
                </a>
              </li>
              <hr className="border-gray-700 my-4" />
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-3 p-2 rounded-md hover:text-[#ffd600]"
                >
                  <LuSettings /> <span>Configuración</span>
                </a>
              </li>
            </ul>
          </nav>
          <div className="mt-auto text-sm">
            <p>&copy; {new Date().getFullYear()} U Fidélitas</p>
          </div>
        </aside>

        {}
        <main className="flex-1 p-8 overflow-y-auto">
          <div>
            {}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Bandeja de Solicitudes
              </h1>
              <div className="flex items-center space-x-4">
                <span className="font-medium">Justin Montoya</span>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SummaryCard
                title="Total Solicitudes"
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

            {}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                {}
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      ID
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Estudiante
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Asunto
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Prioridad
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Estado
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Vencimiento
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {}
                      <td className="p-4 text-sm text-gray-800 font-medium">
                        {ticket.id}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {ticket.req}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {ticket.subj}
                      </td>
                      <td className="p-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full font-medium text-xs ${getPriorityClass(ticket.prio)}`}
                        >
                          {ticket.prio}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full font-medium text-xs ${getStatusClass(ticket.status)}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {ticket.due}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        <button
                          onClick={() => openModal(ticket)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {}
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

function SummaryCard({ title, value, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    yellow: "text-yellow-600 bg-yellow-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div
      className={`p-6 bg-white rounded-xl shadow-md flex items-center space-x-4`}
    >
      <div className={`p-3 rounded-full ${colors[color]}`}>{}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
