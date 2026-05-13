"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner, Card, Button } from "flowbite-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Bem-vindo, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-sm text-gray-500">Total de ocorrências</p>
          <h2 className="text-4xl font-bold">30</h2>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Ocorrências pendentes</p>
          <h2 className="text-4xl font-bold text-yellow-600">5</h2>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Taxa de resolução</p>
          <h2 className="text-4xl font-bold text-green-600">40%</h2>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button color="success">Cadastrar nova ocorrência</Button>
        <Button color="light">Visualizar todas</Button>
      </div>
    </div>
  );
}
