'use client';

import {useState} from 'react';

import {ToDoListState} from '@/app/lib/definitions.ts';
import {fetchList} from '@/app/lib/fetches.ts';
import ListEntry from '@/app/ui/list-entry.tsx';

export default function ToDoList({listDataFn}) {
    const [listObj, setListObj] = useState<ToDoListState>(listDataFn());

    return (
        <div key={"list-" + listObj.id.toString()}>
            <h2 key="list-name">{listObj.name}</h2>

            <div key="list-child-div" className="border-[2px] rounded-md">
                {listObj.children.map(
                    (entry) => (<div key={entry.id}> 
                        <ListEntry entryDataFn={
                            () => {console.log(entry); console.log(entry.children); return entry;}} />
                    </div>)
                )}  
            </div>
        </div>
    );
}
