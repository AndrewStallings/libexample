import { Suspense } from "react";
import { SalesFormPage } from "@/sales/components/SalesFormPage";

type SalesRouteProps = {
  params: Promise<{ id: string }>;
};

const SaleDetailPage = async ({ params }: SalesRouteProps) => {
  const { id } = await params;
  return (
    <Suspense fallback={null}>
      <SalesFormPage mode="edit" saleId={id} />
    </Suspense>
  );
};

export default SaleDetailPage;
