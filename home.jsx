import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import appContext from "../context"; // תיקון הייבוא

export default function Home() {
  const { inRoom } = useContext(appContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(inRoom) navigate("/room"); // יש לעדכן לנתיב הדינמי בהמשך
  }, [inRoom, navigate]);

  return (
    <div className="home">
      <Link to="/create">Create Room</Link>
      <Link to="/join">Join Room</Link>
    </div>
  );
}