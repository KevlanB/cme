import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Image,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Divider,
} from "@heroui/react";
import { Menu, Moon, Power, Sun } from "lucide-react";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { useTheme } from "@heroui/use-theme";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import authService from "@/helpers/auth.service";
import { siteConfig } from "@/config/site";

type Role = {
  id: number;
  name: string;
};

type UserType = {
  role: Role;
};

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserType | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getMyData = async () => {
      const userString = localStorage.getItem("user");

      // Verifica se o valor não é nulo antes de fazer o parse
      if (userString) {
        const user = JSON.parse(userString);

        // Verifica se o "user" existe e contém o "access_token"
        if (user && user.access_token) {
          const token = user.access_token;

          await axios
            .get(`${API_URL}/users/find/me`, {
              headers: {
                Authorization: `Bearer ${token}`, // Incluindo o token no cabeçalho da requisição
              },
            })
            .then((response) => {
              setUser(response.data);
            })
            .catch((error) => {
              console.error("Erro ao buscar os dados:", error);
              authService.logout();
            });
        } else {
          console.error("Token não encontrado");
        }
      } else {
        console.error("Usuário não encontrado no localStorage");
      }
    };

    getMyData();
  }, []);

  return (
    <div className="relative flex flex-col h-screen">
      <div className="flex justify-between py-1 px-3 items-center">
        <div className="flex gap-2 items-center">
          <Button isIconOnly className="bg-transparent" onPress={onOpen}>
            <Menu />
          </Button>
          <Image
            alt="HeroUI hero Image"
            radius="none"
            src="/logo.png"
            width={140}
          />
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Avatar showFallback className="cursor-pointer" src="" />
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Power size={16} />}
              onPress={() => authService.logout()}
            >
              Sair
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Drawer
        backdrop="blur"
        isOpen={isOpen}
        placement="left"
        size="xs"
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1 text-md">
                Central de Materiais e Esterilização
              </DrawerHeader>
              <Divider />
              <DrawerBody className="mt-2">
                {user?.role.name === "Administrativo"
                  ? siteConfig.adminItems.map((item) => {
                      const Icon = item.icon; // Extrai o ícone como um componente válido

                      return (
                        <div
                          key={item.href}
                          className="flex items-center gap-2"
                        >
                          <NavLink
                            className={({}) =>
                              clsx(linkStyles({ color: "foreground" }))
                            }
                            to={item.href}
                          >
                            <div className="flex gap-2 items-center">
                              {Icon && <Icon size={18} />}
                              {item.label}
                            </div>
                          </NavLink>
                        </div>
                      );
                    })
                  : user?.role.name === "Técnico"
                    ? siteConfig.tecItems.map((item) => {
                        const Icon = item.icon; // Extrai o ícone como um componente válido

                        return (
                          <div
                            key={item.href}
                            className="flex items-center gap-2"
                          >
                            <NavLink
                              className={({}) =>
                                clsx(linkStyles({ color: "foreground" }))
                              }
                              to={item.href}
                            >
                              <div className="flex gap-2 items-center">
                                {Icon && <Icon size={18} />}
                                {item.label}
                              </div>
                            </NavLink>
                          </div>
                        );
                      })
                    : siteConfig.enfItems.map((item) => {
                        const Icon = item.icon; // Extrai o ícone como um componente válido

                        return (
                          <div
                            key={item.href}
                            className="flex items-center gap-2"
                          >
                            <NavLink
                              className={({}) =>
                                clsx(linkStyles({ color: "foreground" }))
                              }
                              to={item.href}
                            >
                              <div className="flex gap-2 items-center">
                                {Icon && <Icon size={18} />}
                                {item.label}
                              </div>
                            </NavLink>
                          </div>
                        );
                      })}
                <div className="flex flex-row items-start py-0 my-[-10px]">
                  {theme === "light" ? (
                    <Button
                      className="bg-transparent rounded-none px-0 text-left flex items-left justify-start w-full py-0"
                      startContent={<Moon size={18} />}
                      onPress={() => setTheme("dark")}
                    >
                      <h1 className="text-[16px]">Tema</h1>
                    </Button>
                  ) : (
                    <Button
                      className="bg-transparent rounded-none px-0 text-left flex items-left justify-start w-full py-0"
                      startContent={<Sun size={18} />}
                      onPress={() => setTheme("light")}
                    >
                      <h1 className="text-[16px]">Tema</h1>
                    </Button>
                  )}
                </div>
              </DrawerBody>
              <DrawerFooter className="flex flex-row-reverse" />
            </>
          )}
        </DrawerContent>
      </Drawer>

      <main className="container px-0 flex-grow pt-0">{children}</main>
    </div>
  );
}
