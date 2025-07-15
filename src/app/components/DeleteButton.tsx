"use client"
import { useRouter } from 'next/navigation';
import { RiDeleteBinLine } from 'react-icons/ri';

export default function DeleteButton ({ pageId, buttonPosition, iconSize}: {pageId: string, buttonPosition: string, iconSize: string }) {
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const deletePlan = (planId: number) => {
        fetch(`${API_URL}/api/${pageId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: planId }),
        });

        router.push("/");
        router.refresh();
    };

    return (
        <button type="button" className={`${buttonPosition} bg-black p-4 rounded-full flex justify-center`} onClick={() => deletePlan(parseInt(pageId))}>
            <RiDeleteBinLine className={`${iconSize} text-white`} />
        </button>
    )
}