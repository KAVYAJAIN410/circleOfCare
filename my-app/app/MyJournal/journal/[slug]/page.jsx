'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import NavBar from '../../../components/nav';

const JournalEntryPage = ({ params }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = params; // Extracting the dynamic id from params
  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session) return;

    // Fetch the journal entry by ID
    fetch(`/api/getJournal/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user?.email}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch the journal entry.');
        }
        return res.json();
      })
      .then((data) => {
        setEntry(data.journal);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching journal entry:', err);
        setError('Failed to load the journal entry.');
        setIsLoading(false);
      });
  }, [session, id]);

  const handleSave = () => {
    setIsSaving(true);
    // Update the journal entry
    fetch(`/api/updateJournal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user?.email}`,
      },
      body: JSON.stringify({ ...entry }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update the journal entry.');
        }
        return res.json();
      })
      .then((data) => {
        setEntry(data.journal);
        setIsSaving(false);
        alert('Journal entry updated successfully.');
      })
      .catch((err) => {
        console.error('Error updating journal entry:', err);
        setError('Failed to update the journal entry.');
        setIsSaving(false);
      });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ backgroundColor: '#FBF2E0' }} className="min-h-[100vh]">
      <NavBar />
      <div className="p-10">
        <h1 className="text-4xl m-4">Edit Journal Entry</h1>
        <div className="space-y-4 m-4">
          <input
            type="text"
            value={entry.title}
            onChange={(e) => setEntry({ ...entry, title: e.target.value })}
            className="w-full p-2 border rounded"
            style={{ border: '2px solid black' }}
          />
          <textarea
            value={entry.description}
            onChange={(e) => setEntry({ ...entry, description: e.target.value })}
            className="w-full p-2 border rounded min-h-[200px]"
            style={{ border: '2px solid black' }}
          />
          <div className="flex justify-center m-4">
            <button
              className="bg p-6 rounded-3xl text-3xl"
              style={{ border: '2px solid black' }}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryPage;
