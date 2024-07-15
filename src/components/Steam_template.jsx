import React, { useState } from "react";
import search_steam from "../js_files/steam_api.js";

function Steam_api() {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(false);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var temp = await search_steam(inputValue);
    setOutput(temp);
    setError(false);
    if (temp.length <= 0) {
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="z-10 w-fit">
      {error && (
        <p className="text-red-600 ml-1 text-base">Error getting that ☹</p>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter Steam Games! ♕"
        className="text-white px-3 py-2 rounded font-outfit text-base w-48"
      />

      <button
        type="submit"
        className="ml-2 bg-[#46497e] text-white p-2 rounded font-outfit"
      >
        🕹️
      </button>
      {output.length > 0 && (
        <div
          className="mt-2 w-fit bg-white border border-gray-300 shadow-lg rounded-lg overflow-auto"
          style={{ maxHeight: "200px", maxWidth: "265px", minWidth: "265px" }} // Set a fixed height for the container
        >
          <ul className="divide-y divide-gray-200 justify-center">
            {output.map((game, index) => (
              <li key={index} className="px-4 py-3">
                <img
                  src={game.img}
                  alt="the games pfp"
                  className="ml-auto mr-auto"
                />
                <p>Name: {game.name}</p>
                <p>Price: {game.price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

export default Steam_api;
