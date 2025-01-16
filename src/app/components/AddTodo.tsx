`use client`;

import React, { ChangeEventHandler, MouseEventHandler, useState } from "react";

type PropsType = {
    todoText?: string | number | readonly string[] | undefined,
    onChangeTodoText?: ChangeEventHandler<HTMLElement>,
    onClickAdd?: MouseEventHandler<HTMLElement>
};

export default function AddTodo ({ todoText, onChangeTodoText, onClickAdd }: PropsType) {
    return (
        <div>
            <input value={todoText} onChange={onChangeTodoText} />
            <button onClick={onClickAdd}>追加</button>
        </div>
    )
}