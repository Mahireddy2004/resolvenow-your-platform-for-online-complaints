import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { 
  Clock, 
  User, 
  MessageCircle, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react'

const ComplaintCard = ({ complaint, showUser = false }) => {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={16} className="text-warning-600" />
      case 'in progress':
        return <Loader size={16} className="text-primary-600" />
      case 'resolved':
        return <CheckCircle size={16} className="text-success-600" />
      case 'closed':
        return <XCircle size={16} className="text-gray-600" />
      default:
        return <AlertCircle size={16} className="text-gray-600" />
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

  return (
    <div className="card hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link 
            to={`/complaint/${complaint.id}`}
            className="text-lg font-semibold text-gray-800 hover:text-primary-600 transition-colors duration-200"
          >
            {complaint.title}
          </Link>
          <p className="text-gray-600 mt-1 line-clamp-2">{complaint.description}</p>
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <span className={`status-badge ${getStatusClass(complaint.status)}`}>
            {getStatusIcon(complaint.status)}
            <span className="ml-1">{complaint.status}</span>
          </span>
          <span className={`status-badge ${getPriorityClass(complaint.priority)}`}>
            {complaint.priority} Priority
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
            {complaint.category}
          </span>
          {showUser && (
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>{complaint.userName}</span>
            </div>
          )}
          {complaint.agentName && (
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>Agent: {complaint.agentName}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          {complaint.messages && complaint.messages.length > 0 && (
            <div className="flex items-center space-x-1">
              <MessageCircle size={14} />
              <span>{complaint.messages.length} messages</span>
            </div>
          )}
          <span>Created {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-400">
          Last updated: {format(new Date(complaint.updatedAt), 'MMM dd, yyyy HH:mm')}
        </div>
        <Link 
          to={`/complaint/${complaint.id}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}

export default ComplaintCard