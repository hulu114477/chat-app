import { useParams } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import appContext from '../context';
import Messages from './Messages'
import SendMessage from './SendMessage'

export default function Room() {
  const { roomId } = useParams()
  const { room, setRoom } = useContext(appContext)

  useEffect(() => {
    // טעינת נתוני החדר מהשרת
    fetch(`/api/rooms/${roomId}`)
      .then(res => res.json())
      .then(data => setRoom(data))
  }, [roomId])

  return (
    <div className="room-container">
      <h2>{room.name}</h2>
      <div className="chat-section">
        <Messages />
        <SendMessage />
      </div>
    </div>
  )
}