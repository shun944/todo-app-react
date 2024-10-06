import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Todo } from "../../models/Todo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { Popover, Typography } from '@mui/material';
import ShowTodo from "../ShowTodo/ShowTodo";

interface CalendarProps {
  todos: Todo[];
}

const Calendar: React.FC<CalendarProps> = ({todos}) => {
  // const events = [
  //   { title: "Event 1", date: "2024-10-01" },
  //   { title: "Event 2", start: "2024-10-02", end: "2022-01-03" },
  //   // Add more events as needed
  // ];
  const [calendarEvents, setCalendarEvents] = useState([{}]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [popoverContent, setPopoverContent] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState<Todo>({title: '', description: '', start_date: '', due_date: '', completed: false, user_id: 0});

  useEffect(() => {
    const newEvents = todos.map((todo) => {
      return {
        title: todo.title,
        start: todo.start_date,
        end: dayjs(todo.due_date).add(1, "day").format("YYYY-MM-DD"),
        todo: todo,
      };
    });
    setCalendarEvents(newEvents);
    console.log(newEvents);
  }, [todos]);

  const handleEventClick = (clickInfo: any) => {
    console.log(todos);
    console.log('info:', clickInfo.event.extendedProps.todo);
    //setAnchorEl(clickInfo.jsEvent.currentTarget);
    setSelectedTodo(clickInfo.event.extendedProps.todo);
    setAnchorEl(clickInfo.el);
    setPopoverContent(`Event title: ${clickInfo.event.title}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        eventClick={handleEventClick}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <ShowTodo targetTodo={selectedTodo}
          handleDialogOpenWithUpdate={() => {}}
          handleOnDelete={() => {}}
          handleToggleCompleted={() => {}}
        />
      </Popover>
    </>
  );
}

export default Calendar;