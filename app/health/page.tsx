'use client';

import {useState, useEffect} from 'react';

import {queryDatabaseStatus} from '@/app/lib/queries.ts';

export default function HealthPage() {
    const [status, updateStatus] = useState<any>(null);

    async function getStatus() {
        const newStatus = await queryDatabaseStatus();
        console.log(newStatus);
        updateStatus(newStatus);
    }

    useEffect(() => {
        getStatus();

        return () => {};
    }, []);

    return <div id="db-health-div">
        {status != null ? (<>
            {Array.isArray(status) ? (
                <>
                    <b>Database connection is working!</b>
                    <ul>
                        <li>{status[39].Value} bytes received</li>
                        <li>{status[40].Value} bytes sent</li>
                    </ul>
                </>

            ) : (
                <b>Database connection is not presently working</b>
            )}
        </>) : (
            <>
                <b>Checking database status...</b>
            </>
        )}
    </div>
}
