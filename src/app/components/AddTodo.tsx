`use client`;

import React, { useState } from "react";

export default function AddTodo () {
    const [todoText, setTodoText] = useState(""); 

    function onChangeTodoText (e: React.ChangeEvent<HTMLInputElement>) {
        setTodoText(e.target.value);
    }

    function onClickAdd () {
        if (todoText === "") return;
        
        const newTodo = {
            id: todoText,
            title: todoText,
        }

        setTodoText("");
    }

    return (
        <div>
            <input value={todoText} onChange={onChangeTodoText} />
            <button onClick={onClickAdd}>追加</button>
        </div>
    )
}