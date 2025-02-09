'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import NavBar from '../../components/nav';
import Link from 'next/link';

const Card = ({ children }) => (
  <div className="border rounded-3xl p-4 m-4 shadow-sm" style={{ border: '2px solid black' }}>
    {children}
  </div>
);

const Button = ({ children, onClick }) => (
  <div className="flex justify-center m-4">
    <button className="bg p-6 rounded-3xl text-3xl" style={{ border: '2px solid black' }} onClick={onClick}>
      {children}
    </button>
  </div>
);

const JournalPage = () => {
  const { data: session } = useSession();
  const [entries, setEntries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    fetch('/api/getJournal', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user?.email}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEntries(data.journal))
      .catch((err) => console.error('Error fetching journals:', err));
  }, [session]);

  return (
    <div style={{ backgroundColor: '#FBF2E0' }} className="min-h-[100vh]">
      <NavBar />
      <div className="p-10">
        <h1 className="text-4xl m-4">My Journal</h1>
        <Button onClick={() => router.push('/journals')}>
          <span className="mr-2">Add an entry</span>
        </Button>
        <div className="flex justify-center">
          <hr className="my-2 w-[50%]" style={{ border: '1px solid black' }} />
        </div>
        <div className="space-y-4 m-4">
          {entries?.length > 0 ? (
            entries.map((entry) => (
              <Link key={entry.id} href={`journal/${entries.indexOf(entry)}`}>
                <Card>
                  <div className="text-2xl inline-block">
                    {new Date(entry.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}{' '}
                    - {entry.title}
                    <hr className="border-black w-full mt-1" />
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{entry.description}</p>
                  <div className="flex justify-end gap-2 mt-2">
                    {/* Optional: Add edit and delete icons here */}
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center">No journal entries found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
