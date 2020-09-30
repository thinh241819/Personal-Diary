import os
import datetime

from cs50 import SQL

from flask import Flask, render_template, flash, redirect, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required

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
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///central.db")


@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    userid = session["user_id"]
    if request.method == "GET":
        rows = db.execute("SELECT * FROM todo WHERE userid=:userid", userid=userid)

        return render_template("index.html", rows=rows)
    else:
        todo = request.form.get("user_todo")
        datetime_object = datetime.datetime.now()

        # Insert todo list:
        db.execute("INSERT INTO todo (userid, todo, time) VALUES (:userid, :todo, :time)", userid=userid, todo=todo, time=datetime_object)

        return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "GET":
        return render_template("register.html")
    # Extract the information in the form
    else:
        username = request.form.get("register_username")
        password = request.form.get("register_password")
        password_confirm = request.form.get("register_confirm_password")

        # Ensure the data was submitted:
        if not username:
            return apology("Please enter username, password or confirm password")

        # Check if username is in database already
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=username)
        if len(rows) == 1:
            return apology("username already exists", 403)

        if password != password_confirm:
            return apology("password and confirmation does not match", 403)

        # hash the password:
        new_hash = generate_password_hash(password)

        # Insert the newly created account into the table:
        db.execute("INSERT INTO users (username, hash) VALUES (:username, :new_hash)", username=username, new_hash=new_hash)

        return redirect("/login")

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")
    else:
        username = request.form.get("login_username")
        password = request.form.get("login_password")

        # Query database for username:
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=username)

        # Ensure username exists and password is correct:
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], password):
            return apology("Invalid username or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        return redirect("/")
