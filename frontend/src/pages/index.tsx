import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  Input,
  addToast,
} from "@heroui/react";
import { CheckCheck, Search, TriangleAlert } from "lucide-react";
import axios from "axios";

import { formatDateTimeBR } from "@/utils/dateHours";
import DefaultLayout from "@/layouts/default";
import ModalNewProduct from "@/components/ModalNewMaterial";

export const columns = [
  { name: "SERIAL", uid: "serial" },
  { name: "NOME", uid: "name" },
  { name: "VALIDADE", uid: "expiration_date" },
  { name: "DATA DE CRIAÇÃO", uid: "created_at" },
  { name: "ETAPA ATUAL", uid: "step" },
  { name: "FLUXO", uid: "flow" },
  { name: "AÇÕES", uid: "actions" },
];

export default function IndexPage() {
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

  const nextStep = async (data: any) => {
    try {
      await axios.patch(`${API_URL}/materials/${data.id}/next-step`);

      addToast({
        title: `${data.name} confirmado em ${data.step.name}!`,
        color: "success",
        variant: "flat",
      });

      fetchProducts();
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

      case "created_at":
        return <div>{formatDateTimeBR(cellValue)}</div>;

      case "updated_at":
        return <div>{formatDateTimeBR(cellValue)}</div>;

      case "step":
        return <div>{cellValue.name}</div>;

      case "flow":
        return <div>{cellValue.name}</div>;

      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-center">
            <Button
              color="success"
              startContent={<CheckCheck size={18} />}
              onPress={() => handleCheck(product)}
            >
              Confirmar Etapa
            </Button>
            <Button
              color="danger"
              startContent={<TriangleAlert size={18} />}
              onPress={handleNewProduct}
            >
              Reportar Falha
            </Button>
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

  const handleCheck = (data: any) => {
    console.log(data);
    nextStep(data);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-start py-8 md:py-0 w-[100vw] h-[80vh] px-2">
        <div className="flex flex-col w-full gap-2 mt-4">
          <div className="flex justify-end">
            <Input
              className="flex flex-row items-center justify-center w-60"
              endContent={<Search size={18} />}
              placeholder="Buscar material"
              size="md"
              type="text"
            />
            {/* <Button
              color="primary"
              startContent={<PlusCircle size={18} />}
              onPress={handleNewProduct}
            >
              Novo
            </Button> */}
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
