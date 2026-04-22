'use client';

import { Button, Card, Label, TextInput } from "flowbite-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8faf9] to-[#e6f2ea] flex items-center justify-center p-4 relative overflow-hidden">
      
{/* 🔹 ESQUERDA */}
<div className="absolute pointer-events-none" style={{ right: 'calc(48% + 240px)', top: '32%', transform: 'translateY(-50%)' }}>
  <div className="relative" style={{ width: '90px', height: '270px' }}>
    <div className="absolute bg-[#6ab17e] rounded-lg" style={{ width: '26px', height: '26px', top: '0px', left: '64px' }} />
    <div className="absolute bg-[#6ab17e] rounded-xl" style={{ width: '44px', height: '44px', top: '38px', left: '46px' }} />
    <div className="absolute bg-[#6ab17e] rounded-xl" style={{ width: '44px', height: '44px', top: '94px', left: '0px' }} />
    <div className="absolute bg-[#6ab17e] rounded-lg" style={{ width: '24px', height: '44px', top: '94px', left: '52px' }} />
    <div className="absolute bg-[#6ab17e] rounded-xl" style={{ width: '44px', height: '44px', top: '146px', left: '0px' }} />
    <div className="absolute bg-[#6ab17e] rounded-lg" style={{ width: '24px', height: '44px', top: '146px', left: '52px' }} />
    <div className="absolute bg-[#6ab17e] rounded-xl" style={{ width: '44px', height: '44px', top: '198px', left: '0px' }} />
  </div>
</div>

{/* DIREITA */}
<div className="absolute pointer-events-none" style={{ left: 'calc(50% + 240px)', top: '70%', transform: 'translateY(-44%)' }}>
  <div className="relative" style={{ width: '100px', height: '300px' }}>
    <div className="absolute bg-[#6ab17e] rounded-lg" style={{ width: '36px', height: '36px', top: '0px', left: '0px' }} />
    <div className="absolute bg-[#6ab17e] rounded-lg" style={{ width: '36px', height: '36px', top: '0px', left: '46px' }} />
    <div className="absolute bg-[#6ab17e] rounded-full" style={{ width: '8px', height: '8px', top: '56px', left: '-18px' }} />
    {[0,1,2,3,4].map(i => (
      <div key={i} className="absolute bg-[#6ab17e] rounded-xl" style={{
        width: '36px', height: '36px',
        top: `${48 + Math.floor(i/2) * 48}px`,
        left: `${(i % 2) * 46}px`
      }} />
    ))}
    <div className="absolute bg-[#6ab17e] rounded-xl" style={{ width: '36px', height: '36px', top: '145px', left: '-45px' }} />
    <div className="absolute bg-[#6ab17e] rounded-lg" style={{ width: '28px', height: '28px', top: '190px', left: '4px' }} />
  </div>
</div>
      <Card className="max-w-md w-full shadow-2xl border-none backdrop-blur-md bg-white rounded-md z-10">      
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-500 text-sm">Acesse sua conta</p>
        </div>
        <form className="flex flex-col gap-4 " >         
         <div>
            <Label htmlFor="email" value="Email" className="text-gray-600" />
            <TextInput 
              id="email" 
              type="email" 
              required 
              shadow 
              placeholder="Digite seu email"
            />
          </div>

          <div>
            <Label htmlFor="password" value="Senha" className="text-gray-600" />
            <TextInput 
              id="password" 
              type="password" 
              required 
              shadow 
              placeholder="Digite sua senha"
            />
          </div>

          <Button 
            type="submit" 
            className="bg-[#5da16f] hover:bg-[#4a8a59] transition-colors mt-4 rounded-lg"
          >
            Entrar
          </Button>

        </form>
      </Card>
    </main>
  );
}