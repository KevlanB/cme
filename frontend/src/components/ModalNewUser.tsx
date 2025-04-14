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
} from "@heroui/react";
import axios from "axios";
import { Eye, EyeClosed } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Role = {
  id: string;
  name: string;
};

const ModalNew: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [fieldName, setFieldName] = useState("");
  const [fieldUserName, setFieldUserName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [fieldPassword, setFieldPassword] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [eyePasswd, setEyePasswd] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const clearFields = () => {
    setFieldName("");
    setFieldPassword("");
    setFieldUserName("");
    setFieldType("");
  };

  useEffect(() => {
    const getRoles = async () => {
      await axios
        .get(`${API_URL}/roles`)
        .then((response) => {
          setRoles(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar os dados:", error);
        });
    };

    getRoles();
  }, []);

  const handleSave = async () => {
    const data = {
      name: fieldName,
      username: fieldUserName,
      password: fieldPassword,
      role_id: Number(fieldType),
    };

    try {
      await axios.post(`${API_URL}/users`, data);
      onClose();
      clearFields();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Novo Usuário</ModalHeader>
        <ModalBody>
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
            label="Senha"
            type={eyePasswd ? "text" : "password"}
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

export default ModalNew;
