import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Edubox</h2>
          <p className="text-sm">Your learning marketplace for skills and growth.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <p>Email: support@edubox.com</p>
          <p>Phone: +234 800 123 4567</p>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Edubox. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
