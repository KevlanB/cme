import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");

  return `${day}/${month}/${year}`;
}

export function formatDateComplete(date: Date | string): string {
  if (date === null) {
    return "";
  }

  return format(new Date(date), "dd/MM/yyyy '|' HH:mm:ss", {
    locale: ptBR,
  });
}
