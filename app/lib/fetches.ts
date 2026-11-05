'use server';

import {ToDoListState, ToDoEntryState} from "./definitions.ts";
import {ToDoEntryData, EntryChildrenData} from "./data-definitions.ts";
import {queryListName, queryListTopLevelEntries, queryListChildLevelEntries} from "./queries.ts";

export async function fetchEntryChildrenMap(listID: number): Map<number, Map<number, ToDoEntryData>> {
    try {
        const vals = await queryListChildLevelEntries(listID);
        console.log(vals);
        const map = new Map<number, ToDoEntryData[]>();
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
        return new Map<number, number[]>();
    }
}

function buildEntry(listID: number, entry: ToDoEntryData, 
                    childMap: Map<number, Map<number, ToDoEntryData>>): ToDoEntryState {
    if (entry.entryID in childMap) {
        const children = Array.from(childMap[entry.entryID].entries().map(
            ([_id, childData], childID, _map) => {
                console.log("Making child of ", entry.entryID, " with data:", childData);
                return buildEntry(listID, childData, childMap);
            }
        ));

        const state = {id: entry.entryID, listID: listID, checked: entry.checked, 
            description: entry.description, parent: null, children: children};

        children.forEach(
            (child) => {child.parent = state;}
        );
        
        return state;
    } else {
        return {id: entry.entryID, listID: listID, checked: entry.checked, 
            description: entry.description, parent: null, children: []};
    }
}

export async function fetchList(listID: number): ToDoListState | null {
    // Get name, also checking if list exists
    const listName = await queryListName(listID);
    if (listName === null) {
        return null;
    }

    // Valid list, can get entry data
    const listEntries = await queryListTopLevelEntries(listID);
    const childMap = await fetchEntryChildrenMap(listID);
    console.log(childMap);

    // Build entries
    const children = listEntries.map(
        (val) => buildEntry(listID, val, childMap)
    );

    const state = {id: listID, name: listName, children: children};
    children.forEach(
        (child) => {child.parent = state;}
    );

    return state;
}
