import { Request, Response, NextFunction, request } from "express";
import { database } from "./database";
import { iTreatedList } from "./types";

const checkIfListExists = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const findList: iTreatedList | undefined = database.find(
    (list) => list.id === +req.params.id
  );

  if (!findList) {
    return res.status(404).json({
      message: `List with id ${req.params.id} does not exist`,
    });
  }

  const listIndex = database.indexOf(findList);

  req.groceryList = {
    foundList: findList,
    foundListIndex: listIndex,
  };

  return next();
};

const checkIfItemExists = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const findItem = req.groceryList.foundList!.data.find(
    (item) => item.name === req.params.name
  );

  if (!findItem) {
    return res.status(404).json({
      message: `Item with name ${req.params.name} does not exist`,
    });
  }

  req.groceryList = {
    foundItem: findItem,
    ...req.groceryList,
  };

  return next();
};

export { checkIfListExists, checkIfItemExists };
