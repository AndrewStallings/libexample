import { Suspense } from "react";
import { SalesFormPage } from "@/sales/components/SalesFormPage";

const NewSalesPage = () => {
  return (
    <Suspense fallback={null}>
      <SalesFormPage mode="create" />
    </Suspense>
  );
};

export default NewSalesPage;
