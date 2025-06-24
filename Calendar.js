// script.js
const monthYear = document.getElementById("month-year");
const daysContainer = document.getElementById("days");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const todayBtn = document.getElementById("today");
const eventForm = document.getElementById("event-form");
const eventDate = document.getElementById("event-date");
const eventTitle = document.getElementById("event-title");
const eventList = document.getElementById("event-list");

let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();

  monthYear.textContent = `${date.toLocaleString("default", { month: "long" })} ${year}`;
  daysContainer.innerHTML = "";

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    daysContainer.appendChild(empty);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    const thisDate = new Date(year, month, i);

    if (isToday(thisDate)) {
      day.classList.add("today");
    }

    day.textContent = i;

    const key = formatDateNoOffset(thisDate);
    if (events[key]) {
      events[key].forEach(e => {
        const ev = document.createElement("div");
        ev.classList.add("event");
        ev.textContent = e;
        day.appendChild(ev);
      });
    }

    daysContainer.appendChild(day);
  }
}

function isToday(date) {
  const today = new Date();
  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
}

function formatDateNoOffset(date) {
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date - tzOffset).toISOString().split("T")[0];
  return localISOTime;
}

prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

todayBtn.onclick = () => {
  currentDate = new Date();
  renderCalendar(currentDate);
};

eventForm.onsubmit = e => {
  e.preventDefault();
  const date = eventDate.value;
  const title = eventTitle.value;

  if (!events[date]) events[date] = [];
  events[date].push(title);

  localStorage.setItem("calendarEvents", JSON.stringify(events));
  renderCalendar(currentDate);
  eventForm.reset();
  displayEventList();
};

function displayEventList() {
  eventList.innerHTML = "";
  const sortedDates = Object.keys(events).sort();
  sortedDates.forEach(date => {
    events[date].forEach(e => {
      const item = document.createElement("div");
      item.textContent = `${date}: ${e}`;
      eventList.appendChild(item);
    });
  });
}

renderCalendar(currentDate);
displayEventList();
