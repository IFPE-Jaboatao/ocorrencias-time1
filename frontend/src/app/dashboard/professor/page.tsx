import { StatCard } from "@/components/StatCard";
import { api } from "@/services/api";

export default async function AdminPage() {

  const stats = { total: 30, pendentes: 5, taxa: "40%" }; // Mock enquanto o back não sobe

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Painel Administrativo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total de Ocorrências" value={stats.total} />
      </div>

    </div>
  );
}