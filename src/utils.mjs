import crypto from "crypto";
import { object, string } from "yup";
import { TASK_STATUS_VALUES } from "./constants.mjs";

const TASK_SCHEMA = object({
  id: string().length(8).required(),
  title: string().max(50),
  description: string().max(160),
  status: string().oneOf(TASK_STATUS_VALUES),
});

export const generateRandomID = () => {
  return crypto.randomUUID().slice(0, 8);
};

export const validateTask = (task) => {
  return TASK_SCHEMA.validateSync(task);
};
