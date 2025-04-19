import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import axios from "axios";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalNew: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [fieldName, setFieldName] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const clearFields = () => {
    setFieldName("");
  };

  const handleSave = async () => {
    const data = {
      name: fieldName,
    };

    try {
      await axios.post(`${API_URL}/steps`, data);
      onClose();
      clearFields();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Nova Etapa</ModalHeader>
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

export default ModalNew;
