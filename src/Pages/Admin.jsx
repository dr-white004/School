import React, { useEffect, useState } from "react";
import { Plus, Trash2, Eye, Users, BookOpen, Calendar, CheckCircle, XCircle } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const API = "https://sophisticated-eden-dr-white004-48b8c072.koyeb.app/api";
const getAuthHeaders = () => {
  const t = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
};

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [pending, setPending] = useState([]);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    start_date: "", 
    end_date: "",
    instructor: "" // Will be set to current user ID
  });

  // Get current user ID
  const getCurrentUserId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.id;
    }
    return null;
  };

  // fetch courses created by this admin
  const fetchMyCourses = async () => {
    try {
      const res = await fetch(`${API}/courses/`, { headers: getAuthHeaders() });
      const data = await res.json();
      
      // Filter courses to show only those created by the current admin
      const userId = getCurrentUserId();
      const myCourses = data.results.filter(course => course.instructor === userId);
      setCourses(myCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // fetch pending enrollments for courses taught by this admin
  const fetchPending = async () => {
    try {
      const res = await fetch(`${API}/enrollments/pending_approvals/`, { headers: getAuthHeaders() });
      const data = await res.json();
      setPending(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching pending enrollments:", error);
    }
  };

  useEffect(() => {
    fetchMyCourses();
    fetchPending();
  }, []);

  // create course
  const handleCreate = async e => {
    e.preventDefault();
    try {
      const userId = getCurrentUserId();
      const res = await fetch(`${API}/courses/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          ...form, 
          instructor: userId,
          is_active: true 
        })
      });
      
      if (res.ok) {
        setForm({ title: "", description: "", start_date: "", end_date: "", instructor: "" });
        fetchMyCourses();
        alert("Course created successfully!");
      } else {
        const errorData = await res.json();
        alert(`Error creating course: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course");
    }
  };

  // approve / reject enrollment
  const handleEnroll = async (id, status) => {
    try {
      const res = await fetch(`${API}/enrollments/${id}/${status}/`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      
      if (res.ok) {
        fetchPending();
        alert(`Enrollment ${status} successfully!`);
      } else {
        alert(`Error ${status} enrollment`);
      }
    } catch (error) {
      console.error(`Error ${status} enrollment:`, error);
      alert(`Error ${status} enrollment`);
    }
  };

  // delete course
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const res = await fetch(`${API}/courses/${courseId}/`, {
          method: "DELETE",
          headers: getAuthHeaders()
        });
        
        if (res.ok) {
          fetchMyCourses();
          alert("Course deleted successfully!");
        } else {
          alert("Error deleting course");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Error deleting course");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <Navbar/>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Create Course */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><BookOpen size={20}/> Create New Course</h2>
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
          <input 
            className="border rounded px-3 py-2" 
            placeholder="Title" 
            required 
            value={form.title} 
            onChange={e => setForm({...form, title: e.target.value})} 
          />
          <textarea 
            className="border rounded px-3 py-2 sm:col-span-2" 
            placeholder="Description" 
            required 
            rows="3"
            value={form.description} 
            onChange={e => setForm({...form, description: e.target.value})} 
          />
          <input 
            className="border rounded px-3 py-2" 
            type="date" 
            required 
            value={form.start_date} 
            onChange={e => setForm({...form, start_date: e.target.value})} 
          />
          <input 
            className="border rounded px-3 py-2" 
            type="date" 
            required 
            value={form.end_date} 
            onChange={e => setForm({...form, end_date: e.target.value})} 
          />
          <button className="col-span-full bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2">
            <Plus size={18}/> Create Course
          </button>
        </form>
      </section>

      {/* My Courses */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><BookOpen size={20}/> My Courses</h2>
        {courses.length === 0 && <p className="text-gray-500">No courses yet.</p>}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(c => (
            <div key={c.id} className="border rounded p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold">{c.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1"><Calendar size={14}/> {c.start_date}</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> {c.end_date}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Status: {c.is_active ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                  <Eye size={14}/> View
                </button>
                <button 
                  onClick={() => handleDeleteCourse(c.id)}
                  className="text-red-600 hover:underline text-sm flex items-center gap-1"
                >
                  <Trash2 size={14}/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Enrollments */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Users size={20}/> Pending Enrollments</h2>
        {pending.length === 0 && <p className="text-gray-500">No pending requests.</p>}
        <div className="space-y-3">
          {pending.map(en => (
            <div key={en.id} className="border rounded p-3 flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{en.student_name}</p>
                <p className="text-sm text-gray-600">{en.course_title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Enrolled on: {new Date(en.enrolled_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  Progress: {en.completion_percentage}%
                  {en.grade && ` | Grade: ${en.grade}`}
                </p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button 
                  onClick={() => handleEnroll(en.id, 'approve')} 
                  className="text-green-600 hover:underline flex items-center gap-1"
                >
                  <CheckCircle size={16}/> Approve
                </button>
                <button 
                  onClick={() => handleEnroll(en.id, 'reject')} 
                  className="text-red-600 hover:underline flex items-center gap-1"
                >
                  <XCircle size={16}/> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer/>
    </div>
  );
}