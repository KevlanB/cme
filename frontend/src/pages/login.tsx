import { Button, Image, Input } from "@heroui/react";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";

import authService from "@/helpers/auth.service";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState("");
  const [eyePasswd, setEyePasswd] = useState(false);

  const onAuth = () => {
    navigate("/");
  };

  const handleLogin = async () => {
    setLoading(true);
    authService.login(username, passwd, onAuth);
    setLoading(false);
  };

  return (
    <section className="flex flex-col items-center justify-center w-screen h-screen">
      {/* Container principal */}
      <div className="flex flex-col md:flex-row w-full h-full bg-zinc-800">
        {/* Vídeo (visível apenas em desktop) */}
        <div className="hidden md:block md:w-1/2 relative">
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/forest2.mp4" type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
          <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Image
              alt="Imagem central"
              className="object-cover rounded-none"
              src="/logo.png"
              width={200}
            />
            <h1 className="font-bold text-black text-2xl">
              Central de Materiais e Esterilização
            </h1>
          </div>
        </div>

        {/* Formulário de login */}
        <div className="w-full md:w-1/2 p-8  flex items-center justify-center ">
          <div className="max-w-md text-center justify-center w-full gap-2 flex flex-col ">
            <h1 className="font-bold text-zinc-200 text-4xl">Bem vindo</h1>
            <h1 className=" text-zinc-200 text-xl mb-10">
              Entre com seu usuário e senha para acessar
            </h1>
            <Input
              label="Usuário"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              endContent={
                eyePasswd ? (
                  <Eye
                    className="cursor-pointer"
                    onClick={() => setEyePasswd(!eyePasswd)}
                  />
                ) : (
                  <EyeClosed
                    className="cursor-pointer"
                    onClick={() => setEyePasswd(!eyePasswd)}
                  />
                )
              }
              label="Senha"
              type={eyePasswd ? "text" : "password"}
              onChange={(e) => setPasswd(e.target.value)}
            />
            <Button color="primary" isLoading={loading} onPress={handleLogin}>
              Entrar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
