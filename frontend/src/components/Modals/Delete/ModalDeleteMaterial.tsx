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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalDelete: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [fieldId, setFieldId] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const clearFields = () => {
    setFieldId("");
  };

  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      setFieldId(initialData.id);
    }
  }, [initialData]);

  const handleSave = async () => {
    try {
      await axios.delete(`${API_URL}/materials/${fieldId}`);
      onClose();
      clearFields();
      addToast({
        title: `Material ${initialData.name} foi excluído!`,
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
          Excluir Material
        </ModalHeader>
        <ModalBody>
          <h1>Você tem certeza que deseja excluir este material?</h1>
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
