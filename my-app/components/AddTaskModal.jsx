import { useState } from "react";

export default function AddTaskModal({ isOpen, onClose, onAddTask }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [repeatOption, setRepeatOption] = useState("repeat");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#FBF2E0] p-6 rounded-lg w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">Add a Task</h2>
          <button onClick={onClose} className="text-red-500 text-lg">✖</button>
        </div>

        <input
          type="text"
          placeholder="Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full p-2 border shadow-sm rounded-md mb-4 bg-[#F0E2C6]"
        />

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="repeat"
              checked={repeatOption === "repeat"}
              onChange={() => setRepeatOption("repeat")}
              className="accent-green-600"
            />
            <span>Repeat until deleted</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="repeat"
              checked={repeatOption === "once"}
              onChange={() => setRepeatOption("once")}
              className="accent-green-600"
            />
            <span>Only for today</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="repeat"
              checked={repeatOption === "custom"}
              onChange={() => setRepeatOption("custom")}
              className="accent-green-600"
            />
            <span>Custom</span>
          </label>
        </div>

        <button
          onClick={() => {
            onAddTask(taskTitle, repeatOption);
            setTaskTitle("");
            onClose();
          }}
          className="mt-4 bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
