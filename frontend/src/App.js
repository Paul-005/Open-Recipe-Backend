import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    key1: '',
    key2: ''
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('file', file);
    data.append('key1', formData.key1);
    data.append('key2', formData.key2);

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const print = async (e) => {
    e.preventDefault();

    

    try {
      const response = await fetch('http://localhost:4000/');
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>File Upload with Data</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={print} required />
        <input
          type="text"
          name="key1"
          placeholder="Key 1"
          value={formData.key1}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="key2"
          placeholder="Key 2"
          value={formData.key2}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default App;
