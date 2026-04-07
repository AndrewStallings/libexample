import { notFound } from "next/navigation";
import { SnackFormPage } from "@/snacks/components/SnackFormPage";
import { getSnackById } from "@/snacks/services/snackDemoService";

type SnackRouteProps = {
  params: Promise<{ id: string }>;
};

const SnackEditPage = async ({ params }: SnackRouteProps) => {
  const { id } = await params;
  const record = getSnackById(id);

  if (!record) {
    notFound();
  }

  return <SnackFormPage mode="edit" record={record} />;
};

export default SnackEditPage;
