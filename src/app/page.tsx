import PlanCard from './components/PlanCard';
import { Database } from '../types/database.types';

type Plans = Database['public']['Tables']['plans']['Row'];

export default async function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`http://localhost:3002/plans`, { cache: "no-store" });
  const plans: Plans[] = await res.json()

  return (
    <div>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="max-w-screen-lg my-0 mx-auto py-2.5">
            <div className="mt-10">
              <ul className="grid grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} planData={plan} />
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
