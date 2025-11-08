import { validate as isUUID } from "uuid";
export const validateUUID = (id: string): boolean => isUUID(id);
