"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../components/navbar";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";

import { FaArrowCircleDown } from "react-icons/fa";

export default function Home() {
  // Estados para armazenar os documentos, trâmites e setores
  const [dataDocument, setDataDocument] = useState<any[]>([]);
  const [dataTramite, setDataTramite] = useState<any[]>([]);
  const [dataSetor, setDataSetor] = useState<any[]>([]);

  // Estado para controlar a exibição do formulário de criação de trâmite
  const [showForm, setShowForm] = useState(false);

  // Estados para paginação de documentos
  const [lengthDocumentos, setLengthDocumentos] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  // Estados para armazenar informações do trâmite
  const [nmrDocumento, setNmrDocumento] = useState<number>();
  const [setorEnvio, setSetorEnvio] = useState<number>();
  const [setorRecebimento, setSetorRecebimento] = useState<number>();

  // Estado para armazenar a lista de status disponíveis
  const [selectStatus, setSelectStatus] = useState<any[]>([]);

  // Estado para filtrar os trâmites exibidos
  const [filtroTramite, setFiltroTramite] = useState<number>(1);

  // Estado para controlar a exibição do formulário de consulta de trâmite
  const [showFormConsultaTramite, setShowConsultaTramite] = useState(false);

  // Estados para a consulta de documentos
  const [documentoConsulta, setDocumentoConsulta] = useState<any[]>([]);
  const [isConsultando, setIsConsultando] = useState(false);
  const [numeroDocumentoInput, setNumeroDocumentoInput] = useState("");

  // Função para buscar os setores no backend
  const fetchDataSetor = async () => {
    try {
      const urlData = `http://localhost:4000/setor/select`;

      const result = await fetch(urlData, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!result.ok) {
        console.error("Erro na requisição");
        return;
      }

      const responseData = await result.json();
      setDataSetor(responseData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  // Função para fazer o download de um documento específico pelo ID
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

  // Função para buscar um trâmite pelo número do documento digitado
  const fetchTramiteById = async (ev: React.FormEvent) => {
    ev.preventDefault();

    try {
      const urlDataDocument = `http://localhost:4000/document/tramite/consulta/${numeroDocumentoInput}`;
      console.log("Consultando documento:", numeroDocumentoInput);

      const result = await fetch(urlDataDocument, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!result.ok) {
        console.error("Erro na requisição:", result.status);
        return;
      }

      const responseData = await result.json();
      console.log("Dados do documento consulta:", responseData);

      // Modificação aqui: Não precisamos mais verificar o length
      setDocumentoConsulta(responseData);
      setIsConsultando(true);
      handleCloseFormConsulta();

      if (!responseData || responseData.length === 0) {
        alert("Nenhuma tramitação encontrada para este documento");
      }
      console.log(documentoConsulta);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao consultar documento");
    }
  };

  // Função para buscar os documentos cadastrados
  const fetchDataDocument = async () => {
    try {
      const urlDataDocument = `http://localhost:4000/document/select`;
      console.log("Fazendo requisição...");
      const result = await fetch(urlDataDocument, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!result.ok) {
        console.error("Erro na requisição:", result.status);
        return;
      }

      const responseData = await result.json();
      console.log("Dados Documentos:", responseData.data);

      setDataDocument(responseData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  // Função para buscar os trâmites cadastrados com paginação
  const fetchDataTramite = async () => {
    try {
      const urlDataDocument = `http://localhost:4000/document/tramite/${filtroTramite}?offset=${offset}&limit=${limit}`;

      console.log("Fazendo requisição...");
      const result = await fetch(urlDataDocument, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!result.ok) {
        console.error("Erro na requisição:", result.status);
        return;
      }

      const responseData = await result.json();
      console.log("Dados Tramite:", responseData);

      setLengthDocumentos(responseData.totalCount);
      setDataTramite(responseData.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  // Função para deletar um trâmite pelo ID
  const deleteTramite = async (id: number) => {
    const url: string = `http://localhost:4000/document/tramite/delete/${id}`;
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });
      if (!response.ok) {
        console.log("erro na requisição");
        return;
      }
      fetchDataTramite();
    } catch (error) {
      console.log(error);
    }
  };

  // Função para buscar os status disponíveis
  const fetchStatus = async () => {
    const url: string = `http://localhost:4000/status`;
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });
      if (!response.ok) {
        console.log("erro na requisição");
        return;
      }

      const responseData = await response.json();
      setSelectStatus(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  // Função para criar um novo trâmite
  const handleTramite = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const url: string = "http://localhost:4000/document/tramite/create";
    const data = {
      documentoId: nmrDocumento,
      setorEnvioId: setorEnvio,
      setorRecebimentoId: setorRecebimento,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log("erro na requisição");
        return;
      }

      console.log("sucesso");

      handleCloseForm();
      setFiltroTramite(2);
      fetchDataTramite();
    } catch (error) {
      console.log("erro no servidor", error);
    }
  };

  // Função para receber um novo trâmite
  const receberTramite = async (id: number) => {
    const url: string = `http://localhost:4000/document/tramite/receber/${id}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro na requisição:", errorData);
        return;
      }

      console.log("sucesso");
      setFiltroTramite(1);
    } catch (error) {
      console.log("erro no servidor", error);
    }
  };

  // useEffect para buscar os dados quando filtroTramite, limit ou offset forem alterados
  useEffect(() => {
    fetchDataTramite();
  }, [filtroTramite, limit, offset]);

  // useEffect para carregar dados iniciais ao montar o componente
  useEffect(() => {
    fetchStatus();
    fetchDataSetor();
    fetchDataDocument();
    fetchDataTramite();
  }, []);

  // Alterna a exibição do formulário
  const handleCloseForm = () => {
    setShowForm(!showForm);
  };

  // Alterna a exibição do formulário de consulta
  const handleCloseFormConsulta = () => {
    setShowConsultaTramite(!showFormConsultaTramite);
  };

  // Avança o offset para carregar mais documentos
  const alterAddOffset = () => {
    if (offset + limit < lengthDocumentos) {
      setOffset(offset + limit);
    }
  };

  // Reduz o offset para carregar documentos anteriores
  const alterRemOffset = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };

  return (
    <>
      {/* Layout da página */}
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
              <span className="text-sm font-semibold">
                Consulta / Tramitacão
              </span>
              <p className="text-xs text-gray-600">
              Visualize e gerencie o andamento de documentos no sistema.
              </p>
            </div>
          </div>

          {/* Container do conteúdo principal */}
          <div className="w-full flex-col px-4">
            <div className="w-full flex flex-col bg-white h-auto rounded-lg mt-2 px-2">
              <div className="flex flex-col px-4 py-4">
                <div className="mt-2 overflow-x-auto">
                  <div className="flex items-center justify-between text-[0.7rem]">
                    {/* Container flexível que alinha os itens horizontalmente e distribui o espaço entre eles */}

                    <div className="flex gap-3 items-center justify-center">
                      {/* Div para agrupar os botões de "Nova Tramite" e "Consultar Documento" */}

                      <button
                        onClick={handleCloseForm}
                        className="text-xs bg-blue-600 rounded-sm py-1 px-3 text-white font-semibold"
                      >
                        Nova Tramite
                        {/* Botão para abrir/fechar o formulário de criação de um novo trâmite */}
                      </button>

                      <button
                        onClick={() =>
                          setShowConsultaTramite(!showFormConsultaTramite)
                        }
                        className="text-xs bg-blue-600 rounded-sm py-1 px-3 text-white font-semibold"
                      >
                        Consultar Documento
                        {/* Botão para abrir/fechar o formulário de consulta de documentos */}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      {/* Div para organizar o botão de voltar e o filtro de status */}

                      {isConsultando && (
                        <button
                          onClick={() => {
                            setIsConsultando(false);
                            setDocumentoConsulta([]); // Reseta a lista de documentos consultados
                            setNumeroDocumentoInput(""); // Limpa o campo de entrada do número do documento
                          }}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-sm font-semibold"
                        >
                          Voltar à listagem completa
                          {/* Botão visível apenas quando está em modo de consulta, para retornar à lista completa */}
                        </button>
                      )}

                      <div className="relative w-25">
                        {/* Container para o ícone do filtro e o select */}

                        <FaFilter className="absolute left-3 top-3 text-gray-500" />
                        {/* Ícone de filtro posicionado dentro do select */}

                        <select
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-[0.7rem]"
                          value={filtroTramite}
                          onChange={(e) => {
                            const value = +e.target.value;
                            console.log("Filtro Tramite:", value);
                            setFiltroTramite(value);
                            // Atualiza o estado do filtro de trâmite com o valor selecionado no dropdown
                          }}
                        >
                          {selectStatus &&
                            selectStatus.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.situacao}
                                {/* Renderiza as opções do dropdown dinamicamente com base nos status disponíveis */}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tabela de Tramitação de Documentos */}
                  <table className="w-full border-2 text-xs mt-2 rounded-xs">
                    {/* Cabeçalho da tabela com colunas de informações */}
                    <thead>
                      <tr className="text-gray-700 bg-gray-100">
                        {/* Cabeçalhos das colunas com informações de tramitação */}
                        <th className="border-b-2 p-2 text-left">
                          Nº do Documento
                        </th>
                        <th className="border-b-2 p-2 text-left">Título</th>
                        <th className="border-b-2 p-2 text-left">
                          Setor Envio
                        </th>
                        <th className="border-b-2 p-2 text-left">
                          Data Hora Envio
                        </th>
                        <th className="border-b-2 p-2 text-left">
                          Setor Recebimento
                        </th>
                        <th className="border-b-2 p-2 text-left">
                          Data Hora Recebimento
                        </th>
                        <th className="border-b-2 p-2 text-left">Status</th>
                        <th className="border-b-2 p-2 text-left">Anexo</th>
                        <th className="border-b-2 p-2 text-left">Ações</th>
                      </tr>
                    </thead>

                    {/* Corpo da tabela com listagem de tramitações */}
                    <tbody>
                      {/* Renderização condicional baseada no estado de consulta */}
                      {!isConsultando
                        ? // Mapeamento de tramitações padrão
                          dataTramite.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              {/* Células com informações de cada tramitação */}
                              <td className="border-b-2 p-2">
                                {item.documento.nmrDocumento}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.documento.titulo}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.setorEnvio.sigla}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.dataEnvio
                                  ? new Date(item.dataEnvio).toLocaleString()
                                  : "-"}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.setorRecebimento?.sigla || "-"}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.dataHoraRecebimento
                                  ? new Date(
                                      item.dataHoraRecebimento
                                    ).toLocaleString()
                                  : "-"}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.status.situacao}
                              </td>

                              {/* Coluna de anexo com ícone para download */}
                              <td className="border-b-2 p-2">
                                <FaFileAlt
                                  className="ml-3 cursor-pointer"
                                  onClick={() =>
                                    downloadDocument(item.documentoId)
                                  }
                                />
                              </td>

                              {/* Coluna de ações com botões condicionais */}
                              <td className="border-b-2 p-2">
                                {/* Botão de receber tramitação ou deletar baseado no status */}
                                {item.statusId === 2 ? (
                                  <FaArrowCircleDown
                                    color="green"
                                    size={13}
                                    className="cursor-pointer hover:text-amber-500 ml-[0.7rem]"
                                    onClick={() => receberTramite(item.id)}
                                  />
                                ) : (
                                  <MdDeleteOutline
                                    size={14}
                                    color="red"
                                    className="cursor-pointer hover:text-red-500 ml-[0.6rem]"
                                    onClick={(ev) => deleteTramite(item.id)}
                                  />
                                )}
                              </td>
                            </tr>
                          ))
                        : // Mapeamento de consulta de tramitações
                          documentoConsulta.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              {/* Mesma estrutura da renderização padrão */}
                              <td className="border-b-2 p-2">
                                {item.documento.nmrDocumento}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.documento.titulo}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.setorEnvio.sigla}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.dataEnvio
                                  ? new Date(item.dataEnvio).toLocaleString()
                                  : "-"}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.setorRecebimento?.sigla || "-"}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.dataHoraRecebimento
                                  ? new Date(
                                      item.dataHoraRecebimento
                                    ).toLocaleString()
                                  : "-"}
                              </td>
                              <td className="border-b-2 p-2">
                                {item.status.situacao}
                              </td>
                              <td className="border-b-2 p-2">
                                <FaFileAlt
                                  className="ml-3 cursor-pointer"
                                  onClick={() =>
                                    downloadDocument(item.documentoId)
                                  }
                                />
                              </td>
                              <td className="border-b-2 p-2">
                                {item.statusId === 2 ? (
                                  <FaArrowCircleDown
                                    color="green"
                                    size={13}
                                    className="cursor-pointer hover:text-amber-500 ml-[0.7rem]"
                                    onClick={() => receberTramite(item.id)}
                                  />
                                ) : (
                                  <MdDeleteOutline
                                    size={14}
                                    color="red"
                                    className="cursor-pointer hover:text-red-500 ml-[0.6rem]"
                                    onClick={(ev) => deleteTramite(item.id)}
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>

                  <div className="flex justify-end mt-4 gap-6 items-center">
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
                    <p className="text-[0.7rem]">
                      1-{limit} de {lengthDocumentos}
                    </p>

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

        {/* Modal de Criação de Trâmite */}
        {showForm && (
          // Container modal fixo que cobre toda a tela
          // Fundo escurecido semi-transparente que centraliza o conteúdo
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Container branco do formulário com largura fixa */}
            <div className="bg-white p-6 rounded-lg w-[350px]">
              {/* Cabeçalho do modal */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Tramite</p>
                {/* Botão de fechar */}
                <AiOutlineClose
                  onClick={handleCloseForm}
                  className="cursor-pointer"
                  size={20}
                />
              </div>

              {/* Formulário de criação de trâmite */}
              <form onSubmit={handleTramite} className="mt-4">
                <div className="flex flex-col gap-3">
                  {/* Campo de Seleção: Número do Documento */}
                  <div className="flex flex-col mb-4">
                    <label
                      htmlFor="nomeDocumento"
                      className="text-sm font-semibold mb-2"
                    >
                      Nº do Documento
                    </label>
                    <select
                      className="py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs text-gray-400"
                      name="tipoDocumento"
                      onChange={(ev) =>
                        setNmrDocumento(Number(ev.target.value))
                      }
                    >
                      <option value="">Nº do Documento</option>
                      {dataDocument &&
                        dataDocument.map((document) => (
                          <option key={document.id} value={document.id}>
                            {document.nmrDocumento}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Campo de Seleção: Setor de Envio */}
                  <div className="flex flex-col mb-4">
                    <label
                      htmlFor="setorEnvio"
                      className="text-sm font-semibold mb-2"
                    >
                      Setor de Envio
                    </label>
                    <select
                      className="py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs text-gray-400"
                      name="setorEnvio"
                      onChange={(ev) => setSetorEnvio(Number(ev.target.value))}
                    >
                      <option value="">Setor Envio</option>
                      {dataSetor &&
                        dataSetor.map((setor) => (
                          <option key={setor.id} value={setor.id}>
                            {setor.sigla}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Campo de Seleção: Setor de Recebimento */}
                  <div className="flex flex-col mb-4">
                    <label
                      htmlFor="setorRecebimento"
                      className="text-sm font-semibold mb-2"
                    >
                      Setor de Recebimento
                    </label>
                    <select
                      className="py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs text-gray-400"
                      name="setorRecebimento"
                      onChange={(ev) =>
                        setSetorRecebimento(Number(ev.target.value))
                      }
                    >
                      <option value="">Setor Recebimento</option>
                      {dataSetor &&
                        dataSetor.map((setor) => (
                          <option key={setor.id} value={setor.id}>
                            {setor.sigla}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Botão de submissão */}
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg mt-5"
                >
                  Tramitar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Consulta de Trâmite */}
        {showFormConsultaTramite && (
          // Container modal fixo que cobre toda a tela
          // Fundo escurecido semi-transparente que centraliza o conteúdo
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Container branco do formulário com largura fixa */}
            <div className="bg-white p-6 rounded-lg w-80">
              {/* Botão de fechar alinhado à direita */}
              <div className="w-full flex justify-end">
                <AiOutlineClose
                  onClick={handleCloseFormConsulta}
                  className="cursor-pointer"
                  size={20}
                />
              </div>

              {/* Título centralizado */}
              <div className="flex items-center text-center justify-center">
                <p className="font-semibold">Número Do Documento</p>
              </div>

              {/* Formulário de consulta */}
              <form onSubmit={fetchTramiteById} className="mt-4">
                {/* Campo de input para número do documento */}
                <div className="flex flex-col mb-4">
                  <input
                    type="text"
                    value={numeroDocumentoInput}
                    onChange={(e) => setNumeroDocumentoInput(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs text-center"
                    placeholder="Example: 0001"
                    required
                  />
                </div>

                {/* Botão de submissão */}
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg text-xs"
                >
                  Consultar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
