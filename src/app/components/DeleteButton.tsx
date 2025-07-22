/** @format */

'use client';
import { useRouter } from 'next/navigation';
import { RiDeleteBinLine } from 'react-icons/ri';

export default function DeleteButton({
  pageId,
  buttonPosition,
  size,
  height,
  iconSize,
}: {
  pageId: string;
  buttonPosition: string;
  size: string;
  height: string;
  iconSize: string;
}) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const deletePlan = (planId: number) => {
    const shouldDelete = window.confirm('本プラン自体が全て削除されますがよろしいですか？');

    if (!shouldDelete) return;

    fetch(`${API_URL}/api/${pageId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: planId }),
    });

    router.push('/');
    router.refresh();
  };

  return (
    <div className={`${buttonPosition} bg-stone-500 w-${size} h-${height} rounded-full flex justify-center`}>
      <button type='button' onClick={() => deletePlan(parseInt(pageId))}>
        <RiDeleteBinLine className={iconSize} />
      </button>
    </div>
  );
}
