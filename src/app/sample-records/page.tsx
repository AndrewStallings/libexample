import { SampleRecordsLibraryPage } from "@/app/sample-records/components/SampleRecordsLibraryPage";
import { listSampleRecords } from "@/app/sample-records/services/sampleRecordService";

const SampleRecordsPage = async () => {
  const initialRecords = await listSampleRecords();

  return <SampleRecordsLibraryPage initialRecords={initialRecords} />;
};

export default SampleRecordsPage;
