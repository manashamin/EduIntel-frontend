import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import "./App.css";


// ================= HOME PAGE =================

function Home({ setReport }) {
  const [teacherFile, setTeacherFile] = useState(null);
  const [studentFiles, setStudentFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleTeacherUpload = (e) => {
    setTeacherFile(e.target.files[0]);
  };

  const handleStudentUpload = (e) => {
    const files = Array.from(e.target.files);
    setStudentFiles(files);
  };

  const handleAnalyze = async () => {
    try {
      if (!teacherFile) {
        alert("Please upload teacher key");
        return;
      }

      if (studentFiles.length === 0) {
        alert("Please upload at least one student paper");
        return;
      }

      setLoading(true);

      const formData = new FormData();

      formData.append("teacher", teacherFile);

      studentFiles.forEach((file) => {
        formData.append("students", file);
      });

      const response = await fetch("https://eduintel-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      setLoading(false);

      if (!result.success) {
        alert("Backend Error: " + result.error);
        return;
      }

      setReport(result.data);

      navigate("/report");

    } catch (error) {
      setLoading(false);
      alert("Backend connection failed");
      console.error(error);
    }
  };

  return (
    <div className="main-bg">

      <div className="card">

        <h1 className="title">EduIntel</h1>

        {/* Teacher Upload */}
        <div className="upload-section">

          <label className="label">
            Upload Teacher Key
          </label>

          <input
            type="file"
            onChange={handleTeacherUpload}
            className="file-input"
          />

          {teacherFile && (
            <p className="file-name">
              {teacherFile.name}
            </p>
          )}

        </div>


        {/* Student Upload */}
        <div className="upload-section">

          <label className="label">
            Upload Student Papers (Multiple)
          </label>

          <input
            type="file"
            multiple
            onChange={handleStudentUpload}
            className="file-input"
          />

          {studentFiles.length > 0 && (
            <div className="file-list">

              {studentFiles.map((file, index) => (
                <p key={index}>{file.name}</p>
              ))}

            </div>
          )}

        </div>


        {/* Button */}

        <button
          onClick={handleAnalyze}
          className="analyze-btn"
        >
          {loading ? "Analyzing..." : "Analyze Papers"}
        </button>

      </div>

    </div>
  );
}


// ================= REPORT PAGE =================

function Report({ report }) {

  const navigate = useNavigate();

  if (!report || report.length === 0) {

    return (
      <div className="main-bg">

        <div className="card">

          <h2>No Report Available</h2>

          <button
            onClick={() => navigate("/")}
            className="back-btn"
          >
            Back
          </button>

        </div>

      </div>
    );
  }

  return (

    <div className="main-bg">

      <div className="report-container">

        <h1 className="title">EduIntel Report</h1>

        {report.map((student, index) => (

          <div key={index} className="student-card">

            <h2 className="pdf-title">
              {student.pdf_name}
            </h2>

            
              <h3>
  Performance Score: {student.performance_score} 
</h3>
            


            {student.questions.map((q, i) => (

              <div key={i} className="question-card">

                <p>
                  <b>Question {q.question_number}</b>
                </p>

                <p>
  Similarity: {q.similarity_percent}%
</p>

                <p
  className={
    q.status === "Strong Understanding"
      ? "status-correct"
      : q.status === "Partial Understanding"
      ? "status-partial"
      : q.status === "Weak Understanding"
      ? "status-weak"
      : "status-wrong"
  }
>
  {q.status}
</p>

              </div>

            ))}

          </div>

        ))}


        <button
          onClick={() => navigate("/")}
          className="back-btn"
        >
          Back to Upload
        </button>


      </div>

    </div>
  );
}



// ================= MAIN APP =================

function App() {

  const [report, setReport] = useState([]);

  return (

    <Router>

      <Routes>

        <Route
          path="/"
          element={<Home setReport={setReport} />}
        />

        <Route
          path="/report"
          element={<Report report={report} />}
        />

      </Routes>

    </Router>

  );
}

export default App;
