import { Header } from "@/components/layout/Header";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-950"
      style={{
        backgroundImage: "url('/img/body/fondo.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div className="min-h-screen bg-gray-50/90 dark:bg-gray-950/95">
        <Header />
        <main>
          <CalendarContainer />
        </main>

        {/* Mascota flotante */}
        <div className="fixed bottom-0 right-64 z-50 hidden lg:block">
          <img
            src="/img/mascota/mascota.png"
            alt="Mascota UNAMAD"
            className="w-[450px] h-auto drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            style={{ filter: "drop-shadow(0 10px 30px rgba(219, 4, 85, 0.3))" }}
          />
        </div>
      </div>
    </div>
  );
}
