"use client";
import Image from "next/image";
import { useState } from "react";
import { GoChevronDown, GoChevronRight, GoChevronUp } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { TfiAlignJustify } from "react-icons/tfi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbCheckupList, TbTransfer } from "react-icons/tb";
import { IoList } from "react-icons/io5";

/**
 * Componente de Navegação principal
 * Responsável por exibir a barra lateral em desktop e menu hamburguer em mobile
 */
export default function NavBar() {
  // Estado para controlar a exibição da navbar em desktop
  const [navbarOpen, setNavbarOpen] = useState(true);
  
  // Estado para controlar o submenu de listagem
  const [cadastroBar, setCadastroBar] = useState(false);
  
  // Estado para controlar o menu mobile
  const [menuMobile, setMenuMobile] = useState(false);

  // Handlers para controle de estado
  const toggleCadastroBar = () => setCadastroBar(!cadastroBar);
  const toggleNavbar = () => setNavbarOpen(!navbarOpen);
  const toggleMobileMenu = () => setMenuMobile(!menuMobile);

  return (
    <div>
      {/* Navbar Principal */}
      <nav className="w-full flex items-center justify-between bg-blue-600 py-4 px-6 lg:w-52 lg:min-h-screen lg:flex-col lg:justify-start lg:pt-8">
        {/* Desktop: Logo e Menu */}
        <div className="hidden lg:flex flex-col">
          {/* Cabeçalho com Logo */}
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
                <span className="text-sm text-white font-bold">Solasstec</span>
                <span className="text-xs text-white font-semibold">Tecnologia</span>
              </div>
            </div>
            {/* Botão para expandir/recolher menu */}
            <button onClick={toggleNavbar}>
              {navbarOpen ? (
                <GoChevronDown color="white" />
              ) : (
                <GoChevronUp color="white" />
              )}
            </button>
          </div>

          {/* Menu Desktop */}
          {navbarOpen && (
            <div className="hidden lg:flex flex-col space-y-4 text-white font-medium text-xs mt-8 gap-3">
              {/* Item Dashboard */}
              <div className="flex items-center gap-3">
                <RxDashboard className="mt[0.2rem]" size={14}/>
                <a href="/" className="text-sm">Dashboard</a>
              </div>

              {/* Item Tramitação */}
              <div className="flex items-center gap-2 cursor-pointer">
                <TbTransfer className="mt-[0.2rem]" size={16}/>
                <a href="/tramite" className="text-sm">Tramitação</a>
              </div>

              {/* Submenu Listagem */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TfiAlignJustify className="mt-[0.2rem]" size={14}/>
                    <p className="text-sm">Listagem</p>
                  </div>
                  <button onClick={toggleCadastroBar}>
                    {cadastroBar ? (
                      <GoChevronDown color="white" size={18} className="mt-1" />
                    ) : (
                      <GoChevronRight color="white" size={18} className="mt-1" />
                    )}
                  </button>
                </div>

                {/* Submenu itens */}
                {cadastroBar && (
                  <ul className="flex flex-col gap-1 mt-2 px-1">
                    <div className="flex items-center gap-2">
                      <TbCheckupList size={15}/>
                      <li>
                        <a href="/listSetor" className="hover:text-gray-200 text-xs">
                          Listagem de Setores
                        </a>
                      </li>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoDocumentTextOutline size={15}/>
                      <li>
                        <a href="/listDocumento" className="hover:text-gray-200">
                          Listagem de Documentos
                        </a>
                      </li>
                    </div>
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile: Header */}
        <div className="lg:hidden flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/iconsola.png"
              alt="Ícone Solastec"
              height={40}
              width={50}
              priority
              className="object-contain"
            />
            <div className="flex flex-col">
              <p className="text-white font-bold text-lg tracking-wide">Solasstec</p>
              <p className="text-white/80 font-medium text-sm tracking-wider">Tecnologia</p>
            </div>
          </div>
          <button 
            onClick={toggleMobileMenu} 
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors duration-200"
          >
            <IoList color="white" size={24}/>
          </button>
        </div>
      </nav>

      {/* Mobile: Menu Dropdown */}
      {menuMobile && (
        <div className="p-4 text-white bg-blue-600">
          <div className="flex flex-col space-y-4">
            <a href="/" className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded">
              <RxDashboard size={14} />
              <span>Dashboard</span>
            </a>

            <a href="/tramite" className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded">
              <TbTransfer size={16} />
              <span>Tramitação</span>
            </a>

            <a href="/listSetor" className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded">
              <TbCheckupList size={15} />
              <span>Listagem de Setores</span>
            </a>

            <a href="/listDocumento" className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded">
              <IoDocumentTextOutline size={15} />
              <span>Listagem de Documentos</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}