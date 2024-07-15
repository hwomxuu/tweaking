import React, { useState, useEffect } from "react";
function Clawk_timer() {
  const [inputString, setInputString] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [list, setList] = useState(() => {
    const savedList = localStorage.getItem("todoList");
    return savedList ? JSON.parse(savedList) : [];
  });
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("todoList"));
    if (savedList) {
      setList(savedList);
    }

    const timerID = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
      removePastItems();
    }, 1000);

    return () => clearInterval(timerID);
  }, []);

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(list));
  }, [list]);

  const handleAdd = () => {
    const currentTime = new Date();
    const [inputHours, inputMinutes] = inputTime.split(":");
    const taskTime = new Date();
    taskTime.setHours(inputHours, inputMinutes, 0, 0);

    if (
      taskTime < currentTime ||
      !inputTime.match(/^([01]\d|2[0-3]):([0-5]\d)$/)
    ) {
      setInputTime("00:00");
    } else {
      if (inputString.trim()) {
        setList([...list, { text: inputString.trim(), time: inputTime }]);
        setInputString("");
        setInputTime("");
      }
    }
  };
  const handleInputString = (e) => {
    setInputString(e.target.value);
  };
  const handleRemove = (index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleInputTime = (e) => {
    setInputTime(e.target.value);
  };
  const removePastItems = () => {
    const currentTime = new Date();
    setList((prevList) =>
      prevList.filter(({ time }) => {
        const [taskHours, taskMinutes] = time.split(":");
        const taskTime = new Date();
        taskTime.setHours(taskHours, taskMinutes, 0, 0);
        return taskTime >= currentTime;
      }),
    );
  };

  return (
    <div className="App">
      <h1 className="text-2xl font-bold mt-2 mb-2 text-white">
        Clock and To-Do List
      </h1>
      <div className="clock-container flex justify-center items-center m-2">
        <div className="clock bg-[#46497e] text-white font-outfit rounded">
          <h2 className="text-lg p-2">{time}</h2>
        </div>
      </div>
      <div className="todo">
        <input
          type="text"
          value={inputString}
          onChange={handleInputString}
          placeholder="Add a new task"
          className="mr-2 rounded px-2 py-1 text-base font-outfit w-44"
        />
        <input
          type="text"
          value={inputTime}
          onChange={handleInputTime}
          placeholder="HH:MM"
          className="mr-2 rounded px-2 py-1 text-base font-outfit w-44"
        />
        <button
          onClick={handleAdd}
          className="bg-[#46497e] mt-2 px-3 py-1 rounded text-white font-outfit text-base"
        >
          Add to List
        </button>
        <ul className="list-none p-0">
          {list.map((item, index) => (
            <li key={index} className="mb-2 flex justify-between items-center">
              {item.text} - {item.time}
              <button
                onClick={() => handleRemove(index)}
                className="bg-red-500 text-white p-2 ml-4"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Clawk_timer;
