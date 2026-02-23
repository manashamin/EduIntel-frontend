import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {

  const [answerKey, setAnswerKey] = useState(null);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async () => {

    if (!answerKey) {
      alert("Upload teacher answer key");
      return;
    }

    const formData = new FormData();
    formData.append("answer_key", answerKey);

    for (let i = 0; i < students.length; i++) {
      formData.append("student_answer", students[i]);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/analyze",
        formData
      );

      navigate("/report", { state: { data: response.data } });

    } catch (error) {
      alert("Backend not running");
    }
  };

  return (
    <div className="container">
      <h1>AI Knowledge Gap Finder</h1>

      <div className="upload-box">
        <label>Upload Teacher Answer Key</label>
        <input
          type="file"
          onChange={(e) => setAnswerKey(e.target.files[0])}
        />
      </div>

      <div className="upload-box">
        <label>Upload Student Answers (Multiple)</label>
        <input
          type="file"
          multiple
          onChange={(e) => setStudents(e.target.files)}
        />
      </div>

      <button onClick={handleSubmit}>Find My Gap</button>
    </div>
  );
}

export default Home;
