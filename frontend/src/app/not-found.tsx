import Link from 'next/link';
import { Button } from 'flowbite-react';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <h1 className="text-9xl font-extrabold text-[#5da16f] opacity-20">404</h1>
      <div className="absolute">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Parece que você tentou acessar um caminho que não existe no iFlow. 
          Verifique a URL ou volte para a segurança da sua dashboard.
        </p>
        <div className="flex justify-center">
          <Link href="/" passHref>
            <Button className="bg-[#5da16f] hover:bg-[#4a8a59]">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}