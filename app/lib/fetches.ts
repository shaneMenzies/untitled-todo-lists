'use server';

import {ToDoListState, ToDoEntryState} from "./definitions.ts";
import {ToDoEntryData, EntryChildrenData} from "./data-definitions.ts";
import {queryListName, queryListTopLevelEntries, queryListChildLevelEntries} from "./queries.ts";

export async function fetchEntryChildrenMap(listID: number): Promise<Map<number, Map<number, ToDoEntryData>>> {
    try {
        const vals = await queryListChildLevelEntries(listID);
        const map = new Map();
        vals.forEach(
            ([parentID, val]) => {
                if (!(parentID in map)) {
                    map[parentID] = new Map();
                }
                map[parentID].set(val.entryID, val);
            }
        );

        return map;
    } catch (err) {
        console.log(err);
        return new Map();
    }
}

function buildEntry(listID: number, entry: ToDoEntryData, 
                    childMap: Map<number, Map<number, ToDoEntryData>>): ToDoEntryState {
    if (entry.entryID in childMap) {
        const children: Array<ToDoEntryState> = Array.from(childMap[entry.entryID].entries().map(
            ([_id, childData], childID, _map) => {
                return buildEntry(listID, childData, childMap);
            }
        ));

        const state = {id: entry.entryID, listID: listID, checked: entry.checked, 
            description: entry.description, children: children};

        return state;
    } else {
        return {id: entry.entryID, listID: listID, checked: entry.checked, 
            description: entry.description, children: new Array<ToDoEntryState>()};
    }
}

export async function fetchList(listID: number): Promise<ToDoListState | null> {
    // Get name, also checking if list exists
    const listName = await queryListName(listID);
    if (listName === null) {
        return null;
    }

    // Valid list, can get entry data
    const listEntries = await queryListTopLevelEntries(listID);
    const childMap = await fetchEntryChildrenMap(listID);

    // Build entries
    const children = Array.from(listEntries.map(
        (val) => buildEntry(listID, val, childMap)
    ));

    const state = {id: listID, name: listName, children: children};
    return state;
}
