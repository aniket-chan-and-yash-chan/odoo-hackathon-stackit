from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import random
import string

post_title_limit = 200
post_description_limit = 500
post_tags_limit = 50
user_email_username_password_length = 100
sessionid_length = 30


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stackit.db'  # configure db
db = SQLAlchemy(app) # connecting flask and db

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Making format for db in which it will save things
    title = db.Column(db.String(post_title_limit), nullable=False) 
    description = db.Column(db.String(post_description_limit), nullable=False)
    tags = db.Column(db.String(post_tags_limit), nullable=False)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Making format for db in which it will save things
    email = db.Column(db.String(user_email_username_password_length), nullable=False)
    username = db.Column(db.String(user_email_username_password_length), nullable=False)
    password = db.Column(db.String(user_email_username_password_length), nullable=False)
    sessionid = db.Column(db.String(sessionid_length), nullable=True)

with app.app_context(): # creates db 
    db.create_all()

@app.route("/login", methods=["POST"]) # For login
def user_login():
    data=request.get_json()
    user_email = data["email"]
    user_password = data["password"]
    user_sessionid = ''.join(random.choices(string.ascii_letters + string.digits, k=sessionid_length)) # Random session-id generated
    if len(user_email)<user_email_username_password_length and len(user_password)<user_email_username_password_length:
        login_user = Users(email=user_email, password=user_password, sessionid=user_sessionid)
        db.session.add(login_user)
        db.session.commit() # commits entry in db
        return "User created"
    else:
        return "error: User not created"
    
@app.route("/signup", methods=["POST"]) # For signup
def user_signup():
    data = request.get_json()
    user_email = data["email"]
    user_username = data["username"]
    user_password = data["password"]
    print(user_email + " " + user_password)
    if len(user_email)<user_email_username_password_length and len(user_password)<user_email_username_password_length and len(user_username)<user_email_username_password_length:
        new_user = Users(email=user_email, password=user_password, username = user_username)
        db.session.add(new_user)
        db.session.commit() # commits entry in db
        return "User created"
    else:
        return "error: User not created"

@app.route("/post", methods=["POST"]) # For posting
def post_user():
    if request.method == 'POST':
        data = request.get_json()
        post_title = data["title"]
        post_description = data["description"]
        post_tags = data["tags"]
        if len(post_title)<post_title_limit and len(post_description)<post_description_limit and len(post_tags)<post_tags_limit:
            new_post = Post(title=post_title, description=post_description, tags = post_tags)
            db.session.add(new_post)
            db.session.commit() # commits entry in db
            return "okay"
        else:
            return "error"
    search_query = request.args.get('search') # searches within db by title
    if search_query: # checks if user searches anything
        cards = Post.query.filter(Post.title.contains(search_query)).all()
    else:
        cards = Post.query.all() # otherwise shows all
    return render_template('index.html/post', cards = cards)
    
@app.route("/")
def home():
    return render_template('index.html')
    

if __name__ == '__main__':
    app.run(debug=True, port=5001)