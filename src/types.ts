interface iListData {
  name: string;
  quantity: string;
}

interface iListEntry {
  listName: string;
  data: iListData[];
}

interface iTreatedList extends iListEntry {
  id: number;
}

export { iListData, iListEntry, iTreatedList };
