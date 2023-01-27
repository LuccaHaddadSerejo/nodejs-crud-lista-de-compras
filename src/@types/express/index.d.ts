import * as express from "express";
import { iHandledList, iListData } from "../../types";

declare global {
  namespace Express {
    interface Request {
      groceryList: {
        foundList?: iHandledList;
        foundListIndex?: number;
        foundItem?: iListData;
      };
    }
  }
}
