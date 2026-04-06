import { notFound } from "next/navigation";
import { DropBoxLocationFormPage } from "@/drop-box-locations/components/DropBoxLocationFormPage";
import { getDropBoxLocationById } from "@/drop-box-locations/services/dropBoxLocationDemoService";

type DropBoxLocationRouteProps = {
  params: Promise<{ id: string }>;
};

const DropBoxLocationEditPage = async ({ params }: DropBoxLocationRouteProps) => {
  const { id } = await params;
  const record = getDropBoxLocationById(id);

  if (!record) {
    notFound();
  }

  return <DropBoxLocationFormPage mode="edit" record={record} />;
};

export default DropBoxLocationEditPage;
