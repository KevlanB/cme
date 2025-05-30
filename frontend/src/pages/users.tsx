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
import ModalNewUser from "@/components/Modals/Create/ModalNewUser";
import ModalEditUser from "@/components/Modals/Edit/ModalEditUser";
import ModalDelete from "@/components/Modals/Delete/ModalDeleteUser";

export const columns = [
  { name: "ID", uid: "id" },
  { name: "NOME", uid: "name" },
  { name: "USUÁRIO", uid: "username" },
  { name: "FUNÇÃO", uid: "role" },
  { name: "STATUS", uid: "active" },
  { name: "AÇÕES", uid: "actions" },
];

type DataUser = {
  id: number;
  name: string;
  username: string;
  role_id: number;
  isActive: boolean;
} | null;

export default function UsersPage() {
  // Estado para armazenar os produtos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDataUser, setCurrentDataUser] = useState<DataUser>(null);
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
    isOpen: isOpenEditUser,
    onOpen: onOpenEditUser,
    onClose: onCloseEditUser,
  } = useDisclosure();

  const {
    isOpen: isOpenDeleteUser,
    onOpen: onOpenDeleteUser,
    onClose: onCloseDeleteUser,
  } = useDisclosure();
  const API_URL = import.meta.env.VITE_API_URL;
  // Função para buscar produtos

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);

      setProducts(response.data);
      setLoading(false);
    } catch {
      setError("Erro ao carregar os produtos.");
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
      case "role":
        return <div>{cellValue.name}</div>;
      case "active":
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
                <Edit onClick={() => handleEditUser(product)} />
              </span>
            </Tooltip>
            <Tooltip content="Excluir">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Trash2 onClick={() => handleDeleteUser(product)} />
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
    onCloseDeleteUser();
    onCloseEditUser();
    fetchProducts();
  };

  const handleEditUser = (initialData: any) => {
    setCurrentDataUser(initialData);
    onOpenEditUser();
  };

  const handleDeleteUser = (initialData: any) => {
    setCurrentDataUser(initialData);
    onOpenDeleteUser();
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-start py-8 md:py-0 w-[100vw] h-[80vh] px-2">
        <div className="flex flex-col w-full gap-2 mt-4">
          <div className="flex justify-end gap-2">
            <Input
              className="flex flex-row items-center justify-center w-60"
              endContent={<Search size={18} />}
              placeholder="Buscar usuário"
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

        <ModalNewUser isOpen={isOpenNewProduct} onClose={handleCloseModal} />
        <ModalEditUser
          initialData={currentDataUser}
          isOpen={isOpenEditUser}
          onClose={handleCloseModal}
        />
        <ModalDelete
          initialData={currentDataUser}
          isOpen={isOpenDeleteUser}
          onClose={handleCloseModal}
        />
      </section>
    </DefaultLayout>
  );
}
