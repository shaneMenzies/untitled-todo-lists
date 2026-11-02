import {UserData, ToDoListData, ToDoEntryData} from './data-definitions.ts';

export class User {
    id: number;
    lists: ToDoList[];
};

export class ToDoList {
    id: number;
    name: string;
    entries: ToDoEntry[];
};

export class ToDoEntry {
    id: number;
    checked: boolean;
    description: string;
    parent: ToDoEntry | null;
    children: ToDoEntry[];
};
