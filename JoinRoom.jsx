import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import appContext from '../context';
import socket from '../socket'

export default function JoinRoom() {
  const { setRoom } = useContext(appContext)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    roomId: '',
    username: '',
    color: '#000000',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    socket.emit('joinRoom', {
      roomId: formData.roomId,
      username: formData.username,
      color: formData.color,
      pwd: formData.password
    }, (response) => {
      if(response.success) {
        setRoom({
          id: formData.roomId,
          name: response.room.name,
          members: response.room.users
        })
        navigate(`/room/${formData.roomId}`)
      } else {
        alert(response.error || 'Error joining room')
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
    <div className="join-room">
      <h2>Join Existing Room</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Room ID:</label>
          <input
            type="text"
            name="roomId"
            value={formData.roomId}
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
          <label>Password (if required):</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Join Room</button>
      </form>
    </div>
  )
}