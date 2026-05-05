"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner, Card } from "flowbite-react";

export default function ProfessorDashboard() {
  const { user, loading } = useAuth();

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
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Painel Professor
      </h1>
      <Card>
        <h5 className="text-xl font-bold tracking-tight text-gray-900">
          Bem-vinda, {user?.name}!
        </h5>
        <p className="font-normal text-gray-700">
          Aqui você pode gerenciar todas suas ocorrências do iFlow.
        </p>
      </Card>
    </div>
  );
}
