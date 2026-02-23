import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Report() {

  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data || [];

  return (
    <div className="container">
      <h1>Gap Report</h1>

      {data.map((student, index) => (
        <div key={index}>
          <h2>Student File: {student.file_name}</h2>
          <h3>Overall Score: {student.overall_score}%</h3>

          {student.report.map((item, i) => (
            <div key={i} className="card">
              <p><b>Question:</b> {item.question}</p>
              <p><b>Status:</b> {item.status}</p>
              <p><b>Score:</b> {item.overall_score}</p>
              <p><b>Similarity:</b> {item.similarity}</p>
              
            </div>
          ))}
        </div>
      ))}

      <button onClick={() => navigate("/")}>Upload More</button>
    </div>
  );
}

export default Report;
