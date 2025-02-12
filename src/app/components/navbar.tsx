"use client";
import Image from "next/image";
import { useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";

export default function NavBar() {
  const [navbarOpen, setnavBarOpen] = useState(false);
  const [cadastroBar, setCadastroBar] = useState(false);
  const [gerenciamentoBar, setGerenciamentoBar] = useState(false);
  const [listagemBar, setlistagemBar] = useState(false);

  function alterCadBar() {
    setCadastroBar(!cadastroBar);
  }
  function alterListagem() {
    setlistagemBar(!listagemBar);
  }
  function alterGerenciamento() {
    setGerenciamentoBar(!gerenciamentoBar);
  }

  function alterNavBar() {
    setnavBarOpen(!navbarOpen);
  }

  return (
    <nav className="w-full flex items-center justify-between bg-[#27B3F8] py-4 px-6 lg:w-52 lg:flex-col lg:justify-start lg:pt-8">
      {/* Logo */}
      <div className="hidden lg:flex flex-col">
        <div className="flex gap-16 items-center">
          <div className="flex items-center">
            <Image
              src="/icons/iconsola.png"
              alt="Ícone Solastec"
              height={40}
              width={50}
              priority
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sm text-white font-bold"> Solastec</span>
              <span className="text-xs text-white font-semibold">
                {" "}
                Tecnology
              </span>
            </div>
          </div>
          <button onClick={alterNavBar}>
            {navbarOpen ? (
              <GoChevronDown color="white" />
            ) : (
              <GoChevronUp color="white" />
            )}
          </button>
        </div>

        {/* Menu de Navegação */}
        {navbarOpen && (
          <div className="hidden lg:flex flex-col space-y-4 text-white font-medium text-xs mt-8">
            <div className="flex flex-col">
              <div className="flex items-center">
                <p className="text-sm">Cadastro</p>
                <button onClick={alterCadBar}>
                  {cadastroBar ? (
                    <GoChevronDown color="white" size={18} className="mt-1" />
                  ) : (
                    <GoChevronRight color="white" size={18} className="mt-1" />
                  )}
                </button>
              </div>

              {cadastroBar && (
                
                <ul className="flex flex-col gap-1 mt-2 px-1">
                  <li>
                    <a href="/registerSetor" className="hover:text-gray-200">
                      Cadastrar Setor
                    </a>
                  </li>

                  <li>
                    <a href="/registerSetor" className="hover:text-gray-200">
                      Cadastrar Documento
                    </a>
                  </li>
                </ul>
     
              )}
            </div>



            <div className="flex flex-col">
              <div className="flex items-center">
                <p className="text-sm">Listagem</p>
                <button onClick={alterListagem}>
                  {listagemBar ? (
                    <GoChevronDown color="white" size={18} className="mt-1" />
                  ) : (
                    <GoChevronRight color="white" size={18} className="mt-1" />
                  )}
                </button>
              </div>

              {listagemBar && (
                
                <ul className="flex flex-col gap-1 mt-2 px-1">
                  <li>
                    <a href="/registerSetor" className="hover:text-gray-200">
                      Listagem De Documentos
                    </a>
                  </li>

                  <li>
                    <a href="/registerSetor" className="hover:text-gray-200">
                      Listagem De Setores
                    </a>
                  </li>
                </ul>
     
              )}
            </div>




            <div className="flex flex-col">
              <div className="flex items-center">
                <p className="text-sm">Gerenciamento</p>
                <button onClick={alterGerenciamento}>
                  {gerenciamentoBar ? (
                    <GoChevronDown color="white" size={18} className="mt-1" />
                  ) : (
                    <GoChevronRight color="white" size={18} className="mt-1" />
                  )}
                </button>
              </div>

              {gerenciamentoBar && (
                
                <ul className="flex flex-col gap-1 mt-2 px-1">
                  <li>
                    <a href="/registerSetor" className="hover:text-gray-200">
                      Cadastrar Setor
                    </a>
                  </li>

                  <li>
                    <a href="/registerSetor" className="hover:text-gray-200">
                      Cadastrar Documento
                    </a>
                  </li>
                </ul>
     
              )}
            </div>
          </div>
        )}

     

      </div>

      {/* Responsividade - Ícone de Menu (para mobile) */}
      <div className="lg:hidden flex flex-col items-center">
        <button className="text-white">
          {/* Ícone de menu para telas pequenas */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  );
}
