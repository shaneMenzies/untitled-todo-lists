'use client';

import {useState, Fragment} from 'react';

import {ToDoEntryState, ToDoEntryWrapper} from "@/app/lib/definitions.ts";

export default function ListEntry({entryDataFn, children}) {
    const [state, updateState] = useState(entryDataFn());
    const [isEditing, updateEditing] = useState(false);
    const [editValue, updateEditValue] = useState(null);

    function startEditing() {
        updateEditing(true);
    }

    async function stopEditing() {
        updateEditing(false);

        if (editValue != null) {
            let newState = new ToDoEntryWrapper({...state});
            newState.description = editValue;
            updateEditValue(null);
            updateState(newState.state);
        }
    }

    function onCheckboxChange(val: boolean) {
        let newState = new ToDoEntryWrapper({...state});
        newState.checked = val;
        updateState(newState.state);
    }

    async function deleteEntry(entryID: number) {
        let newState = new ToDoEntryWrapper({...state});
        await newState.deleteEntry(entryID);
        updateState(newState.state);
    }

    async function addNewEntry(text: string) {
        let newState = new ToDoEntryWrapper({...state});
        await newState.addNewEntry(text);
        updateState(newState.state);
    }

    return (
    <div className="grid grid-cols-1 p-1">
        <div className="flex p-1">
            <input className="mr-2"
                type="checkbox" id={"entryChecked"+state.id.toString()} defaultChecked={state.checked} 
                onChange={(change) => {onCheckboxChange(change.target.checked);}}/>

            {isEditing ? 
                (<>
                    <label htmlFor={"entryChecked"+state.id.toString()}>
                        <input className="field-sizing-content min-w-32 border-[1px] rounded-md mx-2 px-1"
                            type="text" id="edit_entry" defaultValue={state.description} 
                            onChange={() => {
                                updateEditValue(edit_entry.value);
                            }}/>
                    </label>
                    <div className="place-content-center cursor-pointer border-[1px] rounded-md shrink px-1 mx-1" 
                        onClick={() => {stopEditing();}}>SAVE</div>
                </>) :
                (<>
                    <label className={`min-w-32 mr-2 py-[-1] px-1 rounded-md 
                        ${state.checked ? "text-(--green) bg-(--dark)": ""}`} 
                        htmlFor={"entryChecked"+state.id.toString()}>{state.description}</label>
                    <div className="place-content-center cursor-pointer border-[1px] rounded-md shrink px-1 mx-1" 
                        onClick={() => {startEditing();}}>EDIT</div>
                </>)
            }

            <div className="place-content-center cursor-pointer border-[1px] rounded-md shrink px-2 mx-1" 
                onClick={() => {
                addNewEntry('');
            }}>
                +
            </div>
            {children}
        </div>
        {state.children.length > 0 ?
            (<div className="ml-4">
                {Array.from(state.children).map(
                    (entry) => (<div key={entry.id}>
                        <ListEntry entryDataFn={() => {return entry;}}>
                        <div className="place-content-center cursor-pointer border-[1px] rounded-md shrink px-1 mx-1" 
                            onClick={() => {
                                deleteEntry(entry.id);
                            }}>DEL
                            </div>
                        </ListEntry>
                    </div>)
                )}  
            </div>) : <></>
        }
    </div>);
}
