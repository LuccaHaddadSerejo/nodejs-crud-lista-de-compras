interface iListData {
  name: string;
  quantity: string;
}

type iListDataRequiredKeys = "name" | "quantity";

interface iListEntry {
  listName: string;
  data: iListData[];
}

interface iHandledList extends iListEntry {
  id: number;
}

type iListEntryRequiredKeys = "listName" | "data";

export {
  iListData,
  iListEntry,
  iHandledList,
  iListDataRequiredKeys,
  iListEntryRequiredKeys,
};
