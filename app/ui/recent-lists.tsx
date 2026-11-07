'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';

import {queryListNameBatch} from '@/app/lib/queries.ts';

function loadHistory() {
    let localHistoryString = localStorage.getItem("recentLists");
    let localHistory: number[];
    if (localHistoryString != null) {
        localHistory = JSON.parse(localHistoryString).map((a) => Number(a));
    } else {
        localHistory = [];
    }

    return localHistory;
}

export default function RecentLists() {
    const [recentLists, updateRecentLists] = useState([]);
    const [recentListNames, updateRecentListNames] = useState([]);

    async function getRecentLists() {
        const listIDs = loadHistory();
        if (listIDs.length > 0) {
            const listNameMap = await queryListNameBatch(listIDs);
            const listNames = listIDs.map((id) => listNameMap.get(id));
            console.log(listNames);
            updateRecentLists(listIDs);
            updateRecentListNames(listNames);
        }
    }

    useEffect(() => {
        getRecentLists();

        return () => {};
    }, []);

    return (
        <div id="recents-div" className="grid items-center gap-1 p-1 rounded grid-cols-1 border-[1px]">
            <b>Recently Visited:</b>
            <ul className="[list-style:georgian_inside]">
                {recentListNames != null ? (<>{recentListNames.map(
                    (listName, i) => (<li key={i}><Link href={`/list/${recentLists[i]}`}>
                        {listName}
                    </Link></li>)
                )}</>) : 
                (<p>Loading Recent Lists...</p>)}
            </ul>
        </div>
    );
}
