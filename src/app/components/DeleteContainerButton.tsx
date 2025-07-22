/** @format */

type DeleteContainerButtonProps = {
  onDeleteList: () => void;
};

export default function DeleteContainerButton({ onDeleteList }: DeleteContainerButtonProps) {
  return (
    <button type='button' className='mb-4 px-4 py-2 bg-red text-white rounded' onClick={onDeleteList}>
      日数を削除
    </button>
  );
}
