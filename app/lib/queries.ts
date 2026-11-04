'use server';

import mysql from "mysql2/promise";

import {ToDoListData, ToDoEntryData} from "./data-definitions.ts";

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export async function queryListName(listID: number): string | null {
    try {
        const query = 'SELECT ToDoList.listName FROM ToDoList WHERE listID = ?;';
        const [rows, fields] = await pool.execute(query, [listID]);
        const results = (rows.length > 0 ? rows[0].listName : null);
        console.log(results);
        return results
    } catch (err) {
        console.log(err);
    }
}

export async function queryListEntries(listID: number): Array<ToDoEntryData> {
    try {
        const query = 'SELECT * FROM ToDoEntry WHERE listID = ? ORDER BY entryID ASC;';
        const [rows, fields] = await pool.execute(query, [listID]);
        const results = rows.map(
            (x) => {return {
                entryID: x.entryID, checked: x.checked[0] == 1, description: x.description
            }}
        );
        console.log(results);
        return results
    } catch (err) {
        console.log(err);
    }
}

export async function queryListEntryChildren(listID: number): Array<EntryChildrenData> {
    try {
        const query = 'SELECT * FROM EntryChildren WHERE listID = ? ORDER BY parentID ASC';
        const [rows, fields] = await pool.execute(query, [listID]);
        const results = rows.map(
            (x) => {return {
                parentID: x.parentID, childID: x.childID
            }}
        );
        console.log(results);
        return results
    } catch (err) {
        console.log(err);
    }
}

export async function updateListName(listID: number, name: string) {
    try {
        const query = "UPDATE ToDoList SET name = ? WHERE listID = ?";
        const vals = [name, listID];
        const [results, fields] = await pool.execute(query, vals);
        console.log(results);
    } catch (err) {
        console.log(err);
    }
}

export async function updateEntryChecked(listID: number, entryID: number, checked: boolean) {
    try {
        const query = "UPDATE ToDoEntry SET checked = ? WHERE listID = ?, entryID = ?";
        const vals = [checked ? 1 : 0, listID, entryID];
        const [results, fields] = await pool.execute(query, vals);
        console.log(results);
    } catch (err) {
        console.log(err);
    }
}

export async function updateEntryDescription(listID: number, entryID: number, description: string) {
    try {
        const query = "UPDATE ToDoEntry SET description = ? WHERE listID = ?, entryID = ?";
        const vals = [description, listID, entryID];
        const [results, fields] = await pool.execute(query, vals);
        console.log(results);
    } catch (err) {
        console.log(err);
    }
}

export async function updateEntryParent(listID: number, prevParentID: number, childID: number,
                                       newParentID: number) {
    try {
        const query = "UPDATE EntryChildren SET parentID = ? WHERE listID = ?, parentID = ?, childID = ?";
        const vals = [newParentID, listID, prevParentID, childID];
        const [results, fields] = await pool.execute(query, vals);
        console.log(results);
    } catch (err) {
        console.log(err);
    }
}

export async function deleteEntryChild(listID: number, parentID: number, childID: number) {
    try {
        const query = "DELETE FROM EntryChildren WHERE listID = ?, parentID = ?, childID = ?";
        const vals = [listID, parentID, childID];
        const [results, fields] = await pool.execute(query, vals);
        console.log(results);
    } catch (err) {
        console.log(err);
    }
}

export async function insertEntryChild(listID: number, parentID: number, childID: number) {
    try {
        const query = "INSERT INTO EntryChildren(listID, parentID, childID) VALUES (?, ?, ?)";
        const vals = [listID, parentID, childID];
        const [results, fields] = await pool.execute(query, vals);
        console.log(results);
    } catch (err) {
        console.log(err);
    }
}
