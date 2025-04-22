import {
  Contact,
  House,
  Milestone,
  Scissors,
  Users,
  Workflow,
} from "lucide-react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  adminItems: [
    {
      label: "Início",
      href: "/",
      icon: House, // Aqui o ícone é passado como um JSX válido
    },
    {
      label: "Usuários",
      href: "/users",
      icon: Users,
    },
    {
      label: "Materiais",
      href: "/materials",
      icon: Scissors,
    },
    {
      label: "Etapas",
      href: "/steps",
      icon: Milestone,
    },
    {
      label: "Funções",
      href: "/roles",
      icon: Contact,
    },
    {
      label: "Fluxos",
      href: "/flows",
      icon: Workflow,
    },
  ],
  tecItems: [
    {
      label: "Início",
      href: "/",
      icon: House, // Aqui o ícone é passado como um JSX válido
    },
    {
      label: "Materiais",
      href: "/materials",
      icon: Scissors,
    },
  ],
  enfItems: [
    {
      label: "Início",
      href: "/",
      icon: House, // Aqui o ícone é passado como um JSX válido
    },

    {
      label: "Materiais",
      href: "/materials",
      icon: Scissors,
    },
  ],
  navMenuItems: [
    {
      label: "Início",
      href: "/",
      icon: House,
    },
    {
      label: "Usuários",
      href: "/users",
      icon: Users,
    },
    {
      label: "Materiais",
      href: "/materials",
      icon: Scissors,
    },
    {
      label: "Etapas",
      href: "/steps",
      icon: Milestone,
    },
    {
      label: "Funções",
      href: "/roles",
      icon: Contact,
    },

    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
