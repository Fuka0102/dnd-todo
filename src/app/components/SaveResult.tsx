type SaveResultParams = {
    isStartToSave: boolean;
    isCompleted: boolean;
    isFailed: boolean;
};

export default function SaveResult ({isStartToSave, isCompleted, isFailed}: SaveResultParams) {
    return (
        <>
        {isStartToSave && (
            <div className='flex items-center justify-center mt-4'>
                <div className="text-blue-600 text-center font-bold">
                    <p>Saving...</p>
                </div>
            </div>
        )}
        {!isStartToSave && isCompleted && (
            <div className='flex items-center justify-center mt-4'>
                <div className="text-green-600 text-center font-bold">
                    <p>Save successful!</p>
                </div>
            </div>
        )}
        {!isStartToSave && isFailed && (
            <div className='flex items-center justify-center mt-4'>
                    <div className="text-red-600 text-center font-bold">
                        <p>Save failed. Please try again.</p>
                    </div>
            </div>
        )}
        </>
    )
}