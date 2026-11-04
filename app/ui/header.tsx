'use client';

import Link from 'next/link';

export function Header(): React.ReactNode {
    return (<div className="flex justify-start gap-6 border-[2px] rounded-md shadow-md m-1 p-1">
        <Link key="home" href="/">Home</Link>
        <h2>Button 1</h2>
        <h2>Button 2</h2>
    </div>);
}
