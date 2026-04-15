import { notFound } from "next/navigation";
import { SampleRecordFormPage } from "@/app/sample-records/components/SampleRecordFormPage";
import { getSampleRecordById } from "@/app/sample-records/services/sampleRecordService";

type SampleRecordDetailPageProps = {
  params: Promise<{
    sampleRecordId: string;
  }>;
};

const SampleRecordDetailPage = async ({ params }: SampleRecordDetailPageProps) => {
  const { sampleRecordId } = await params;
  const record = await getSampleRecordById(sampleRecordId);

  if (!record) {
    notFound();
  }

  return <SampleRecordFormPage mode="edit" record={record} />;
};

export default SampleRecordDetailPage;
