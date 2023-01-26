interface iListData {
  name: string;
  quantity: string;
}

type iListDataRequiredKeys = "name" | "quantity";

interface iListEntry {
  listName: string;
  data: iListData[];
}

interface iTreatedList extends iListEntry {
  id: number;
}

type iListEntryRequiredKeys = "listName" | "data";

export {
  iListData,
  iListEntry,
  iTreatedList,
  iListDataRequiredKeys,
  iListEntryRequiredKeys,
};
