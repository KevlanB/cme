import type { RangeValue } from "@react-types/shared";

import { useState } from "react";
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
  RangeCalendar,
} from "@heroui/react";
import { Calendar, Eye, Search } from "lucide-react";
import axios from "axios";
import { DateValue } from "@react-types/calendar";

import DefaultLayout from "@/layouts/default";
import ModalNewProduct from "@/components/Modals/Create/ModalNewMaterial";
import { formatDate, formatDateComplete } from "@/utils/date";
import DrawerDetails from "@/components/DrawerDetails";

export const columns = [
  { name: "NOME", uid: "material_name" },
  { name: "SERIAL", uid: "material_serial" },
  { name: "VALIDADE", uid: "material_expiration" },
  { name: "TIPO", uid: "material_type" },
  { name: "ETAPA ANTERIOR", uid: "from_step" },
  { name: "NOVA ETAPA", uid: "to_step" },
  { name: "DATA E HORA DO REGISTRO", uid: "date_register" },
  { name: "AÇÕES", uid: "actions" },
];

export default function TraceabilityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMaterial, setCurrentMaterial] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [valueDate, setValueDate] = useState<RangeValue<DateValue> | null>(
    null,
  );

  const [searchField, setSearchField] = useState("");

  const [dataList, setDataList] = useState([]);

  const {
    isOpen: isOpenNewProduct,
    onOpen: onOpenNewProduct,
    onClose: onCloseNewProduct,
  } = useDisclosure();

  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  const API_URL = import.meta.env.VITE_API_URL;
  // Função para buscar produtos

  const handleDetails = (data: []) => {
    setCurrentMaterial(data);
    onOpenDrawer();
  };

  const renderCell = (product: any, columnKey: any) => {
    switch (columnKey) {
      case "material_name":
        return product.material.name;

      case "material_serial":
        return product.material.serial;

      case "material_expiration":
        return product.material.expiration_date
          ? formatDate(product.material.expiration_date)
          : "-";

      case "material_type":
        return product.material.type;

      case "from_step":
        return product.from_step?.name ?? "-";

      case "to_step":
        return product.to_step?.name ?? "-";

      case "date_register":
        return formatDateComplete(product.changed_at);

      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-center">
            <Tooltip content="Detalhes">
              <span className="text-lg text-default-600 cursor-pointer active:opacity-50">
                <Eye onClick={() => handleDetails(product)} />
              </span>
            </Tooltip>
          </div>
        );

      default:
        return product[columnKey];
    }
  };

  const handleSearchLogs = async () => {
    const startDate = `${valueDate?.start.year}-${String(valueDate?.start.month).padStart(2, "0")}-${String(valueDate?.start.day).padStart(2, "0")}`;
    const endDate = `${valueDate?.end.year}-${String(valueDate?.end.month).padStart(2, "0")}-${String(valueDate?.end.day).padStart(2, "0")}`;

    if (searchField.length > 0) {
      await axios
        .get(`${API_URL}/materials/logs/by-serial/${searchField}`, {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        })
        .then((response) => {
          setDataList(response.data);
          setOpenCalendar(false);
        })
        .catch((error) => {
          console.error(error);
          setOpenCalendar(false);
        });
    } else {
      await axios
        .get(`${API_URL}/materials/logs/all`, {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        })
        .then((response) => {
          setDataList(response.data);
          console.log(response.data);
          setOpenCalendar(false);
        })
        .catch((error) => {
          console.error(error);
          setOpenCalendar(false);
        });
    }
  };

  const handleCloseModal = () => {
    onCloseNewProduct();
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-start py-8 md:py-0 w-[100vw] h-[80vh] px-2">
        <div className="flex flex-col w-full gap-2 mt-4 px-4">
          <div className="flex justify-end gap-2">
            <Input
              className="w-60"
              placeholder="Buscar por Serial"
              size="md"
              type="text"
              onChange={(e) => setSearchField(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                isIconOnly
                className={valueDate ? "bg-primary" : "bg-default"}
                onPress={() => setOpenCalendar(!openCalendar)}
              >
                {openCalendar ? (
                  <Calendar className="text-white-500" />
                ) : (
                  <Calendar className="text-default-500" />
                )}
              </Button>
              {openCalendar && (
                <RangeCalendar
                  aria-label="Date (No Selection)"
                  className="fixed mt-12 z-10"
                  value={valueDate}
                  onChange={setValueDate}
                />
              )}
            </div>

            <Button
              color="primary"
              startContent={<Search size={18} />}
              onPress={handleSearchLogs}
            >
              Buscar
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
            <TableBody items={dataList}>
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
        <DrawerDetails
          initialData={currentMaterial}
          isOpen={isOpenDrawer}
          onClose={onCloseDrawer}
        />
      </section>
    </DefaultLayout>
  );
}
