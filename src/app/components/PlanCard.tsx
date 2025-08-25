"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { RiDeleteBinLine } from 'react-icons/ri';
import { Database } from '@/types/database.types';

type Plan = Database['public']['Tables']['plans']['Row'];

export default function PlanCard ({ planData }: {planData: Plan }) {

    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const deletePlan = (planId: number) => {
        fetch(`${API_URL}/api/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: planId }),
        });

        router.refresh();
    };

    return (
        <li className="relative">
            <Link href={`plan/${planData.id}`} className="block max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                <div className="h-52 overflow-hidden">
                {/* todo: 画像はサーバーから取得したい */}
                <img src="https://placehold.jp/920x613.png" alt="" />
                </div>
                <div className="p-5">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{planData.title}</h2>
                <div className="text-sm">
                    <span className="text-xl">{planData.period}</span>
                    <span className="ml-1">日間</span>
                </div>
                </div>
            </Link>
            <div className="absolute bottom-6 right-4 bg-black w-8 h-8 rounded-full flex justify-center text-white">
                <button type="button" onClick={() => deletePlan(planData.id)}>
                    <RiDeleteBinLine />
                </button>
            </div>
        </li>
    )
}