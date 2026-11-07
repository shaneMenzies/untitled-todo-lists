'use client';

import {useState, useEffect} from 'react';

import {ToDoListState, ToDoListWrapper, ToDoEntryWrapper} from '@/app/lib/definitions.ts';
import {fetchList} from '@/app/lib/fetches.ts';
import {queryNextEntryIDFor} from '@/app/lib/queries.ts';
import ListEntry from '@/app/ui/list-entry.tsx';

export default function ToDoList({listDataFn}) {
    const [state, updateState] = useState<ToDoListState>(listDataFn());
    const [isEditing, updateEditing] = useState(false);
    const [editValue, updateEditValue] = useState(null);

    function startEditing() {
        updateEditing(true);
    }

    async function stopEditing() {
        updateEditing(false);

        if (editValue != null) {
            let newState = new ToDoListWrapper({...state});
            newState.name = editValue;
            updateEditValue(null);
            updateState(newState.state);
        }
    }

    async function addNewEntry(text: string) {
        let newState = new ToDoListWrapper({...state});
        await newState.addNewEntry(text);
        updateState(newState.state);
    }

    async function deleteEntry(entryID: number) {
        let newState = new ToDoListWrapper({...state});
        await newState.deleteEntry(entryID);
        updateState(newState.state);
    }

    return (
        <div id={"list-" + state.id.toString()}>
            {isEditing ? 
                (<div className="flex m-2">
                    <input className="field-sizing-content mx-1" type="text" id="edit_entry" defaultValue={state.name} 
                        onChange={(e) => {
                            updateEditValue(e.target.value);
                    }}/>
                    <div className="place-content-center cursor-pointer border-[1px] rounded-md shrink px-1 mx-1" 
                        onClick={() => {stopEditing();}}>
                        SAVE
                    </div>
                </div>) :
                (<div className="flex m-2">
                    <b id="list-name" className="mx-1">
                        {state.name}
                    </b>
                    <div className="place-content-center cursor-pointer border-[1px] rounded-md shrink px-1 mx-1" 
                        onClick={() => {startEditing();}}>EDIT</div>
                </div>)
            }

            <div id="list-child-div" className="border-[2px] rounded-md">
                {state.children.map(
                    (entry) => (<div key={entry.id}> 
                        <ListEntry entryDataFn={
                            () => {return entry;}}>
                            <div className="place-content-center cursor-pointer border-[1px] rounded-md shrink mx-1 px-1" 
                                onClick={() => {deleteEntry(entry.id);}}>
                                DEL
                            </div>
                        </ListEntry>
                    </div>)
                )}  
            </div>

            <div className="flex m-2" id="list-add-new-div">
                <input className="field-sizing-content min-w-64 border-[2px] rounded-md mx-2" type="text" id="list_add_new_entry" />
                <div className="place-content-center cursor-pointer border-[1px] rounded-md shrink px-2" 
                    onClick={(e) => {
                    addNewEntry((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                }}>
                    +
                </div>
            </div>
        </div>
    );
}
