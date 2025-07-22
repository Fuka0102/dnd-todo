/** @format */

type AddContainerButtonProps = {
  onAddList: () => void;
};

export default function AddContainerButton({ onAddList }: AddContainerButtonProps) {
  return (
    <button type='button' className='mb-4 px-4 py-2 bg-black text-white rounded' onClick={onAddList}>
      日数を追加
    </button>
  );
}
