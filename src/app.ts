import express, { Application } from "express";
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
app.get("/purchaseList/:id", getListById);
app.post("/purchaseList", createList);
app.patch("/purchaseList/:id/:name", updateItem);
app.delete("/purchaseList/:id/:name", deleteItemFromList);
app.delete("/purchaseList/:id", deleteList);

const port: number = 3000;
const runningMessage: string = `Server running on http://localhost:${port}`;
app.listen(port, () => console.log(runningMessage));
