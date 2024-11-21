import { useState } from "react";

export default function UserModal({ onClose, onSubmit }) {
  const [newUsername, setNewUsername] = useState("");
  const [existingUsers, setExistingUsers] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
    }
    return [];
  });
  const [selectedUser, setSelectedUser] = useState("");

  const handleAddUser = () => {
    if (!newUsername.trim()) return;

    const users = [
      ...existingUsers,
      {
        id: Date.now(),
        name: newUsername,
        score: 0
      }
    ];

    localStorage.setItem("mbtiUsers", JSON.stringify(users));
    setExistingUsers(users);
    setNewUsername("");
    onSubmit(users[users.length - 1]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">사용자 선택</h2>

        {existingUsers.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기존 사용자 선택
            </label>
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                const user = existingUsers.find(
                  (u) => u.id.toString() === e.target.value
                );
                if (user) onSubmit(user);
              }}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">사용자 선택</option>
              {existingUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} (점수: {user.score})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            새 사용자 추가
          </label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="사용자 이름 입력"
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            취소
          </button>
          <button
            onClick={handleAddUser}
            disabled={!newUsername.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
