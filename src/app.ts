import express, { Application, json, Request, Response } from "express";
import { createList, getAllLists, getListById } from "./logic";

const app: Application = express();
app.use(json());

app.post("/purchaseList", createList);
app.get("/purchaseList", getAllLists);
app.get("/purchaseList/:id", getListById);

const port: number = 3000;
const runningMessage: string = `Server running on http://localhost:${port}`;
app.listen(port, () => console.log(runningMessage));
