'use client';

import {useState, Fragment} from 'react';

import {ToDoEntryState} from "@app/lib/definitions.ts";

export default function ListEntry({entryDataFn}) {
    const [state, updateState] = useState(entryDataFn());

    return (
    <div>
        <input type="checkbox" id={"entryChecked"+state.id.toString()} defaultChecked={state.checked} />
        <label htmlFor={"entryChecked"+state.id.toString()}>{state.description}</label>
            <div className="border-[2px] rounded-md">
                {Array.from(state.children).map(
                    (entry) => (<div><h3>child: </h3><ListEntry key={entry.entryID} entryDataFn={
                        () => {console.log(entry.children); return entry;}} /></div>)
                )}  
            </div>
    </div>);
}
