import type { User } from "../models/user.js";
import { v4 as uuidv4 } from "uuid";

let users: User[] = [];

export const getAllUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined =>
  users.find((user) => user.id === id);

export const createUser = (data: Omit<User, "id">): User => {
  const newUser = { id: uuidv4(), ...data };
  users.push(newUser);
  return newUser;
};

export const updateUser = (id: string, data: Omit<User, "id">): User | null => {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;
  users[index] = { id, ...data };
  return users[index];
};

export const deleteUser = (id: string): boolean => {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
};
