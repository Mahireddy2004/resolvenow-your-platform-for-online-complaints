import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Shield, 
  Clock, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight,
  Star,
  Zap,
  Globe
} from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: <Shield className="text-primary-600" size={32} />,
      title: 'Secure & Confidential',
      description: 'Your complaints are handled with utmost security and confidentiality using advanced encryption.'
    },
    {
      icon: <Clock className="text-success-600" size={32} />,
      title: 'Real-time Tracking',
      description: 'Track your complaint status in real-time with instant notifications and updates.'
    },
    {
      icon: <Users className="text-warning-600" size={32} />,
      title: 'Expert Agents',
      description: 'Our trained agents are dedicated to resolving your issues quickly and efficiently.'
    },
    {
      icon: <MessageSquare className="text-purple-600" size={32} />,
      title: 'Direct Communication',
      description: 'Communicate directly with assigned agents through our built-in messaging system.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Complaints Resolved' },
    { number: '98%', label: 'Customer Satisfaction' },
    { number: '24/7', label: 'Support Available' },
    { number: '<2hrs', label: 'Average Response Time' }
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl mb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-600 text-white p-4 rounded-2xl animate-bounce-subtle">
              <Shield size={48} />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-primary-600">ResolveNow</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your trusted platform for online complaint registration and management. 
            Submit, track, and resolve your issues with ease and transparency.
          </p>
          
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/submit-complaint" 
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center space-x-2"
              >
                <span>Submit Complaint</span>
                <MessageSquare size={20} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/login" 
                className="btn-secondary text-lg px-8 py-4"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="text-3xl font-bold text-primary-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose ResolveNow?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide a comprehensive solution for complaint management with cutting-edge features 
            designed to ensure your issues are resolved quickly and efficiently.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Simple steps to get your issues resolved</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Submit Your Complaint</h3>
            <p className="text-gray-600">Register your account and submit your complaint with detailed information and supporting documents.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-success-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Track Progress</h3>
            <p className="text-gray-600">Monitor your complaint status in real-time and receive notifications about updates and progress.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-warning-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Get Resolution</h3>
            <p className="text-gray-600">Communicate with assigned agents and receive timely resolution to your complaint.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied users who trust ResolveNow for their complaint management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2"
            >
              <span>Create Account</span>
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home