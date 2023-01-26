import { Response, Request } from "express";
import { database } from "./database";
import {
  iListData,
  iListDataRequiredKeys,
  iListEntry,
  iListEntryRequiredKeys,
  iTreatedList,
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
      `The required keys are: ${requiredKeys[0]} and ${requiredKeys[1]}`
    );
  }

  if (keyFilter.length > 0) {
    throw new Error(`Only the listName and data keys are accepted`);
  }

  return payload;
};

const createList = (req: Request, res: Response) => {
  try {
    const validateList = validateListData(req.body);

    if (typeof validateList.listName !== typeof "string") {
      return res.status(400).json({
        message: `The type of the key /ListName/ needs to be a string`,
      });
    }

    if (Array.isArray(validateList.data) === false) {
      return res.status(400).json({
        message: `The type of the key /data/ needs to be a array`,
      });
    }

    const treatedData = {
      id: id + 1,
      ...validateList,
    };

    database.push(treatedData);
    updateId();
    return res.status(201).json(treatedData);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
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
      return res.status(404).json({
        message: `List with id ${req.params.id} does not exist`,
      });
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
      return res.status(404).json({
        message: `List with id ${req.params.id} does not exist`,
      });
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
      return res.status(404).json({
        message: `List with id ${req.params.id} does not exist`,
      });
    }

    const findItem = findList.data.find(
      (item) => item.name === req.params.name
    );

    if (!findItem) {
      return res.status(404).json({
        message: `Item with name ${req.params.name} does not exist`,
      });
    }

    const itemIndex = findList.data.indexOf(findItem);

    findList.data.splice(itemIndex, 1);

    return res.status(204).send("");
  } catch (error) {
    console.log(error);
  }
};

const validateItemData = (payload: any): iListData => {
  const payloadKeys: string[] = Object.keys(payload);
  const requiredKeys: iListDataRequiredKeys[] = ["name", "quantity"];

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
      `The required keys are: ${requiredKeys[0]} and ${requiredKeys[1]}`
    );
  }

  if (keyFilter.length > 0) {
    throw new Error(
      `You can only change ${requiredKeys[0]} and ${requiredKeys[1]}`
    );
  }

  return payload;
};

const updateItem = (req: Request, res: Response) => {
  try {
    const validateItem: iListData = validateItemData(req.body);

    const findList: iTreatedList | undefined = database.find(
      (list) => list.id === +req.params.id
    );

    if (!findList) {
      return res.status(404).json({
        message: `List with id ${req.params.id} does not exist`,
      });
    }

    let findItem = findList.data.find((item) => item.name === req.params.name);

    if (!findItem) {
      return res.status(404).json({
        message: `Item with name ${req.params.name} does not exist`,
      });
    }

    if (
      typeof validateItem.name !== typeof "string" ||
      typeof validateItem.quantity !== typeof "string"
    ) {
      return res.status(400).json({
        message: `The type of the keys can only be string`,
      });
    }

    findList.data.forEach((item) => {
      if (item.name === req.params.name) {
        item.name = req.body.name;
        item.quantity = req.body.quantity;
      }
    });

    return res.status(200).json(validateItem);
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
