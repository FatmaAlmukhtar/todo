import { useState, useEffect, useRef } from "react";
import TodoItem from "../todoItem/TodoItem";
import io from 'socket.io-client';
import {v4 as uuidv4} from 'uuid'

const socket = io.connect("http://localhost:4000")
const serverUrl = "http://localhost:4000/api"
function TodoList() {
    const [teamTodoList, setTeamTodoList] = useState([]);
    const [personalTodoList, setPersonalTodoList] = useState([]);
    const [text, setText] = useState("");
    const [todoType , setTodoType] = useState("personal");
 
    let username = useRef(localStorage.getItem("_username"))
   
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setTeamTodoList(data.todo)
        })
    }, [socket])

    useEffect(() => {
        fetch(serverUrl)
            .then((res) => res.json())
            .then((data) => setTeamTodoList(data))
            .catch((err) => console.error(err));

        setPersonalTodoList(JSON.parse(localStorage.getItem(`${username.toString()}_todoList`)))
    }, []);

    useEffect(() => {
        localStorage.setItem(`${username.toString()}_todoList`, JSON.stringify(personalTodoList))
        socket.emit("personal", {todo: personalTodoList, user: username.toString()})
    }, [personalTodoList])

    const handleAdd = () => {
        if(text.length === 0) {
            alert('Please Enter Some Text')
            return
        }
        if(todoType === 'team') {
            let newTodo = [
                ...teamTodoList,
                {id: uuidv4(), content: text, completed: false}
            ]
            setTeamTodoList(newTodo);
            socket.emit("send_message", {todo: newTodo})
        } else {
            let newTodo = [
                ...personalTodoList,
                {id: uuidv4(), content: text, completed: false}
            ]
            setPersonalTodoList(newTodo);
        }  
        setText("")
    }

    const deleteItem = (index) => {
        if(todoType === 'team') {
            let newTodo = [
                ...teamTodoList.filter((item, i) => item.id!==index)
            ]
            setTeamTodoList(newTodo);
            socket.emit("send_message", {todo: newTodo})
        } else {
            let newTodo = [
                ...personalTodoList.filter((item, i) => item.id!==index)
            ]
            setPersonalTodoList(newTodo);
        }
    }

    const editItem = (text, index) => {
        if(todoType === 'team') {
            let newTodo = teamTodoList
            newTodo.find(todo => todo.id === index).content = text
            setTeamTodoList([...newTodo])
            socket.emit("send_message", {todo: newTodo})
        } else {
            let newTodo = personalTodoList
            newTodo.find(todo => todo.id === index).content = text
            setPersonalTodoList([...newTodo])
        }
    }

    const completedItem = (status, index) => {
        if(todoType === 'team') {
            let newTodo = teamTodoList
            newTodo.find(todo => todo.id === index).completed = status
            setTeamTodoList([...newTodo])
            socket.emit("send_message", {todo: newTodo})
        } else {
            let newTodo = personalTodoList
            newTodo.find(todo => todo.id === index).completed = status
            setPersonalTodoList([...newTodo])
        }
    }

    return (
        <div className="container flex flex-col items-center">
            <div className="flex items-start justify-center ">
                <input className="bg-white border border-pink-500 pl-2 pr-2 rounded-md mr-2" type="text" name="" onChange={(e) => setText(e.target.value)} value={text} />
                <button type="" className="add-item bg-pink-500 text-white text-s px-2 rounded-md" onClick={handleAdd}>Add</button>
            </div>
            <div onChange={(e) => setTodoType(e.target.value)}>
                <input type="radio" id="team" name="todo-type" value="team" />
                <label htmlFor="team">Team</label>
                <input type="radio" id="personal" name="todo-type" value="personal" defaultChecked/>
                <label htmlFor="personal">Personal</label>
            </div>
            <div className="todo-list">
                { 
                    todoType === 'team'
                    ?
                    teamTodoList.map((item, key) => 
                        <TodoItem text={item.content} key={key} index={item.id} deleteItem={deleteItem} editItem={editItem} completed={item.completed} completedItem={completedItem}/>
                    )
                    :
                    personalTodoList.map((item, key) => 
                        <TodoItem text={item.content} key={key} index={item.id} deleteItem={deleteItem} editItem={editItem} completed={item.completed} completedItem={completedItem}/>
                    )
                }
            </div>
        </div>
    );
}

export default TodoList;