import { Header } from "@/components/layout/Header";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { MascotVideo } from "@/components/layout/MascotVideo";

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
        <MascotVideo />
      </div>
    </div>
  );
}
