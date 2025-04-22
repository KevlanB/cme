import type { CalendarDate } from "@internationalized/date";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  addToast,
  DateInput,
} from "@heroui/react";
import axios from "axios";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id: number;
    name: string;
    serial: string;
    flow: flows;
    role_id: number;
    active: boolean;
    expiration_date: string;
  } | null;
}

type flows = {
  id: string;
  name: string;
};

const ModalEdit: React.FC<ModalEditProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [fieldName, setFieldName] = useState("");
  const [fieldSerial, setFieldSerial] = useState("");
  const [flows, setFlows] = useState<flows[]>([]);
  const [fieldFlow, setFieldFlow] = useState("");
  const [calendarDate, setCalendarDate] = useState<CalendarDate | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getFlows = async () => {
      try {
        const response = await axios.get(`${API_URL}/flows`);

        setFlows(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    getFlows();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFieldName(initialData.name);
      setFieldFlow(String(initialData.flow.id));
      setFieldSerial(initialData.serial);

      if (initialData.expiration_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        setCalendarDate(parseDate(initialData.expiration_date));
      } else {
        setCalendarDate(null);
      }
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!initialData) return;

    const data = {
      name: fieldName,
      flow_id: Number(fieldFlow),
      expiration_date: calendarDate
        ? `${calendarDate.year}-${String(calendarDate.month).padStart(2, "0")}-${String(calendarDate.day).padStart(2, "0")}`
        : null,
    };

    console.log("DATA", data);

    try {
      await axios.patch(`${API_URL}/materials/${initialData.id}`, data);
      onClose();
      addToast({
        title: `Usuário ${data.name} foi atualizado!`,
        color: "success",
        variant: "flat",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Editar Material
        </ModalHeader>
        <ModalBody>
          <Input
            label="Nome"
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
          <Input
            isDisabled
            label="Serial"
            type="text"
            value={fieldSerial}
            onChange={(e) => setFieldSerial(e.target.value)}
          />
          <DateInput
            label={"Validade"}
            minValue={today(getLocalTimeZone())}
            value={calendarDate}
            onChange={setCalendarDate}
          />
          <Select
            label="Fluxo"
            selectedKeys={[fieldFlow]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];

              setFieldFlow(String(selected));
            }}
          >
            {flows.map((f) => (
              <SelectItem key={String(f.id)}>{f.name}</SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSave}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalEdit;
