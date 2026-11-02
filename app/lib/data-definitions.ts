
export type UserData = {
    id: number,
    lists: number[]
};

export type ToDoListData = {
    id: number,
    name: string,
    entries: number[]
};

export type ToDoEntryData = {
    list_id: number,
    entry_id: number,
    checked: boolean,
    description: string,
    children: number[]
};
