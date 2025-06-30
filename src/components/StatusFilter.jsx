import React from 'react'

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  const statuses = ['All', 'Pending', 'In Progress', 'Resolved', 'Closed']

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            selectedStatus === status
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  )
}

export default StatusFilter