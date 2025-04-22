import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from "@heroui/react";
import axios from "axios";

interface ModalDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id: number;
    name: string;
  } | null;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [fieldId, setFieldId] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  const clearFields = () => {
    setFieldId(0);
  };

  useEffect(() => {
    if (initialData) {
      setFieldId(initialData.id);
    }
  }, [initialData]);

  const handleSave = async () => {
    try {
      await axios.delete(`${API_URL}/roles/${fieldId}`);
      onClose();
      clearFields();
      addToast({
        title: `Função ${initialData?.name} foi excluída!`,
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
          Excluir Função
        </ModalHeader>
        <ModalBody>
          <h1>
            Você tem certeza que deseja excluir a função {initialData?.name}?
          </h1>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSave}>
            Excluir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalDelete;
