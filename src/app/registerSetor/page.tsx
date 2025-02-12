"use client";
import { useState } from "react";
import NavBar from "../components/navbar";

export default function RegisterSetor() {
  
  // Estado para os campos do formulário
  const [nomeSetor, setNomeSetor] = useState("");
  const [descricaoSetor, setDescricaoSetor] = useState("");
  const [responsavel, setResponsavel] = useState("");

  // Função que será chamada quando o formulário for submetido
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log({
      nomeSetor,
      descricaoSetor,
      responsavel,
    });

    setNomeSetor("");
    setDescricaoSetor("");
    setResponsavel("");
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        <NavBar />

        <div className="w-full bg-gray-300 flex-1 px-4">
          <div className="w-full flex flex-col bg-white h-auto rounded-lg mt-6 px-2 py-6">
            <div className="flex justify-center mt-4">
              <p className="font-semibold">CADASTRAR SETOR</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 px-4 flex flex-col gap-4">
              {/* Nome do Setor */}
              <div className="flex flex-col">
                <label htmlFor="nomeSetor" className="text-sm font-semibold mb-2">
                  Nome do Setor
                </label>
                <input
                  type="text"
                  id="nomeSetor"
                  value={nomeSetor}
                  onChange={(e) => setNomeSetor(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                  placeholder="Digite o nome do setor"
                  required
                />
              </div>

              {/* Descrição do Setor */}
              <div className="flex flex-col">
                <label htmlFor="descricaoSetor" className="text-sm font-semibold mb-2">
                  Descrição do Setor
                </label>
                <textarea
                  id="descricaoSetor"
                  value={descricaoSetor}
                  onChange={(e) => setDescricaoSetor(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg  text-xs"
                  placeholder="Descrição do setor"
                  required
                />
              </div>

              {/* Responsável pelo Setor */}
              <div className="flex flex-col">
                <label htmlFor="responsavel" className="text-sm font-semibold mb-2">
                  Responsável pelo Setor
                </label>
                <input
                  type="text"
                  id="responsavel"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                  placeholder="Digite o nome do responsável"
                  required
                />
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
