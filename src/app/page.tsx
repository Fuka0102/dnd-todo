import Link from "next/link";
import { Database } from '../types/database.types';

type Plans = Database['public']['Tables']['plans']['Row'];

export default async function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/api/`, { cache: "no-store" });
  const plans: Plans[] = await res.json()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <ul>
            {plans.map((plan) => (
              <li key={plan.id}>
                <Link href={``}>
                    <div>
                      <h2>{plan.title}</h2>
                      <div>{plan.period}</div>
                    </div>
                </Link>
              </li>
            ))}
          </ul>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
