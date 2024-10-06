import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendarApi from "@fullcalendar/react"
import { Todo } from "../../models/Todo";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import { Popover, Typography } from '@mui/material';
import ShowTodo from "../ShowTodo/ShowTodo";
//import makeStyles from '@mui/styles/makeStyles';
import { styled } from '@mui/material/styles';


interface CalendarProps {
  todos: Todo[];
  onSelectedMonthChange: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({todos, onSelectedMonthChange}) => {
  const [calendarEvents, setCalendarEvents] = useState([{}]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [popoverContent, setPopoverContent] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState<Todo>({title: '', description: '', start_date: '', due_date: '', completed: false, user_id: 0});

  const calendarRef = useRef<FullCalendarApi | null>(null);

  const StyledDiv = styled('div')({
    width: '100%',  // 幅を指定
    height: '100%', // 高さを指定
  });

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

  const getSelectedMonth = () => {
    if (calendarRef.current) {
      const currentStart = calendarRef.current?.getApi().view.currentStart;
      const selectedDate = currentStart ? `${currentStart.getFullYear()}-${currentStart.getMonth() + 1}-01` : '';
      onSelectedMonthChange(selectedDate);
    }
  }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        eventClick={handleEventClick}
        ref={calendarRef}
        datesSet={getSelectedMonth}
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
        <StyledDiv>
        <ShowTodo targetTodo={selectedTodo}
          handleDialogOpenWithUpdate={() => {}}
          handleOnDelete={() => {}}
          handleToggleCompleted={() => {}}
        />
        </StyledDiv>
      </Popover>
    </>
  );
}

export default Calendar;