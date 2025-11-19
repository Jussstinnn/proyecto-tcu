

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuUser, LuTarget, LuBuilding, LuFileText, LuCheck } from "react-icons/lu";
import { useSolicitudes } from "../contexts/SolicitudContext";

import StudentStatusPage from "./StudentStatusPage";


const initialFormData = {
  nombre: "Justin Montoya",
  cedula: "1-1234-5678",
  carrera: "",
  institucion: "",
  justificacion: "",
  objetivoGeneral: "",
  objetivosEspecificos: "",
};

function StudentWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  
  const { addSolicitud } = useSolicitudes();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) { 
      setCurrentStep(currentStep + 1);
    } else {
     
      if (!formData.objetivoGeneral || !formData.institucion) {
        alert("Por favor, complete al menos la institución y el objetivo general.");
        return;
      }
      
      addSolicitud(formData);
      
      alert("¡Solicitud enviada con éxito!");
      
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, name: "Datos Personales", icon: LuUser },
    { id: 2, name: "Institución", icon: LuBuilding },
    { id: 3, name: "Objetivos y Proyecto", icon: LuTarget },
    { id: 4, name: "Documentos", icon: LuFileText },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
        {}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Inscripción de Trabajo Comunal Universitario (TCU)
          </h1>
          <nav className="flex items-center justify-between">
            {steps.map((step, index) => {
              const stepIndex = index + 1;
              const isCompleted = stepIndex < currentStep;
              const isActive = stepIndex === currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${isCompleted ? 'bg-green-500 text-white' : ''} ${isActive ? 'bg-blue-600 text-white' : ''} ${!isCompleted && !isActive ? 'bg-gray-200 text-gray-600' : ''}`}>
                    {isCompleted ? <LuCheck /> : <step.icon />}
                  </div>
                  <p className={`mt-2 text-xs font-semibold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.name}
                  </p>
                </div>
              );
            })}
          </nav>
        </div>

        {}
        <div className="p-8">
          {currentStep === 1 && (<Step1_DatosPersonales formData={formData} handleChange={handleChange} />)}
          {currentStep === 2 && (<Step2_Institucion formData={formData} handleChange={handleChange} />)}
          {currentStep === 3 && (<Step3_Objetivos formData={formData} handleChange={handleChange} />)}
          {currentStep === 4 && <Step4_Documentos />}
        </div>

        {}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button onClick={handleBack} disabled={currentStep === 1} className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md disabled:opacity-50 hover:bg-gray-400">
            Atrás
          </button>
          <button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
            {currentStep === steps.length ? "Finalizar y Enviar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}



export default function StudentPortal() {
  const { getMySolicitud } = useSolicitudes();
  
  
  const mySolicitud = getMySolicitud();

 
  return mySolicitud ? <StudentStatusPage solicitud={mySolicitud} /> : <StudentWizard />;
}




function Step1_DatosPersonales({ formData, handleChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Paso 1: Datos Personales y Académicos</h3>
      <div className="grid grid-cols-2 gap-4">
        <input name="nombre" value={formData.nombre} onChange={handleChange} type="text" placeholder="Nombre Completo" className="p-2 border rounded-md bg-gray-100" readOnly />
        <input name="cedula" value={formData.cedula} onChange={handleChange} type="text" placeholder="Cédula" className="p-2 border rounded-md" />
        <select name="carrera" value={formData.carrera} onChange={handleChange} className="p-2 border rounded-md col-span-2">
          <option value="">Selecciona tu carrera</option>
          <option value="Ingeniería de Software">Ingeniería de Software</option>
          <option value="Administración">Administración</option>
        </select>
      </div>
    </div>
  );
}
function Step2_Institucion({ formData, handleChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Paso 2: Selección de Institución</h3>
      <select name="institucion" value={formData.institucion} onChange={handleChange} className="p-2 border rounded-md w-full mb-4">
        <option value="">Instituciones Habilitadas (Cargadas de la BD)</option>
        <option value="Hogar de Ancianos Luz y Vida">Hogar de Ancianos Luz y Vida</option>
        <option value="Escuela El Porvenir">Escuela El Porvenir</option>
        <option value="[NUEVA] Otra institución">[NUEVA] Otra institución (registrar)</option>
      </select>
    </div>
  );
}
function Step3_Objetivos({ formData, handleChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Paso 3: Objetivos y Justificación</h3>
      <div className="space-y-4">
        <textarea name="justificacion" value={formData.justificacion} onChange={handleChange} placeholder="Justificación del proyecto" className="w-full p-2 border rounded-md h-24"></textarea>
        <textarea name="objetivoGeneral" value={formData.objetivoGeneral} onChange={handleChange} placeholder="Objetivo General" className="w-full p-2 border rounded-md h-20"></textarea>
        <textarea name="objetivosEspecificos" value={formData.objetivosEspecificos} onChange={handleChange} placeholder="Objetivos Específicos (uno por línea)" className="w-full p-2 border rounded-md h-24"></textarea>
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="font-bold text-yellow-800">Asistente IA</p>
          <p className="text-sm text-yellow-700">
            “Tu objetivo general no especifica la comunidad beneficiada. ¿Deseas mejorar esta redacción?”
          </p>
        </div>
      </div>
    </div>
  );
}
function Step4_Documentos() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Paso 4: Adjuntar Documentos Requeridos</h3>
      <div className="space-y-4">
        <div className="p-4 border-2 border-dashed rounded-md text-center">
          <label className="cursor-pointer">
            <span className="text-blue-600 font-medium">Adjuntar Constancia de Matrícula (PDF)</span>
            <input type="file" className="hidden" />
          </label>
        </div>
        <div className="p-4 border-2 border-dashed rounded-md text-center">
          <label className="cursor-pointer">
            <span className="text-blue-600 font-medium">Adjuntar Copia de Cédula (PDF o JPG)</span>
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}