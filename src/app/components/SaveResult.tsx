export default function SaveResult (isCompleted: boolean) {
    return (
        <div>
            {isCompleted ? (
                <div className="text-green-600 text-center font-bold">
                    <p>Save successful!</p>
                </div>
            ) : (
                <div className="text-red-600 text-center font-bold">
                    <p>Save failed. Please try again.</p>
                </div>
            )}
        </div>
    )
}