import TodoList from './todoList/TodoList';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  }
  return (
    <div className="flex flex-col">
      <nav className='bg-blue-400 w-screen h-10 text-white flex justify-end items-center gap-5'>
        <span className=''>Hello {localStorage.getItem("_username")}</span>
        <button type="" className="mr-5 bg-white text-blue-400 px-2 rounded-md" onClick={handleLogout}>Log Out</button>
      </nav>
      <TodoList />
    </div>
  )
}