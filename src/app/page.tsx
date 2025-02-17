import { FaSignInAlt, FaChartBar, FaFileAlt } from "react-icons/fa";
import NavBar from "./components/navbar";

export default function LandingPage() {
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <NavBar />
      
      <div className="w-full bg-gradient-to-br from-blue-50 to-white flex-1 flex items-center justify-center">
        <div className="w-full max-w-3xl px-6">
          {/* Ícone grande centralizado */}
          <div className="flex justify-center mb-8">
            <FaFileAlt className="text-blue-600 w-16 h-16" />
          </div>

          {/* Texto principal */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6 ">
              Gerencie Documentos com <span className="text-blue-600">Eficiência</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Simplifique a tramitação de documentos, aumente a produtividade e 
              mantenha o controle total do fluxo de trabalho.
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex  justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center shadow-lg">
              <FaSignInAlt className="mr-2" /> 
              <a href="/listSetor" className="text-lg font-semibold animate-pulse">Começar Agora</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}