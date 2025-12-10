import { useState, useEffect } from "react";
import { LuX } from "react-icons/lu";

export default function InstitutionModal({
  isOpen,
  onClose,
  onSave,
  institutionData,
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("");

  const isEditMode = !!institutionData;

  useEffect(() => {
    if (!isOpen) return;

    // Soportar tanto {name, contact, type} como {nombre, contacto_email, tipo_servicio}
    const data = institutionData || {
      name: "",
      contact: "",
      type: "",
    };

    const nombre = data.name || data.nombre || "";
    const contacto = data.contact || data.contacto_email || "";
    const tipo = data.type || data.tipo_servicio || "";

    setName(nombre);
    setContact(contacto);
    setType(tipo);
  }, [isOpen, institutionData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !contact) {
      alert("Por favor, complete el nombre y el contacto.");
      return;
    }

    // Enviamos ambos formatos para compatibilidad
    onSave(
      {
        // formato legacy
        name,
        contact,
        type,
        // formato backend
        nombre: name,
        contacto_email: contact,
        tipo_servicio: type,
      },
      institutionData ? institutionData.id : null
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* CONTENEDOR GRANDE */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {isEditMode ? "Institución registrada" : "Nueva institución TCU"}
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEditMode
                ? "Ver / editar institución"
                : "Registrar nueva institución"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form
          id="institution-form"
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-5"
        >
          {/* fila 1: nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nombre de la institución
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(2,14,159,1)] focus:border-[rgba(2,14,159,1)]"
              placeholder="Ej: Hogar de Ancianos Luz y Vida"
            />
          </div>

          {/* fila 2: contacto + tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Correo de contacto
              </label>
              <input
                id="contact"
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(2,14,159,1)] focus:border-[rgba(2,14,159,1)]"
                placeholder="Ej: ana@luzvida.org"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Tipo de servicio
              </label>
              <input
                id="type"
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(2,14,159,1)] focus:border-[rgba(2,14,159,1)]"
                placeholder="Ej: Cuidado de adulto mayor, Educación, ONG…"
              />
            </div>
          </div>

          {/* NOTA INFORMATIVA */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-600">
            Recordá que solo se aprueban instituciones <b>sin fines de lucro</b>{" "}
            y con alineación al reglamento del TCU (ONGs, municipalidades,
            centros educativos, fundaciones, etc.).
          </div>
        </form>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs md:text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="institution-form"
            className="px-5 py-2 text-xs md:text-sm font-semibold text-white rounded-xl shadow-sm bg-[rgba(2,14,159,1)] hover:bg-indigo-900"
          >
            {isEditMode ? "Actualizar institución" : "Guardar y aprobar"}
          </button>
        </div>
      </div>
    </div>
  );
}
