'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';

import ToDoList from '@/app/ui/todo-list.tsx';
import {fetchList} from '@/app/lib/fetches.ts';
import {ToDoListState} from '@/app/lib/definitions.ts';

const MAX_LOCAL_HISTORY_LEN = 15;

async function updateHistory(listID: number) {
    // Get/make history stored in browser
    let localHistoryString = localStorage.getItem("recentLists");
    let localHistory: number[];
    if (localHistoryString != null) {
        localHistory = JSON.parse(localHistoryString).map((a) => Number(a));
    } else {
        localHistory = [];
    }

    console.log(localHistory);

    // Check/update this list in the history
    if (!(localHistory.includes(listID))) {
        if (localHistory.length == MAX_LOCAL_HISTORY_LEN) {
            localHistory.pop();
        }
        localHistory.unshift(listID);
    } else if (localHistory[0] != listID) {
        localHistory.splice(localHistory.indexOf(listID), 1);
        localHistory.unshift(listID);
    }

    // Save back to local storage
    localStorage.setItem("recentLists", JSON.stringify(localHistory)); 
}

export default function ListPage() {
    const queriedListID = Number(useParams().listID);
    const [listState, updateListState] = useState<ToDoListState>();

    useEffect(() => {
        console.log(queriedListID);
        fetchList(queriedListID).then((list) => {
            updateListState(list);

            if (list != null) {
                updateHistory(queriedListID);
            }
        });
    
      return () => {
        return
      }
    }, []);

    return (
        <div>
            {listState != null ? 
                (<ToDoList listDataFn={() => {return listState;}} />) :
                (<p>Loading List...</p>)}
        </div>
    );
}
