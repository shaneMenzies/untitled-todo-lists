import {UserData, ToDoListData, ToDoEntryData} from './data-definitions.ts';
import {updateListName, updateEntryChecked, updateEntryDescription, queryNextEntryIDFor,
        deleteEntryChild, updateEntryParent, insertEntryChild, insertEntry, deleteEntry} from './queries.ts';

export type ToDoListState = {
    id: number;
    name: string;
    children: ToDoEntryState[];
};

export class ToDoListWrapper {
    state: ToDoListState;

    constructor(state: ToDoListState);
    constructor(id: number, name: string, entries: ToDoEntryState[]) {
        if (arguments.length == 1) {
            this.state = arguments[0];
        } else {
            this.state = {
                id: id, name: name, children: entries
            };
        }
    }

    get id(): number {return this.state.id;}

    get name(): string {return this.state.name;}
    set name(val: string) {
        this.state.name = val;
        updateListName(this.state.id, val); 
    }

    get children(): ToDoEntryState[] {return this.state.children;}

    public async addNewEntry(description: string) {
        const newID = await queryNextEntryIDFor(this.state.id);
        await insertEntry(this.state.id, newID, false, description);

        const entry = {id: newID, listID: this.state.id, checked: false, 
            description: description, children: []};
        this.state.children.push(entry);
    }

    public async deleteEntry(entryID: number) {
        await deleteEntry(this.state.id, entryID);

        // Find target in own children
        const spliceIndex = this.state.children.findIndex((child) => child.id == entryID);
        const removedVal = this.state.children[spliceIndex];

        // Remove entry child
        this.state.children.splice(spliceIndex, 1);
        this.state.children.push(...removedVal.children);
    }
};

export type ToDoEntryState = {
    id: number;
    listID: number;
    checked: boolean;
    description: string;
    children: ToDoEntryState[];
}

export class ToDoEntryWrapper {
    state: ToDoEntryState;

    constructor(state: ToDoEntryState);
    constructor(id: number, listID: number, checked: boolean, description: string, children = []) {
        if (arguments.length == 1) {
            this.state = arguments[0];
        } else {
            this.state = {
                id: id, listID: listID, checked: checked,
                description: description,
                children: children
            };
        }
    }

    get id(): number {return this.state.id;}
    get listID(): number {return this.state.listID;}

    get checked(): boolean {return this.state.checked;}
    set checked(val: boolean) {
        this.state.checked = val;
        updateEntryChecked(this.listID, this.id, val);
    }

    get description(): string {return this.state.description;}
    set description(val: string) {
        this.state.description = val;
        updateEntryDescription(this.listID, this.id, val);
    }

    get children(): ToDoEntryState[] {return this.state.children;}

    public async addNewEntry(description: string) {
        const newID = await queryNextEntryIDFor(this.state.listID);
        await insertEntry(this.state.listID, newID, false, description);
        await insertEntryChild(this.state.listID, this.id, newID);

        const entry = {id: newID, listID: this.state.listID, checked: false, 
            description: description, children: []};
        this.state.children.push(entry);
    }

    public async deleteEntry(entryID: number) {
        await deleteEntry(this.state.listID, entryID);

        // Find target in own children
        const spliceIndex = this.state.children.findIndex((child) => child.id == entryID);
        const removedVal = this.state.children[spliceIndex];

        // Remove entry child
        this.state.children.splice(spliceIndex, 1);
        this.state.children.push(...removedVal.children);
    }
};
