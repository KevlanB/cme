import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Check } from "lucide-react";

import DefaultLayout from "@/layouts/default";
import { formatDate } from "@/utils/date";
import { formatDateTimeBR } from "@/utils/dateHours";

export default function IndexPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const [roles, setRoles] = useState([]);
  const [currentStep, setCurrentStep] = useState("");
  const [currentId, setCurrentId] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/materials`);

      setMaterials(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar os materiais.");
      setLoading(false);
    }
  };

  const getSteps = async () => {
    await axios
      .get(`${API_URL}/steps`)
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados:", error);
      });
  };

  useEffect(() => {
    fetchProducts();
    getSteps();
  }, []);

  const handleSaveNext = async (id: Number) => {
    await axios.patch(`${API_URL}/materials/${id}/next-step`, {}).then(() => {
      alert("material validado no posto");
      fetchProducts();
      onClose();
    });
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-start py-8 md:py-0 w-[100vw] h-[80vh] px-2">
        {materials.length === 0 ? (
          <div className="grid grid-cols-4 gap-2 mt-10">
            <Card className="w-60 space-y-5 p-4 h-100" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
            <Card className="w-60 space-y-5 p-4 h-100" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
            <Card className="w-60 space-y-5 p-4 h-100" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
            <Card className="w-60 space-y-5 p-4 h-100" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
            <Card className="w-60 space-y-5 p-4 h-100" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
            <Card className="w-60 space-y-5 p-4 h-100" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
            <Card className="w-60 space-y-5 p-4 h-100" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
            <Card className="w-60 space-y-5 p-4 h-100" radius="lg">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 mt-10">
            {materials.map((e) => (
              <Card key={e.id}>
                <div className="flex bg-primary items-center justify-center text-white">
                  <h1 className="font-bold">{e.step.name}</h1>
                </div>

                <CardHeader>
                  <h1 className="text-xs">{formatDateTimeBR(e.created_at)}</h1>
                </CardHeader>
                <CardBody className="flex-col gap-2">
                  <Button className="text-lg font-bold ">{e.name}</Button>
                  <h1 className="text-sm font-bold ">{e.serial}</h1>
                </CardBody>
                <CardFooter className="text-sm bg-default">
                  <div>
                    <h1>Tipo: {e.type}</h1>

                    <h1>Validade: {formatDate(e.expiration_date)}</h1>
                  </div>
                </CardFooter>
                <Button
                  className="w-full text-white bg-green-600 mt-2"
                  endContent={<Check />}
                  onPress={() => handleSaveNext(e.id)}
                >
                  Validar Material
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
