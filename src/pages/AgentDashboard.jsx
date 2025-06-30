import React, { useState } from 'react'
import { useComplaints } from '../contexts/ComplaintContext'
import ComplaintCard from '../components/ComplaintCard'
import StatusFilter from '../components/StatusFilter'
import { 
  Headphones, 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const AgentDashboard = () => {
  const { getAgentComplaints, updateComplaintStatus } = useComplaints()
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [loading, setLoading] = useState(false)
  
  const agentComplaints = getAgentComplaints()
  
  const filteredComplaints = selectedStatus === 'All' 
    ? agentComplaints 
    : agentComplaints.filter(complaint => complaint.status === selectedStatus)

  const stats = {
    total: agentComplaints.length,
    pending: agentComplaints.filter(c => c.status === 'Pending').length,
    inProgress: agentComplaints.filter(c => c.status === 'In Progress').length,
    resolved: agentComplaints.filter(c => c.status === 'Resolved').length,
    highPriority: agentComplaints.filter(c => c.priority === 'High').length
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Agent Dashboard</h1>
        <p className="text-gray-600">
          Manage your assigned complaints and help resolve customer issues.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          icon={<FileText size={24} />}
          title="Assigned Cases"
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
          icon={<AlertCircle size={24} />}
          title="High Priority"
          value={stats.highPriority}
          color="text-red-600"
          bgColor="bg-red-50"
        />
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Performance</h2>
            <p className="opacity-90">
              You have resolved {stats.resolved} out of {stats.total} assigned complaints.
              {stats.inProgress > 0 && ` ${stats.inProgress} cases are currently in progress.`}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <Headphones size={32} />
          </div>
        </div>
      </div>

      {/* Assigned Complaints */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Assigned Complaints</h2>
          {agentComplaints.length > 0 && (
            <span className="text-sm text-gray-500">
              {filteredComplaints.length} of {agentComplaints.length} complaints
            </span>
          )}
        </div>

        {agentComplaints.length > 0 ? (
          <>
            <StatusFilter 
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
            
            {filteredComplaints.length > 0 ? (
              <div className="space-y-6">
                {filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="relative">
                    <ComplaintCard complaint={complaint} showUser={true} />
                    
                    {/* Agent Actions */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      {complaint.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusUpdate(complaint.id, 'In Progress')}
                          disabled={loading}
                          className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-3 py-1 rounded-full transition-colors duration-200 disabled:opacity-50"
                        >
                          Start Working
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
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
            <Headphones size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No assigned complaints
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have any complaints assigned to you yet. Check back later or contact your administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentDashboard