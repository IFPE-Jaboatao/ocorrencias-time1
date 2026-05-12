"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { DarkThemeToggle } from "flowbite-react";
import { HiHome, HiClipboardList } from "react-icons/hi";
import Link from "next/link";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

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

  if (loading) return null;

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center bg-green-700 dark:bg-green-800 p-2 px-4 rounded-full shadow-2xl gap-3 border border-white/10 backdrop-blur-md">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`p-3 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-white text-green-700 -translate-y-2 shadow-lg"
                  : "text-white hover:bg-green-600"
              }`}
            >
              <Icon size={24} />
            </Link>
          );
        })}
        <div className="w-[1px] h-6 bg-white/20 mx-1" />
        <DarkThemeToggle className="text-white hover:bg-green-600 border-none focus:ring-0 rounded-full" />
      </div>
    </nav>
  );
}
