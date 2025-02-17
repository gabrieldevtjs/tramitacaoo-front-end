"use client";
import { ReactElement, useEffect, useState } from "react";
import NavBar from "../components/navbar";
import { LuPencil } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function Home() {
 // Estados para gerenciamento de dados de setores
 const [data, setData] = useState<any[]>([]); 
 
 // Estados de controle de formulários modal
 const [showForm, setShowForm] = useState(false);
 const [showFormUpdate, setShowFormUpdate] = useState(false);
 
 // Estados para campos de criação de setor
 const [createSetor, setCreateSetor] = useState("");
 const [createDescrição, setCreateDescrição] = useState("");
 const [createResponsável, setCreateResponsavel] = useState("");
 
 // Estados para campos de atualização de setor
 const [updateSetor, setUpdateSetor] = useState("");
 const [updateDescrição, setUpdateDescricao] = useState("");
 const [updateResponsável, setUpdateResponsavel] = useState("");
 
 // Estados de gerenciamento de paginação
 const [id, setIdUpdate] = useState<number | null>(null);
 const [lengthDocumentos, setLengthDocumentos] = useState<number>(0);
 const [offset, setOffset] = useState<number>(0);
 const [limit, setLimit] = useState<number>(5);

 /**
  * Busca dados dos setores com suporte a paginação
  * Recupera lista de setores do backend
  */
 const fetchData = async () => {
   try {
     // Construção da URL com parâmetros de paginação
     const urlData = `http://localhost:4000/setor?offset=${offset}&limit=${limit}`;
     
     const result = await fetch(urlData, {
       method: "GET",
       headers: { "Content-Type": "application/json" },
     });

     // Tratamento de erro de requisição
     if (!result.ok) {
       console.error("Erro na requisição");
       return;
     }

     // Processamento da resposta
     const responseData = await result.json();
     setLengthDocumentos(responseData.totalCount);
     setData(responseData.data);
   } catch (error) {
     console.error("Erro ao buscar dados:", error);
   }
 };

 /**
  * Cria novo setor no backend
  * @param ev Evento de submissão do formulário
  */
 const handleCreateSetor = async (ev: React.FormEvent) => {
   ev.preventDefault();
   const url: string = "http://localhost:4000/setor/create";
   const data = { 
     sigla: createSetor,
     descricao: createDescrição,
     responsavel: createResponsável
   };

   try {
     const response = await fetch(url, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(data)
     });

     if (!response.ok) {
       console.log("erro na requisição");
       return;
     } 

     console.log("sucesso");
     handleCloseForm();
     fetchData();
   } catch (error) {
     console.log("erro no servidor", error);
   }
 };

 /**
  * Atualiza setor existente no backend
  * @param ev Evento de submissão do formulário
  */
 const handleUpdateSetor = async (ev: React.FormEvent) => {
   ev.preventDefault();
   const url = `http://localhost:4000/setor/update/${id}`;

   const data = { 
     sigla: updateSetor,
     description: updateDescrição,
     responsavel: updateResponsável
   };

   try {
     const response = await fetch(url, {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(data)
     });

     if (!response.ok) {
       console.error("Erro na requisição");
       return;
     }

     console.log("Setor atualizado com sucesso!");
     setIdUpdate(null);
     handleCloseUpdateForm();
     fetchData();
   } catch (error) {
     console.error("Erro no servidor:", error);
   }
 };

 /**
  * Exclui setor no backend
  * @param ev Evento de submissão
  * @param id Identificador do setor
  */
 const deleteSetor = async (ev: React.FormEvent, id: number) => {
   ev.preventDefault();
   const url: string = `http://localhost:4000/setor/delete/${id}`;
   
   try {
     const response = await fetch(url, {
       headers: { "Content-Type": "application/json" },
       method: "DELETE"
     });
     
     if (!response.ok) {
       console.log("erro na requisição");
       return;
     }
     
     fetchData();
   } catch (error) {
     console.log(error);
   }
 };

 // Atualiza dados quando limite ou offset são modificados
 useEffect(() => {
   fetchData();
 }, [limit, offset]);

 /**
  * Alterna visibilidade do formulário de criação
  */
 const handleCloseForm = () => {
   setShowForm(!showForm);
 };

 /**
  * Alterna visibilidade do formulário de atualização
  */
 const handleCloseUpdateForm = () => {
   setShowFormUpdate(!showFormUpdate);
 };

 /**
  * Incrementa offset para próxima página
  * Respeita limite total de documentos
  */
 const alterAddOffset = () => {
   if (offset + limit < lengthDocumentos) {
     setOffset(offset + limit);
   }
 };

 /**
  * Decrementa offset para página anterior
  * Impede valores negativos
  */
 const alterRemOffset = () => {
   if (offset - limit >= 0) {
     setOffset(offset - limit);
   }
 };

  return (
    <>
      {/* Container principal da página com layout responsivo */}
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        {/* Componente de Navegação */}
        <NavBar />
   
        {/* Área principal de conteúdo */}
        <div className="w-full bg-gray-300 flex-1">
          {/* Cabeçalho da página */}
          <div className="w-full flex items-center bg-white px-4 py-2 gap-4">
            {/* Ícone decorativo */}
            <div className="bg-gray-200 p-1 rounded-lg">
              <IoDocumentTextOutline color="blue" size={20} />
            </div>
            
            {/* Título e subtítulo */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Setores</span>
              <p className="text-xs text-gray-600">Listagem de todos os setores no sistema</p>
            </div>
          </div>
   
          {/* Container do conteúdo principal */}
          <div className="w-full flex-col px-4">
            <div className="w-full flex flex-col bg-white h-auto rounded-lg mt-2 px-2">
              <div className="flex flex-col px-4 py-4">
                <div className="mt-2 overflow-x-auto">
                  {/* Botão para abrir modal de criação de setor */}
                  <button 
                    onClick={handleCloseForm} 
                    className="text-xs bg-blue-600 rounded-sm py-1 px-3 text-white font-semibold"
                  >
                    Cadastrar Setor
                  </button>
   
                  {/* Tabela de listagem de setores */}
                  <table className="w-full border-2 text-xs mt-2 rounded-xs">
                    <thead>
                      <tr className="text-gray-700 bg-gray-100">
                        <th className="border-b-2 p-2 text-left">Setor</th>
                        <th className="border-b-2 p-2 text-left">Responsável</th>
                        <th className="border-b-2 p-2 text-left">Descrição</th>
                        <th className="border-b-2 p-2 text-left">Ações</th>
                      </tr>
                    </thead>
   
                    <tbody>
                      {/* Mapeamento dos setores na tabela */}
                      {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="border-b-2 p-2">{item.sigla}</td>
                          <td className="border-b-2 p-2">{item.responsavel}</td>
                          <td className="border-b-2 p-2">{item.descricao}</td>
                          <td className="border-b-2 p-2">
                            {/* Ações de edição e exclusão */}
                            <div className="flex items-center justify-start gap-4">
                              {/* Ícone de edição */}
                              <LuPencil
                                color="orange"
                                size={14}
                                className="cursor-pointer hover:text-amber-500"
                                onClick={() => {
                                  // Preparação para edição do setor
                                  setIdUpdate(item.id);
                                  setUpdateSetor(item.sigla);
                                  setUpdateDescricao(item.descricao);
                                  setUpdateResponsavel(item.responsavel);
                                  setShowFormUpdate(true);
                                }}
                              />
                              
                              {/* Ícone de exclusão */}
                              <MdDeleteOutline
                                size={14}
                                className="cursor-pointer hover:text-red-500"
                                onClick={(ev) => deleteSetor(ev, item.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
   
                  {/* Controles de paginação */}
                  <div className="flex justify-end mt-4 gap-6 items-center">
                    {/* Seleção de itens por página */}
                    <div className="flex items-center gap-2">
                      <p className="text-[0.7rem]">Itens por página</p>
                      <select 
                        name="pagination" 
                        onChange={(ev) => setLimit(+ev.target.value)} 
                        className="border-2 text-[0.7rem]"
                      >
                        <option value="5" className="text-[0.7rem]">5</option>
                        <option value="10" className="text-[0.7rem]">10</option>
                        <option value="20" className="text-[0.7rem]">20</option>
                      </select>
                    </div>
   
                    {/* Informação de intervalo de itens */}
                    <p className="text-[0.7rem]">1-{limit} de {lengthDocumentos}</p>
   
                    {/* Navegação entre páginas */}
                    <div className="flex items-center gap-5">
                      <MdOutlineKeyboardArrowLeft 
                        className="text-gray-500 cursor-pointer" 
                        onClick={alterRemOffset}
                      />
                      <MdOutlineKeyboardArrowRight 
                        className="text-gray-500 cursor-pointer" 
                        onClick={alterAddOffset}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
   
        {/* Modal de Criação de Setor */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              {/* Cabeçalho do modal */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Cadastrar Setor</p>
                <AiOutlineClose
                  onClick={handleCloseForm}
                  className="cursor-pointer"
                  size={20}
                />
              </div>
   
              {/* Formulário de criação */}
              <form onSubmit={handleCreateSetor} className="mt-4">
                {/* Campos do formulário de criação */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="nomeSetor" className="text-sm font-semibold mb-2">
                    Nome do Setor
                  </label>
                  <input
                    type="text"
                    id="nomeSetor"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                    placeholder="Digite o nome do setor"
                    required
                    onChange={(ev) => setCreateSetor(ev.target.value)}
                  />
                </div>
   
                {/* Campo de descrição */}
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="descricaoSetor"
                    className="text-sm font-semibold mb-2"
                  >
                    Descrição do Setor
                  </label>
                  <textarea
                    id="descricaoSetor"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs"
                    placeholder="Descrição do setor"
                    required
                    onChange={(ev) => setCreateDescrição(ev.target.value)}
                  />
                </div>
   
                {/* Campo de responsável */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="responsavel" className="text-sm font-semibold mb-2">
                    Responsável pelo Setor
                  </label>
                  <input
                    type="text"
                    id="responsavel"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                    placeholder="Digite o nome do responsável"
                    required
                    onChange={(ev) => setCreateResponsavel(ev.target.value)}
                  />
                </div>
   
                {/* Botão de submissão */}
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg"
                >
                  Cadastrar Setor
                </button>
              </form>
            </div>
          </div>
        )}
   
        {/* Modal de Atualização de Setor */}
        {showFormUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              {/* Cabeçalho do modal */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Atualizar Setor</p>
                <AiOutlineClose
                  onClick={handleCloseUpdateForm}
                  className="cursor-pointer"
                  size={20}
                />
              </div>
   
              {/* Formulário de atualização */}
              <form onSubmit={(ev) => handleUpdateSetor(ev)} className="mt-4">
                {/* Campos do formulário de atualização */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="nomeSetor" className="text-sm font-semibold mb-2">
                    Novo Nome do Setor
                  </label>
                  <input
                    type="text"
                    id="nomeSetor"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                    placeholder="Digite o nome do setor"
                    required
                    onChange={(ev) => setUpdateSetor(ev.target.value)}
                  />
                </div>
   
                {/* Campo de nova descrição */}
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="descricaoSetor"
                    className="text-sm font-semibold mb-2"
                  >
                    Nova Descrição do Setor
                  </label>
                  <textarea
                    id="descricaoSetor"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs"
                    placeholder="Descrição do setor"
                    required
                    onChange={(ev) => setUpdateDescricao(ev.target.value)}
                  />
                </div>
   
                {/* Campo de novo responsável */}
                <div className="flex flex-col mb-4">
                  <label htmlFor="responsavel" className="text-sm font-semibold mb-2">
                    Novo Responsável pelo Setor
                  </label>
                  <input
                    type="text"
                    id="responsavel"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                    placeholder="Digite o nome do responsável"
                    required
                    onChange={(ev) => setUpdateResponsavel(ev.target.value)}
                  />
                </div>
   
                {/* Botão de submissão */}
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg"
                >
                  Atualizar Setor
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
   );
  }