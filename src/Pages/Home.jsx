import React from 'react'
import Navbar from '../Components/Navbar'
import Body from '../Components/Body'
import { Link } from 'react-router-dom'
import Footer from '../Components/Footer'

const Home = () => {
  return (
    <>
      <Navbar />
      <Body />

      <section id='role-selection' className="p-12 text-center bg-gradient-to-t from-white to-blue-100">
        <h2 className="text-2xl font-bold mb-4">Start Your Journey</h2>
        <p className="mb-6">Choose your role to continue</p>
        <div className="space-x-6">
          <Link to="/login?role=student">
            <button className="bg-amber-500 px-6 py-2 rounded text-white cursor-pointer hover:bg-amber-600">I’m a Student</button>
          </Link>
          <Link to="/login?role=admin">
            <button className="bg-blue-500 px-6 py-2 rounded text-white cursor-pointer hover:bg-blue-700">I’m an Admin</button>
          </Link>
        </div>
      </section>

      <section className="p-12 bg-gradient-to-t from-white to-blue-100">
        <h2 className="text-2xl font-bold text-center mb-6">Why Edubox?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-bold mb-2">Flexible Learning</h3>
            <p>Students choose tutors and courses that match their goals.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Easy Management</h3>
            <p>Admins manage courses, students, and issue certificates easily.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Secure Platform</h3>
            <p>Authentication and dashboards tailored to each role.</p>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  )
}

export default Home
