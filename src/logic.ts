import { Response, Request } from "express";
import { database } from "./database";

let id = 0;

const updateId = () => {
  let result = (id += 1);
  return result;
};

const createList = (req: Request, res: Response) => {
  try {
    const treatedData = {
      id: id + 1,
      ...req.body,
    };
    database.push(treatedData);
    updateId();
    return res.status(201).json(treatedData);
  } catch (error) {
    console.log(error);
  }
};

const getAllLists = (req: Request, res: Response) => {
  try {
    return res.status(201).json(database);
  } catch (error) {
    console.log(error);
  }
};

const getListById = (req: Request, res: Response) => {
  try {
    const getParamValue = Object.values(req.params);
    const findList = database.find((list) => list.id === +getParamValue);
    return res.status(200).json(findList);
  } catch (error) {
    console.log(error);
  }
};

export { createList, getAllLists, getListById };
