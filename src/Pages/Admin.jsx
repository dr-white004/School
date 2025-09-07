// AdminDashboard.jsx
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
  const [form, setForm] = useState({ title: "", description: "", start_date: "", end_date: "" });

  // fetch courses created by this admin
  const fetchMyCourses = async () => {
    const res = await fetch(`${API}/courses/`, { headers: getAuthHeaders() });
    const data = await res.json();
   console.log (data)
    setCourses(data.results);
  };

  // fetch pending enrollments for courses taught by this admin
  const fetchPending = async () => {
    const res = await fetch(`${API}/enrollments/pending_approvals/`, { headers: getAuthHeaders() });
    const data = await res.json();
    setPending(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchMyCourses();
    fetchPending();
  }, []);

  // create course
  const handleCreate = async e => {
    e.preventDefault();
    const res = await fetch(`${API}/courses/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...form, is_active: true })
    });
    if (res.ok) {
      setForm({ title: "", description: "", start_date: "", end_date: "" });
      fetchMyCourses();
    } else {
      alert("Error creating course");
    }
  };

  // approve / reject enrollment
  const handleEnroll = async (id, status) => {
    await fetch(`${API}/enrollments/${id}/${status}/`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    fetchPending();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
        <Navbar/>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Create Course */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><BookOpen size={20}/> Create New Course</h2>
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
          <input className="border rounded px-3 py-2" placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Description" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input className="border rounded px-3 py-2" type="date" required value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
          <input className="border rounded px-3 py-2" type="date" required value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
          <button className="col-span-full bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"><Plus size={18}/> Create Course</button>
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
                <p className="text-sm text-gray-600">{c.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1"><Calendar size={14}/> {c.start_date}</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> {c.end_date}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="text-blue-600 hover:underline text-sm flex items-center gap-1"><Eye size={14}/> View</button>
                <button className="text-red-600 hover:underline text-sm flex items-center gap-1"><Trash2 size={14}/> Delete</button>
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
            <div key={en.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{en.student_name}</p>
                <p className="text-sm text-gray-600">{en.course_title}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEnroll(en.id, 'approve')} className="text-green-600 hover:underline flex items-center gap-1"><CheckCircle size={16}/> Approve</button>
                <button onClick={() => handleEnroll(en.id, 'reject')} className="text-red-600 hover:underline flex items-center gap-1"><XCircle size={16}/> Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer/>
    </div>
  );
}