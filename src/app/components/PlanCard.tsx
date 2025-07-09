"use client";

import Link from "next/link";
import { Database } from '@/types/database.types';

type Plan = Database['public']['Tables']['plans']['Row'];

export default function PlanCard ({ planData }: {planData: Plan }) {
    return (
        <li>
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
        </li>
    )
}