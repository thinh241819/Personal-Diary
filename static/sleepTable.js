function pad(n, width, z)
{
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var curr = new Date;
var first = curr.getDate() - curr.getDay() + 1;
var last = first + 7;

var firstday = new Date(curr.setDate(first));
var lastday = new Date(curr.setDate(last));

document.getElementById("sleep_table_full_date_monday_java").value = pad(firstday.getMonth()+1, 2) + "-" + pad(firstday.getDate(), 2) + "-" + firstday.getFullYear();
document.getElementById("sleep_table_date_monday_java").value = pad(firstday.getDate(), 2);
document.getElementById("sleep_table_month_monday_java").value = pad(firstday.getMonth()+1, 2);
document.getElementById("sleep_table_year_monday_java").value = pad(firstday.getFullYear(), 2);
first = firstday.getDate() + 1;
firstday = new Date(curr.setDate(first));

document.getElementById("sleep_table_full_date_tuesday_java").value = pad(firstday.getMonth()+1, 2) + "-" + pad(firstday.getDate(), 2) + "-" + firstday.getFullYear();
document.getElementById("sleep_table_date_tuesday_java").value = pad(firstday.getDate(), 2);
document.getElementById("sleep_table_month_tuesday_java").value = pad(firstday.getMonth()+1, 2);
document.getElementById("sleep_table_year_tuesday_java").value = pad(firstday.getFullYear(), 2);
first = firstday.getDate() + 1;
firstday = new Date(curr.setDate(first));

document.getElementById("sleep_table_full_date_wednesday_java").value = pad(firstday.getMonth()+1, 2) + "-" + pad(firstday.getDate(), 2) + "-" + firstday.getFullYear();
document.getElementById("sleep_table_date_wednesday_java").value = pad(firstday.getDate(), 2);
document.getElementById("sleep_table_month_wednesday_java").value = pad(firstday.getMonth()+1, 2);
document.getElementById("sleep_table_year_wednesday_java").value = pad(firstday.getFullYear(), 2);
first = firstday.getDate() + 1;
firstday = new Date(curr.setDate(first));

document.getElementById("sleep_table_full_date_thursday_java").value = pad(firstday.getMonth()+1, 2) + "-" + pad(firstday.getDate(), 2) + "-" + firstday.getFullYear();
document.getElementById("sleep_table_date_thursday_java").value = pad(firstday.getDate(), 2);
document.getElementById("sleep_table_month_thursday_java").value = pad(firstday.getMonth()+1, 2);
document.getElementById("sleep_table_year_thursday_java").value = pad(firstday.getFullYear(), 2);
first = firstday.getDate() + 1;
firstday = new Date(curr.setDate(first));

document.getElementById("sleep_table_full_date_friday_java").value = pad(firstday.getMonth()+1, 2) + "-" + pad(firstday.getDate(), 2) + "-" + firstday.getFullYear();
document.getElementById("sleep_table_date_friday_java").value = pad(firstday.getDate(), 2);
document.getElementById("sleep_table_month_friday_java").value = pad(firstday.getMonth()+1, 2);
document.getElementById("sleep_table_year_friday_java").value = pad(firstday.getFullYear(), 2);
first = firstday.getDate() + 1;
firstday = new Date(curr.setDate(first));

document.getElementById("sleep_table_full_date_saturday_java").value = pad(firstday.getMonth()+1, 2) + "-" + pad(firstday.getDate(), 2) + "-" + firstday.getFullYear();
document.getElementById("sleep_table_date_saturday_java").value = pad(firstday.getDate(), 2);
document.getElementById("sleep_table_month_saturday_java").value = pad(firstday.getMonth()+1, 2);
document.getElementById("sleep_table_year_saturday_java").value = pad(firstday.getFullYear(), 2);
first = firstday.getDate() + 1;
firstday = new Date(curr.setDate(first));

document.getElementById("sleep_table_full_date_sunday_java").value = pad(firstday.getMonth()+1, 2) + "-" + pad(firstday.getDate(), 2) + "-" + firstday.getFullYear();
document.getElementById("sleep_table_date_sunday_java").value = pad(firstday.getDate(), 2);
document.getElementById("sleep_table_month_sunday_java").value = pad(firstday.getMonth()+1, 2);
document.getElementById("sleep_table_year_sunday_java").value = pad(firstday.getFullYear(), 2);
first = firstday.getDate() + 1;
firstday = new Date(curr.setDate(first));


//Final function
function sleep_cal() {
  let wake_hr_p = parseInt(document.querySelector("#wake_hr").value);
  let wake_min_p = parseInt(document.querySelector("#wake_min").value);
  let sleep_hr_p = parseInt(document.querySelector("#sleep_hr").value);
  let sleep_min_p = parseInt(document.querySelector("#sleep_min").value);

  let sleep_hour  = sleep_hr_p * 60 + sleep_min_p;
  let wake_hr = 24 * 60 + wake_hr_p * 60 + wake_min_p;
  let slept_hr = wake_hr - sleep_hour;

  let temp_sleep_hr = document.querySelector("#temp_sleep_hr").value;
  let temp_slept_hr = document.querySelector("#temp_slept_hr").value;


  if(Math.abs(sleep_hour - temp_sleep_hr) > 30)
  {
    document.querySelector("#sleep_table_sleep_cal_java").innerHTML = "There is a discrepancy of " + Math.abs(sleep_hour - temp_sleep_hr) + " minutes from your average go to bed time. This may break your pattern of sleep and decrease your quality of sleep.";
    document.querySelector("#sleep_table_sleep_cal_java_emoji").innerHTML = "(｡+･`ω･´)";
    document.querySelector("#sleep_table_sleep_cal_java_message").innerHTML = "NOT GOOD!";
  }
  else
  {
    document.querySelector("#sleep_table_sleep_cal_java").innerHTML = "This match your pattern of sleep and should be continue.";
    document.querySelector("#sleep_table_sleep_cal_java_emoji").innerHTML = "( ◞･౪･)	)";
    document.querySelector("#sleep_table_sleep_cal_java_message").innerHTML = "NICE!";
  }

  if(slept_hr < (8 * 60))
  {
    document.querySelector("#sleep_table_slept_cal_java").innerHTML = "You are sleeping less than 8 hours and this will affect your performance.";
    document.querySelector("#sleep_table_slept_cal_java_emoji").innerHTML = "(｡+･`ω･´)";
    document.querySelector("#sleep_table_slept_cal_java_message").innerHTML = "NOT GOOD!";
  }
  else
  {
    document.querySelector("#sleep_table_slept_cal_java").innerHTML = "You are sleeping enough, this is good.";
    document.querySelector("#sleep_table_slept_cal_java_emoji").innerHTML = "( ◞･౪･)	)";
    document.querySelector("#sleep_table_slept_cal_java_message").innerHTML = "NICE!";
  }

}
