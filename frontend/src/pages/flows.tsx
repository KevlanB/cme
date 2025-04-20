import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { Edit, PlusCircle, Search, Trash2 } from "lucide-react";
import axios from "axios";

import DefaultLayout from "@/layouts/default";
import ModalNewFlow from "@/components/ModalNewFlows";

export const columns = [
  { name: "ID", uid: "id" },
  { name: "NOME", uid: "name" },
  { name: "ETAPAS", uid: "steps" },
  { name: "AÇÕES", uid: "actions" },
];

export default function FlowsPage() {
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
      const response = await axios.get(`${API_URL}/flows`);

      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar as etapas.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const statusColorMap: any = {
    true: "success",
    false: "danger",
  };

  // Função para renderizar as células
  const renderCell = (product: any, columnKey: any) => {
    const cellValue = product[columnKey];

    {
      console.log(cellValue);
    }

    switch (columnKey) {
      case "steps":
        return (
          <>
            {cellValue.map((e) => (
              <Chip
                key={e.id}
                className="capitalize dark:text-white text-black"
                color="primary"
                size="sm"
                variant="flat"
              >
                {e.name}
              </Chip>
            ))}
          </>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-center">
            <Tooltip content="Editar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Edit />
              </span>
            </Tooltip>
            <Tooltip content="Excluir">
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
          <div className="flex justify-end gap-2">
            <Input
              className="flex flex-row items-center justify-center w-60"
              endContent={<Search size={18} />}
              placeholder="Buscar fluxo"
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

          <Table aria-label="Tabela de Funções">
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

        <ModalNewFlow isOpen={isOpenNewProduct} onClose={handleCloseModal} />
      </section>
    </DefaultLayout>
  );
}
