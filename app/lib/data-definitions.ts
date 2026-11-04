
export type UserData = {
    id: number;
    lists: number[];
};

export type ToDoListData = {
    listID: number;
    listName: string;
    entryIDs: number[];
};

export type ToDoEntryData = {
    entryID: number;
    checked: boolean;
    description: string;
};

export type EntryChildrenData = {
    parentID: number;
    childID: number;
};
