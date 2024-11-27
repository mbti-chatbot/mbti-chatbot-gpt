import { useRouter } from "next/router";
import { useUser } from "@/hooks";
import { UserModal } from "@/components";

export default function Layout({ children }) {
  const router = useRouter();
  const {
    currentUser,
    showUserModal,
    setShowUserModal,
    selectUser,
    switchUser
  } = useUser();

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

            {/* 사용자 정보 표시 */}
            {router.pathname === "/random" && (
              <div className="flex items-center gap-4">
                {currentUser ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {currentUser.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {currentUser.score || 0}점
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-600">
                    사용자를 선택해주세요
                  </span>
                )}
                <button
                  onClick={() => setShowUserModal(true)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 
                           text-gray-700 rounded-lg transition-colors"
                >
                  {currentUser ? "사용자 전환" : "사용자 선택"}
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
            if (user.id === currentUser?.id) {
              switchUser(user);
            } else {
              selectUser(user);
            }
          }}
          currentUser={currentUser}
          forceAdd={!currentUser && !localStorage.getItem("mbtiUsers")}
        />
      )}
    </div>
  );
}
