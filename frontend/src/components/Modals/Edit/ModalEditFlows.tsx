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
  CheckboxGroup,
} from "@heroui/react";
import axios from "axios";

import { CustomCheckbox } from "@/components/CheckOptions";

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

type stepsType = {
  id: number;
  name: string;
};

const ModalEdit: React.FC<ModalEditProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [fieldName, setFieldName] = useState("");
  const [groupSelected, setGroupSelected] = useState<string[]>([]);
  const [steps, setSteps] = useState<stepsType[]>([]);

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

  useEffect(() => {
    if (initialData) {
      setFieldName(initialData.name);
      const selectedIds = initialData.steps.map((step) => String(step.id));

      setGroupSelected(selectedIds);
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!initialData) return;

    const data = {
      name: fieldName,
      step_ids: groupSelected.map(Number),
    };

    try {
      await axios.put(`${API_URL}/flows/${initialData.id}`, data);
      onClose();
      addToast({
        title: `Fluxo "${data.name}" foi atualizado!`,
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
        <ModalHeader className="flex flex-col gap-1">Editar Fluxo</ModalHeader>
        <ModalBody>
          <Input
            label="Nome"
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
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
