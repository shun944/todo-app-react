import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Todo } from "../../models/Todo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface CalendarProps {
  todos: Todo[];
}

const Calendar: React.FC<CalendarProps> = ({todos}) => {
  const events = [
    { title: "Event 1", date: "2024-10-01" },
    { title: "Event 2", start: "2024-10-02", end: "2022-01-03" },
    // Add more events as needed
  ];
  const [calendarEvents, setCalendarEvents] = useState([{}]);

  useEffect(() => {
    const newEvents = todos.map((todo) => {
      return {
        title: todo.title,
        start: todo.start_date,
        end: dayjs(todo.due_date).add(1, "day").format("YYYY-MM-DD"),
      };
    });
    setCalendarEvents(newEvents);
    console.log(newEvents);
    console.log(events);
  }, [todos]);

  const handleEventClick = (clickInfo: any) => {
    console.log(todos);
    alert(`Event title: ${clickInfo.event.title}`);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={calendarEvents}
      eventClick={handleEventClick}
    />
  );
}

export default Calendar;