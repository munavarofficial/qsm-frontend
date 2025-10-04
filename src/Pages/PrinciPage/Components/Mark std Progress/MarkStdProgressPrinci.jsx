import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function MarkStdProgressPrinci() {
  const [allClasses, setAllClasses] = useState([]);
  const [allTerms, setAllTerms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marks, setMarks] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/principal/csrf-token/`,
          { withCredentials: true }
        );
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };
    fetchCsrfToken();
  }, [backendUrl]);

  // Fetch classes and terms
  useEffect(() => {
    const getCurrentYear = () => new Date().getFullYear();

    const fetchAllClasses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/principal/get-class-with-stds/`, { withCredentials: true });
        setAllClasses(response.data || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    const fetchAllTerms = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/principal/terms/`, { withCredentials: true });
        const currentYear = getCurrentYear();
        const filteredTerms = response.data.filter(term => term.year === currentYear);
        setAllTerms(filteredTerms || []);
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    };

    fetchAllClasses();
    fetchAllTerms();
  }, [backendUrl]);

  // Handlers
  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setSelectedTerm(null);
    setSelectedStudent(null);
    setMarks({});
  };

  const handleTermSelect = (termId) => {
    setSelectedTerm(termId);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    const initialMarks = {};
    (selectedClass.subjects || []).forEach((subject) => {
      initialMarks[subject.id] = '';
    });
    setMarks(initialMarks);
  };

  const handleMarkChange = (subjectId, mark) => {
    setMarks((prev) => ({ ...prev, [subjectId]: mark }));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedTerm || !selectedStudent) {
      setError("Please select a class, term, and student.");
      return;
    }

    try {
      // For each subject, send a POST request
      for (const subject of selectedClass.subjects) {
        const singleProgressData = {
          student: selectedStudent.id,
          term: selectedTerm,
          subject: subject.id,
          marks: Number(marks[subject.id] || 0),
        };

        const response = await axios.post(
          `${backendUrl}/api/principal/create-progress-report/`,
          singleProgressData,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            withCredentials: true,
          }
        );

        if (response.status !== 201 && response.status !== 200) {
          throw new Error('Failed to submit one of the progress records.');
        }
      }

      setSuccess("Progress submitted successfully for all subjects.");
      setError(null);
      setMarks({});
    } catch (error) {
      console.error('Error during submission:', error);
      setError('Failed to submit progress. Please try again.');
      setSuccess(null);
    }
  };
const getImageUrl = (url) => (url?.startsWith("http") ? url : `${backendUrl}${url}`);
  return (
    <div className="student-info-container ">

      <h1 className="student-info-title">Mark Student Progress</h1>

   {/* Class Selection */}
   <div className="class-selection">
          <h2>Classes</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {allClasses.map((classData, index) => (
              <button
                key={index}
                className={`class-btn ${
                  selectedClass === classData ? "selected" : ""
                }`}
                onClick={() => handleClassSelect(classData)}
              >
                Class: {classData.class}
              </button>
            ))}
          </div>
        </div>

      {/* Term Selection */}
      {selectedClass && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Select a Term</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {allTerms.map((term) => (
              <button
                key={term.id}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #007bff',
                  borderRadius: '4px',
                  backgroundColor: selectedTerm === term.id ? '#007bff' : 'transparent',
                  color: selectedTerm === term.id ? '#fff' : '#007bff',
                  cursor: 'pointer',
                }}
                onClick={() => handleTermSelect(term.id)}
              >
                {term.name} {term.year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Student Selection */}
      {selectedTerm && selectedClass && !selectedStudent && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Select a Student</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedClass.students.map((student) => (
              <div
                key={student.id}
                onClick={() => handleStudentSelect(student)}
                style={{
                  padding: '10px',
                  textAlign: 'left',
                  backgroundColor: selectedStudent === student ? '#d1ecf1' : '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Student Thumbnail */}
                  <img
                    src={getImageUrl(student.image)}  // Replace with actual image URL or default placeholder
                    alt={student.name}
                    className="student-thumbnail"
                  />
                  <span>{student.name} - {student.place}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marks Input */}
      {selectedStudent && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Enter Marks for {selectedStudent.name}</h3>
          {selectedClass.subjects && selectedClass.subjects.length > 0 ? (
            selectedClass.subjects.map((subject) => (
              <div key={subject.id} style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>{subject.name}</label>
                <input
                  type="number"
                  value={marks[subject.id] || ''}
                  onChange={(e) => handleMarkChange(subject.id, e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    width: '100%',
                  }}
                />
              </div>
            ))
          ) : (
            <p>No subjects available for this class.</p>
          )}
        </div>
      )}

      {/* Error / Success */}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

      {/* Submit Button */}
      {selectedStudent && selectedTerm && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={handleSubmit} className="btn btn-primary">
            Submit Progress
          </button>
        </div>
      )}
      </div>

  );
}

export default MarkStdProgressPrinci;
