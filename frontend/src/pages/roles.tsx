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
import ModalNewRoles from "@/components/Modals/Create/ModalNewRoles";
import ModalEdit from "@/components/Modals/Edit/ModalEditRoles";
import ModalDelete from "@/components/Modals/Delete/ModalDeleteRoles";

export const columns = [
  { name: "ID", uid: "id" },
  { name: "NOME", uid: "name" },
  { name: "AÇÕES", uid: "actions" },
];

type DataMaterial = {
  id: number;
  name: string;
  type: string;
} | null;

export default function RolesPage() {
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
    isOpen: isOpenEditRoles,
    onOpen: onOpenEditRoles,
    onClose: onCloseEditRoles,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteRoles,
    onOpen: onOpenDeleteRoles,
    onClose: onCloseDeleteRoles,
  } = useDisclosure();

  const API_URL = import.meta.env.VITE_API_URL;
  // Função para buscar produtos

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/roles`);

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

    switch (columnKey) {
      case "description":
        return <div>{cellValue}</div>;
      case "code":
        return <div>{cellValue}</div>;
      case "price":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {typeof cellValue === "number" ? cellValue.toFixed(2) : cellValue}
            </p>
          </div>
        );
      case "isActive":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[cellValue]}
            size="sm"
            variant="flat"
          >
            {cellValue ? "Ativo" : "Inativo"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-center">
            <Tooltip content="Editar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Edit onClick={() => handleEditSteps(product)} />
              </span>
            </Tooltip>
            <Tooltip content="Excluir">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Trash2 onClick={() => handleDeleteSteps(product)} />
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
    onCloseEditRoles();
    onCloseDeleteRoles();
    fetchProducts();
  };

  const handleEditSteps = (initialData: any) => {
    setCurrentDataMaterial(initialData);
    onOpenEditRoles();
  };

  const handleDeleteSteps = (initialData: any) => {
    setCurrentDataMaterial(initialData);
    onOpenDeleteRoles();
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-start py-8 md:py-0 w-[100vw] h-[80vh] px-2">
        <div className="flex flex-col w-full gap-2 mt-4">
          <div className="flex justify-end">
            <Input
              className="flex flex-row items-center justify-center w-60"
              endContent={<Search size={18} />}
              placeholder="Buscar função"
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

        <ModalNewRoles isOpen={isOpenNewProduct} onClose={handleCloseModal} />
        <ModalEdit
          initialData={currentDataMaterial}
          isOpen={isOpenEditRoles}
          onClose={handleCloseModal}
        />
        <ModalDelete
          initialData={currentDataMaterial}
          isOpen={isOpenDeleteRoles}
          onClose={handleCloseModal}
        />
      </section>
    </DefaultLayout>
  );
}
