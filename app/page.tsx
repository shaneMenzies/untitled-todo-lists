'use client';

import {useEffect, useState} from 'react';

import CoolList from './ui/cool-list';
import ToDoList from './ui/todo-list.tsx';
import {fetchList} from './lib/fetches.ts';
import {ToDoListState} from './lib/definitions.ts';

function CoolThing(props) {
    return <h2>{'text' in props ? props.text : 'This is a cool thing'}</h2>;
}

export default function Home() {
    const [testList, updateTestList] = useState<ToDoListState>();

    useEffect(() => {
        fetchList(104).then((list) => {
            console.log("new list: ", typeof list);
            updateTestList(list);
            console.log("updated list value: ", typeof testList);
        });
    
      return () => {
        return
      }
    }, []);

    return (
        <div>
            {testList != null ? (<ToDoList listDataFn={() => {console.log(testList); return testList;}} />) : (<p>Loading List...</p>)}
            <CoolList />
        </div>
    );
}
