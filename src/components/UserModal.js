import { useState, useEffect } from "react";

export function UserModal({
  onClose,
  onSubmit,
  currentUser,
  forceAdd = false
}) {
  const [newUsername, setNewUsername] = useState("");
  const [existingUsers, setExistingUsers] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
    setExistingUsers(users);
  }, []);

  const handleAddUser = () => {
    if (!newUsername.trim()) return;

    const newUser = {
      id: Date.now(),
      name: newUsername,
      score: 0
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("mbtiUsers", JSON.stringify(updatedUsers));
    setExistingUsers(updatedUsers);
    onSubmit(newUser);
    setNewUsername("");
  };

  const handleSelectUser = (userId) => {
    const selectedUser = existingUsers.find((u) => u.id.toString() === userId);
    if (selectedUser) {
      onSubmit(selectedUser);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {forceAdd ? "새로운 사용자 등록" : "사용자 선택"}
        </h2>

        {!forceAdd && existingUsers.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기존 사용자 선택
            </label>
            <div className="space-y-2">
              {existingUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user.id.toString())}
                  className={`w-full p-3 text-left rounded-lg transition-colors
                    ${
                      currentUser?.id === user.id
                        ? "bg-blue-50 border-blue-500"
                        : "hover:bg-gray-50"
                    } border`}
                >
                  <span className="font-medium">{user.name}</span>
                  <span className="ml-2 text-gray-600">
                    (점수: {user.score || 0}점)
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {forceAdd ? "사용자 이름 입력" : "새 사용자 추가"}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="사용자 이름 입력"
              className="flex-1 p-2 border rounded-lg"
              autoFocus={forceAdd}
            />
            <button
              onClick={handleAddUser}
              disabled={!newUsername.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 disabled:opacity-50"
            >
              추가
            </button>
          </div>
        </div>

        {!forceAdd && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
