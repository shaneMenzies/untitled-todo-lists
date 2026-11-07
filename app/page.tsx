'use client';

import {useEffect, useState} from 'react';

import RecentLists from './ui/recent-lists.tsx';

export default function Home() {
    return (
        <div>
            <RecentLists />
        </div>
    );
}
