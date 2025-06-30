import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useComplaints } from '../contexts/ComplaintContext'
import { FileText, Upload, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium'
  })
  const [loading, setLoading] = useState(false)
  
  const { submitComplaint } = useComplaints()
  const navigate = useNavigate()

  const categories = [
    'Product Quality',
    'Billing',
    'Customer Service',
    'Delivery',
    'Technical Support',
    'Refund/Return',
    'Account Issues',
    'Other'
  ]

  const priorities = [
    { value: 'Low', label: 'Low', description: 'Minor issue, not urgent' },
    { value: 'Medium', label: 'Medium', description: 'Moderate issue, needs attention' },
    { value: 'High', label: 'High', description: 'Urgent issue, requires immediate attention' }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const result = await submitComplaint(formData)
      if (result.success) {
        toast.success('Complaint submitted successfully!')
        navigate(`/complaint/${result.complaintId}`)
      } else {
        toast.error(result.error || 'Failed to submit complaint')
      }
    } catch (error) {
      toast.error('An error occurred while submitting your complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Submit a Complaint</h1>
        <p className="text-gray-600">
          Please provide detailed information about your issue to help us resolve it quickly.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Brief summary of your complaint"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Priority Level *
                </label>
                <div className="space-y-3">
                  {priorities.map((priority) => (
                    <label key={priority.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={formData.priority === priority.value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{priority.label}</div>
                        <div className="text-sm text-gray-600">{priority.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field resize-none"
                  placeholder="Please provide a detailed description of your complaint, including any relevant dates, order numbers, or other important information..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 20 characters ({formData.description.length}/20)
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200">
                  <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.description.length < 20}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      <span>Submit Complaint</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <AlertCircle size={20} className="text-primary-600" />
              <span>Tips for Better Resolution</span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Be specific and detailed in your description</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Include relevant dates, order numbers, or reference IDs</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Attach supporting documents or screenshots</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Choose the appropriate priority level</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 font-bold">•</span>
                <span>Provide your contact information for follow-up</span>
              </li>
            </ul>
          </div>

          {/* What Happens Next */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What Happens Next?</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-800">Complaint Received</p>
                  <p className="text-gray-600">You'll receive a confirmation with your complaint ID</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-800">Agent Assignment</p>
                  <p className="text-gray-600">A specialized agent will be assigned to your case</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-800">Investigation</p>
                  <p className="text-gray-600">We'll investigate and work on resolving your issue</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-800">Resolution</p>
                  <p className="text-gray-600">You'll be notified once your complaint is resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmitComplaint