import { SalesFormPage } from "@/sales/components/SalesFormPage";

type SalesRouteProps = {
  params: Promise<{ id: string }>;
};

const SaleDetailPage = async ({ params }: SalesRouteProps) => {
  const { id } = await params;
  return <SalesFormPage mode="edit" saleId={id} />;
};

export default SaleDetailPage;
