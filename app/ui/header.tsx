'use client';

import {useRouter} from 'next/navigation';

import RecentLists from '@/app/ui/recent-lists.tsx';
import {insertNewList} from '@/app/lib/queries.ts';

export function Header(): React.ReactNode {
    const router = useRouter();

    async function newList() {
        const newID = await insertNewList("Untitled List");
        router.push(`/list/${newID}`);
    }

    return (<div className="flex flex-col gap-6 border-[2px] rounded-md shadow-md m-1 p-1">
        <div className="cursor-pointer rounded-md flex place-content-center shrink p-1 border-[1px]"
            onClick={() => {newList();}}
        >
            Make New List
        </div>
        <RecentLists />
    </div>);
}
