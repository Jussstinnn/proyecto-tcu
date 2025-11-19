

import { useState } from "react"; 
import { LuLayoutDashboard, LuTicket, LuUsers, LuFile, LuCalendar, LuSettings } from "react-icons/lu";
import InstitutionModal from "../components/InstitutionModal";

const initialInstitutions = [
  { id: 1, name: "Hogar de Ancianos Luz y Vida", contact: "ana@luzvida.org", type: "Cuidado de adulto mayor", status: "Pendiente" },
  { id: 2, name: "Escuela El Porvenir", contact: "director@porvenir.me.cr", type: "Educación", status: "Aprobada" },
  { id: 3, name: "Refugio Animal de Cartago", contact: "info@refugiocartago.org", type: "Bienestar animal", status: "Aprobada" },
  { id: 4, name: "Municipalidad de Curridabat", contact: "proveeduria@curridabat.go.cr", type: "Gubernamental", status: "Rechazada" },
  { id: 5, name: "Comedor Semillitas", contact: "info@semillitas.org", type: "Ayuda social", status: "Pendiente" },
];

const getStatusClass = (status) => {
  switch (status) {
    case 'Aprobada': return 'bg-green-100 text-green-700';
    case 'Pendiente': return 'bg-yellow-100 text-yellow-700';
    case 'Rechazada': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState(initialInstitutions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  
  
  const openModal = (institution) => {
    setSelectedInstitution(institution); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInstitution(null); 
    setIsModalOpen(false);
  };

  const handleApprove = (id) => {
    setInstitutions(current => 
      current.map(inst => inst.id === id ? { ...inst, status: "Aprobada" } : inst)
    );
  };

  const handleReject = (id) => {
    setInstitutions(current => 
      current.map(inst => inst.id === id ? { ...inst, status: "Rechazada" } : inst)
    );
  };


  const handleSave = (formData, id) => {
    if (id) {
      
      setInstitutions(current => 
        current.map(inst => 
          inst.id === id ? { ...inst, ...formData } : inst
        )
      );
    } else {
      
      const newId = Math.max(...institutions.map(i => i.id)) + 1;
      const newInstitution = {
        ...formData,
        id: newId,
        status: "Aprobada", 
      };
      setInstitutions(current => [newInstitution, ...current]);
    }
    
    closeModal();
  };

  return (
    <> 
      <div className="flex h-screen bg-gray-100">
        
        {}
        <aside className="w-64 bg-gray-900 text-gray-300 p-6 flex flex-col">
          {}
          <h1 className="text-white text-2xl font-bold mb-8">TCU Admin</h1>
          <nav className="flex-1">
            <ul className="space-y-3">
              <li>
                <a href="/admin" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700">
                  <LuLayoutDashboard /> <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="/admin" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700">
                  <LuTicket /> <span>Solicitudes (Tickets)</span>
                </a>
              </li>
              <li>
                <a href="/instituciones" className="flex items-center space-x-3 p-2 rounded-md bg-blue-600 text-white">
                  <LuUsers /> <span>Instituciones</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700">
                  <LuFile /> <span>Reportes</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700">
                  <LuCalendar /> <span>Calendario</span>
                </a>
              </li>
              <hr className="border-gray-700 my-4" />
              <li>
                <a href="#" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700">
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
          {}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Instituciones</h1>
            <button
              onClick={() => openModal(null)} 
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
            >
              + Registrar Nueva
            </button>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Nombre de Institución</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Contacto</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Estado</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map((inst) => (
                  <tr key={inst.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-800 font-medium">{inst.name}</td>
                    <td className="p-4 text-sm text-gray-700">{inst.contact}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-3 py-1 rounded-full font-medium text-xs ${getStatusClass(inst.status)}`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700 space-x-3">
                      {inst.status === 'Pendiente' && (
                        <>
                          <button
                            onClick={() => handleApprove(inst.id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleReject(inst.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      {inst.status !== 'Pendiente' && (
                        <button 
                          onClick={() => openModal(inst)} 
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Ver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {}
      <InstitutionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSave}
        institutionData={selectedInstitution} 
      />
    </>
  );
}