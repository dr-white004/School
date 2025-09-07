import React from 'react'
import { Link } from 'react-router-dom'

const Body = () => {
  return (
    <section className='flex flex-col md:flex-row items-center justify-between p-8 bg-[url(/public/BodyImg.avif)] text-white'>
      
      {/* Left Side - Hero Text */}
      <div className='flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0 w-full md:w-1/2'>        
        <h2 className='text-4xl font-bold mb-4 leading-snug'>
          Welcome to <span className="text-amber-500">Edubox</span>
        </h2>
        <p className='mb-6 text-lg'>
          Learn from trusted tutors. Manage your courses. Earn certificates.  
          Join the marketplace for knowledge and growth.
        </p>

        {/* CTA Buttons */}
        <div className="space-x-4">
          <a href="#role-selection">
            <button className='bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded text-white font-semibold shadow'>
              Get Started
            </button>
          </a>
          <Link to="/courses">
            <button className='bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded font-semibold shadow'>
              View Courses
            </button>
          </Link>
        </div>
      </div> 

      {/* Right Side - Image */}
      <div className='w-full md:w-1/2 flex justify-center'>
        <img src="/Bg-Image.avif" alt="Education" className='w-full max-w-md rounded-lg shadow-lg' />  
      </div>
    </section>
  )
}

export default Body
