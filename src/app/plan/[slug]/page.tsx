/** @format */

import React from 'react';
import PlanContainer from '../../components/PlanContainer';
import DeleteButton from '../../components/DeleteButton';

export default async function Plan({ params }: { params: Promise<{ slug: string }> }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { slug } = await params;

  const res = await fetch(`${API_URL}/api/${slug}`, {
    next: {
      revalidate: 0,
    },
  });
  const plan = await res.json();

  return (
    <div className='max-w-screen-lg my-0 mx-auto py-2.5'>
      <div className='mt-10'>
        <h2 className='font-bold text-2xl text-center'>{plan.title}</h2>
      </div>
      <div>
        <PlanContainer planData={plan} pageId={slug} />
        <DeleteButton pageId={slug} buttonPosition='fixed bottom-6 right-4' size='16' height='16' iconSize='text-2xl' />
      </div>
    </div>
  );
}
