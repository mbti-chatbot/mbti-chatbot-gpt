// src/components/Layout.js
import { useState } from "react";
import { useRouter } from "next/router";
import { UserModal } from "@/components";

export default function Layout({ children }) {
  const router = useRouter();
  const [showUserModal, setShowUserModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <a
                href="/"
                className={`text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium
                  ${router.pathname === "/" ? "text-blue-600" : ""}`}
              >
                MBTI 대화
              </a>
              <a
                href="/random"
                className={`text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium
                  ${router.pathname === "/random" ? "text-blue-600" : ""}`}
              >
                랜덤 대화
              </a>
            </div>
            {router.pathname === "/random" && (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-medium" id="current-user-name"></span>
                  <span
                    className="ml-2 text-gray-600"
                    id="current-user-score"
                  ></span>
                </div>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  사용자 전환
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">{children}</main>

      <footer className="bg-white border-t border-gray-100 py-2">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 font-medium">
            © infiduk
          </p>
        </div>
      </footer>

      {showUserModal && (
        <UserModal
          onClose={() => setShowUserModal(false)}
          onSubmit={(user) => {
            const nameElement = document.getElementById("current-user-name");
            const scoreElement = document.getElementById("current-user-score");
            if (nameElement) nameElement.textContent = user.name;
            if (scoreElement)
              scoreElement.textContent = `점수: ${user.score}점`;
            setShowUserModal(false);
            // 페이지 새로고침
            router.reload();
          }}
        />
      )}
    </div>
  );
}
