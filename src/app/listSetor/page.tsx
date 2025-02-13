"use client";
import { ReactElement, useEffect, useState } from "react";
import NavBar from "../components/navbar";
import { LuPencil } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const[showForm, setShowForm] = useState(false)
  const[showFormUpdate, setShowFormUpdate] = useState(false)
  const [createSetor, setCreateSetor] = useState("")
  const [createDescrição, setCreateDescrição] = useState("")
  const [createResponsável, setCreateResponsavel] = useState("")
  const [updateSetor, setUpdateSetor] = useState("")
  const [updateDescrição, setUpdateDescricao] = useState("")
  const [updateResponsável, setUpdateResponsavel] = useState("")
  const [id, setIdUpdate] = useState<number| null>(null)

  const handleCloseForm = () => {
    setShowForm(!showForm)
  }
  const handleCloseUpdateForm = () => {
    setShowFormUpdate(!showFormUpdate)
  }
  const fetchData = async () => {
    try {
      const url = "http://localhost:4000/setor";
      const result = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!result.ok) {
        console.error("Erro na requisição");
        return;
      }

      const responseData = await result.json();
      setData(responseData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

const handleCreateSetor = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const url: string = "http://localhost:4000/setor/create"
    const data = { 
        sigla: createSetor,
        descricao: createDescrição,
        responsavel: createResponsável
    }
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if(!response.ok){
            console.log("erro na requisição")
            return
        } 

        console.log("sucesso")

        handleCloseForm()
        fetchData()
    } catch(error){
        console.log("erro no servidor", error)
    }
}

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
        setIdUpdate(null)

        handleCloseUpdateForm();
        fetchData();
    } catch (error) {
        console.error("Erro no servidor:", error);
    }
};


const deleteSetor = async (ev: React.FormEvent, id: number) => {
    ev.preventDefault()

    const url: string = `http://localhost:4000/setor/delete/${id}`
    try {
        const response = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            method: "DELETE"
        })
        if(!response.ok){
            console.log("erro na requisição")
            return 
        }
        fetchData()
    } catch(error){
        console.log(error)
    }
}

  

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
              <p className="font-semibold">TODOS OS SETORES</p>
            </div>

           
            <div className="flex flex-col mt-6 px-4">
              <div className="mt-8 overflow-x-auto">
                <button onClick={handleCloseForm} className="text-xs bg-blue-600 rounded-sm py-1 px-3 text-white font-semibold">Cadastrar Setor</button>
                {/* Tabela de documentos */}
                <table className="w-full border-2 text-xs mt-2 rounded-xs">
                  <thead>
                    {/* Cabeçalho da tabela */}
                    <tr>
                      <th className="border-b-2 p-2 text-left">Setor</th>
                      <th className="border-b-2 p-2 text-left">Descrição</th>
                      <th className="border-b-2 p-2 text-left">Responsável</th>
                      <th className="border-b-2 p-2 text-left">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* Colunas*/}
                    {data.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border-b-2 p-2">{item.sigla}</td>
                        <td className="border-b-2 p-2">{item.responsavel}</td>
                        <td className="border-b-2 p-2">{item.descricao}</td>
                        <td className="border-b-2 p-2">
                          <div className="flex items-center justify-start gap-4">
                            <LuPencil
                              color="orange"
                              size={14}
                              className="cursor-pointer hover:text-amber-500"
                              onClick={() => {
                                setIdUpdate(item.id);
                                setUpdateSetor(item.sigla);
                                setUpdateDescricao(item.descricao);
                                setUpdateResponsavel(item.responsavel);
                                setIdUpdate(item.id);
                                setShowFormUpdate(true);
                              }}
                            />
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
              </div>
            </div>
          </div>
        </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Cadastrar Setor</p>
              <AiOutlineClose
                onClick={handleCloseForm}
                className="cursor-pointer"
                size={20}
              />
            </div>

            <form onSubmit={handleCreateSetor} className="mt-4">
              {/* Campos do formulário */}
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

      {showFormUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Cadastrar Setor</p>
              <AiOutlineClose
                onClick={handleCloseUpdateForm}
                className="cursor-pointer"
                size={20}
              />
            </div>

            <form onSubmit={(ev) => handleUpdateSetor(ev)} className="mt-4">
              {/* Campos do formulário */}
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

              <div className="flex flex-col mb-4">
                <label htmlFor="responsavel" className="text-sm font-semibold mb-2">
                  Novo Responsável Responsável pelo Setor
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
