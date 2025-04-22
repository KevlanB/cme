import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  addToast,
} from "@heroui/react";
import axios from "axios";

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id: number;
    name: string;
    step: {
      id: number;
      name: string;
    }[];
  } | null;
}
type flows = {
  id: string;
  name: string;
};

const ModalNew: React.FC<ModalEditProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [fieldId, setFieldId] = useState(0);
  const [fieldDesc, setFieldDesc] = useState("");
  const [fieldStep, setFieldStep] = useState(0);
  const [flows, setFlows] = useState<flows[]>([]);
  const [fieldFlow, setFieldFlow] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getRoles = async () => {
      await axios
        .get(`${API_URL}/flows`)
        .then((response) => {
          setFlows(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar os dados:", error);
        });
    };

    getRoles();
  }, []);

  useEffect(() => {
    console.log(initialData);
    if (initialData) {
      setFieldId(initialData.id);
      setFieldStep(initialData.step.id);
    }
  }, [initialData]);

  const handleSave = async () => {
    console.log(initialData);
    try {
      const response = await axios.post(
        `${API_URL}/materials/fails/${fieldId}`,
        null,
        {
          params: {
            step_id: fieldStep,
            description: fieldDesc,
          },
        },
      );

      onClose();
      addToast({
        title: `Falha registrada!`,
        color: "warning",
        variant: "flat",
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Reportar Falha
        </ModalHeader>
        <ModalBody>
          <Textarea
            isClearable
            defaultValue=""
            placeholder="Descreva a falha"
            variant="bordered"
            onChange={(e) => setFieldDesc(e.target.value)}
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
