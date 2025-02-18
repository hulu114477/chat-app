//client/src/components/CreateRoom.jsx
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import appContext from '../context';
import socket from '../socket'

export default function CreateRoom() {
  const { setRoom } = useContext(appContext)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    roomName: '',
    username: '',
    color: '#000000',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    socket.emit('createRoom', {
      name: formData.roomName,
      username: formData.username,
      color: formData.color,
      pwd: formData.password
    }, (response) => {
      if(response.success) {
        setRoom({
          id: response.roomId,
          name: formData.roomName,
          members: [{
            username: formData.username,
            color: formData.color
          }]
        })
        navigate(`/room/${response.roomId}`)
      } else {
        alert(response.error || 'Error creating room')
      }
    })
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="create-room">
      <h2>Create New Room</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Room Name:</label>
          <input 
            type="text" 
            name="roomName"
            value={formData.roomName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Your Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Your Color:</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password (optional):</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create Room</button>
      </form>
    </div>
  )
}