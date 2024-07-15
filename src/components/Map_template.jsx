import React, { useState } from "react";
import map_search from "../js_files/map_api.js";
import wiki_search from "../js_files/wikipedia_api.js";
function Map_template() {
  const [mapInputValue, setMapInputValue] = useState("");
  const [mapOutput, setMapOutput] = useState([]);
  const [wikiInputValue, setWikiInputValue] = useState("");
  const [wikiOutput, setWikiOutput] = useState([]);
  const [mapError, setMapError] = useState("");
  const [wikiError, setWikiError] = useState("");
  const [first, setFirst] = useState(true);

  const handleMapInputChange = (e) => {
    setMapInputValue(e.target.value);
  };
  const handleWikiInputChange = (e) => {
    setWikiInputValue(e.target.value);
  };

  const handleMapSubmit = async (e) => {
    e.preventDefault();
    var temp = await map_search(mapInputValue);
    console.log(temp);
    setMapOutput(temp);
    setMapError("");
    if (temp == undefined) {
      setMapError("undefined");
    }

    setFirst(false);
  };
  const handleWikiSubmit = async (e) => {
    e.preventDefault();
    var temp = await wiki_search(wikiInputValue);
    setWikiOutput(temp);
    console.log(temp);
    setWikiError("");
    if (temp.length <= 0) {
      setWikiError("N");
    }
    setFirst(false);
  };

  return (
    <div className="z-20 flex justify-center align-middle text-center m-auto">
      <form onSubmit={handleWikiSubmit}>
        {first && (
          <h1 className="font-outfit text-white text-center">Search the Web</h1>
        )}
        {wikiError === "N" && (
          <p className="text-red-600 ml-1 text-base">
            That's not in the web! 🌎
          </p>
        )}

        <button
          type="submit"
          className="bg-[#46497e] text-white p-2 rounded font-outfit"
        >
          🔍
        </button>
        <input
          type="text"
          value={wikiInputValue}
          onChange={handleWikiInputChange}
          placeholder="What is: "
          className="m-2 px-3 py-2 rounded text-white font-outfit text-base w-44"
        />
        {wikiOutput.length > 0 && (
          <div
            className="mt-2 w-fit bg-white border border-gray-300 shadow-lg rounded-lg overflow-auto"
            style={{ maxHeight: "200px", maxWidth: "265px", minWidth: "265px" }} // Set a fixed height for the container
          >
            <ul className="divide-y divide-gray-200">
              {wikiOutput.map((search, index) => (
                <li key={index} className="px-4 py-3">
                  <p className="text-sm">Title: {search.title}</p>
                  <p className="text-sm">{search.text}</p>
                  <a className="text-sm text-orange-600" href={search.link}>
                    CLICK ME!
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
      <h3 className="font-outfit text-white text-center">OR</h3>
      <form onSubmit={handleMapSubmit}>
        {first && (
          <h1 className="font-outfit text-white text-center">
            Find schools nearby!
          </h1>
        )}
        {mapError === "N" && (
          <p className="text-red-600 ml-1 text-base">
            That's not in the world! 🌎
          </p>
        )}
        {mapError === "API" && (
          <p className="text-red-600 ml-1 text-base">
            Server ran out of API uses! 🗲
          </p>
        )}
        {mapError === "undefined" && (
          <p className="text-red-600 ml-1 text-base">
            That's not in the world! 🌎
          </p>
        )}
        <input
          type="text"
          value={mapInputValue}
          onChange={handleMapInputChange}
          placeholder="Search for schools! 🗺️"
          className="m-2 px-3 py-2 rounded text-white font-outfit text-base w-44"
        />
        <button
          type="submit"
          className="bg-[#46497e] text-white p-2 rounded font-outfit"
        >
          🛰️
        </button>
        {mapOutput != undefined && (
          <div
          // className="mt-2 w-fit bg-white border border-gray-300 shadow-lg rounded-lg overflow-auto"
          // style={{ maxHeight: "200px" , maxWidth:"265px", minWidth:"265px"}} // Set a fixed height for the container
          >
            <ul className="divide-y divide-gray-200">
              {mapOutput.map((map, index) => (
                <li key={index} className="px-4 py-3">
                  <p className="text-sm">Name: {map.name}</p>
                  <p className="text-sm">Location: {map.street}</p>
                  <p className="text-sm text-orange-600">
                    {map.location.distance} m away!
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}

export default Map_template;
