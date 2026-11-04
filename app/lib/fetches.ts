'use server';

import {ToDoList, ToDoEntry} from "./definitions.ts";
import {queryListName, queryListEntries, queryListEntryChildren} from "./queries.ts";

export async function fetchList(listID: number): ToDoList | null {
    
}
