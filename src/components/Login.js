import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("_username", username);
        navigate("/home");
    };
    return (
        <div className=''>
            <h2>Sign in to your todo-list</h2>
            <form onSubmit={handleSubmit} className=''>
                <label htmlFor='username'>Your Username</label>
                <input
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button>SIGN IN</button>
            </form>
        </div>
    );
}