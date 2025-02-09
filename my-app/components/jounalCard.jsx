import React from "react";

const DailyTasksUI = () => {
  return (
    <div className="flex gap-4 p-4 bg-beige min-h-screen">
      <div className="w-1/3 p-4 rounded-xl border border-black bg-[#f5eada]">
        <h2 className="text-lg font-semibold mb-2">Daily Tasks</h2>
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-[#f0e6d1] rounded-lg border"
            >
              <span className="flex-1">Task {index + 1}</span>
              <input type="checkbox" className="ml-2" />
            </div>
          ))}
        </div>
        <button className="mt-2 w-full bg-black text-white p-2 rounded-lg">+</button>
      </div>

      <div className="flex flex-col gap-4 w-2/3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center p-4 border border-black rounded-lg">
            <span className="mr-2">💬</span> How can we help you!
          </div>
          <div className="flex items-center justify-center p-4 border border-black rounded-lg">
            <span className="mr-2">🎲</span> Play to Relax!
          </div>
        </div>

        <div className="p-4 border border-black rounded-xl">
          <h2 className="text-lg font-semibold mb-2">My Journal</h2>
          <textarea className="w-full p-2 border rounded-lg" placeholder="today I..."></textarea>
        </div>

        <div className="p-4 border border-black rounded-xl">
          <h2 className="text-lg font-semibold mb-2">How are you feeling today?</h2>
          <div className="flex justify-between text-2xl">
            {"😀😘😊😐😒😣😡🤕😭😵".split("").map((emoji, index) => (
              <span key={index} className="cursor-pointer">
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTasksUI;
