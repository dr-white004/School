import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

const Register = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '', password: '', firstname: '', lastname: '', 
    phone: '', dob: '', address: '', secretKey: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleRegister(e) {
  e.preventDefault();
  setError('');
  try {
    const requestData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstname,
      last_name: formData.lastname,
      phone: formData.phone,
      date_of_birth: formData.dob,
      address: formData.address,
    };

    if (role === 'admin') {
      requestData.admin_secret = formData.secretKey;
    }

    const response = await fetch('https://sophisticated-eden-dr-white004-48b8c072.koyeb.app/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (response.ok) {
      if (data.access && data.refresh) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        console.log('Tokens stored in localStorage');
      } else {
        setError('Registration succeeded, but tokens are missing.');
        return;
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        console.warn('No user data in response');
      }

      if (data.user?.role === 'student') {
        navigate('/contact');
      } else if (data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } else {
      setError(data.message || 'Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    setError('An error occurred. Please try again.');
  }
}



  return (
    <>
      <div className='bg-gradient-to-b from-blue-100 to-white min-h-screen'>
        <Navbar />
       
        <div className="p-12 max-w-md mx-auto bg-gradient-to-r from-blue-100 to-amber-200 mt-5 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Register</h1>
          
          {/* Error message display */}
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="mr-4">
              <input 
                type="radio" 
                value="student" 
                checked={role === 'student'} 
                onChange={() => setRole('student')} 
              /> Student
            </label>
            <label>
              <input 
                type="radio" 
                value="admin" 
                checked={role === 'admin'} 
                onChange={() => setRole('admin')} 
              /> Admin
            </label>
          </div>
          
          <form className="space-y-4" onSubmit={handleRegister}>
            <input  
              name='email'
              value={formData.email}
              type="email" 
              placeholder="Email" 
              className="w-full p-2 border rounded" 
              onChange={handleChange}
              required
            />

            <input 
              name='phone' 
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <input 
              name='firstname'
              type="text"
              value={formData.firstname}
              placeholder="First Name" 
              onChange={handleChange}
              className="w-full p-2 border rounded" 
              required
            />
            
            <input 
              name='lastname'  
              onChange={handleChange} 
              type="text"  
              value={formData.lastname} 
              placeholder="Last Name" 
              className="w-full p-2 border rounded" 
              required
            />
            
            <input 
              name='dob' 
              onChange={handleChange} 
              type="date" 
              value={formData.dob} 
              placeholder="Date of Birth" 
              className="w-full p-2 border rounded" 
              required
            />
            
            <input 
              name='password' 
              onChange={handleChange} 
              type="password" 
              value={formData.password} 
              placeholder="Password" 
              className="w-full p-2 border rounded" 
              required
            />
            
            <input 
              name='address' 
              onChange={handleChange} 
              value={formData.address} 
              type="text" 
              placeholder="Address" 
              className="w-full p-2 border rounded" 
              required
            />
            
            {role === 'admin' && (
              <input 
                name='secretKey' 
                onChange={handleChange} 
                value={formData.secretKey} 
                type="password" 
                placeholder="Secret Key" 
                className="w-full p-2 border rounded" 
                required
              />
            )}
            
            <button  
              type="submit" 
              className="bg-amber-500 text-white px-6 py-2 rounded w-full cursor-pointer hover:bg-amber-600"
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Register