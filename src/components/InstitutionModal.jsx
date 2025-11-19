

import { useState, useEffect } from "react"; 
import { LuX } from "react-icons/lu";

export default function InstitutionModal({ isOpen, onClose, onSave, institutionData }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("");


  const isEditMode = Boolean(institutionData);

  
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        
        setName(institutionData.name || "");
        setContact(institutionData.contact || "");
        setType(institutionData.type || "");
      } else {
        
        setName("");
        setContact("");
        setType("");
      }
    }
  }, [isOpen, institutionData, isEditMode]); 

  
  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (!name || !contact) {
      alert("Por favor, complete el nombre y el contacto.");
      return;
    }

    
    onSave(
      { name, contact, type }, 
      institutionData ? institutionData.id : null
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      
      {}
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        
        {}
        <div className="flex items-center justify-between pb-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {}
            {isEditMode ? "Ver / Editar Institución" : "Registrar Nueva Institución"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <LuX size={24} />
          </button>
        </div>

        {}
        <form id="institution-form" onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre de la Institución
            </label>
            <input
              type="text"
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ej: Hogar de Ancianos Luz y Vida"
            />
          </div>
          
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Correo de Contacto
            </label>
            <input
              type="email"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ej: ana@luzvida.org"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Tipo de Servicio
            </label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ej: Cuidado de adulto mayor, Educación, etc."
            />
          </div>
        </form>

        {}
        <div className="flex justify-end pt-6 mt-6 space-x-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="institution-form"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {}
            {isEditMode ? "Actualizar" : "Guardar y Aprobar"}
          </button>
        </div>
      </div>
    </div>
  );
}