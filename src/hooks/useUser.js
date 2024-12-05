import { useEffect } from "react";
import { create } from "zustand";

const useUserStore = create((set) => ({
  currentUser: null,
  showUserModal: false,
  setCurrentUser: (user) => set({ currentUser: user }),
  setShowUserModal: (show) => set({ showUserModal: show })
}));

export function useUser() {
  const { currentUser, showUserModal, setCurrentUser, setShowUserModal } =
    useUserStore();

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
        if (users.length === 0) {
          setShowUserModal(true);
        }
      }
    };

    loadUser();
  }, [setCurrentUser, setShowUserModal]);

  const updateUserScore = (userId, score) => {
    if (!userId) return; // 사용자 ID가 없으면 리턴

    const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, score: (u.score || 0) + score };
      }
      return u;
    });

    localStorage.setItem("mbtiUsers", JSON.stringify(updatedUsers));

    const updatedUser = updatedUsers.find((u) => u.id === userId);
    if (updatedUser) {
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const selectUser = (user) => {
    if (!user) return; // 사용자가 없으면 리턴

    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));

    const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
    const userExists = users.some((u) => u.id === user.id);

    if (!userExists) {
      const updatedUsers = [...users, user];
      localStorage.setItem("mbtiUsers", JSON.stringify(updatedUsers));
    }

    setShowUserModal(false);
  };

  const switchUser = (user) => {
    if (!user) return; // 사용자가 없으면 리턴

    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setShowUserModal(false);
  };

  return {
    currentUser,
    showUserModal,
    setShowUserModal,
    updateUserScore,
    selectUser,
    switchUser
  };
}
