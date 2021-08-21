import os
import datetime
import csv

from cs50 import SQL

from flask import Flask, render_template, flash, redirect, request, session, url_for, send_file, send_from_directory, Response
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from helpers import apology, login_required, filling
from days14 import days7, mins_to_hrs

#upload path for profile pic
UPLOAD_FOLDER = 'static/uploads/'

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
Session(app)

app.jinja_env.globals.update(filling=filling)
# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///central.db")

def update_status():
    user = db.execute("SELECT * FROM users WHERE id=:userid", userid=session["user_id"])
    session["profile_pic"] = user[0]["profile_pic"]
    session["name"] = user[0]["username"]
    session["bmi"] = user[0]["bmi"]
    session["wake_hr"] = user[0]["avg_wake_hr"]
    session["sleep_hr"] = user[0]["avg_sleep_hr"]
    session["slept_hr"] = user[0]["avg_slept_hr"]
    session["task_completed"] = user[0]["task_completed"]
    session["task_failed"] = user[0]["task_failed"]
    session["snake_highscore"] = user[0]["snake_score"]


@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    userid = session["user_id"]
    if request.method == "GET":
        rows = db.execute("SELECT * FROM todo WHERE userid=:userid", userid=userid)
        user = db.execute("SELECT * FROM users WHERE id=:userid", userid=session['user_id'])
        return render_template("index.html", rows=rows)
    else:
        # Handles the add_todo button
        user = db.execute("SELECT * FROM users WHERE id=:userid", userid=session['user_id'])
        if request.form["btn_identifier"] == "add_todo":
            todo = request.form.get("user_todo")
            datetime_object = datetime.datetime.now()
            due = request.form.get("user_due")

            # Insert todo list:
            if not todo:
                return redirect("/")
            else:
                db.execute("INSERT INTO todo (userid, todo, time, due_date) VALUES (:userid, :todo, :time, :due)", userid=userid, todo=todo, time=datetime_object, due=due)
        # Handles the remove_todo button
        elif request.form["btn_identifier"] == "complete_todo":
            done_id = request.form.get("delete_todo_id")
            old_todo = db.execute("SELECT * FROM todo WHERE id=:doneid", doneid=done_id)

            # Insert the database
            db.execute("INSERT INTO todo_completed (userid, todo, time, status, due_date) VALUES (:userid, :todo, :time, :status, :due)", \
            userid=old_todo[0]["userid"], todo=old_todo[0]["todo"], time=old_todo[0]["time"], status=1, due=old_todo[0]["due_date"])
            db.execute("DELETE FROM todo WHERE id=:deleteId", deleteId=done_id)
            #Update user in the database
            db.execute("UPDATE users SET task_completed = :taskcompleted WHERE id = :user_id", taskcompleted=user[0]["task_completed"] + 1, user_id=session["user_id"])
            #Update Status
            update_status()
        elif request.form["btn_identifier"] == "delete_todo":
            done_id = request.form.get("delete_todo_id")
            db.execute("DELETE FROM todo WHERE id=:deleteId", deleteId=done_id)
            db.execute("UPDATE users SET task_failed = :taskfailed WHERE id = :user_id", taskfailed=user[0]["task_failed"] + 1, user_id=session["user_id"])
            #Update Status
            update_status()

        return redirect("/")


######################## AUTHENTICATION ############################
@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "GET":
        return render_template("Authentication/register.html")
    # Extract the information in the form
    else:
        username = request.form.get("register_username")
        password = request.form.get("register_password")
        password_confirm = request.form.get("register_confirm_password")
        security_question_p = request.form.get("register_security_question_value")
        security_answer_p = request.form.get("register_security_answer_value")

        # Ensure the data was submitted:
        if not username:
            return apology("Please enter username, password or confirm password")

        # Check if username is in database already
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=username)
        if len(rows) == 1:
            return apology("username already exists", 403)

        if password != password_confirm:
            return apology("password and confirmation does not match", 403)

        if security_question_p == "0":
            return apology("Please choose a security question!", 403)

        if not security_answer_p:
            return apology("Please type in your answer!", 403)

        # hash the password:
        new_hash = generate_password_hash(password)

        # Insert the newly created account into the table:
        db.execute("INSERT INTO users (username, hash, security_question, security_answer) VALUES (:username, :new_hash, :security_question_p, :security_answer_p)", username=username, new_hash=new_hash, security_question_p=security_question_p, security_answer_p=security_answer_p)

        return redirect("/login")

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("Authentication/login.html")
    else:
        if request.form["btn_identifier"] == "login_login":
            username = request.form.get("login_username")
            password = request.form.get("login_password")

            # Query database for username:
            rows = db.execute("SELECT * FROM users WHERE username = :username", username=username)

            # Ensure username exists and password is correct:
            if len(rows) != 1 or not check_password_hash(rows[0]["hash"], password):
                return apology("Invalid username or password", 403)

            # Remember which user has logged in
            session["user_id"] = rows[0]["id"]
            update_status()

            return redirect("/")
        elif request.form["btn_identifier"] == "login_forgot_password":
            return redirect("/forgotpassword")

@app.route('/logout')
def logout():
    session.clear()
    return redirect("/")

@app.route('/changepassword', methods=["GET", "POST"])
def change_password():
    if request.method == "GET":
        return render_template("Authentication/changepassword.html")
    else:
        old_password = request.form.get("old_login_password")
        new_password = request.form.get("new_login_password")
        confirm_new_password = request.form.get("confirm_new_login_password")

        # Query database for password:
        rows = db.execute("SELECT * FROM users WHERE id = :user_id", user_id=session["user_id"])

        # Ensure username exists and password is correct:
        if not check_password_hash(rows[0]["hash"], old_password):
            return apology("Invalid old password", 403)
        elif new_password != confirm_new_password:
            return apology("Confirm password not match", 403)

        # Change password in database
        new_hash = generate_password_hash(new_password)
        db.execute("UPDATE users SET hash = :new_hash WHERE id = :user_id", new_hash=new_hash, user_id=session["user_id"])

        return redirect("/")

@app.route('/forgotpassword', methods=["GET", "POST"])
def forgot_password():
    if request.method == "GET":
        return render_template("Authentication/forgotpassword.html")
    else:
        if request.form["btn_identifier"] == "forgot_question":
            user_name = request.form.get("forgotpassword_username_value")
            security_question_value = request.form.get("forgotpassword_security_question_value")
            security_answer_value = request.form.get("forgotpassword_security_answer_value")

            rows = db.execute("SELECT * FROM users WHERE username = :user_name", user_name=user_name)

            if len(rows) != 1:
                return apology("Sorry, username not available.")
            else:
                if security_question_value == rows[0]["security_question"] and security_answer_value == rows[0]["security_answer"]:
                    session["userforgot"] = rows[0]["id"]
                    return render_template("Authentication/forgotpassword.html")
                else:
                    return apology("Sorry, you chose wrong question or gave the wrong answer.")
        elif request.form["btn_identifier"] == "forgot_change_password":
            newPassword = request.form.get("forgot_new_password")
            confirmPassword = request.form.get("forgot_confirm_password")

            if(newPassword != confirmPassword):
                return apology("Sorry, password confirmation not match")
            else:
                new_hash = generate_password_hash(confirmPassword)
                db.execute("UPDATE users SET hash=:new_hash WHERE id=:user_id", new_hash=new_hash, user_id=session["userforgot"])

            return redirect("/login")

######################## XXXXXXXXXX AUTHENTICATION XXXXXXXXXX ############################

@app.route('/calendar', methods=["GET", "POST"])
@login_required
def calendar():
    userid = session["user_id"]
    if request.method == "GET":
        return render_template("Functions/calendar.html")
    else:
        day = request.form.get("select_day")
        month = request.form.get("select_month")
        year = request.form.get("select_year")
        query = month.zfill(2) + "-" + day.zfill(2) + "-" + year

        #query for database
        rows = db.execute("SELECT * FROM todo WHERE due_date=:due", due=query)

        #I am using the index as a common ground for modifying todo list
        return render_template("index.html", rows=rows)


@app.route('/sleeptable', methods=["GET", "POST"])
@login_required
def sleep_table():
    if request.method == "GET":
        today = datetime.datetime.now()
        string_today = today.strftime("%d-%m-%y")
        today_date = int(string_today[0:2])
        today_month = int(string_today[3:5])
        today_year = int(string_today[6:])
        #Select week days for sleep table
        rows = []
        rows.append(db.execute("SELECT * FROM temp WHERE user_id=:userid AND week_day=:weekday", userid=session["user_id"], weekday=1))
        rows.append(db.execute("SELECT * FROM temp WHERE user_id=:userid AND week_day=:weekday", userid=session["user_id"], weekday=2))
        rows.append(db.execute("SELECT * FROM temp WHERE user_id=:userid AND week_day=:weekday", userid=session["user_id"], weekday=3))
        rows.append(db.execute("SELECT * FROM temp WHERE user_id=:userid AND week_day=:weekday", userid=session["user_id"], weekday=4))
        rows.append(db.execute("SELECT * FROM temp WHERE user_id=:userid AND week_day=:weekday", userid=session["user_id"], weekday=5))
        rows.append(db.execute("SELECT * FROM temp WHERE user_id=:userid AND week_day=:weekday", userid=session["user_id"], weekday=6))
        rows.append(db.execute("SELECT * FROM temp WHERE user_id=:userid AND week_day=:weekday", userid=session["user_id"], weekday=7))

        #Handling calculation of avg sleep time.
        sleepday = db.execute("SELECT * FROM sleepschedule WHERE user_id=:userid", userid=session["user_id"])
        avg_wake_hr = 0
        avg_sleep_hr = 0
        avg_slept_hr = 0
        if not sleepday:
            line = "Not enough information to calculate!"
            return render_template("Functions/sleepTable.html", rows=rows, line = line)
        else:
            days_to_calculate = 7
            rows2 = db.execute("SELECT * FROM sleepschedule WHERE user_id=:userid", userid=session["user_id"])

            length = len(sleepday)
            total_slept_hr = 0
            total_wake_up_hr = 0
            total_sleep_hr = 0
            for x in range(days_to_calculate):
                wake_hr_p = sleepday[length - 1 - x]["wake_hr"]
                wake_min_p = sleepday[length - 1 - x]["wake_min"]
                sleep_hr_p = sleepday[length - 1 - 1 - x]["sleep_hr"]       # Sleep hr of last day
                sleep_min_p = sleepday[length - 1 - 1 - x]["sleep_min"]     # Sleep min of last day

                sleep_hr = sleep_hr_p * 60 + sleep_min_p
                wake_hr = 24 * 60 + wake_hr_p * 60 + wake_min_p

                slept_hr = wake_hr - sleep_hr

                total_slept_hr += slept_hr
                total_wake_up_hr += wake_hr_p * 60 + wake_min_p
                total_sleep_hr += sleep_hr_p * 60 + sleep_min_p

            avg_wake_hr = int(total_wake_up_hr / days_to_calculate)
            avg_sleep_hr = int(total_sleep_hr / days_to_calculate)
            avg_slept_hr = int(total_slept_hr / days_to_calculate)

            #Insert avg sleep into table
            db.execute("UPDATE users SET avg_wake_hr=:avg_wake_hr, avg_sleep_hr=:avg_sleep_hr, avg_slept_hr=:avg_slept_hr WHERE id=:userid", userid=session["user_id"], avg_wake_hr=avg_wake_hr, avg_sleep_hr=avg_sleep_hr, avg_slept_hr=avg_slept_hr)
            update_status()

            return render_template("Functions/sleepTable.html", rows=rows, rows2=rows2, avg_wake_hr=avg_wake_hr, avg_sleep_hr=avg_sleep_hr, avg_slept_hr=avg_slept_hr,\
            avg_wake_hr_str=mins_to_hrs(avg_wake_hr), avg_sleep_hr_str=mins_to_hrs(avg_sleep_hr), avg_slept_hr_str=mins_to_hrs(avg_slept_hr))

        return render_template("Functions/sleepTable.html", rows=rows)
    else:
        if request.form["btn_identifier"] == "sleep_table_lock_time":
            wake_hr_p = request.form.get("sleep_table_wake_time_hh")
            wake_min_p = request.form.get("sleep_table_wake_time_mm")
            sleep_hr_p = request.form.get("sleep_table_sleep_time_hh")
            sleep_min_p = request.form.get("sleep_table_sleep_time_mm")

            week_day_p = request.form.get("sleep_table_day_of_week")
            fulldate_p = request.form.get("sleep_table_full_date")
            date_p = request.form.get("sleep_table_date")
            month_p = request.form.get("sleep_table_month")
            year_p = request.form.get("sleep_table_year")

            if not wake_hr_p or not wake_min_p or not sleep_hr_p or not sleep_min_p:
                return apology("Sorry, you cannot lock time when lacking information.")

            db.execute("INSERT INTO temp (user_id, wake_hr, wake_min, sleep_hr, sleep_min, week_day, date, month, year, fulldate) VALUES (:userid, :wakehr, :wakemin, :sleephr, :sleepmin, :weekday, :date_p, :month_p, :year_p, :fulldate_p)",\
                userid=session["user_id"], wakehr=wake_hr_p, wakemin=wake_min_p, sleephr=sleep_hr_p, sleepmin=sleep_min_p, weekday=week_day_p, date_p=date_p, month_p=month_p, year_p=year_p, fulldate_p=fulldate_p)

            return redirect("/sleeptable")
        elif request.form["btn_identifier"] == "sleep_table_change_time":
            week_day_p = request.form.get("sleep_table_day_of_week")

            db.execute("DELETE FROM temp WHERE user_id=:userid AND week_day=:weekday", userid=session["user_id"], weekday=week_day_p)
            return redirect("/sleeptable")

        elif request.form["btn_identifier"] == "sleep_table_submit_table":
            #Query the temp sleep table
            temp_table = db.execute("SELECT * FROM temp WHERE user_id=:userid", userid=session["user_id"])
            #Delete from temp sleep table
            db.execute("DELETE FROM temp")

            # Insert the table into the SQL table
            for item in temp_table:
                db.execute("""INSERT INTO sleepschedule (user_id, wake_hr, wake_min, sleep_hr, sleep_min, week_day, date, month, year, fulldate)
                    VALUES (:userid, :wakehr, :wakemin, :sleephr, :sleepmin, :weekday, :date_p, :month_p, :year_p, :fulldate_p)""",\
                    userid=session["user_id"], wakehr=item["wake_hr"], wakemin=item["wake_min"], sleephr=item["sleep_hr"], sleepmin=item["sleep_min"], weekday=item["week_day"], date_p=item["date"], month_p=item["month"], year_p=item["year"], fulldate_p=item["fulldate"])
            update_status()
            return redirect("/sleeptable")

        elif request.form["btn_identifier"] == "sleep_table_calculate":
            user = db.execute("SELECT * FROM users WHERE id=:userid", userid=session["user_id"])

            wake_hr_p = request.form.get("sleep_table_wake_time_hh")
            wake_min_p = request.form.get("sleep_table_wake_time_mm")
            sleep_hr_p = request.form.get("sleep_table_sleep_time_hh")
            sleep_min_p = request.form.get("sleep_table_sleep_time_mm")

            sleep_hr = sleep_hr_p * 60 + sleep_min_p
            wake_hr = 24 * 60 + wake_hr_p * 60 + wake_min_p

            slept_hr = wake_hr - sleep_hr

            if abs(sleep_hr - user["avg_sleep_hr"]) > 30:
                session["avg_sleep_hr"] = sleep_hr
            if abs(slept_hr - user["avg_slept_hr"]) > 30:
                session["avg_slept_hr"] = slept_hr

            return redirect("/sleeptable")


@app.route('/change-profile-pic', methods=["GET", "POST"])
@login_required
def change_profile_pic():
    if request.method == "GET":
        return render_template("Functions/change-profile-pic.html")
    else:
        user = db.execute("SELECT * FROM users WHERE id=:userid", userid=session["user_id"])
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']

        #if user does does not select file, browser also submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        if file:
            # Potential path
            path = os.path.join(app.config['UPLOAD_FOLDER'], user[0]["username"], "profile_pic")
            # If potential path not exists, create folder
            if not os.path.exists(path):
                os.makedirs(path)
            path = os.path.join(path, file.filename)
            file.save(path)
            db.execute("UPDATE users SET profile_pic=:filepath WHERE id=:userid", userid=session['user_id'], filepath = path)
            update_status()
        return redirect("/")

@app.route('/downloaddata', methods=["GET", "POST"])
@login_required
def download_data():
    #Select todo for users
    user = db.execute("SELECT * FROM users WHERE id=:userid", userid=session["user_id"])
    todoCompleted = db.execute("SELECT * FROM todo_completed WHERE userid=:userid", userid=session["user_id"])
    sleepTable = db.execute("SELECT * FROM sleepschedule WHERE user_id=:userid", userid=session["user_id"])

    PATH = 'Download/'
    path = os.path.join(PATH, user[0]["username"], "file")
    if not os.path.exists(path):
        os.makedirs(path)
    todo_completed_csv = "todo_completed.csv"
    sleep_table_csv = "sleep_table.csv"

    if request.method == "GET":
        # Create paths for 2 files
        path1 = os.path.join(path, todo_completed_csv)
        path2 = os.path.join(path, sleep_table_csv)

        #Write todo_completed
        with open(path1, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["ID", "USER_ID", "TASK", "TIME CREATED", "STATUS", "DUE DATE"])
            for item in todoCompleted:
                writer.writerow([item["id"], item["userid"], item["todo"], item["time"], item["status"], item["due_date"]])
        #Write sleep table
        with open(path2, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["ID", "USER_ID", "WAKE TIME", "SLEEP TIME", "WEEK DAY", "DATE"])
            for item in sleepTable:
                writer.writerow([item["id"], item["user_id"], str(item["wake_hr"]).zfill(2) + ":" + str(item["wake_min"]).zfill(2), str(item["sleep_hr"]).zfill(2) + ":" + str(item["sleep_min"]).zfill(2), item["week_day"], item["fulldate"]])

        return render_template("Functions/downloaddata.html")
    else:
        if request.form["btn_identifier"] == "download_todo":
            return send_from_directory(path, todo_completed_csv, as_attachment=True, mimetype="text/csv", attachment_filename=todo_completed_csv)
        elif request.form["btn_identifier"] == "download_sleeptable":
            return send_from_directory(path, sleep_table_csv, as_attachment=True, mimetype="text/csv", attachment_filename=sleep_table_csv)

@app.route('/bmical', methods=["GET", "POST"])
@login_required
def bmi_cal():
    if request.method == "GET":
        return render_template("Functions/BMICAL.html")
    else:
        if request.form["btn_identifier"] == "update_bmi":
            feet = int(request.form.get("bmi_height_feet"))
            inch = int(request.form.get("bmi_height_inch"))
            kg = int(request.form.get("bmi_weight_kg"))
            height_meter = feet * 0.3048 + inch * 0.0254
            bmi = round((kg / (height_meter * height_meter)), 2)
            #Update BMI into database
            db.execute("UPDATE users SET height_feet=:feet, height_inch=:inch, weight=:kg, bmi=:bmi WHERE id=:userid", userid=session['user_id'], feet=feet, inch=inch, kg=kg, bmi=bmi)
            update_status()
        return redirect("/")

@app.route('/nibbles', methods=["GET", "POST"])
@login_required
def nibbles():
    if request.method == "GET":
        return render_template("Functions/nibbles.html")
    else:
        user = db.execute("SELECT * FROM users WHERE id=:userid", userid=session['user_id'])
        if request.form["btn_identifier"] == "replay_snake":
            snakescore = int(request.form.get("snake_game_score"))
            if(snakescore > user[0]["snake_score"]):
                db.execute("UPDATE users SET snake_score=:snakescore WHERE id=:userid", userid=session['user_id'], snakescore = snakescore)
                update_status()

        return redirect('/nibbles')


@app.route('/sleepCal')
@login_required
def sleep_cal():
    return render_template("Functions/sleepCal.html")

@app.route('/tip')
@login_required
def tips():
    return render_template("Functions/tip.html")

@app.route('/recommend')
@login_required
def recommend():
    return render_template("Functions/recommend.html")

@app.route('/calories')
@login_required
def calories():
    return render_template("Functions/calories.html")
