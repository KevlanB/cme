// utils/formatDateBR.ts
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateTimeBR(date: Date | string): string {
  if (date === null) {
    return "";
  }

  return format(new Date(date), "dd/MM/yyyy '-' HH:mm", {
    locale: ptBR,
  });
}
