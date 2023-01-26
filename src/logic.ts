import { Response, Request } from "express";
import { database } from "./database";
import { iTreatedList } from "./types";

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
    const findListGet: iTreatedList | undefined = database.find(
      (list) => list.id === +req.params.id
    );

    if (!findListGet) {
      const errorMessageListNotFound = {
        message: `List with id ${req.params.id} does not exist`,
      };
      return res.status(404).json(errorMessageListNotFound);
    }

    const findList = database.find((list) => list.id === +req.params.id);
    return res.status(200).json(findList);
  } catch (error) {
    console.log(error);
  }
};

const deleteList = (req: Request, res: Response) => {
  try {
    const findList: iTreatedList | undefined = database.find(
      (list) => list.id === +req.params.id
    );

    if (!findList) {
      const errorMessageListNotFound = {
        message: `List with id ${req.params.id} does not exist`,
      };
      return res.status(404).json(errorMessageListNotFound);
    }

    const listIndex = database.indexOf(findList);

    database.splice(listIndex, 1);

    return res.status(204).send("");
  } catch (error) {
    console.log(error);
  }
};

const deleteItemFromList = (req: Request, res: Response) => {
  try {
    const findList: iTreatedList | undefined = database.find(
      (list) => list.id === +req.params.id
    );

    if (!findList) {
      const errorMessageListNotFound = {
        message: `List with id ${req.params.id} does not exist`,
      };
      return res.status(404).json(errorMessageListNotFound);
    }

    const findItem = findList.data.find(
      (item) => item.name === req.params.name
    );
    console.log(findItem);
    if (!findItem) {
      const errorMessageItemNotFound = {
        message: `Item with name ${req.params.name} does not exist`,
      };
      return res.status(404).json(errorMessageItemNotFound);
    }

    const itemIndex = findList.data.indexOf(findItem);

    findList.data.splice(itemIndex, 1);

    return res.status(204).send("");
  } catch (error) {
    console.log(error);
  }
};

export { createList, getAllLists, getListById, deleteList, deleteItemFromList };
