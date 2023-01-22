import { useState } from "react";
import './TodoItem.css'

function TodoItem(props) {
    const [editStatus, setEditStatus] = useState(false)
    const [editedText, setEditedText] = useState("")

    const handleDelete = () => {
        props.deleteItem(props.index) 
    }

    const handleCompleted = (e) => {
        props.completedItem(!props.completed, props.index)
    }

    const handleEdit = () => {
        setEditStatus(true)
    }

    const handleSave = () => {
        if(editedText.length === 0) {
            alert("Please Enter Some Text!")
            return
        }
        setEditStatus(false)
        props.editItem(editedText, props.index)
    }

    return (
        <div className="todo-item flex justify-center bg-blue-300 m-2 p-2">
            <input type="checkbox" name="" checked={props.completed} onChange={handleCompleted}/>
            {
                editStatus 
                ? 
                <>
                    <input className="bg-white border border-pink-500 pl-2 pr-2 rounded-md mr-2" type="text" name="" onChange={(e) => setEditedText(e.target.value)} value={editedText} /> 
                    <button className="bg-pink-500 text-white text-s px-2 rounded-md" type="" onClick={handleSave}>Save</button>
                </>
                : 
                <>
                    <span className={props.completed ? "completed mr-5" : "mr-5"}>{props.text}</span>
                    <button className="bg-pink-500 text-white text-s px-2 rounded-md" type="" onClick={handleEdit}>Edit</button>
                </>
            }
            
            <button className="bg-pink-500 text-white text-s px-2 rounded-md" type="" onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default TodoItem;