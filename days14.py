# return a list of 14 days from today
def days7(date, month, year, myList):
    temp_date = date
    temp_month = month
    temp_year = year
    for x in range(7):
        temp_date = temp_date - 1
        if temp_date == 0:
            temp_month = temp_month - 1
            if temp_month == 0:
                temp_date = 31
                temp_month = 12
                temp_year = temp_year - 1
            elif temp_month == 1 or temp_month == 3 or temp_month == 5 or temp_month == 7 or temp_month == 8 or temp_month == 10 or temp_month == 12:
                temp_date = 31
            elif temp_month == 4 or temp_month == 6 or temp_month == 9 or temp_month == 11:
                temp_date = 30
            elif temp_month == 2:
                if (temp_year % 4 == 0):
                    temp_date = 29
                else:
                    temp_date = 28

        myList[x]["date"] = temp_date
        myList[x]["month"] = temp_month
        myList[x]["year"] = temp_year

def mins_to_hrs(minutes):
    minutes_calculate = int(minutes % 60)
    hr_calculate = int((minutes - minutes_calculate) / 60)

    to_hour = str(hr_calculate).zfill(2) + ":" + str(minutes_calculate).zfill(2)

    return to_hour

# 1, 3, 5, 7, 8, 10, 12