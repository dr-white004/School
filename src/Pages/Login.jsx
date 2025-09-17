import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [role, setRole] = useState('student') // default role
  const nav = useNavigate()

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleLogin = async e => {
    e.preventDefault()
    setError('')

    const res = await fetch(
      'https://sophisticated-eden-dr-white004-48b8c072.koyeb.app/api/auth/login/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }
    )

    const data = await res.json()
    if (res.ok) {
      // store tokens & user
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))

      // role-based redirect
      if (data.user?.role === 'student') {
        nav('/contact')
      } else if (data.user?.role === 'admin') {
        nav('/admin')
      } else {
        nav('/home')
      }
    } else {
      setError(data.detail || 'Invalid credentials')
    }
  }

  return (
    <>
      <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen">
        <Navbar />
        <div className="p-12 max-w-md mt-5 bg-gradient-to-r from-blue-100 to-amber-200 mx-auto rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        
          <div className="mb-4 flex justify-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="student"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              <span>Student</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="admin"
                checked={role === 'admin'}
                onChange={() => setRole('admin')}
              />
              <span>Admin</span>
            </label>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-amber-500 text-white px-6 py-2 rounded w-full cursor-pointer hover:bg-amber-600"
            >
              Login as {role}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Login
