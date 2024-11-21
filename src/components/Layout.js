import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className={`text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium
                  ${router.pathname === "/" ? "text-blue-600" : ""}`}
              >
                MBTI 대화
              </Link>
              <Link
                href="/random"
                className={`text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium
                  ${router.pathname === "/random" ? "text-blue-600" : ""}`}
              >
                랜덤 대화
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-gray-100 py-2">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 font-medium">
            © infiduk
          </p>
        </div>
      </footer>
    </div>
  );
}
