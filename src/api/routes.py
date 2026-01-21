"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.data_mock.mock_data import jobs
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

bcrypt = Bcrypt()  # just create the instance here


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=["POST"])
def register():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"message": "Missing username, email, or password"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        username=username,
        email=email,
        password=password_hash,
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": new_user.serialize()
    }), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200


@api.route('/user', methods=["GET"])
def user_detail():
    users = User.query.all()
    list_user = [user.serialize() for user in users]
    return jsonify(list_user)


# -----------------------------Postulaciones-----------------------------#
@api.route("/posts/my-post-count", methods=["GET"])
def count_post():
    total_job=len(jobs)
    return jsonify({"count":total_job})

@api.route("/posts/oferta", methods=["GET"])
def count_oferta():
    total_job = len([j for j in jobs if j["proceso"] == "Ofertas"])
    return jsonify({"oferta": total_job})

@api.route("/posts/descartado", methods=["GET"])
def count_descartado():
    total_job = len([j for j in jobs if j["proceso"] == "Descartado"])
    return jsonify({"descartado": total_job})

@api.route("/posts/entrevista", methods=["GET"])
def count_entrevista():
    total_job = len([j for j in jobs if j["proceso"] == "En entrevista"])
    return jsonify({"entrevista": total_job})


@api.route("/postulacion", methods=['GET'])
def postulaciones_get():
    job = [j for j in jobs]
    return jsonify(job)
@api.route("/postulacion/<int:id>", methods=['GET'])
def postulaciones_get_id(id):
    job = next((j for j in jobs if j['id'] == id), None)
    if job is None:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job)
    
@api.route("/postulacion/filter", methods=['GET'])
def postulaciones_ge_filtert():
    status_filter = request.args.get('status', None)

    if status_filter:
        filtered_jobs = [job for job in jobs if job.get('status', '').lower() == status_filter.lower()]
    else:
        filtered_jobs = jobs

    return jsonify(filtered_jobs), 200
