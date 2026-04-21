'use client';

import { Button, Card, Label, TextInput } from "flowbite-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f8faf9] flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:grid grid-cols-3 gap-2 opacity-40">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-[#5da16f] rounded-sm" />
        ))}
      </div>

      <Card className="max-w-md w-full shadow-lg border-none">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">login</h1>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="email" className="text-gray-500" />
            </div>
            <TextInput id="email" type="email" required shadow />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="senha" className="text-gray-500" />
            </div>
            <TextInput id="password" type="password" required shadow />
          </div>

          <Button 
            type="submit" 
            className="bg-[#5da16f] enabled:hover:bg-[#4a8a59] transition-colors mt-4"
          >
            entrar
          </Button>
        </form>
      </Card>

      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:grid grid-cols-2 gap-2 opacity-40">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-[#5da16f] rounded-sm" />
        ))}
      </div>
    </main>
  );
}