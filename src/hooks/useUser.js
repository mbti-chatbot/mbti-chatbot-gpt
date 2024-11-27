import { useState, useEffect } from "react";

export function useUser() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isInitialCheck, setIsInitialCheck] = useState(false);

  // 초기 로드시에만 실행
  useEffect(() => {
    if (!isInitialCheck) {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
        if (users.length === 0) {
          setShowUserModal(true);
        }
      }
      setIsInitialCheck(true);
    }
  }, [isInitialCheck]);

  const selectUser = (user) => {
    // 사용자 정보 업데이트
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));

    // 전체 사용자 목록에서도 업데이트
    const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
    const userExists = users.some((u) => u.id === user.id);

    if (!userExists) {
      // 새로운 사용자인 경우 목록에 추가
      const updatedUsers = [...users, user];
      localStorage.setItem("mbtiUsers", JSON.stringify(updatedUsers));
    }

    setShowUserModal(false);
  };

  const updateUserScore = (userId, score) => {
    // 전체 사용자 목록에서 점수 업데이트
    const users = JSON.parse(localStorage.getItem("mbtiUsers") || "[]");
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, score: (u.score || 0) + score };
      }
      return u;
    });

    localStorage.setItem("mbtiUsers", JSON.stringify(updatedUsers));

    // 현재 사용자가 점수를 얻은 사용자라면 현재 사용자 정보도 업데이트
    if (currentUser?.id === userId) {
      const updatedUser = {
        ...currentUser,
        score: (currentUser.score || 0) + score
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const switchUser = (user) => {
    // 사용자 전환 시 현재 사용자 정보만 업데이트
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setShowUserModal(false);
  };

  return {
    currentUser,
    showUserModal,
    setShowUserModal,
    updateUserScore,
    selectUser, // 새 사용자 추가할 때
    switchUser // 기존 사용자로 전환할 때
  };
}
