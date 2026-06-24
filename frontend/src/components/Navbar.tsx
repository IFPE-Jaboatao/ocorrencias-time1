"use client";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { DarkThemeToggle } from "flowbite-react";
import {
  HiHome,
  HiClipboardList,
  HiOutlineLogout,
  HiUserAdd,
  HiUsers,
} from "react-icons/hi";
import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  if (pathname === "/login" || (!user && !loading)) return null;

  const userRole = (user?.funcao || "aluno").toLowerCase();

  const menuItems = [
    {
      id: "home",
      href: userRole === "admin" ? "/dashboard/admin" : "/dashboard/professor",
      icon: HiHome,
      label: "Início",
      roles: ["admin", "professor"],
    },
    {
      id: "historico-ocorrencias",
      href: "/historico-ocorrencias",
      icon: HiUsers,
      label: "Histórico de Alunos",
      roles: ["admin", "professor"],
    },
    {
      id: "ocorrencias",
      href: "/ocorrencias",
      icon: HiClipboardList,
      label: "Ocorrências",
      roles: ["admin", "professor"],
    },
    {
      id: "usuarios",
      href: "/dashboard/admin/cadastrar-usuario",
      icon: HiUserAdd,
      label: "Cadastrar Perfil",
      roles: ["admin"],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center bg-green-700 p-2 px-4 rounded-full shadow-2xl gap-3 border border-white/10 backdrop-blur-md">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              className={`relative p-3 rounded-full transition-all duration-300 ${isActive ? "text-green-700" : "text-white hover:bg-green-600"}`}
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-white rounded-full shadow-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10">
                <item.icon size={24} />
              </div>
            </Link>
          );
        })}

        <div className="w-[1px] h-6 bg-white/20 mx-1" />
        <DarkThemeToggle className="text-white hover:bg-green-600 border-none focus:ring-0 p-3 rounded-full flex items-center justify-center w-12 h-12 [&>svg]:w-6 [&>svg]:h-6" />
        <button
          onClick={logout}
          className="text-white hover:bg-red-500 p-3 rounded-full transition-all"
          title="Sair do sistema"
        >
          <HiOutlineLogout size={24} />
        </button>
      </div>
    </nav>
  );
}
