import Link from "next/link";
import { Database } from '../types/database.types';

type Plans = Database['public']['Tables']['plans']['Row'];

export default async function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/api/`, { cache: "no-store" });
  const plans: Plans[] = await res.json()

  return (
    <div>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="max-w-screen-lg my-0 mx-auto py-2.5">
            <div className="mt-10">
              <ul className="grid grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <li key={plan.id}>
                    <Link href={`plan/${plan.id}`} className="block max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                      <div className="h-52 overflow-hidden">
                        {/* todo: 画像はサーバーから取得したい */}
                        <img src="https://placehold.jp/920x613.png" alt="" />
                      </div>
                      <div className="p-5">
                        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{plan.title}</h2>
                        <div className="text-sm">
                          <span className="text-xl">{plan.period}</span>
                          <span className="ml-1">日間</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
            </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
