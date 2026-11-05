import {UserData, ToDoListData, ToDoEntryData} from './data-definitions.ts';
import {updateListName, updateEntryChecked, updateEntryDescription,
        deleteEntryChild, updateEntryParent, insertEntryChild} from './queries.ts';

export type ToDoListState = {
    id: number;
    name: string;
    children: ToDoEntryState[];
};

export class ToDoListWrapper {
    state: ToDoListState;

    constructor(id: number, name: string, entries: ToDoEntryState[]) {
        this.state = {
            id: id, name: name, children: entries
        };

        entries.forEach((entry) => {
            entry.parent = this.state;
        });
    }

    constructor(state: ToDoListState) {
        this.state = state;
    }

    get id(): number {return this.state.id;}

    get name(): string {return this.state.name;}
    set name(val: string) {
        this.state.name = val;
        updateListName(this.state.id, val); 
    }

    get children(): ToDoEntryState[] {return this.state.children;}
};

export type ToDoEntryState = {
    id: number;
    listID: number;
    checked: boolean;
    description: string;
    parent: ToDoListState | ToDoEntryState | null;
    children: ToDoEntryState[];
}

export class ToDoEntryWrapper {
    state: ToDoEntryState;

    constructor(id: number, listID: number, checked: boolean, description: string, parent = null, children = []) {
        this.state = {
            id: id, listID: listID, checked: checked,
            description: description, parent: parent,
            children: children
        };

        children.forEach(
            (entry) => {entry.parent = this;}
        );
    }

    constructor(state: ToDoEntryState) {
        this.state = state;
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

    get parent(): ToDoListState | ToDoEntryState | null {return this.state.parent;}
    set parent(val: ToDoList) {
        if (val.id != this.listID) {
            throw new Error("Attempted to move list entry between lists by changing ToDoEntry.parent!");
        }

        // Remove this from previous parent
        this.state.parent.children.splice(this.state.parent.children.indexOf(this), 1);
        if (this.parent instanceof ToDoEntry) {
            // Remove this from previous parent entry
            deleteEntryChild(this.listID, this.parent.id, this.id);
        }
        this.state.parent = val;
    }

    set parent(val: ToDoEntry) {
        if (val.listID != this.listID) {
            throw new Error("Attempted to move list entry between lists by changing ToDoEntry.parent!");
        }

        // Remove this from previous parent
        this.state.parent.children.splice(this.state.parent.children.indexOf(this), 1);
        if (this.state.parent instanceof ToDoEntry) {
            // Update existing child entry
            updateEntryParent(this.listID, this.state.parent.id, this.id, val.id);
        } else {
            // Add new child entry
            insertEntryChild(this.listID, val.id, this.id);
        }
        this.state.parent = val;
        val.state.children.push(this);
    }

    get children(): ToDoEntryState[] {return this.state.children;}
};
