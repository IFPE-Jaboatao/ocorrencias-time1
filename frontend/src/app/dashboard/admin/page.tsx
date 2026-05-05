"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner, Card, Button } from "flowbite-react";
import { HiOutlineLogout } from "react-icons/hi";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        role="status"
      >
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Painel Administrativo
        </h1>

        <Button
          color="failure"
          size="sm"
          onClick={logout}
          className="flex items-center gap-2"
        >
          <HiOutlineLogout className="h-5 w-5 mr-2" />
          Sair do iFlow
        </Button>
      </div>

      <Card>
        <h5 className="text-xl font-bold tracking-tight text-gray-900">
          Bem-vinda, {user?.name}!
        </h5>
        <p className="font-normal text-gray-700">
          Aqui você pode gerenciar todas as ocorrências do iFlow.
        </p>
      </Card>
    </div>
  );
}
