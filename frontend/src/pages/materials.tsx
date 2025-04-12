import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { Edit, Eye, PlusCircle, Search, Trash2 } from "lucide-react";
import axios from "axios";

import { formatDateTimeBR } from "@/utils/dateHours";
import DefaultLayout from "@/layouts/default";
import ModalNewProduct from "@/components/ModalNewMaterial";

export const columns = [
  { name: "ID", uid: "id" },
  { name: "NOME", uid: "name" },
  { name: "SERIAL", uid: "serial" },
  { name: "VALIDADE", uid: "expiration_date" },
  { name: "ETAPA", uid: "step" },
  { name: "DATA", uid: "created_at" },
  { name: "ATUALIZADO", uid: "updated_at" },
  { name: "AÇÕES", uid: "actions" },
];

export default function MaterialsPage() {
  // Estado para armazenar os produtos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    isOpen: isOpenNewProduct,
    onOpen: onOpenNewProduct,
    onClose: onCloseNewProduct,
  } = useDisclosure();
  const API_URL = import.meta.env.VITE_API_URL;
  // Função para buscar produtos

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/materials`);

      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar os produtos.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  function formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-");

    return `${day}/${month}/${year}`;
  }

  // Função para renderizar as células
  const renderCell = (product: any, columnKey: any) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "expiration_date":
        return cellValue !== null && <div>{formatDate(cellValue)}</div>;
      case "step":
        return <div>{cellValue.name}</div>;
      case "created_at":
        return <div>{formatDateTimeBR(cellValue)}</div>;

      case "updated_at":
        return <div>{formatDateTimeBR(cellValue)}</div>;

      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-center">
            <Tooltip content="Detalhes">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Eye />
              </span>
            </Tooltip>
            <Tooltip content="Editar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Edit />
              </span>
            </Tooltip>
            <Tooltip content="Excluir Produto">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Trash2 />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const handleNewProduct = () => {
    onOpenNewProduct();
  };

  const handleCloseModal = () => {
    onCloseNewProduct();
    fetchProducts();
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-start py-8 md:py-0 w-[100vw] h-[80vh] px-2">
        <div className="flex flex-col w-full gap-2 mt-4">
          <div className="flex justify-end">
            <Input
              className="flex flex-row items-center justify-center w-60"
              endContent={<Search size={18} />}
              placeholder="Buscar produto"
              size="md"
              type="text"
            />
            <Button
              color="primary"
              startContent={<PlusCircle size={18} />}
              onPress={handleNewProduct}
            >
              Novo
            </Button>
          </div>

          <Table aria-label="Tabela de Produtos">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={products}>
              {(item: any) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <ModalNewProduct isOpen={isOpenNewProduct} onClose={handleCloseModal} />
      </section>
    </DefaultLayout>
  );
}
