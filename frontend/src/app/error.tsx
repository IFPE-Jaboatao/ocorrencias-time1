'use client';
import { Button } from "flowbite-react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Ops! Algo deu errado.</h1>
      <p className="text-gray-600 mb-8">Não conseguimos carregar as informações do iFlow agora.</p>
      <Button onClick={() => reset()} color="gray">Tentar novamente</Button>
    </div>
  );
}