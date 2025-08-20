/** @format */

'use client';
import { useRouter } from 'next/navigation';
import { RiDeleteBinLine } from 'react-icons/ri';

export default function DeleteButton({
  pageId,
  buttonPosition,
  iconSize,
}: {
  pageId: string;
  buttonPosition: string;
  iconSize: string;
}) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const deletePlan = (planId: string) => {
    const shouldDelete = window.confirm('本プラン自体が全て削除されますがよろしいですか？');

    if (!shouldDelete) return;

    fetch(`http://localhost:3002/plans/${pageId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: planId }),
    });

    router.push('/');
    router.refresh();
  };

  return (
    <div className={`${buttonPosition} bg-stone-500 w-8 h-8 rounded-full flex justify-center`}>
      <button type='button' onClick={() => deletePlan(pageId)}>
        <RiDeleteBinLine className={iconSize} />
      </button>
    </div>
  );
}
