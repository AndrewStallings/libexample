import { DropBoxLocationsLibraryPage } from "@/drop-box-locations/components/DropBoxLocationsLibraryPage";
import { listDropBoxLocations } from "@/drop-box-locations/services/dropBoxLocationService";

const DropBoxLocationsPage = async () => {
  const initialLocations = await listDropBoxLocations();

  return <DropBoxLocationsLibraryPage initialLocations={initialLocations} />;
};

export default DropBoxLocationsPage;
