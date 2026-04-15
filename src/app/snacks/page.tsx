import { SnacksLibraryPage } from "@/snacks/components/SnacksLibraryPage";
import { listSnacks } from "@/snacks/services/snackService";

const SnacksPage = async () => {
  const initialSnacks = await listSnacks();

  return <SnacksLibraryPage initialSnacks={initialSnacks} />;
};

export default SnacksPage;
