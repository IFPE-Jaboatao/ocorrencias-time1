'use client';
import { useState } from "react"; 
import { Button, Card,  Label,TextInput ,Spinner} from "flowbite-react";
import { api } from "@/services/api"; 
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
const [login, setLogin] = useState(""); 
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState<{ type: 'error' | 'loading' | null, message: string }>({ type: null, message: "" });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: "" });

    try {
      const response = await api.post('/auth/login', { login, senha });

      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        router.push('/dashboard');
      } else {
        setStatus({ type: 'error', message: "Usuário ou senha incorretos" });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Não foi possível conectar ao servidor" });
    }
  };
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
        <Card className="max-w-md w-full shadow-2xl border-none backdrop-blur-md rounded-md bg-white z-10">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-700">Login</h1>
        </div>

        {status.type === 'error' && (
          <Alert color="failure" icon={HiInformationCircle} className="mb-2">
            {status.message}
          </Alert>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="text-gray-600">Usuário</label>
            <TextInput 
              placeholder="Digite seu usuário"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              color={status.type === 'error' ? "failure" : "gray"}
              required 
            />
          </div>

          <div>
            <label className="text-gray-600">Senha</label>
            <TextInput 
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              color={status.type === 'error' ? "failure" : "gray"}
              required 
            />
          </div>
         <Button 
          type="submit" 
  className="bg-[#5da16f] hover:bg-[#4a8a59] transition-all"
  disabled={status.type === 'loading'}
>
  {status.type === 'loading' ? (
    <div className="flex items-center gap-3">
      <Spinner size="sm" light={true} />
      <span>Carregando...</span>
    </div>
  ) : (
    "Entrar"
  )}
</Button>
        </form>
      </Card>
    </main>
  );
}