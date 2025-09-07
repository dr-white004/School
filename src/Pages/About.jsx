import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

const About = () => {
  return (
    <>
      <Navbar />
      <div className="p-12 bg-gradient-to-t from-white to-blue-100">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="mb-4">Edubox connects students with tutors and administrators who provide high-quality education.</p>
        
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="mb-6">To make learning accessible by providing a platform where tutors share knowledge and students grow skills.</p>

        <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
        <p className="mb-6">To be the most trusted education marketplace for skill and career growth.</p>

        <h2 className="text-2xl font-semibold mb-2">Meet the Team</h2>
        <ul className="list-disc pl-6">
          <li>Developers building the platform</li>
          <li>Admins managing courses</li>
          <li>Students gaining new skills</li>
        </ul>
      </div>
      <Footer/>
    </>
  )
}

export default About
