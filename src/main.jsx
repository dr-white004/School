import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './Pages/Home'
import About from './Pages/About'
import StudentCourses from './Pages/Courses'
import Contact from './Pages/Contact'
import Login from './Pages/Login'
import Register from './Pages/Register'
import AdminDashboard from './Pages/admin'
import CourseDetail from './Pages/CourseDetail'



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<StudentCourses />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  </BrowserRouter>,
)
