'use client';

export default function CreatePlan () {
    return (
        <div>
            <h2>Create Plan</h2>
    
            <form>
                <div>
                    <label>URL</label>
                    <input type="text" />
                </div>
                <div>
                    <label>タイトル</label>
                    <input type="text" />
                </div>
                <div>
                    <label>期間</label>
                    <input type="text" />日間
                </div>
                <button type="submit">
                    作成
                </button>
            </form>
        </div>
    );
}
