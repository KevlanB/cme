import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
} from "@heroui/react";
import axios from "axios";

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id: number;
    name: string;
  } | null;
}

const ModalEdit: React.FC<ModalEditProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [fieldName, setFieldName] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (initialData) {
      setFieldName(initialData.name);
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!initialData) return;

    const data = {
      name: fieldName,
    };

    try {
      await axios.put(`${API_URL}/steps/${initialData.id}`, data);
      onClose();
      addToast({
        title: `Etapa ${data.name} foi atualizada!`,
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
