import { useEffect, useState } from "react";
import axios from "axios";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "@heroui/react";
import { Milestone } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerDetails: React.FC<ModalProps> = ({ isOpen, onClose, material }) => {
  const [logs, setLogs] = useState([]);
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/materials/${material.id}/logs`,
        );

        setLogs(response.data.logs);
        setCounts(response.data.step_counts);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    getDetails();
  }, [isOpen, material]);

  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      size="full"
      onOpenChange={onClose}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              {material.serial} - {material.name}
            </DrawerHeader>
            <DrawerBody className="h-[60px]">
              <div className="flex gap-2">
                {counts.map((c) => (
                  <Card key={c.step_id}>
                    <CardHeader className="gap-2">
                      <Milestone className="text-default-600" /> {c.step_name}
                    </CardHeader>
                    <Divider />
                    <CardBody className="font-bold text-default-600 md:text-2xl flex-row-reverse">
                      x{c.total_passagens}
                    </CardBody>
                  </Card>
                ))}
              </div>

              {logs.map((l) => (
                <div key={l.id}>
                  <h1>{l.from_step.name}</h1>
                </div>
              ))}
            </DrawerBody>
            <DrawerFooter>
              <Button color="success" variant="light" onPress={onClose}>
                XSLX
              </Button>
              <Button color="danger" variant="light" onPress={onClose}>
                PDF
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerDetails;
