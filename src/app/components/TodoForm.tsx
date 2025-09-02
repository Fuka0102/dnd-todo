import { useState } from 'react';

export default function TodoForm({ slotId, onCreateTodo }) {
  const [title, setTitle] = useState('');

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  );
}