import React, { useState } from 'react'
import { useComplaints } from '../contexts/ComplaintContext'
import ComplaintCard from '../components/ComplaintCard'
import StatusFilter from '../components/StatusFilter'
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  UserCheck,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { getAllComplaints, updateComplaintStatus } = useComplaints()
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [loading, setLoading] = useState(false)
  
  const allComplaints = getAllComplaints()
  
  const filteredComplaints = selectedStatus === 'All' 
    ? allComplaints 
    : allComplaints.filter(complaint => complaint.status === selectedStatus)

  const stats = {
    total: allComplaints.length,
    pending: allComplaints.filter(c => c.status === 'Pending').length,
    inProgress: allComplaints.filter(c => c.status === 'In Progress').length,
    resolved: allComplaints.filter(c => c.status === 'Resolved').length,
    unassigned: allComplaints.filter(c => !c.agentId).length,
    highPriority: allComplaints.filter(c => c.priority === 'High').length
  }

  const handleAssignAgent = async (complaintId) => {
    setLoading(true)
    try {
      const result = await updateComplaintStatus(complaintId, 'In Progress', '2')
      if (result.success) {
        toast.success('Agent assigned successfully!')
      } else {
        toast.error('Failed to assign agent')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (complaintId, newStatus) => {
    setLoading(true)
    try {
      const result = await updateComplaintStatus(complaintId, newStatus)
      if (result.success) {
        toast.success(`Status updated to ${newStatus}`)
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon, title, value, color, bgColor, subtitle }) => (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage all complaints and monitor system performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
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
        <StatCard
          icon={<Users size={24} />}
          title="Unassigned"
          value={stats.unassigned}
          color="text-gray-600"
          bgColor="bg-gray-50"
          subtitle="Need attention"
        />
        <StatCard
          icon={<AlertTriangle size={24} />}
          title="High Priority"
          value={stats.highPriority}
          color="text-red-600"
          bgColor="bg-red-50"
          subtitle="Urgent cases"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Unassigned Complaints</h3>
              <p className="opacity-90 text-sm">
                {stats.unassigned} complaints need agent assignment
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">High Priority Cases</h3>
              <p className="opacity-90 text-sm">
                {stats.highPriority} urgent complaints require immediate attention
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Management */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Complaints</h2>
          <span className="text-sm text-gray-500">
            {filteredComplaints.length} of {allComplaints.length} complaints
          </span>
        </div>

        <StatusFilter 
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        
        {filteredComplaints.length > 0 ? (
          <div className="space-y-6">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="relative">
                <ComplaintCard complaint={complaint} showUser={true} />
                
                {/* Admin Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {!complaint.agentId && (
                    <button
                      onClick={() => handleAssignAgent(complaint.id)}
                      disabled={loading}
                      className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-3 py-1 rounded-full transition-colors duration-200 disabled:opacity-50"
                    >
                      Assign Agent
                    </button>
                  )}
                  
                  {complaint.status === 'In Progress' && (
                    <button
                      onClick={() => handleStatusUpdate(complaint.id, 'Resolved')}
                      disabled={loading}
                      className="bg-success-600 hover:bg-success-700 text-white text-xs px-3 py-1 rounded-full transition-colors duration-200 disabled:opacity-50"
                    >
                      Mark Resolved
                    </button>
                  )}
                  
                  {complaint.status === 'Resolved' && (
                    <button
                      onClick={() => handleStatusUpdate(complaint.id, 'Closed')}
                      disabled={loading}
                      className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-full transition-colors duration-200 disabled:opacity-50"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No complaints found
            </h3>
            <p className="text-gray-600">
              No complaints match the selected status filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard