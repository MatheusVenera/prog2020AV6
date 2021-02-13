from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from os import path, remove

app = Flask(__name__)
CORS(app)

db_path = path.dirname(path.abspath(__file__))
db_file = path.join(db_path, 'carros.db')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
