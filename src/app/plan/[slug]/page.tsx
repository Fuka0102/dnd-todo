import React from "react";

export default async function Plan({ params }: { params: Promise<{ slug: string }> }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const { slug } = await params;

    const res = await fetch(`${API_URL}/api/${slug}`, {
    next: {
        revalidate: 10,
    },
    });
    const plan = await res.json();

    return (
        <>
            <h2>{plan.title}</h2>
        </>
    );
}