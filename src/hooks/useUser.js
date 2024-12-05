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
      const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");

      // currentUser는 있는데 mbtiUsers가 없는 경우
      if (savedUser && users.length === 0) {
        const currentUser = JSON.parse(savedUser);
        localStorage.setItem("mbtiUsers", JSON.stringify([currentUser]));
      }
      // mbtiUsers는 있는데 currentUser가 없는 경우
      else if (!savedUser && users.length > 0) {
        setShowUserModal(true);
      }
      // currentUser가 있는 경우 상태 업데이트
      else if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      // 둘 다 없는 경우
      else if (!savedUser && users.length === 0) {
        setShowUserModal(true);
      }
    };

    loadUser();
  }, [setCurrentUser, setShowUserModal]);

  const updateUserScore = (userId, score) => {
    if (!userId) return;

    let users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
    const currentUserData = localStorage.getItem("currentUser");

    if (!currentUserData) return;

    const currentUser = JSON.parse(currentUserData);

    // currentUser가 mbtiUsers에 없는 경우
    if (!users.some((u) => u.id === currentUser.id)) {
      users = [...users, { ...currentUser, score: 0 }];
      localStorage.setItem("mbtiUsers", JSON.stringify(users));
    }

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
