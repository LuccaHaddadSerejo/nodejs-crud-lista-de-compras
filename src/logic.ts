import { Response, Request } from "express";
import { database } from "./database";
import {
  iListData,
  iListDataRequiredKeys,
  iListEntry,
  iListEntryRequiredKeys,
} from "./types";

let id = 0;

const updateId = () => {
  let result = (id += 1);
  return result;
};

const validateListData = (payload: any): iListEntry => {
  const payloadKeys: string[] = Object.keys(payload);
  const requiredKeys: iListEntryRequiredKeys[] = ["listName", "data"];

  const validateKeys: boolean = requiredKeys.every((key: string) =>
    payloadKeys.includes(key)
  );

  const keyFilter: string[] = payloadKeys.filter((key) => {
    if (key !== requiredKeys[0] && key !== requiredKeys[1]) {
      return key;
    }
  });

  if (!validateKeys) {
    throw new Error(
      `The required keys are: '${requiredKeys[0]}' and '${requiredKeys[1]}'`
    );
  }

  if (keyFilter.length > 0) {
    throw new Error("Request done with invalid keys");
  }

  return payload;
};

const validateItemData = (payload: any): iListData => {
  const payloadKeys: string[] = Object.keys(payload);
  const requiredKeys: iListDataRequiredKeys[] = ["name", "quantity"];

  const validateKeys: boolean = requiredKeys.some((key: string) =>
    payloadKeys.includes(key)
  );

  const keyFilter: string[] = payloadKeys.filter((key) => {
    if (key !== requiredKeys[0] && key !== requiredKeys[1]) {
      return key;
    }
  });

  if (!validateKeys) {
    throw new Error(
      `The required keys are: '${requiredKeys[0]}' and '${requiredKeys[1]}'`
    );
  }

  if (keyFilter.length > 0) {
    throw new Error(
      `You can only update '${requiredKeys[0]}' and '${requiredKeys[1]}'`
    );
  }

  return payload;
};

const createList = (req: Request, res: Response): Response => {
  try {
    const validateList = validateListData(req.body);

    if (typeof validateList.listName !== typeof "string") {
      return res.status(400).json({
        message: `The type of the key 'listName' needs to be a string`,
      });
    }

    if (Array.isArray(validateList.data) === false) {
      return res.status(400).json({
        message: `The type of the key 'data' needs to be a array`,
      });
    }

    const checkAllItensKeys = validateList.data.map((item) => {
      const keys = Object.keys(item);
      const checkKeys = keys.every(
        (key) => key === "name" || key === "quantity"
      );
      return checkKeys;
    });

    const itemKeyValidation = checkAllItensKeys.some((elt) => elt === false);

    if (itemKeyValidation) {
      return res.status(400).json({
        message:
          "Invalid key inside a data object, you can only send 'name' or 'quantity' keys",
      });
    }

    const handledData = {
      id: id + 1,
      ...validateList,
    };

    database.push(handledData);
    updateId();
    return res.status(201).json(handledData);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllLists = (req: Request, res: Response): Response => {
  return res.status(200).json(database);
};

const getListById = (req: Request, res: Response): Response => {
  const foundList = req.groceryList.foundList;

  return res.status(200).json(foundList);
};

const deleteList = (req: Request, res: Response): Response => {
  const listIndex = req.groceryList.foundListIndex;

  database.splice(listIndex!, 1);

  return res.status(204).send();
};

const deleteItemFromList = (req: Request, res: Response): Response => {
  const foundList = req.groceryList.foundList;
  const foundItem = req.groceryList.foundItem;
  const itemIndex = req.groceryList.foundList!.data.indexOf(foundItem!);
  foundList!.data.splice(itemIndex!, 1);
  return res.status(204).send();
};

const updateItem = (req: Request, res: Response): Response => {
  try {
    const validateItem: iListData = validateItemData(req.body);
    const validateItemKeys = Object.values(validateItem);
    console.log(validateItemKeys);
    const checkKeyTypes = validateItemKeys.every(
      (value) => typeof value !== "string"
    );
    console.log(checkKeyTypes);
    const foundList = req.groceryList.foundList;
    const foundItem = req.groceryList.foundItem;
    const itemIndex = req.groceryList.foundList!.data.indexOf(foundItem!);

    if (checkKeyTypes) {
      return res.status(400).json({
        message: `Invalid key type, key values needs to be strings.`,
      });
    }

    foundList!.data[itemIndex] = {
      ...foundList!.data[itemIndex],
      ...validateItem,
    };

    return res.status(200).json(foundList!.data[itemIndex]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createList,
  getAllLists,
  getListById,
  deleteList,
  deleteItemFromList,
  updateItem,
};
