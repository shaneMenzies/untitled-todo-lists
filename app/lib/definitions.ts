import {UserData, ToDoListData, ToDoEntryData} from './data-definitions.ts';
import * from './queries.ts';

export class User {
    id: number;
    lists: ToDoList[];
};

export class ToDoList {
    readonly id: number;
    _name: string;
    _children: ToDoEntry[];

    constructor(id: number, name: string, entries: ToDoEntry[]) {
        this.id = id;
        this._name = name;
        this._children = entries;

        for (entry in entries) {
            entry._parent = this;
        }
    }

    get name(): string {return this._name;}
    set name(val: string) {
        this._name = val;
        updateListName(this.id, val); 
    }
};

export class ToDoEntry {
    readonly id: number;
    readonly listID: number;
    _checked: boolean;
    _description: string;
    _parent: ToDoList | ToDoEntry | null;
    _children: ToDoEntry[];

    constructor(id: number, listID: number, checked: boolean, description: string, parent = null, children = []) {
        this.id = id;
        this.listID = listID;
        this._checked = checked;
        this._description = description;
        this._parent = parent;
        this._children = children;

        for (entry in children) {
            entry._parent = this;
        }
    }

    get checked(): boolean {return this._checked;}
    set checked(val: boolean) {
        this._checked = val;
        updateEntryChecked(this.listID, this.id, val);
    }

    get description(): string {return this._description;}
    set description(val: string) {
        this._description = val;
        updateEntryDescription(this.listID, this.id, val);
    }

    get parent(): ToDoList | ToDoEntry | null {return this._parent;}
    set parent(val: ToDoList) {
        if (val.id != this.listID) {
            throw new Error("Attempted to move list entry between lists by changing ToDoEntry.parent!");
        }

        // Remove this from previous parent
        this._parent._children.splice(this._parent._children.indexOf(this), 1);
        if (this._parent instanceof ToDoEntry) {
            // Remove this from previous parent entry
            deleteEntryChild(this.listID, this._parent.id, this.id);
        }
        this._parent = val;
    }

    set parent(val: ToDoEntry) {
        if (val.listID != this.listID) {
            throw new Error("Attempted to move list entry between lists by changing ToDoEntry.parent!");
        }

        // Remove this from previous parent
        this._parent._children.splice(this._parent._children.indexOf(this), 1);
        if (this._parent instanceof ToDoEntry) {
            // Update existing child entry
            updateEntryParent(this.listID, this._parent.id, this.id, val.id);
        } else {
            // Add new child entry
            insertEntryChild(this.listID, val.id, this.id);
        }
        this._parent = val;
        val._children.push(this);
    }

    get children(): ToDoEntry[] {return this._children;}
};
