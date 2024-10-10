import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendarApi from "@fullcalendar/react"
import { Todo } from "../../models/Todo";
import "./Calendar.css";
import { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useRecoilValue } from "recoil";
import { 
  updatedFromDialogAtom,
  deletedFromCardAtom,
  checkedFromCardAtom
} from "../../atom";
//context
import TodoContext from "../../contexts/TodoContext";

import { Popover, Typography } from '@mui/material';
import ShowTodo from "../ShowTodo/ShowTodo";
import { styled } from '@mui/material/styles';


interface CalendarProps {
  todos: Todo[];
  onSelectedMonthChange: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({todos, onSelectedMonthChange}) => {
  const [calendarEvents, setCalendarEvents] = useState([{}]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo>({title: '', description: '', start_date: '', due_date: '', completed: false, user_id: 0});
  const [tempPopoverStop, setTempPopoverStop] = useState(false);
  const [tempAncohrEl, setTempAnchorEl] = useState<HTMLButtonElement | null>(null);

  const calendarRef = useRef<FullCalendarApi | null>(null);
  const { dialogOpen } = useContext(TodoContext);

  const updatedFromDialog = useRecoilValue(updatedFromDialogAtom);
  const deletedFromCard = useRecoilValue(deletedFromCardAtom);
  const checkedFromCard = useRecoilValue(checkedFromCardAtom);

  const StyledDiv = styled('div')({
    width: '100%',
    height: '100%',
  });

  useEffect(() => {
    const newEvents = todos.map((todo) => {
      const colorClass = setCalendarColorClass(todo);
      return {
        title: todo.title,
        start: todo.start_date,
        end: dayjs(todo.due_date).add(1, "day").format("YYYY-MM-DD"),
        todo: todo,
        className: colorClass,
      };
    });
    setCalendarEvents(newEvents);
  }, [todos]);

  useEffect(() => {
    if (dialogOpen && anchorEl) {
      setTempAnchorEl(anchorEl);
      setAnchorEl(null);
      setTempPopoverStop(true);
    } else if(!dialogOpen && tempPopoverStop) {
      setAnchorEl(tempAncohrEl);
      setTempPopoverStop(false);
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (updatedFromDialog || deletedFromCard || checkedFromCard) {
      handleClose();
    }
  }, [updatedFromDialog, deletedFromCard, checkedFromCard]);

  const handleEventClick = (clickInfo: any) => {
    setSelectedTodo(clickInfo.event.extendedProps.todo);
    setAnchorEl(clickInfo.el);
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
        <ShowTodo targetTodo={selectedTodo} />
        </StyledDiv>
      </Popover>
    </>
  );
}

export default Calendar;

const setCalendarColorClass = (todo: Todo) => {
  let colorClass = '';
  if (todo.completed) {
    colorClass = 'completed-todo';
    return colorClass;
  } 
  if (todo.category === 'study') {
    colorClass = 'study-todo';
  } else if (todo.category === 'test') {
    colorClass = 'test-todo';
  }
  return colorClass;
}