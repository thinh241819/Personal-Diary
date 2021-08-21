//Task: handle the edge case for january and december if necessary

function pad(n, width, z)
{
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const date = new Date();

const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December",];

// using querySelector for HTML
  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--)
  {
      days += `
            <div class="prev-date">
                <form method="POST" action="/calendar">
                    <input type="hidden" name="select_day" value="${prevLastDay - x + 1}">
                    <input type="hidden" name="select_month" value="${date.getMonth()}">
                    <input type="hidden" name="select_year" value="${date.getFullYear()}">
                    <button type="submit"">${prevLastDay - x + 1}</button>
                </form>
            </div>`;
    //   days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++)
  {
      if ( i === new Date().getDate() && date.getMonth() === new Date().getMonth() )
      {
          days += `
            <div class="today">
                <form method="POST" action="/calendar">
                    <input type="hidden" name="select_day" value="${i}">
                    <input type="hidden" name="select_month" value="${date.getMonth() + 1}">
                    <input type="hidden" name="select_year" value="${date.getFullYear()}">
                    <button class="btn btn-info" type="submit"">${pad(i, 2)}</button>
                </form>
            </div>`;
      }
      else
      {
        days += `
            <div>
                <form method="POST" action="/calendar">
                    <input type="hidden" name="select_day" value="${i}">
                    <input type="hidden" name="select_month" value="${date.getMonth() + 1}">
                    <input type="hidden" name="select_year" value="${date.getFullYear()}">
                    <button type="submit"">${pad(i, 2)}</button>
                </form>
            </div>`;
      }
  }

  for (let i = 1; i <= nextDays; i++)
  {
      days += `
            <div class="next-date">
                <form method="POST" action="/calendar">
                    <input type="hidden" name="select_day" value="${i}">
                    <input type="hidden" name="select_month" value="${date.getMonth() + 2}">
                    <input type="hidden" name="select_year" value="${date.getFullYear()}">
                    <button type="submit"">${pad(i, 2)}</button>
                </form>
            </div>`;
  }

  monthDays.innerHTML = days;
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
