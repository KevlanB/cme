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
  Switch,
} from "@heroui/react";
import axios from "axios";
import { Eye, EyeClosed } from "lucide-react";

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id: number;
    name: string;
    username: string;
    role_id: number;
    isActive: boolean;
  } | null;
}

type Role = {
  id: string;
  name: string;
};

const ModalEdit: React.FC<ModalEditProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [fieldName, setFieldName] = useState("");
  const [fieldUserName, setFieldUserName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [fieldPassword, setFieldPassword] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [eyePasswd, setEyePasswd] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await axios.get(`${API_URL}/roles`);

        setRoles(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    getRoles();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFieldName(initialData.name);
      setFieldUserName(initialData.username);
      setFieldType(String(initialData.role_id));
      setFieldPassword(""); // senha não vem por segurança, só se editar.
      setIsActive(initialData.isActive);
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!initialData) return;

    const data = {
      name: fieldName,
      username: fieldUserName,
      password: fieldPassword || undefined, // só envia se for alterada
      role_id: Number(fieldType),
      active: isActive,
    };

    try {
      await axios.put(`${API_URL}/users/${initialData.id}`, data);
      onClose();
      addToast({
        title: `Usuário ${data.username} foi atualizado!`,
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
          Editar Usuário
        </ModalHeader>
        <ModalBody>
          <Switch isSelected={isActive} onValueChange={setIsActive}>
            Ativo
          </Switch>
          <Input
            label="Nome"
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
          <Input
            label="Usuário"
            type="text"
            value={fieldUserName}
            onChange={(e) => setFieldUserName(e.target.value)}
          />
          <Select
            label="Função"
            selectedKeys={new Set([fieldType])}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];

              setFieldType(String(selected));
            }}
          >
            {roles.map((func) => (
              <SelectItem key={String(func.id)}>{func.name}</SelectItem>
            ))}
          </Select>
          <Input
            endContent={
              eyePasswd ? (
                <Eye
                  className="cursor-pointer"
                  onClick={() => setEyePasswd(!eyePasswd)}
                />
              ) : (
                <EyeClosed
                  className="cursor-pointer"
                  onClick={() => setEyePasswd(!eyePasswd)}
                />
              )
            }
            label="Senha (deixe em branco para não alterar)"
            type={eyePasswd ? "text" : "password"}
            value={fieldPassword}
            onChange={(e) => setFieldPassword(e.target.value)}
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
