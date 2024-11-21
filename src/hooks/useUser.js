import { useEffect, useState } from "react";

export function useUser() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
    if (users.length === 0) {
      setShowUserModal(true);
    }
  }, []);

  const updateUserScore = (userId, score) => {
    const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, score: (u.score || 0) + score };
      }
      return u;
    });
    localStorage.setItem("mbtiUsers", JSON.stringify(updatedUsers));

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({ ...prev, score: prev.score + score }));
    }
  };

  return {
    currentUser,
    setCurrentUser,
    showUserModal,
    setShowUserModal,
    updateUserScore
  };
}
