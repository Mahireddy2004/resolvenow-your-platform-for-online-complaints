import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  User, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  Headphones,
  Home,
  FileText,
  Plus
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const NavLink = ({ to, children, icon: Icon, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
        isActive(to)
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
      }`}
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </Link>
  )

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <Shield size={24} />
            </div>
            <span className="text-xl font-bold text-gray-800">ResolveNow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <NavLink to="/dashboard" icon={Home}>
                  Dashboard
                </NavLink>
                <NavLink to="/submit-complaint" icon={Plus}>
                  Submit Complaint
                </NavLink>
                
                {user.role === 'admin' && (
                  <NavLink to="/admin" icon={Shield}>
                    Admin Panel
                  </NavLink>
                )}
                
                {user.role === 'agent' && (
                  <NavLink to="/agent" icon={Headphones}>
                    Agent Panel
                  </NavLink>
                )}

                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <User size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2 mb-4 bg-gray-50 rounded-lg">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <User size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  <NavLink to="/dashboard" icon={Home} onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/submit-complaint" icon={Plus} onClick={() => setIsMenuOpen(false)}>
                    Submit Complaint
                  </NavLink>
                  
                  {user.role === 'admin' && (
                    <NavLink to="/admin" icon={Shield} onClick={() => setIsMenuOpen(false)}>
                      Admin Panel
                    </NavLink>
                  )}
                  
                  {user.role === 'agent' && (
                    <NavLink to="/agent" icon={Headphones} onClick={() => setIsMenuOpen(false)}>
                      Agent Panel
                    </NavLink>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar