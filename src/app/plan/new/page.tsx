'use client';
import { useState } from "react";

export default function CreatePlan () {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [period, setPeriod] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newPlan = await fetch(`${API_URL}/api`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, title, period }),
        });

        console.log(newPlan);
    };

    return (
        <div>
            <h2>Create Plan</h2>
    
            <form onSubmit={ handleSubmit }>
                <div>
                    <label>URL</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div>
                    <label>タイトル</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>期間</label>
                    <input type="text" value={period} onChange={(e) => setPeriod(e.target.value)} />日間
                </div>
                <button type="submit">
                    作成
                </button>
            </form>
        </div>
    );
}
