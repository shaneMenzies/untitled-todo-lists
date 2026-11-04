'use client';

import {useState, Fragment} from 'react';

export default function CoolList() {
    const [data, setData] = useState([
        ['Ada Lovelace', 0],
        ['Grace Hopper', 0],
        ['Margaret Hamilton', 0],
        ['chuck bingle', 0]
    ]);

    function handleAdd(i) {
        console.log('Adding on ', i);
        let new_data = data.slice();
        new_data[i][1] += 1;
        console.log(new_data);
        setData(new_data);
    }

    function addName(newName) {
        let new_data = data.slice();
        new_data.push([newName, 0]);
        console.log(new_data);
        setData(new_data);
    }
     
    return (
        //<div className="flex w-md grow-0">
        <div id="jimmy" className="flex items-center gap-6 rounded m-4 columns-1">
          <div id="terry" className="grid border-[2px] rounded-md shadow-md m-1 p-1 grid-cols-1 space-between">
            {data.map(([name, count], i) => <div id="tim" className="grid grid-cols-[7fr_1fr_2fr] gap-3" key={i}>
                    <div id="tim2erry" key="{i}-name" className="border-[1px] m-1 p-1">{name}</div>
                    <div id="fred" key="{i}-count" className="border-[1px] m-1 p-1">{count}</div>
                    <button id="jed" key="{i}-button" className="border-[1px] rounded-md shadow-md p-1" 
                        onClick={() => {handleAdd(i);}}>Add</button>
            </div>)}
          </div>
          <div id="samantha" className="flex">
              <input className="border-[1px] rounded-md m-1 p-1"
                type="text" name="new_name" id="new_name" />
              <button id="may" className="border-[2px] rounded-md shadow-md m-1 p-1"
                onClick={() => {
                addName(new_name.value);
                new_name.value = '';
              }}>Add new name</button>
          </div>
        </div>
        //</div>
    );
}
