"use client"
import Image from "next/image";
import NavBar from "../components/nav";
import avatar from "../assets/avatar.png";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import TaskBar from "../components/taskBar";
import message from "../assets/message.png";
import { useRouter } from "next/navigation";
import dice from "../assets/dice.png";
import journal from "../assets/journal.png";
import jour from "../assets/jour.png";
import AddTaskModal from "../components/AddTaskModal";

export default function Home() {
  const router=useRouter();
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (status === "authenticated") {
      getUserData();
    }
  }, [status]);
  //  const onAddTask=async(title,repeatOption)=>{
  //   try {
  //     const response = await axios.post(
  //       "/api/addTask",
  //       { title },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${session?.user?.email}`,
  //           "Access-Control-Allow-Origin": "*",
  //         },
  //       }
  //     );

  //     if (!response.data.success) {
  //       const errorData = response.data.error ?? response.data.message;
  //       toast.error(`Error: ${errorData}`); // Display error toast
  //       setIsLoading(false); // Stop loading
  //       return;
  //     }

  //     setActivities("");
  //     toast.success("activities added successfully!"); 
  //   } catch (error) {
  //     toast.error("An error occurred while adding the journal entry."); 
  //   } finally {
  //     setIsLoading(false); 
  //   }
  // };
  //  }
  const getUserData = () => {
    fetch(`/api/userInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessTokenBackend}`,
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setActivities(data.user.DailyTask);
      });
  };

  return (
    <div className="min-h-screen bg-[#FBF2E0]">
      <NavBar />
      <div className="flex flex-col items-center gap-6 mt-6 px-4 md:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-center w-full max-w-4xl">
          <Image src={avatar} alt="avatar" className="w-1/3 md:w-1/4 object-contain" />
          <div className="border border-black rounded-lg p-4 md:px-12 text-center max-w-xs">
            <p>
              If I cannot do great things, I can do small things in a great way.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full max-w-5xl">
          <div className="border-2 border-black rounded-lg p-6 w-full lg:w-1/2 h-[400px] flex flex-col">
          <div className="flex justify-between"> 
            <h2 className="text-2xl font-semibold mb-4">Daily Task</h2>
            <button onClick={() => setIsModalOpen(true)} className="text-xl font-bold">+</button>
            </div>
            {activities && activities.length > 0 ? (
              activities.map((t, index) => <TaskBar key={index}>{t}</TaskBar>)
            ) : (
              <p>No tasks available</p>
            )}
          </div>
          <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          // onAddTask={onAddTask} // Reload tasks after adding
        />
          <div className="w-full lg:w-1/2 h-[400px] flex flex-col gap-4">
            <div className="flex gap-4 h-3/5">
              <div className="flex flex-col gap-4 w-1/3">
                <div className="border-2 border-black rounded-t-lg flex justify-center items-center p-2 h-1/2">
                  <Image src={message} alt="chat bot" className="w-2/3 md:w-1/2" />
                  <p className="text-lg">How can we help you?</p>
                </div>
                <div className="border-2 border-black flex justify-center items-center p-2 h-1/2">
                  <p className="text-lg">Play to Relax!</p>
                  <Image src={dice} alt="dice" className="w-2/3 md:w-1/2" />
                </div>
              </div>
              <div className="border-2 border-black rounded-t-lg w-2/3 flex flex-col items-center p-4 hover:scale-95 transition-transform cursor-pointer" onClick={()=>{
               router.push('/MyJournal')
              }}>
                <h2 className="text-xl font-semibold">My Journal</h2>
                <div className="w-full bg-cover bg-center" style={{ backgroundImage: `url(${jour})` }}>
                  <Image src={journal} alt="journal" className="w-3/4 mx-auto" />
                </div>
              </div>
            </div>

            <div className="border-2 border-black rounded-b-lg p-4 flex flex-col items-center h-2/5">
              <h2 className="text-lg font-semibold">How are you feeling today?</h2>
              <div className="flex gap-4 md:text-2xl ">
                {["😃", "😘", "😊", "😐", "😕", "😖", "😡", "🤕", "🤒", "😵", "😭"].map((emoji, index) => (
                  <span key={index} className="cursor-pointer hover:scale-110 transition-transform">{emoji}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
