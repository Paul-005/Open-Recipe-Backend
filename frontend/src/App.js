import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [textData, setTextData] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setTextData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("myFile", file); // 'myFile' matches the Multer field name
    formData.append("textData", textData);

    try {
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          value={textData}
          onChange={handleTextChange}
          placeholder="Enter some text"
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default App;
