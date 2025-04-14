import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  DateInput,
} from "@heroui/react";
import axios from "axios";
import { getLocalTimeZone, today } from "@internationalized/date";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalNew: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [fieldExpiration, setFieldExpiration] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const clearFields = () => {
    setFieldName("");
    setFieldType("");
  };

  const handleSave = async () => {
    const data = {
      name: fieldName,
      type: fieldType,
      expiration_date: fieldExpiration,
    };

    try {
      await axios.post(`${API_URL}/materials`, data);
      onClose();
      clearFields();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Novo Material</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Nome"
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
          <Input
            placeholder="Tipo"
            type="text"
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
          />
          <DateInput
            label={"Validade"}
            minValue={today(getLocalTimeZone())}
            onChange={(value) => {
              if (value) {
                const formatted = `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`;

                setFieldExpiration(formatted);
              } else {
                setFieldExpiration("");
              }
            }}
          />
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

export default ModalNew;
