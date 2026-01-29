import { Header } from "@/components/layout/Header";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Header />
      <main>
        <CalendarContainer />
      </main>
    </div>
  );
}
