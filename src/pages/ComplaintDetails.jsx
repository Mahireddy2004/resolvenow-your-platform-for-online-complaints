import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useComplaints } from '../contexts/ComplaintContext'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Clock, 
  User, 
  MessageCircle, 
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
  XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const ComplaintDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getComplaintById, addMessage } = useComplaints()
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  const complaint = getComplaintById(id)

  if (!complaint) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Complaint Not Found</h2>
        <p className="text-gray-600 mb-6">The complaint you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={20} className="text-warning-600" />
      case 'in progress':
        return <Loader size={20} className="text-primary-600" />
      case 'resolved':
        return <CheckCircle size={20} className="text-success-600" />
      case 'closed':
        return <XCircle size={20} className="text-gray-600" />
      default:
        return <AlertCircle size={20} className="text-gray-600" />
    }
  }

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending'
      case 'in progress':
        return 'status-in-progress'
      case 'resolved':
        return 'status-resolved'
      case 'closed':
        return 'status-closed'
      default:
        return 'status-badge bg-gray-100 text-gray-800'
    }
  }

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-danger-100 text-danger-800'
      case 'medium':
        return 'bg-warning-100 text-warning-800'
      case 'low':
        return 'bg-success-100 text-success-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const result = await addMessage(complaint.id, newMessage.trim())
      if (result.success) {
        setNewMessage('')
        toast.success('Message sent successfully!')
      } else {
        toast.error('Failed to send message')
      }
    } catch (error) {
      toast.error('An error occurred while sending the message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Complaint Details</h1>
          <p className="text-gray-600">ID: {complaint.id}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Info */}
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{complaint.title}</h2>
              <div className="flex space-x-2">
                <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                  {getStatusIcon(complaint.status)}
                  <span className="ml-1">{complaint.status}</span>
                </span>
                <span className={`status-badge ${getPriorityClass(complaint.priority)}`}>
                  {complaint.priority} Priority
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                {complaint.category}
              </span>
              <span>Created {format(new Date(complaint.createdAt), 'MMM dd, yyyy HH:mm')}</span>
              <span>Updated {format(new Date(complaint.updatedAt), 'MMM dd, yyyy HH:mm')}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <MessageCircle size={20} />
              <span>Communication</span>
            </h3>

            {complaint.messages && complaint.messages.length > 0 ? (
              <div className="space-y-4 mb-6">
                {complaint.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.senderId === user.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium opacity-75">
                          {message.senderName}
                        </span>
                        <span className="text-xs opacity-60">
                          {format(new Date(message.timestamp), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 pt-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 input-field"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-success-100 text-success-600 rounded-full p-1">
                  <CheckCircle size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Complaint Submitted</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(complaint.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              
              {complaint.agentId && (
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 text-primary-600 rounded-full p-1">
                    <User size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Agent Assigned</p>
                    <p className="text-sm text-gray-600">{complaint.agentName}</p>
                  </div>
                </div>
              )}

              {complaint.status === 'In Progress' && (
                <div className="flex items-start space-x-3">
                  <div className="bg-warning-100 text-warning-600 rounded-full p-1">
                    <Loader size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Under Investigation</p>
                    <p className="text-sm text-gray-600">Currently being processed</p>
                  </div>
                </div>
              )}

              {complaint.status === 'Resolved' && (
                <div className="flex items-start space-x-3">
                  <div className="bg-success-100 text-success-600 rounded-full p-1">
                    <CheckCircle size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Complaint Resolved</p>
                    <p className="text-sm text-gray-600">Issue has been resolved</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Complaint Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaint Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-800">{complaint.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <span className={`status-badge ${getPriorityClass(complaint.priority)}`}>
                  {complaint.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              {complaint.agentName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned Agent:</span>
                  <span className="font-medium text-gray-800">{complaint.agentName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div className="card bg-primary-50 border-primary-200">
            <h3 className="text-lg font-semibold text-primary-800 mb-2">Need Help?</h3>
            <p className="text-sm text-primary-700 mb-4">
              If you need immediate assistance, you can contact our support team.
            </p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetails