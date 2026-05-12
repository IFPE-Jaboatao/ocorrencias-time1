"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { DarkThemeToggle } from "flowbite-react";
import { HiHome, HiClipboardList } from "react-icons/hi";
import Link from "next/link";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  
  if (pathname === "/login" || (!user && !loading)) {
    return null;
  }

  const userRole = user?.funcao || "aluno";

  const menuItems = [
    {
      id: "home",
      href: "/", 
      icon: HiHome,
      label: "Início",
      roles: ["admin", "aluno", "professor", "responsavel"],
    },
    {
      id: "ocorrencias",
      href: "/ocorrencias",
      icon: HiClipboardList,
      label: "Ocorrências",
      roles: ["admin", "professor"],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center bg-green-700 dark:bg-green-800 p-2 px-4 rounded-full shadow-2xl gap-3 border border-white/10 backdrop-blur-md transition-colors duration-300">
        
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`p-3 rounded-full transition-all duration-300 group relative ${
                isActive
                  ? "bg-white text-green-700 -translate-y-2 shadow-lg scale-110"
                  : "text-white hover:bg-green-600 hover:scale-105"
              }`}
            >
              <Icon size={24} />
              
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </Link>
          );
        })}

        <div className="w-[1px] h-6 bg-white/20 mx-1" />

        <DarkThemeToggle 
          className="text-white hover:bg-green-600 border-none focus:ring-0 rounded-full transition-transform hover:scale-110" 
        />
      </div>
    </nav>
  );
}