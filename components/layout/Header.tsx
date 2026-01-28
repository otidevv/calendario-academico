import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/img/log/logounamad.png"
            alt="Logo UNAMAD"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
              UNAMAD
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Universidad Nacional Amazónica de Madre de Dios
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: "rgba(219, 4, 85, 0.1)" }}
          >
            <span style={{ color: "#db0455" }} className="text-sm font-semibold">
              2026
            </span>
            <span style={{ color: "#db0455" }} className="text-xs opacity-75">
              Pregrado
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
