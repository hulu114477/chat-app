//client/src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import appContext from './context';
import Home from './components/Home';
import Room from './components/Room';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import socket from './socket';

export default function App() {
  const [inRoom, setInRoom] = useState(false);
  const [room, setRoom] = useState({
    id: '',
    name: '',
    members: [],
    messages: []
  });

  useEffect(() => {
    const handleMemberUpdate = (members) => {
      setRoom(prev => ({ ...prev, members }));
    };

    const handleNewMessage = (message) => {
      setRoom(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));
    };

    socket.on('memberUpdate', handleMemberUpdate);
    socket.on('message', handleNewMessage);

    return () => {
      socket.off('memberUpdate', handleMemberUpdate);
      socket.off('message', handleNewMessage);
    };
  }, []);

  return (
    <appContext.Provider value={{
      inRoom,
      room,
      setRoom,
      setInRoom
    }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </appContext.Provider>
  );
}