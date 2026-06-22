"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner, Card, Button } from "flowbite-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto mt-20 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 transition-colors">
        Bem-vindo, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total de ocorrências
          </p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            30
          </h2>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ocorrências pendentes
          </p>
          <h2 className="text-4xl font-bold text-yellow-600">5</h2>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Taxa de resolução
          </p>
          <h2 className="text-4xl font-bold text-green-600">40%</h2>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button color="success">Cadastrar nova ocorrência</Button>

        <Link href="/dashboard/admin/cadastrar-usuario">
          <Button color="light"
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">
            Cadastrar novo perfil
          </Button>
        </Link>
        <Button
          color="light"
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Visualizar todas
        </Button>
      </div>
    </div>
  );
}
