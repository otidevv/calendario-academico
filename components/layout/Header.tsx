import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo izquierda */}
        <div className="flex items-center gap-2">
          <Image
            src="/img/log/logounamad.png"
            alt="Logo UNAMAD"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="font-bold text-gray-900 dark:text-white text-sm hidden sm:block">
            UNAMAD
          </span>
        </div>

        {/* Título centrado */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-center">
          <span className="text-sm md:text-lg lg:text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
            Calendario Académico
          </span>
          <span className="hidden md:inline text-sm md:text-lg lg:text-xl font-black uppercase tracking-tight" style={{ color: "#db0455" }}>
            {" "}Pregrado 2026
          </span>
        </h1>

        {/* Derecha */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(219, 4, 85, 0.1)", color: "#db0455" }}>
            2026
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
