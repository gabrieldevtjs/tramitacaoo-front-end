"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/navbar";
// Importação dos ícones organizados por biblioteca
import { LuPencil } from "react-icons/lu";
import {
  MdDeleteOutline,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import {
  FaPaperclip,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";

export default function Home() {
  // ==================== Estados do Componente ====================
  // Estados para dados
  const [dataDocument, setDataDocument] = useState<any[]>([]);
  const [dataType, setDataType] = useState<any[]>([]);
  const [lengthDocumentos, setLengthDocumentos] = useState<number>(0);

  // Estados de controle de formulário
  const [showForm, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [showFormType, setShowFormType] = useState(false);

  // Estados para criação de documento
  const [createNmrDocument, setCreateNmrDocument] = useState("");
  const [createTypeDocument, setCreateTypeDocument] = useState("");
  const [createTitulo, setCreateTitulo] = useState("");
  const [createDescricao, setCreateDescricao] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [createTypeSelect, setCreateTypeSelect] = useState("");

  // Estados para atualização
  const [updateTitulo, setUpdateTitulo] = useState("");
  const [updateDescrição, setUpdateDescricao] = useState("");
  const [id, setIdUpdate] = useState<number | null>(null);

  // Estados para paginação
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  // ==================== Funções de API ====================

  /**
   * Realiza o download de um documento específico
   * @param id - ID do documento a ser baixado
   */
  const downloadDocument = async (id: number) => {
    try {
      const urlDataDocument = `http://localhost:4000/document/${id}/download`;
      console.log("Iniciando download...");

      const result = await fetch(urlDataDocument, {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      });

      if (!result.ok) {
        console.error(
          "Erro na requisição:",
          result.status,
          await result.text()
        );
        return;
      }

      const blob = await result.blob();
      console.log("Detalhes do blob:", {
        tamanho: blob.size,
        tipo: blob.type,
        headers: Object.fromEntries(result.headers),
      });

      if (blob.size === 0) {
        throw new Error("Arquivo vazio recebido");
      }

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `documento_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Erro no download:", error);
    }
  };

  /**
   * Busca a lista de documentos com paginação
   */
  const fetchDataDocument = async () => {
    try {
      const urlDataDocument = `http://localhost:4000/document?offset=${offset}&limit=${limit}`;
      const result = await fetch(urlDataDocument, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!result.ok) {
        console.error("Erro na requisição:", result.status);
        return;
      }

      const responseData = await result.json();
      setDataDocument(responseData.data);
      setLengthDocumentos(responseData.totalCount);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  /**
   * Busca os tipos de documentos disponíveis
   */
  const fetchDataType = async () => {
    try {
      const urlData = `http://localhost:4000/document/type`;
      const result = await fetch(urlData, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!result.ok) {
        console.error("Erro na requisição:", result.status);
        return;
      }

      const responseData = await result.json();
      setDataType(responseData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  /**
   * Cria um novo documento
   * @param ev - Evento do formulário
   */
  const handleCreateDocument = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("nmrDocumento", createNmrDocument);
    formData.append("titulo", createTitulo);
    formData.append("descricao", createDescricao);
    formData.append("tipoDocumentoId", createTypeDocument);

    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://localhost:4000/document/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.log("erro na requisição");
        return;
      }

      handleCloseForm();
      fetchDataDocument();
      resetFile();
    } catch (error) {
      console.log("erro no servidor", error);
    }
  };

  /**
   * Cria um novo tipo de documento
   * @param ev - Evento do formulário
   */
  const handleTypeSelect = async (ev: React.FormEvent) => {
    ev.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:4000/document/type/create",
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ tipo: createTypeSelect }),
        }
      );

      if (!response.ok) {
        console.log("erro na requisição");
        return;
      }

      fetchDataType();
      handleCloseFormType();
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Atualiza um documento existente
   * @param ev - Evento do formulário
   */
  const handleUpdateDocumento = async (ev: React.FormEvent) => {
    ev.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:4000/document/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: updateTitulo,
            descricao: updateDescrição,
          }),
        }
      );

      if (!response.ok) {
        console.error("Erro na requisição");
        return;
      }

      setIdUpdate(null);
      handleCloseUpdateForm();
      fetchDataDocument();
    } catch (error) {
      console.error("Erro no servidor:", error);
    }
  };

  /**
   * Deleta um documento
   * @param ev - Evento do formulário
   * @param id - ID do documento a ser deletado
   */
  const deleteDocumento = async (ev: React.FormEvent, id: number) => {
    ev.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:4000/document/delete/${id}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.log("erro na requisição");
        return;
      }

      fetchDataDocument();
    } catch (error) {
      console.log(error);
    }
  };

  // ==================== Funções Utilitárias ====================

  /**
   * Controla a abertura/fechamento do formulário principal
   */
  const handleCloseForm = () => {
    setShowForm(!showForm);
  };

  /**
   * Controla a abertura/fechamento do formulário de tipo
   */
  const handleCloseFormType = () => {
    setShowFormType(!showFormType);
  };

  /**
   * Controla a abertura/fechamento do formulário de atualização
   */
  const handleCloseUpdateForm = () => {
    setShowFormUpdate(!showFormUpdate);
  };

  /**
   * Incrementa o offset para paginação
   */
  const alterAddOffset = () => {
    if (offset + limit < lengthDocumentos) {
      setOffset(offset + limit);
    }
  };

  /**
   * Decrementa o offset para paginação
   */
  const alterRemOffset = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };

  /**
   * Gerencia o estado do arquivo anexado
   */
  const anexoState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  /**
   * Reseta o estado do arquivo
   */
  const resetFile = () => {
    setFile(null);
  };

  // ==================== Effects ====================

  // Carrega tipos de documentos ao montar o componente
  useEffect(() => {
    fetchDataType();
  }, []);

  // Atualiza lista de documentos quando mudam os parâmetros de paginação
  useEffect(() => {
    fetchDataDocument();
  }, [limit, offset]);

  return (
    <>
      {/* 
  Layout principal da página 
  - Usa flex-col para mobile (padrão)
  - Muda para flex-row em telas grandes (lg)
  - Ocupa toda a largura e altura mínima da tela
*/}
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        {/* Componente de navegação lateral */}
        <NavBar />

        {/* 
    Container principal - área de conteúdo
    - Fundo cinza claro
    - Flex-1 permite que ocupe o espaço restante
  */}
        <div className="w-full bg-gray-300 flex-1">
          {/* 
      Cabeçalho da página 
      - Fundo branco
      - Flex para alinhar ícone e texto
    */}
          <div className="w-full flex items-center bg-white px-4 py-2 gap-4">
            {/* Círculo cinza com ícone */}
            <div className="bg-gray-200 p-1 rounded-lg">
              <IoDocumentTextOutline color="blue" size={20} />
            </div>
            {/* Título e subtítulo em coluna */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Documentos</span>
              <p className="text-xs text-gray-600">
                Listagem de todos os Documentos no sistema
              </p>
            </div>
          </div>

          {/* 
      Área de conteúdo principal
      - Padding horizontal
      - Estrutura em coluna
    */}
          <div className="w-full flex-col px-4">
            {/* 
        Card branco principal
        - Cantos arredondados
        - Altura automática
      */}
            <div className="w-full flex flex-col bg-white h-auto rounded-lg mt-2 px-2">
              <div className="flex flex-col px-4 py-4">
                {/* Container com scroll horizontal quando necessário */}
                <div className="mt-2 overflow-x-auto">
                  {/* 
              Barra de ações
              - Botões alinhados com gap
            */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCloseForm}
                      className="text-xs bg-blue-600 rounded-sm py-1 px-3 text-white font-semibold"
                    >
                      Cadastrar Documento
                    </button>
                    <button
                      onClick={handleCloseFormType}
                      className="text-xs bg-blue-600 rounded-sm py-1 px-3 text-white font-semibold"
                    >
                      Novo Tipo
                    </button>
                  </div>

                  {/* 
              Tabela de documentos
              - Largura total
              - Texto pequeno
              - Bordas e cantos arredondados
            */}
                  <table className="w-full border-2 text-xs mt-2 rounded-xs">
                    {/* Cabeçalho da tabela com fundo cinza */}
                    <thead>
                      <tr className="text-gray-700 bg-gray-100">
                        <th className="border-b-2 p-2 text-left">
                          Nº do Documento
                        </th>
                        <th className="border-b-2 p-2 text-left">Título</th>
                        <th className="border-b-2 p-2 text-left">Descrição</th>
                        <th className="border-b-2 p-2 text-left">
                          Data de Cadastro
                        </th>
                        <th className="border-b-2 p-2 text-left">
                          Tipo Documento
                        </th>
                        <th className="border-b-2 p-2 text-left">Arquivo</th>
                        <th className="border-b-2 p-2 text-left">Ações</th>
                      </tr>
                    </thead>

                    {/* 
                Corpo da tabela
                - Renderização condicional dos dados
                - Efeito hover nas linhas
              */}
                    <tbody>
                      {dataDocument &&
                        dataDocument.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="border-b-2 p-2">
                              {item.nmrDocumento}
                            </td>
                            <td className="border-b-2 p-2">{item.titulo}</td>
                            <td className="border-b-2 p-2">{item.descricao}</td>
                            <td className="border-b-2 p-2">
                              {item.dataCadastro}
                            </td>
                            <td className="border-b-2 p-2">
                              {item.tipoDocumento.tipo}
                            </td>
                            {/* Ícone de arquivo com ação de download */}
                            <td className="border-b-2 p-2">
                              <FaFileAlt
                                className="ml-4 cursor-pointer"
                                onClick={() => downloadDocument(item.id)}
                              />
                            </td>
                            {/* 
                        Coluna de ações
                        - Ícones de editar e deletar
                        - Cores e hover states diferentes
                      */}
                            <td className="border-b-2 p-2">
                              <div className="flex items-center justify-start gap-4">
                                <LuPencil
                                  color="orange"
                                  size={14}
                                  className="cursor-pointer hover:text-amber-500"
                                  onClick={() => {
                                    setIdUpdate(item.id);
                                    setShowFormUpdate(true);
                                  }}
                                />
                                <MdDeleteOutline
                                  size={14}
                                  className="cursor-pointer hover:text-red-500"
                                  onClick={(ev) => deleteDocumento(ev, item.id)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {/* 
              Controles de paginação
              - Alinhados à direita
              - Flexbox para layout dos elementos
            */}
                  <div className="flex justify-end mt-4 gap-6 items-center">
                    {/* Seletor de itens por página */}
                    <div className="flex items-center gap-2">
                      <p className="text-[0.7rem]">Itens por página</p>
                      <select
                        name="pagination"
                        onChange={(ev) => setLimit(+ev.target.value)}
                        className="border-2 text-[0.7rem]"
                      >
                        <option value="5" className="text-[0.7rem]">
                          5
                        </option>
                        <option value="10" className="text-[0.7rem]">
                          10
                        </option>
                        <option value="20" className="text-[0.7rem]">
                          20
                        </option>
                      </select>
                    </div>
                    {/* Indicador de intervalo atual */}
                    <p className="text-[0.7rem]">
                      1-{limit} de {lengthDocumentos}
                    </p>
                    {/* Botões de navegação */}
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

        {/* 
  Modal de Cadastro de Documento
  - Renderização condicional baseada no estado showForm
*/}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* 
      Container do modal
    */}
            <div className="bg-white p-6 rounded-lg w-100">
              {/* 
        Cabeçalho do modal
        - Flex para título e botão de fechar
        - Espaçamento entre elementos
      */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Cadastrar Documento</p>
                <AiOutlineClose
                  onClick={handleCloseForm}
                  className="cursor-pointer"
                  size={20}
                />
              </div>

              {/* 
        Formulário de cadastro
        - Manipula submissão através de handleCreateDocument
        - Margem superior para separar do cabeçalho
      */}
              <form onSubmit={handleCreateDocument} className="mt-4">
                {/* 
          Primeira linha do formulário
          - Flex para alinhar campos lado a lado
          - Gap para espaçamento entre campos
        */}
                <div className="flex gap-3">
                  {/* Campo Número do Documento */}
                  <div className="flex flex-col mb-4">
                    <label
                      htmlFor="nomeDocumento"
                      className="text-sm font-semibold mb-2"
                    >
                      Nº do Documento
                    </label>
                    <input
                      type="text"
                      id="nomeDocumento"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                      placeholder="Digite o Nº do Documento"
                      required
                      onChange={(ev) => setCreateNmrDocument(ev.target.value)}
                    />
                  </div>

                  {/* 
            Dropdown Tipo de Documento
            - Populado dinamicamente com dataType
            - Estilização consistente com outros campos
          */}
                  <div className="flex flex-col mb-4">
                    <label
                      htmlFor="nomeDocumento"
                      className="text-sm font-semibold mb-2"
                    >
                      Tipo de Documento
                    </label>
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs text-gray-400"
                      name="tipoDocumento"
                      id=""
                      onChange={(ev) => setCreateTypeDocument(ev.target.value)}
                    >
                      <option value="">Tipo De Documento</option>
                      {dataType &&
                        dataType.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.tipo}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* 
          Campo Título
          - Largura total
          - Estilização consistente
        */}
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="nomeDocumento"
                    className="text-sm font-semibold mb-2"
                  >
                    Título
                  </label>
                  <input
                    type="text"
                    id="nomeDocumento"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                    placeholder="Digite o nome do Documento"
                    required
                    onChange={(ev) => setCreateTitulo(ev.target.value)}
                  />
                </div>

                {/* 
          Campo Descrição
          - Textarea para texto mais longo
          - Estilização consistente
        */}
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="descricaoDocumento"
                    className="text-sm font-semibold mb-2"
                  >
                    Descrição do Documento
                  </label>
                  <textarea
                    id="descricaoDocumento"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs"
                    placeholder="Descrição do Documento"
                    required
                    onChange={(ev) => setCreateDescricao(ev.target.value)}
                  />
                </div>

                {/* 
          Upload de Arquivo
          - Input file escondido
          - Label personalizado como botão de upload
          - Exibe nome do arquivo quando selecionado
          - Botão de remover arquivo
        */}
                <div className="flex flex-col">
                  <label
                    htmlFor="anexo"
                    className="text-sm font-semibold mb-2 text-gray-700"
                  >
                    Anexo
                  </label>
                  <label
                    htmlFor="anexo"
                    className="flex items-center border border-gray-300 rounded-lg px-4 py-2 max-w-xs cursor-pointer"
                  >
                    <input
                      type="file"
                      id="anexo"
                      className="w-0 h-0"
                      onChange={anexoState}
                    />

                    <div className="flex items-center flex-grow">
                      <FaPaperclip className="text-gray-500 mr-2" />
                      <span className="text-xs text-gray-500">
                        {file ? file.name : "Selecionar arquivo"}
                      </span>
                    </div>

                    {/* 
              Botão de remover arquivo
              - Aparece apenas quando há arquivo selecionado
              - Transição suave de cor no hover
            */}
                    {file && (
                      <button
                        onClick={resetFile}
                        className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <FaTimes size={12} />
                      </button>
                    )}
                  </label>
                </div>

                {/* 
          Botão de Submit
          - Largura total
          - Estilo destacado
          - Margem superior para separar do último campo
        */}
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg mt-5"
                >
                  Cadastrar Documento
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 
  Modal de Criação de Novo Tipo
  - Renderização condicional baseada em showFormType
*/}
        {showFormType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Container do modal */}
            <div className="bg-white p-6 rounded-lg w-80">
              {/* Botão de fechar alinhado à direita */}
              <div className="w-full flex justify-end">
                <AiOutlineClose
                  onClick={handleCloseFormType}
                  className="cursor-pointer"
                  size={20}
                />
              </div>
              {/* Título do modal */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Novo Tipo</p>
              </div>

              {/* 
        Formulário de criação de tipo
        - Evento de submit chama handleTypeSelect
      */}
              <form onSubmit={(ev) => handleTypeSelect(ev)} className="mt-4">
                {/* Campo único para nome do tipo */}
                <div className="flex flex-col mb-4">
                  
                  <input
                    type="text"
                    id="nomeDocumento"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                    placeholder="Digite o novo Tipo"
                    required
                    onChange={(ev) => setCreateTypeSelect(ev.target.value)}
                  />
                </div>

                {/* Botão de submit */}
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg text-xs"
                >
                  Criar Novo Tipo
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 
  Modal de Atualização de Documento
  - Renderização condicional baseada em showFormUpdate

*/}
        {showFormUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Container do modal */}
            <div className="bg-white p-6 rounded-lg w-96">
              {/* Cabeçalho com título e botão de fechar */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Cadastrar Documentor</p>
                <AiOutlineClose
                  onClick={handleCloseUpdateForm}
                  className="cursor-pointer"
                  size={20}
                />
              </div>

              {/* 
        Formulário de atualização
        - Evento de submit chama handleUpdateDocumento
      */}
              <form
                onSubmit={(ev) => handleUpdateDocumento(ev)}
                className="mt-4"
              >
                {/* Campo de título */}
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="nomeDocumento"
                    className="text-sm font-semibold mb-2"
                  >
                    Novo Título do Documento
                  </label>
                  <input
                    type="text"
                    id="nomeDocumento"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                    placeholder="Digite o Novo Título do Documento"
                    onChange={(ev) => setUpdateTitulo(ev.target.value)}
                  />
                </div>

                {/* Campo de descrição */}
                <div className="flex flex-col mb-4">
                  <label
                    htmlFor="descricaoDocumento"
                    className="text-sm font-semibold mb-2"
                  >
                    Nova Descrição Do Documento
                  </label>
                  <textarea
                    id="descricaoDocumento"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs"
                    placeholder="Descreva a Nova Descrição do Documento"
                    onChange={(ev) => setUpdateDescricao(ev.target.value)}
                  />
                </div>

                {/* Botão de submit */}
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg"
                >
                  Atualizar Documento
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
