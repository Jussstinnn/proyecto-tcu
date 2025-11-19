

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPortal from "./pages/StudentPortal";
import InstitutionsPage from "./pages/InstitutionsPage.jsx"; 

import { SolicitudProvider } from "./contexts/SolicitudContext";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Proyecto TCU</h1>
      <div className="flex space-x-4">
        <Link 
          to="/admin" 
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
        >
          Ir al Dashboard de Admin
        </Link>
        <Link 
          to="/portal" 
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
        >
          Ir al Portal de Estudiante
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
   
    <SolicitudProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/portal" element={<StudentPortal />} />
          <Route path="/instituciones" element={<InstitutionsPage />} />
        </Routes>
      </BrowserRouter>
    </SolicitudProvider>
  );
}

export default App;