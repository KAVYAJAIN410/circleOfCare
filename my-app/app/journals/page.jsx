"use client";
import React, { useState } from "react";
import { Gem, Flame } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Toaster, toast } from "react-hot-toast";
import NavBar from "../../components/nav";
export default function AddJournal() {
  const { data: session } = useSession();
  const [journal, setJournal] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Start loading
    try {
      const response = await axios.post(
        "/api/addJournal",
        { journal },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.email}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (!response.data.success) {
        const errorData = response.data.error ?? response.data.message;
        toast.error(`Error: ${errorData}`); // Display error toast
        setIsLoading(false); // Stop loading
        return;
      }

      setJournal("");
      toast.success("Journal entry added successfully!"); // Display success toast
    } catch (error) {
      toast.error("An error occurred while adding the journal entry."); // Display error toast
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleChange = (e) => {
    setJournal(e.target.value);
  };

  return (
    <>
    <div className="bg-[#FBF2E0]">
    <NavBar></NavBar>
    <section className="h-screen  items-center  p-4">
      <Toaster /> {/* Toast notifications */}
     

      <div className="flex gap-4 text-lg justify-end m-2">
        <div className="flex items-center gap-1">
          <Gem size={20} className="text-blue-500" /> 200
        </div>
        <div className="flex items-center gap-1">
          <Flame size={20} className="text-orange-500" /> 3
        </div>
      </div>

      <div className="flex justify-center w-full">
        <div className="mt-6 w-full max-w-2xl p-4 bg-[#FAEBD7] rounded-lg shadow-lg border border-gray-300">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            My Journal
          </h1>
          <textarea
            value={journal}
            onChange={handleChange}
            className="w-full mt-4 h-40 p-3 border border-gray-400 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Write your thoughts here..."
          ></textarea>
          <button
            className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center justify-center"
            onClick={handleSubmit}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : null}
            {isLoading ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </div>
    </section>
    </div>
    </>
  );
}
