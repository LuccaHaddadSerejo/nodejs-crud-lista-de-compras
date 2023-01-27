import express, { Application } from "express";
import { checkIfListExists, checkIfItemExists } from "./middlewares";
import {
  createList,
  deleteItemFromList,
  deleteList,
  getAllLists,
  getListById,
  updateItem,
} from "./logic";

const app: Application = express();
app.use(express.json());

app.get("/purchaseList", getAllLists);
app.get("/purchaseList/:id", checkIfListExists, getListById);
app.post("/purchaseList", createList);
app.patch(
  "/purchaseList/:id/:name",
  checkIfListExists,
  checkIfItemExists,
  updateItem
);
app.delete("/purchaseList/:id", checkIfListExists, deleteList);
app.delete(
  "/purchaseList/:id/:name",
  checkIfListExists,
  checkIfItemExists,
  deleteItemFromList
);

const port: number = 3000;
const runningMessage: string = `Server running on http://localhost:${port}`;
app.listen(port, () => console.log(runningMessage));
