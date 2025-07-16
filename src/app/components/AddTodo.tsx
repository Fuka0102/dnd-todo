/** @format */

"use client";

import React, { ChangeEventHandler, MouseEventHandler } from 'react';

type PropsType = {
  todoText?: string | number | readonly string[] | undefined;
  onChangeTodoText?: ChangeEventHandler<HTMLElement>;
  onClickAdd?: MouseEventHandler<HTMLElement>;
};

export default function AddTodo({ todoText, onChangeTodoText, onClickAdd }: PropsType) {
  return (
    <div className='flex'>
      <input
        className='block py-1.5 px-0 w-1/5 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
        value={todoText}
        onChange={onChangeTodoText}
        placeholder='todo内容を入力'
      />
      <button
        className='flex px-2 py-1.5 bg-black text-white border-solid border-2 border-black hover:bg-white hover:text-black hover:border-black ml-3'
        onClick={onClickAdd}
      >
        追加
      </button>
    </div>
  );
}
