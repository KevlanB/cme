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
import { Edit, PlusCircle, Search, Trash2 } from "lucide-react";
import axios from "axios";

import { formatDateTimeBR } from "@/utils/dateHours";
import { formatDate } from "@/utils/date";
import DefaultLayout from "@/layouts/default";
import ModalNewProduct from "@/components/Modals/Create/ModalNewMaterial";
import ModalEditMaterials from "@/components/Modals/Edit/ModalEditMaterials";
import ModalDelete from "@/components/Modals/Delete/ModalDeleteMaterial";

export const columns = [
  { name: "ID", uid: "id" },
  { name: "NOME", uid: "name" },
  { name: "SERIAL", uid: "serial" },
  { name: "VALIDADE", uid: "expiration_date" },
  { name: "DATA DE CRIAÇÃO", uid: "created_at" },
  { name: "FLUXO", uid: "flow" },
  { name: "AÇÕES", uid: "actions" },
];

type DataMaterial = {
  id: number;
  name: string;
  type: string;
} | null;

export default function MaterialsPage() {
  // Estado para armazenar os produtos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDataMaterial, setCurrentDataMaterial] =
    useState<DataMaterial>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const {
    isOpen: isOpenNewProduct,
    onOpen: onOpenNewProduct,
    onClose: onCloseNewProduct,
  } = useDisclosure();

  const {
    isOpen: isOpenEditMaterial,
    onOpen: onOpenEditMaterial,
    onClose: onCloseEditMaterial,
  } = useDisclosure();

  const {
    isOpen: isOpenDeleteMaterial,
    onOpen: onOpenDeleteMaterial,
    onClose: onCloseDeleteMaterial,
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

      case "flow":
        return <div>{cellValue.name}</div>;

      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-center">
            <Tooltip content="Editar">
              <span className="text-lg text-default-600 cursor-pointer active:opacity-50">
                <Edit onClick={() => handleEditMaterial(product)} />
              </span>
            </Tooltip>
            <Tooltip content="Excluir">
              <span className="text-lg text-default-600 cursor-pointer active:opacity-50">
                <Trash2 onClick={() => handleDeleteMaterial(product)} />
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
    onCloseEditMaterial();
    onCloseDeleteMaterial();
    fetchProducts();
  };

  const handleEditMaterial = (initialData: any) => {
    setCurrentDataMaterial(initialData);
    onOpenEditMaterial();
  };

  const handleDeleteMaterial = (initialData: any) => {
    setCurrentDataMaterial(initialData);
    onOpenDeleteMaterial();
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-start py-8 md:py-0 w-[100vw] h-[80vh] px-2">
        <div className="flex flex-col w-full gap-2 mt-4">
          <div className="flex justify-end gap-2">
            <Input
              className="flex flex-row items-center justify-center w-60"
              endContent={<Search size={18} />}
              placeholder="Buscar material"
              size="md"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <TableBody items={filtered}>
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
        <ModalEditMaterials
          initialData={currentDataMaterial}
          isOpen={isOpenEditMaterial}
          onClose={handleCloseModal}
        />
        <ModalDelete
          initialData={currentDataMaterial}
          isOpen={isOpenDeleteMaterial}
          onClose={handleCloseModal}
        />
      </section>
    </DefaultLayout>
  );
}
