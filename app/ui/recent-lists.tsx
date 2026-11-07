'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';

import {queryListNameBatch} from '@/app/lib/queries.ts';

function loadHistory() {
    let localHistory = localStorage.getItem("recentLists");
    if (localHistory != null) {
        localHistory = JSON.parse(localHistory);
    } else {
        localHistory = [];
    }

    return localHistory.map((a) => Number(a));
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
