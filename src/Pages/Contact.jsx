import React, { useEffect, useState } from "react";
import { BookOpen, Calendar, User, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const API = "https://sophisticated-eden-dr-white004-48b8c072.koyeb.app/api";
const getAuthHeaders = () => {
  const t = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
};

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const navigate = useNavigate();

  // fetch all active courses
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API}/courses/?is_active=true`, { headers: getAuthHeaders() });
      const data = await res.json();
      setCourses(data.results || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // fetch user enrollments
  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`${API}/enrollments/student_enrollments/`, { headers: getAuthHeaders() });
      const data = await res.json();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  // Get enrollment status for a course
  const getEnrollmentStatus = (courseId) => {
    const enrollment = enrollments.find(e => e.course === courseId);
    return enrollment ? enrollment.status : null;
  };

  // enroll in a course
  const handleEnroll = async courseId => {
    try {
      // Get current user ID
      const userData = localStorage.getItem("user");
      if (!userData) {
        alert("Please log in first");
        navigate("/login");
        return;
      }
      
      const user = JSON.parse(userData);
      
      const res = await fetch(`${API}/enrollments/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ course: courseId, student: user.id })
      });
      console.log(res)
      if (res.ok) {
        alert("Enrollment request submitted! Waiting for instructor approval.");
        fetchEnrollments(); // refresh enrollments
      } else {
        const errorData = await res.json();
        alert(`Enrollment failed: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Enrollment failed");
    }
  };

  // view course details
  const viewCourseDetails = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BookOpen size={24}/> Available Courses
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(c => {
          const enrollmentStatus = getEnrollmentStatus(c.id);
          
          return (
            <div key={c.id} className="border rounded-lg shadow p-4 flex flex-col">
              <img
              src={`https://res.cloudinary.com/dlev4b4pu/${c.thumbnail}`|| "https://via.placeholder.com/300x160?text=Course"}
                alt={c.title}
                className="rounded mb-3 h-40 object-cover w-full cursor-pointer"
                onClick={() => viewCourseDetails(c.id)}
              />
              <h2 className="font-semibold text-lg mb-1">{c.title}</h2>
              <p className="text-sm text-gray-600 mb-3 flex-1 line-clamp-3">{c.description}</p>

              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <div className="flex items-center gap-2">
                  <User size={14}/> Instructor: {c.instructor_name}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14}/> Starts: {new Date(c.start_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14}/> Ends: {new Date(c.end_date).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-auto">
                {enrollmentStatus === "approved" && (
                  <button
                    onClick={() => viewCourseDetails(c.id)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    Access Course <ArrowRight size={16} />
                  </button>
                )}
                
                {enrollmentStatus === "pending" && (
                  <div className="w-full bg-yellow-100 text-yellow-800 px-4 py-2 rounded flex items-center justify-center gap-2">
                    <Clock size={16} /> Waiting for Approval
                  </div>
                )}
                
                {enrollmentStatus === "rejected" && (
                  <div className="w-full bg-red-100 text-red-800 px-4 py-2 rounded">
                    Enrollment Rejected
                  </div>
                )}
                
                {!enrollmentStatus && (
                  <button
                    onClick={() => handleEnroll(c.id)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Enroll
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}