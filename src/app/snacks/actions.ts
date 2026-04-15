"use server";

import type { SnackInput } from "@/snacks/models/schemas";
import { createSnack, listSnacks, updateSnack } from "@/snacks/services/snackService";

export const listSnacksAction = async () => {
  return listSnacks();
};

export const createSnackAction = async (input: SnackInput) => {
  return createSnack(input);
};

export const updateSnackAction = async (snackId: string, input: SnackInput) => {
  return updateSnack(snackId, input);
};
