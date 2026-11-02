'use client';

import {useState} from 'react';

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
        <div>
          <ul>
            {data.map(([name, count], i) => (
              <li key={i}>{name} - {count} - <button onClick={() => {handleAdd(i);}}>Add</button></li>
            ))}
          </ul>
          <input type="text" name="new_name" id="new_name" />
          <button onClick={() => {
            addName(new_name.value);
            new_name.value = '';
          }}>Add new name</button>
        </div>
    );
}
