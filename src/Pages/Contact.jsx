// StudentCourses.jsx
import React, { useEffect, useState } from "react";
import { BookOpen, Calendar, User, CheckCircle } from "lucide-react";

const API = "https://sophisticated-eden-dr-white004-48b8c072.koyeb.app/api";
const getAuthHeaders = () => {
  const t = localStorage.getItem("access_token");
  return { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
};

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState(new Set());

  // fetch all active courses
  const fetchCourses = async () => {
    const res = await fetch(`${API}/courses/?is_active=true`, { headers: getAuthHeaders() });
    const data = await res.json();
    setCourses(data.results || []);
  };

  // fetch already-enrolled course ids
  const fetchEnrolled = async () => {
    const res = await fetch(`${API}/enrollments/`, { headers: getAuthHeaders() });
    const data = await res.json();
    const ids = (data.results || []).map(e => e.course);
    setEnrolled(new Set(ids));
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrolled();
  }, []);

  // enroll
  const handleEnroll = async courseId => {
    const res = await fetch(`${API}/enrollments/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ course: courseId, student: null }) // backend fills student
    });
    if (res.ok) {
      fetchEnrolled(); // refresh
    } else {
      alert("Enrollment failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen size={24}/> Available Courses</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(c => (
          <div key={c.id} className="border rounded-lg shadow p-4 flex flex-col">
            <img
              src={c.thumbnail || "https://via.placeholder.com/300x160?text=Course"}
              alt={c.title}
              className="rounded mb-3 h-40 object-cover w-full"
            />
            <h2 className="font-semibold text-lg mb-1">{c.title}</h2>
            <p className="text-sm text-gray-600 mb-3 flex-1">{c.description}</p>

            <div className="text-xs text-gray-500 space-y-1 mb-4">
              <div className="flex items-center gap-2"><User size={14}/> Instructor: {c.instructor_name}</div>
              <div className="flex items-center gap-2"><Calendar size={14}/> Starts: {c.start_date}</div>
              <div className="flex items-center gap-2"><Calendar size={14}/> Ends: {c.end_date}</div>
            </div>

            {enrolled.has(c.id) ? (
              <span className="inline-flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle size={16}/> Enrolled
              </span>
            ) : (
              <button
                onClick={() => handleEnroll(c.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Enroll
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}