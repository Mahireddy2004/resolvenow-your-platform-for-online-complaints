import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ComplaintContext = createContext()

export const useComplaints = () => {
  const context = useContext(ComplaintContext)
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider')
  }
  return context
}

export const ComplaintProvider = ({ children }) => {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)

  // Mock data
  const mockComplaints = [
    {
      id: '1',
      title: 'Defective Product',
      description: 'The product I received has a manufacturing defect. The screen is cracked and the device won\'t turn on properly.',
      category: 'Product Quality',
      priority: 'High',
      status: 'In Progress',
      userId: '3',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      agentId: '2',
      agentName: 'Agent Sarah',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      messages: [
        {
          id: '1',
          senderId: '3',
          senderName: 'John Doe',
          message: 'I received a defective product and need a replacement.',
          timestamp: new Date('2024-01-15T10:00:00')
        },
        {
          id: '2',
          senderId: '2',
          senderName: 'Agent Sarah',
          message: 'Thank you for reporting this issue. I\'ve escalated this to our quality team and we\'ll arrange a replacement for you.',
          timestamp: new Date('2024-01-16T09:30:00')
        }
      ]
    },
    {
      id: '2',
      title: 'Billing Issue',
      description: 'I was charged twice for the same order. Please refund the duplicate charge.',
      category: 'Billing',
      priority: 'Medium',
      status: 'Pending',
      userId: '3',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      agentId: null,
      agentName: null,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      messages: []
    }
  ]

  useEffect(() => {
    if (user) {
      setComplaints(mockComplaints)
    }
  }, [user])

  const submitComplaint = async (complaintData) => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newComplaint = {
        id: Date.now().toString(),
        ...complaintData,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        status: 'Pending',
        agentId: null,
        agentName: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: []
      }
      
      setComplaints(prev => [newComplaint, ...prev])
      return { success: true, complaintId: newComplaint.id }
    } catch (error) {
      return { success: false, error: 'Failed to submit complaint' }
    } finally {
      setLoading(false)
    }
  }

  const updateComplaintStatus = async (complaintId, status, agentId = null) => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setComplaints(prev => prev.map(complaint => 
        complaint.id === complaintId 
          ? { 
              ...complaint, 
              status, 
              agentId,
              agentName: agentId === '2' ? 'Agent Sarah' : null,
              updatedAt: new Date() 
            }
          : complaint
      ))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to update complaint' }
    } finally {
      setLoading(false)
    }
  }

  const addMessage = async (complaintId, message) => {
    try {
      const newMessage = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        message,
        timestamp: new Date()
      }
      
      setComplaints(prev => prev.map(complaint => 
        complaint.id === complaintId 
          ? { 
              ...complaint, 
              messages: [...complaint.messages, newMessage],
              updatedAt: new Date()
            }
          : complaint
      ))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to send message' }
    }
  }

  const getUserComplaints = () => {
    if (!user) return []
    return complaints.filter(complaint => complaint.userId === user.id)
  }

  const getAgentComplaints = () => {
    if (!user || user.role !== 'agent') return []
    return complaints.filter(complaint => complaint.agentId === user.id)
  }

  const getAllComplaints = () => {
    if (!user || user.role !== 'admin') return []
    return complaints
  }

  const getComplaintById = (id) => {
    return complaints.find(complaint => complaint.id === id)
  }

  const value = {
    complaints,
    loading,
    submitComplaint,
    updateComplaintStatus,
    addMessage,
    getUserComplaints,
    getAgentComplaints,
    getAllComplaints,
    getComplaintById
  }

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  )
}