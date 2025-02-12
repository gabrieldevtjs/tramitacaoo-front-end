"use client"  
import { useState } from "react"
import NavBar from "./components/navbar";  // Importa o componente NavBar, responsável pela barra de navegação
import { FaFilter, FaCalendarAlt } from "react-icons/fa";  // Importa ícones de filtro e calendário da biblioteca react-icons


export default function Home() {

  // Declaração de variáveis de estado utilizando o useState
  const [selectedEnvio, setSelectedEnvio] = useState("");  // Estado que armazena o valor do filtro "Setor de Envio"
  const [selectedRecebimento, setSelectedRecebimento] = useState("");  // Estado que armazena o valor do filtro "Setor de Recebimento"
  const [selectedDate, setSelectedDate] = useState("");  // Estado que armazena o valor do filtro "Data"

  // Dados simulados representando os documentos
  const data = [
    {
      id: 1,  
      Ndocumento: "0001/2024",
      titulo: "Solicitção de compras", 
      setorEnvio: "Setor de tecnologia", 
      dataHoraEnvio: "23/03/2024 - 11:54",
      setorRecebimento: "Setor De Compras", 
      dataHoraRecebimento: "23/03/2024 - 11:54", 
      anexo: "", 
      acoes: "", 
    },
  
  ];

  return (
    <>
      {/* Layout da página */}
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        
        {/* Barra de navegação */}
        <NavBar />
        
         {/* Container principal para o conteúdo da página */}
        <div className="w-full bg-gray-300 flex-1 px-4">
         
          <div className="w-full flex flex-col bg-white h-auto rounded-lg mt-6 px-2">
            <div className="flex justify-center mt-4">
              <p className="font-semibold">GERENCIAMENTO DE DOCUMENTOS</p>
            </div>

            {/* Filtros de pesquisa */}
            <div className="flex flex-col mt-6 px-4">
              

              {/* Filtros e tabelas para Gerencimento de Documentos*/}
              <div className="mt-8 overflow-x-auto">
                <div className="flex items-center gap-6">
                
                  {/* Filtro de Setor de Envio */}
                  <div className="relative w-64">
                    <FaFilter className="absolute left-3 top-3 text-gray-500" />
                    <select
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-xs"
                      value={selectedEnvio}
                      onChange={(e) => setSelectedEnvio(e.target.value)}
                    >
                      <option value="">Filtrar por Setor de Envio</option>
                      <option value="Setor de Tecnologia">Setor de Tecnologia</option>
                      <option value="Setor de Compras">Setor de Compras</option>
                      <option value="Setor Financeiro">Setor Financeiro</option>
                    </select>
                  </div>

                  {/* Filtro de Setor de Recebimento */}
                  <div className="relative w-64">
                    <FaFilter className="absolute left-3 top-3 text-gray-500" />
                    <select
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-xs"
                      value={selectedRecebimento}
                      onChange={(e) => setSelectedRecebimento(e.target.value)}
                    >
                      <option value="">Filtrar por Setor de Recebimento</option>
                      <option value="Setor de Tecnologia">Setor de Tecnologia</option>
                      <option value="Setor de Compras">Setor de Compras</option>
                      <option value="Setor Financeiro">Setor Financeiro</option>
                    </select>
                  </div>

                  {/* Filtro de Data */}
                  <div className="relative w-52">
                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="date"  
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-xs"
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}  
                    />
                  </div>
                </div>

                {/* Tabela de documentos */}
                <table className="w-full border-2 text-xs mt-2">
                  <thead>
                    {/* Cabeçalho da tabela */}
                    <tr>
                      <th className="border-b-2 p-2 text-left">N Documento</th>  
                      <th className="border-b-2 p-2 text-left">Título</th>  
                      <th className="border-b-2 p-2 text-left">Setor Envio</th>  
                      <th className="border-b-2 p-2 text-left">Data/Hora - Envio</th>
                      <th className="border-b-2 p-2 text-left">Setor Recebimento</th>
                      <th className="border-b-2 p-2 text-left">Data/Hora - Recebimento</th>
                      <th className="border-b-2 p-2 text-left">Anexo</th> 
                      <th className="border-b-2 p-2 text-left">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                   {/* Colunas*/}
                    {data.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border-b-2 p-2">{item.Ndocumento}</td>
                        <td className="border-b-2 p-2">{item.titulo}</td>
                        <td className="border-b-2 p-2">{item.setorEnvio}</td>
                        <td className="border-b-2 p-2">{item.dataHoraEnvio}</td>
                        <td className="border-b-2 p-2">{item.setorRecebimento}</td>
                        <td className="border-b-2 p-2">{item.dataHoraRecebimento}</td>
                        <td className="border-b-2 p-2">{item.anexo}</td>
                        <td className="border-b-2 p-2">{item.acoes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}