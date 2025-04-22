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
  const [fieldRole, setFieldRole] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const clearFields = () => {
    setFieldRole("");
  };

  const handleSave = async () => {
    const data = {
      name: fieldRole,
    };

    try {
      await axios.post(`${API_URL}/roles`, data);
      onClose();
      clearFields();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Nova Função</ModalHeader>
        <ModalBody>
          <Input
            label="Função"
            type="text"
            value={fieldRole}
            onChange={(e) => setFieldRole(e.target.value)}
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
