import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(() => {
  return [
    { id: uuidv4(), name: "Иван" },
    { id: uuidv4(), name: "Мария" },
  ];
});
