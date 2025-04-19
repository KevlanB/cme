import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  CheckboxGroup,
} from "@heroui/react";
import axios from "axios";

import { CustomCheckbox } from "@/components/CheckOptions";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalNew: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [fieldFlow, setFieldFlow] = useState("");
  const [groupSelected, setGroupSelected] = useState([]);
  const [steps, setSteps] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getRoles = async () => {
      await axios
        .get(`${API_URL}/steps`)
        .then((response) => {
          setSteps(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar os dados:", error);
        });
    };

    getRoles();
  }, []);

  const clearFields = () => {
    setFieldFlow("");
    setGroupSelected([]);
  };

  const handleSave = async () => {
    const data = {
      name: fieldFlow,
      step_ids: groupSelected.map(Number),
    };

    console.log(data);

    try {
      await axios.post(`${API_URL}/flows`, data);
      onClose();
      clearFields();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    onClose();
    clearFields();
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Novo Fluxo</ModalHeader>
        <ModalBody>
          <Input
            label="Nome do fluxo"
            type="text"
            value={fieldFlow}
            onChange={(e) => setFieldFlow(e.target.value)}
          />

          <CheckboxGroup
            className="gap-1"
            label="Selecione as etapas"
            orientation="horizontal"
            value={groupSelected}
            onChange={setGroupSelected}
          >
            {steps.map((s) => (
              <CustomCheckbox key={s.id} value={String(s.id)}>
                {s.name}
              </CustomCheckbox>
            ))}
          </CheckboxGroup>
          <div className="mt-4 ml-1 text-default-500 flex flex-col gap-1  border-1 rounded-md p-2 border-default">
            {groupSelected
              .map((id) => {
                const step = steps.find((s) => String(s.id) === id);

                return step ? step.name : null;
              })
              .filter((name) => name !== null)
              .map((name, index) => (
                <span key={index}>
                  {index + 1}. {name}
                </span>
              ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
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
