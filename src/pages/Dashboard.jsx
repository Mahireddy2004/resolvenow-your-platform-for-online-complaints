import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useComplaints } from '../contexts/ComplaintContext'
import ComplaintCard from '../components/ComplaintCard'
import StatusFilter from '../components/StatusFilter'
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  MessageSquare
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { getUserComplaints } = useComplaints()
  const [selectedStatus, setSelectedStatus] = useState('All')
  
  const userComplaints = getUserComplaints()
  
  const filteredComplaints = selectedStatus === 'All' 
    ? userComplaints 
    : userComplaints.filter(complaint => complaint.status === selectedStatus)

  const stats = {
    total: userComplaints.length,
    pending: userComplaints.filter(c => c.status === 'Pending').length,
    inProgress: userComplaints.filter(c => c.status === 'In Progress').length,
    resolved: userComplaints.filter(c => c.status === 'Resolved').length
  }

  const StatCard = ({ icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your complaints and their current status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FileText size={24} />}
          title="Total Complaints"
          value={stats.total}
          color="text-primary-600"
          bgColor="bg-primary-50"
        />
        <StatCard
          icon={<Clock size={24} />}
          title="Pending"
          value={stats.pending}
          color="text-warning-600"
          bgColor="bg-warning-50"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          title="In Progress"
          value={stats.inProgress}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<CheckCircle size={24} />}
          title="Resolved"
          value={stats.resolved}
          color="text-success-600"
          bgColor="bg-success-50"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-2">Need to file a new complaint?</h2>
            <p className="opacity-90">Submit your complaint and get it resolved quickly by our expert team.</p>
          </div>
          <Link 
            to="/submit-complaint"
            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Submit Complaint</span>
          </Link>
        </div>
      </div>

      {/* Complaints Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Complaints</h2>
          {userComplaints.length > 0 && (
            <span className="text-sm text-gray-500">
              {filteredComplaints.length} of {userComplaints.length} complaints
            </span>
          )}
        </div>

        {userComplaints.length > 0 ? (
          <>
            <StatusFilter 
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
            
            {filteredComplaints.length > 0 ? (
              <div className="grid gap-6">
                {filteredComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No complaints found
                </h3>
                <p className="text-gray-600">
                  No complaints match the selected status filter.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No complaints yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any complaints yet. Get started by filing your first complaint.
            </p>
            <Link 
              to="/submit-complaint"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Submit Your First Complaint</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard