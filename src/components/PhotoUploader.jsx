import React, { useState } from "react";
import axios from "axios";
const PhotoUploader = ({addedPhotos, setAddedPhotos}) => {
  const [photoLink, setPhotoLink] = useState("");

  async function addPhotoByLink(e) {
    e.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    if (filename === "error") return alert("Invalid Link");
    else {
      setAddedPhotos((prev) => [...prev, filename]);
      setPhotoLink("");
    }
  }
  async function uploadPhoto(e) {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        const { data: filenames } = res;
        setAddedPhotos((prev) => [...prev, ...filenames]);
      });
  }
  return (
    <>
      <div className="flex gap-2">
        <input
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
          className="border-2 border-gray-400 rounded-full px-4 py-1 w-full"
          type="text"
          placeholder="Add using a link ....jpg"
        />
        <button
          onClick={addPhotoByLink}
          className="bg-gray-200 px-4 rounded-2xl py-2 w-fit hover:bg-gray-300 transition duration-200 hover:scale-110"
        >
          Add&nbsp;Photos
        </button>
      </div>
      <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link) => (
            <div className="rounded-2xl flex h-32 overflow-hidden " key={link}>
              <img
                src={"http://localhost:4000/uploads/" + link}
                className="object-cover w-full rounded-2xl"
                alt=""
              />
            </div>
          ))}
        <label className="flex cursor-pointer items-center gap-2 h-32 justify-center border-2 bg-transparent rounded-xl p-2 py-8 mb-4 text-2xl text-gray-600 hover:text-gray-400 transition duration-200 hover:scale-105">
          <input
            type="file"
            multiple={true}
            className="hidden"
            onChange={uploadPhoto}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 lg:w-8 lg:h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
          <span className="text-sm lg:text-lg">Upload</span>
        </label>
      </div>
    </>
  );
};

export default PhotoUploader;
