"use client";
import { useState } from "react";
import NavBar from "../components/navbar";
import { FaPaperclip } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

export default function RegisterSetor() {
  const [nomeDocumento, setDocumento] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setDocumento("");
    setTipoDocumento("");
    setResponsavel("");
    setFile(null)
  };

  const anexoState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
  
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const resetFile = () => {
    setFile(null)
  } 

  return (
    <>
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        <NavBar />

        <div className="w-full bg-gray-300 flex-1 px-4">
          <div className="w-full flex flex-col bg-white h-auto rounded-lg mt-6 px-2 py-6">
            <div className="flex justify-center mt-4">
              <p className="font-semibold">NOVO DOCUMENTO</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 px-4 flex flex-col gap-4"
            >
              {/* Número do Documento */}
              <div className="flex flex-col">
                <label
                  htmlFor="nomeDocumento"
                  className="text-sm font-semibold mb-2"
                >
                  Número Do Documento
                </label>
                <input
                  type="text"
                  id="nomeDocumento"
                  value={nomeDocumento}
                  onChange={(e) => setDocumento(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                  placeholder="Digite o nome do Documento"
                  required
                />
              </div>

              {/* Tipo do Documento */}
              <div className="flex flex-col">
                <label
                  htmlFor="tipoDocumento"
                  className="text-sm font-semibold mb-2"
                >
                  Tipo De Documento
                </label>
                <input
                  id="tipoDocumento"
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg  text-xs"
                  placeholder="Digite o tipo de Documento"
                  required
                />
              </div>

              {/* Título do Documento */}
              <div className="flex flex-col">
                <label
                  htmlFor="tipoDocumento"
                  className="text-sm font-semibold mb-2"
                >
                  Título
                </label>
                <input
                  id="tipoDocumento"
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg  text-xs"
                  placeholder="Título do documento"
                  required
                />
              </div>

              {/* Descrição do Documento */}
              <div className="flex flex-col">
                <label
                  htmlFor="tipoDocumento"
                  className="text-sm font-semibold mb-2"
                >
                  Descrição
                </label>
                <textarea
                  id="tipoDocumento"
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg  text-xs"
                  placeholder="Descrição do documento"
                  required
                />
              </div>

              {/* Anexo Documento */}
              <div className="flex flex-col">
                <label htmlFor="anexo" className="text-sm font-semibold mb-2">
                  Anexo
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 max-w-xs">
                  <input
                    type="file"
                    id="anexo"
                    className="hidden"
                    onChange={anexoState}
                  />
                  <label
                    htmlFor="anexo"
                    className="flex items-center cursor-pointer w-full justify-between"
                  >
                    <div className="flex">
                    <FaPaperclip className="text-gray-500 mr-2" />
                    <span className="text-xs text-gray-500">
                        {file ? file.name : "Selecionar arquivo"}                        
                      
                    </span>
                    </div>
                   
                  </label>
                  {file ? (
                        <button onClick={resetFile}>
                             <FaTimes size={12} className="mt-1"/>
                        </button>
                        
                    ) : ""}
                </div>
              </div>

              {/* Botão para enviar/chamar a api*/}
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg mt-4"
              >
                Cadastrar Setor
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
