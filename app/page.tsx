'use client';

import {useEffect, useState} from 'react';

import CoolList from './ui/cool-list';
import {queryListEntries} from './lib/queries.ts';

function CoolThing(props) {
    return <h2>{'text' in props ? props.text : 'This is a cool thing'}</h2>;
}

export default function Home() {
    const [idList, updateIDList] = useState([]);

    useEffect(() => {
        queryListEntries(100).then((list) => {
            updateIDList(list);
            console.log("new list: ", list);
        });
    
      return () => {
        return
      }
    }, []);

    return (
        <div>
            <ul>
                {idList.map((id, i) => {
                    return <li key={i}>{id.entryID} - {id.checked ? "Done" : "Not Done"} - {id.description}</li>
                })} 
            </ul>
            <CoolList />
        </div>
    );
}
