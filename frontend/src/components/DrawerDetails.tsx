import { useEffect, useState } from "react";
import axios from "axios";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Milestone } from "lucide-react";

import { formatDateComplete } from "@/utils/date";

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id: number;
    name: string;
    steps: {
      id: number;
      name: string;
    }[];
  } | null;
}

export const columns = [
  { name: "ID", uid: "id" },
  { name: "DESC", uid: "description" },
  { name: "ETAPA", uid: "step" },
  { name: "DATA E HORA DA FALHA", uid: "created_at" },
];

const DrawerDetails: React.FC<ModalEditProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [logs, setLogs] = useState([]);
  const [counts, setCounts] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldSerial, setFieldSerial] = useState("");
  const [fieldId, setFieldId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fails, setFails] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (initialData) {
      setFieldId(initialData.id);
      setFieldName(initialData.material?.name);
      setFieldSerial(initialData.material?.serial);
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData?.id) return;

    const getDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/materials/logs/${initialData.id}`,
        );

        setLogs(response.data.logs);
        setCounts(response.data.step_counts);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    const getFails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/materials/fails/${initialData.id}`,
        );

        console.log("response", response.data);
        setFails(response.data);
      } catch (err) {
        console.log("err", err);
      }
    };

    getDetails();
    getFails();
  }, [initialData]);

  const renderCell = (product: any, columnKey: any) => {
    console.log("product", product);
    switch (columnKey) {
      case "step":
        return <span className="text-default-600">{product.step.name}</span>;
      case "created_at":
        return formatDateComplete(product.created_at);
      default:
        return product[columnKey];
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      size="full"
      onOpenChange={onClose}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              {fieldSerial} - {fieldName}
            </DrawerHeader>
            <DrawerBody className="h-[60px]">
              <div className="flex gap-2">
                {counts.map((c) => (
                  <Card key={c.step_id}>
                    <CardHeader className="gap-2">
                      <Milestone className="text-default-600" /> {c.step_name}
                    </CardHeader>
                    <Divider />
                    <CardBody className="font-bold text-default-600 md:text-2xl flex-row-reverse">
                      x{c.total_passagens}
                    </CardBody>
                  </Card>
                ))}
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
                <TableBody items={fails}>
                  {(item: any) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DrawerBody>
            <DrawerFooter>
              <Button color="success" variant="light" onPress={onClose}>
                XSLX
              </Button>
              <Button color="danger" variant="light" onPress={onClose}>
                PDF
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerDetails;
