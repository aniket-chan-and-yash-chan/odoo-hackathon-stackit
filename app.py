from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import random
import string

post_title_limit = 200
post_description_limit = 500
post_tags_limit = 50
user_email_username_password_length = 100
sessionid_length = 30


app = Flask(__name__, static_folder='./react-frontend/dist', static_url_path='')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stackit.db'  # configure db
db = SQLAlchemy(app) # connecting flask and db
CORS(app)


from flask import send_from_directory

@app.route("/api/questions")
def get_questions():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)
    search = request.args.get('search', '', type=str)

    query = Post.query

    if search:
        query = query.filter(
            Post.title.ilike(f"%{search}%") |
            Post.tags.ilike(f"%{search}%")
        )

    paginated = query.paginate(page=page, per_page=per_page)
    questions = [
        {
            "id": post.id,
            "title": post.title,
            "description": post.description,
            "tags": post.tags,
            "username": "Anonymous",
            "answers": 0
        }
        for post in paginated.items
    ]

    return jsonify({
        "questions": questions,
        "total": paginated.total,
        "pages": paginated.pages,
        "current_page": paginated.page
    })

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

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    username = db.Column(db.String(user_email_username_password_length), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context(): # creates db 
    db.create_all()

@app.route("/api/login", methods=["POST"])
def user_login():
    data = request.get_json()
    if not data:
        return "error: invalid json", 400

    user_email = data.get("email")
    user_password = data.get("password")

    if not user_email or not user_password:
        return "error: missing email or password", 400

    user = Users.query.filter_by(email=user_email, password=user_password).first()
    if user:
        return "asjdfhlkashdfkjl",200
    else:
        return "error: invalid credentials", 401


@app.route("/api/answers/<int:post_id>")
def get_answers(post_id):
    answers = Answer.query.filter_by(post_id=post_id).order_by(Answer.timestamp.desc()).all()
    return jsonify([
        {
            "id": a.id,
            "content": a.content,
            "username": a.username,
            "timestamp": a.timestamp.isoformat()
        } for a in answers
    ])

@app.route("/api/signup", methods=["POST"])
def user_signup():
    data = request.get_json()
    if not data:
        return "error: invalid json", 400

    user_email = data.get("email")
    user_username = data.get("username")
    user_password = data.get("password")

    if not all([user_email, user_username, user_password]):
        return "error: missing fields", 400

    new_user = Users(email=user_email, password=user_password, username=user_username)
    db.session.add(new_user)
    db.session.commit()

    return "User created", 201

@app.route("/api/post", methods=["POST"]) # For posting
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
    
@app.route("/api/answer", methods=["POST"])
def post_answer():
    data = request.get_json()
    content = data.get("content")
    post_id = data.get("post_id")
    username = data.get("username", "Anonymous")

    if not content or not post_id:
        return "Missing content or post_id", 400

    new_answer = Answer(content=content, post_id=post_id, username=username)
    db.session.add(new_answer)
    db.session.commit()
    return "Answer added", 201


if __name__ == '__main__':
    app.run(debug=True, port=10000) # running on port 10000
