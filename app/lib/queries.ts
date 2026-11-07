'use server';

import mysql from "mysql2/promise";

import {ToDoListData, ToDoEntryData, EntryChildrenData} from "./data-definitions.ts";

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export async function queryDatabaseStatus(): Promise<any> {
    try {
        const query = 'SHOW STATUS;';
        const [rows, fields] = await pool.execute(query);
        return rows
    } catch (err) {
        console.log(err);
    }
}

export async function queryListName(listID: number): Promise<string | null> {
    try {
        const query = 'SELECT ToDoList.listName FROM ToDoList WHERE listID = ?;';
        const [rows, fields] = await pool.execute(query, [listID]);
        const results = ('listName' in rows[0] ? rows[0].listName : null);
        return results
    } catch (err) {
        console.log(err);
    }
}

export async function queryListNameBatch(listIDs: number[]) : Promise<Map<number, string>> {
    try {
        const query = 'SELECT * FROM ToDoList WHERE listID IN (?);';
        // can't use execute with an array value
        const [rows, fields] = await pool.query(query, [listIDs]);
        const results = new Map();
        (rows as any).forEach((row) => {results.set(row.listID, row.listName);});
        return results;
    } catch (err) {
        console.log(err);
    }
}

export async function queryListEntries(listID: number): Promise<Array<ToDoEntryData>> {
    try {
        const query = 'SELECT * FROM ToDoEntry WHERE listID = ? ORDER BY entryID ASC;';
        const [rows, fields] = await pool.execute(query, [listID]);
        const results = (rows as any).map(
            (x) => {return {
                entryID: x.entryID, checked: x.checked[0] == 1, description: x.description
            }}
        );
        return results
    } catch (err) {
        console.log(err);
    }
}

export async function queryListTopLevelEntries(listID: number): Promise<Array<ToDoEntryData>> {
    try {
        const query = `SELECT * FROM ToDoEntry 
                        WHERE listID = ?
                            AND entryID NOT IN 
                                (SELECT childID FROM EntryChildren WHERE listID = ?)
                            ORDER BY entryID ASC`;
        const [rows, fields] = await pool.execute(query, [listID, listID]);
        const results = (rows as any).map(
            (x) => {return {
                entryID: x.entryID, checked: x.checked[0] == 1, description: x.description
            }}
        );
        return results
    } catch (err) {
        console.log(err);
    }
}

export async function queryListChildLevelEntries(listID: number): Promise<Array<[number, ToDoEntryData]>> {
    try {
        const query = `SELECT ToDoEntry.listID, parentID, childID, checked, description  
                        FROM (ToDoEntry
                            JOIN EntryChildren
                            ON ToDoEntry.listID = EntryChildren.listID
                            AND ToDoEntry.entryID = EntryChildren.childID)
                        WHERE ToDoEntry.listID = ?
                        ORDER BY parentID ASC`;
        const [rows, fields] = await pool.execute(query, [listID]);
        const results = (rows as any).map(
            (x) => {return [x.parentID, {
                entryID: x.childID, checked: x.checked[0] == 1, description: x.description
            }]}
        );
        return results
    } catch (err) {
        console.log(err);
    }
}

export async function queryListEntryChildren(listID: number): Promise<Array<EntryChildrenData>> {
    try {
        const query = 'SELECT * FROM EntryChildren WHERE listID = ? ORDER BY parentID ASC';
        const [rows, fields] = await pool.execute(query, [listID]);
        const results = (rows as any).map(
            (x) => {return {
                parentID: x.parentID, childID: x.childID
            }}
        );
        return results
    } catch (err) {
        console.log(err);
    }
}

export async function queryNextEntryIDFor(listID: number): Promise<number> {
    try {
        const query = `SELECT MAX(entryID) as newID FROM ToDoEntry 
                        WHERE listID = ?;`;
        const [rows, fields] = await pool.execute(query, [listID]);
        const results = rows[0].newID;
        return results + 1;
    } catch (err) {
        console.log(err);
    }
}

export async function insertNewList(listName: string): Promise<number> {
    try {
        const query1 = `SELECT MAX(listID) as newID FROM ToDoList`;
        let [rows, fields] = await pool.execute(query1);
        const newID = rows[0].newID + 1;
        const query2 = `INSERT INTO ToDoList(listID, listName) VALUES (?, ?)`;
        [rows, fields] = await pool.execute(query2, [newID, listName]);
        return newID;
    } catch (err) {
        console.log(err);
    }
}

export async function updateListName(listID: number, name: string) {
    try {
        const query = "UPDATE ToDoList SET listName = ? WHERE listID = ?";
        const vals = [name, listID];
        const [results, fields] = await pool.execute(query, vals);
    } catch (err) {
        console.log(err);
    }
}

export async function updateEntryChecked(listID: number, entryID: number, checked: boolean) {
    try {
        const query = "UPDATE ToDoEntry SET checked = ? WHERE ToDoEntry.listID = ? AND ToDoEntry.entryID = ?";
        const vals = [checked ? 1 : 0, listID, entryID];
        const [results, fields] = await pool.execute(query, vals);
    } catch (err) {
        console.log(err);
    }
}

export async function updateEntryDescription(listID: number, entryID: number, description: string) {
    try {
        const query = "UPDATE ToDoEntry SET description = ? WHERE listID = ? AND entryID = ?";
        const vals = [description, listID, entryID];
        const [results, fields] = await pool.execute(query, vals);
    } catch (err) {
        console.log(err);
    }
}

export async function updateEntryParent(listID: number, prevParentID: number, childID: number,
                                       newParentID: number) {
    try {
        const query = "UPDATE EntryChildren SET parentID = ? WHERE listID = ? AND parentID = ? AND childID = ?";
        const vals = [newParentID, listID, prevParentID, childID];
        const [results, fields] = await pool.execute(query, vals);
    } catch (err) {
        console.log(err);
    }
}

export async function deleteEntry(listID: number, entryID: number) {
    try {
        const query1 = `DELETE FROM EntryChildren WHERE LISTID = ? AND (parentID = ? OR childID = ?)`;
        const query2 = `DELETE FROM ToDoEntry WHERE listID = ? AND entryID = ?`;
        let [results, fields] = await pool.execute(query1, [listID, entryID, entryID]);
        [results, fields] = await pool.execute(query2, [listID, entryID]);
    } catch (err) {
        console.log(err);
    }
}

export async function deleteEntryChild(listID: number, parentID: number, childID: number) {
    try {
        const query = "DELETE FROM EntryChildren WHERE listID = ? AND parentID = ? AND childID = ?";
        const vals = [listID, parentID, childID];
        const [results, fields] = await pool.execute(query, vals);
    } catch (err) {
        console.log(err);
    }
}



export async function insertEntry(listID: number, entryID: number, checked: boolean, description: string) {
    try {
        const query = "INSERT INTO ToDoEntry(listID, entryID, checked, description) VALUES (?, ?, ?, ?)";
        const vals = [listID, entryID, checked ? 1 : 0, description];
        const [results, fields] = await pool.execute(query, vals);
    } catch (err) {
        console.log(err);
    }
}

export async function insertEntryChild(listID: number, parentID: number, childID: number) {
    try {
        const query = "INSERT INTO EntryChildren(listID, parentID, childID) VALUES (?, ?, ?)";
        const vals = [listID, parentID, childID];
        const [results, fields] = await pool.execute(query, vals);
    } catch (err) {
        console.log(err);
    }
}
