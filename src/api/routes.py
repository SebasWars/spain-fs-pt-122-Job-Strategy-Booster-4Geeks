from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Category, City, Gender, Skill, SocialMedia, Status, WorkType, EmploymentType, Postulaciones, CV
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json
from datetime import datetime

api = Blueprint('api', __name__)
CORS(api)
bcrypt = Bcrypt()

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({"message": "Hello! I'm a message that came from the backend"}), 200

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

    new_user = User(username=username, email=email, password=password_hash, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "user": new_user.serialize()}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": user.serialize()}), 200

@api.route('/user', methods=["GET"])
def user_detail():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])

@api.route("/category", methods=["GET"])
def category_get():
    categories = Category.query.order_by(Category.id.asc()).all()
    return jsonify([category.serialize() for category in categories])

@api.route("/category/<int:id>", methods=["GET"])
def category_get_by_id(id):
    category = Category.query.filter_by(id=id).first()
    if not category:
        return jsonify({"msg": "Category not found"}), 404
    return jsonify(category.serialize())

@api.route("/category", methods=["POST"])
def category_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()
    return jsonify(new_category.serialize())

@api.route("/category/<int:id>", methods=["PUT"])
def category_put(id):
    category = Category.query.filter_by(id=id).first()
    if not category:
        return jsonify({"msg": "Category not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    category.name = name
    db.session.commit()
    return jsonify(category.serialize())

@api.route("/category/<int:id>", methods=["DELETE"])
def category_delete(id):
    category = Category.query.filter_by(id=id).first()
    if not category:
        return jsonify({"msg": "Category not founded"})
    db.session.delete(category)
    db.session.commit()
    return jsonify({"msg": "This category was deleted"})

@api.route("/city", methods=["GET"])
def city_get():
    cities = City.query.order_by(City.id.asc()).all()
    return jsonify([city.serialize() for city in cities])

@api.route("/city/<int:id>", methods=["GET"])
def city_get_by_id(id):
    city = City.query.filter_by(id=id).first()
    if not city:
        return jsonify({"msg": "City not found"}), 404
    return jsonify(city.serialize())

@api.route("/city", methods=["POST"])
def city_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_city = City(name=name)
    db.session.add(new_city)
    db.session.commit()
    return jsonify(new_city.serialize())

@api.route("/city/<int:id>", methods=["PUT"])
def city_put(id):
    city = City.query.filter_by(id=id).first()
    if not city:
        return jsonify({"msg": "City not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    city.name = name
    db.session.commit()
    return jsonify(city.serialize())

@api.route("/city/<int:id>", methods=["DELETE"])
def city_delete(id):
    city = City.query.filter_by(id=id).first()
    if not city:
        return jsonify({"msg": "City not founded"})
    db.session.delete(city)
    db.session.commit()
    return jsonify({"msg": "This city was deleted"})

@api.route("/gender", methods=["GET"])
def gender_get():
    genders = Gender.query.order_by(Gender.id.asc()).all()
    return jsonify([gender.serialize() for gender in genders])

@api.route("/gender/<int:id>", methods=["GET"])
def gender_get_by_id(id):
    gender = Gender.query.filter_by(id=id).first()
    if not gender:
        return jsonify({"msg": "Gender not found"}), 404
    return jsonify(gender.serialize())

@api.route("/gender", methods=["POST"])
def gender_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_gender = Gender(name=name)
    db.session.add(new_gender)
    db.session.commit()
    return jsonify(new_gender.serialize())

@api.route("/gender/<int:id>", methods=["PUT"])
def gender_put(id):
    gender = Gender.query.filter_by(id=id).first()
    if not gender:
        return jsonify({"msg": "Gender not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    gender.name = name
    db.session.commit()
    return jsonify(gender.serialize())

@api.route("/gender/<int:id>", methods=["DELETE"])
def gender_delete(id):
    gender = Gender.query.filter_by(id=id).first()
    if not gender:
        return jsonify({"msg": "Gender not founded"})
    db.session.delete(gender)
    db.session.commit()
    return jsonify({"msg": "This Gender was deleted"})

@api.route("/skill", methods=["GET"])
def skill_get():
    skills = Skill.query.order_by(Skill.id.asc()).all()
    return jsonify([skill.serialize() for skill in skills])

@api.route("/skill/<int:id>", methods=["GET"])
def skill_get_by_id(id):
    skill = Skill.query.filter_by(id=id).first()
    if not skill:
        return jsonify({"msg": "Skill not found"}), 404
    return jsonify(skill.serialize())

@api.route("/skill", methods=["POST"])
def skill_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_skill = Skill(name=name)
    db.session.add(new_skill)
    db.session.commit()
    return jsonify(new_skill.serialize())

@api.route("/skill/<int:id>", methods=["PUT"])
def skill_put(id):
    skill = Skill.query.filter_by(id=id).first()
    if not skill:
        return jsonify({"msg": "Skill not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    skill.name = name
    db.session.commit()
    return jsonify(skill.serialize())

@api.route("/skill/<int:id>", methods=["DELETE"])
def skill_delete(id):
    skill = Skill.query.filter_by(id=id).first()
    if not skill:
        return jsonify({"msg": "Skill not founded"})
    db.session.delete(skill)
    db.session.commit()
    return jsonify({"msg": "This Skill was deleted"})

@api.route("/social_media", methods=["GET"])
def social_media_get():
    social_medias = SocialMedia.query.order_by(SocialMedia.id.asc()).all()
    return jsonify([sm.serialize() for sm in social_medias])

@api.route("/social_media/<int:id>", methods=["GET"])
def social_media_by_id(id):
    social_media = SocialMedia.query.filter_by(id=id).first()
    if not social_media:
        return jsonify({"msg": "social_media not found"}), 404
    return jsonify(social_media.serialize())

@api.route("/social_media", methods=["POST"])
def social_media_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_social_media = SocialMedia(name=name)
    db.session.add(new_social_media)
    db.session.commit()
    return jsonify(new_social_media.serialize())

@api.route("/social_media/<int:id>", methods=["PUT"])
def social_media_put(id):
    social_media = SocialMedia.query.filter_by(id=id).first()
    if not social_media:
        return jsonify({"msg": "social_media not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    social_media.name = name
    db.session.commit()
    return jsonify(social_media.serialize())

@api.route("/social_media/<int:id>", methods=["DELETE"])
def social_media_delete(id):
    social_media = SocialMedia.query.filter_by(id=id).first()
    if not social_media:
        return jsonify({"msg": "social_media not founded"})
    db.session.delete(social_media)
    db.session.commit()
    return jsonify({"msg": "This social_media was deleted"})

@api.route("/status", methods=["GET"])
def status_get():
    status = Status.query.order_by(Status.id.asc()).all()
    return jsonify([st.serialize() for st in status])

@api.route("/status/<int:id>", methods=["GET"])
def status_id(id):
    status = Status.query.filter_by(id=id).first()
    if not status:
        return jsonify({"msg": "Status not found"}), 404
    return jsonify(status.serialize())

@api.route("/status", methods=["POST"])
def status_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_status = Status(name=name)
    db.session.add(new_status)
    db.session.commit()
    return jsonify(new_status.serialize())

@api.route("/status/<int:id>", methods=["PUT"])
def status_put(id):
    status = Status.query.filter_by(id=id).first()
    if not status:
        return jsonify({"msg": "Status not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    status.name = name
    db.session.commit()
    return jsonify(status.serialize())

@api.route("/status/<int:id>", methods=["DELETE"])
def status_delete(id):
    status = Status.query.filter_by(id=id).first()
    if not status:
        return jsonify({"msg": "Status not founded"})
    db.session.delete(status)
    db.session.commit()
    return jsonify({"msg": "This status was deleted"})

@api.route("/WorkType", methods=["GET"])
def work_type_get():
    work_types = WorkType.query.order_by(WorkType.id.asc()).all()
    return jsonify([wt.serialize() for wt in work_types])

@api.route("/WorkType/<int:id>", methods=["GET"])
def work_type_id(id):
    work_type = WorkType.query.filter_by(id=id).first()
    if not work_type:
        return jsonify({"msg": "new_work_type not found"}), 404
    return jsonify(work_type.serialize())

@api.route("/WorkType", methods=["POST"])
def work_type_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_work_type = WorkType(name=name)
    db.session.add(new_work_type)
    db.session.commit()
    return jsonify(new_work_type.serialize())

@api.route("/WorkType/<int:id>", methods=["PUT"])
def new_work_type_put(id):
    new_work_type = WorkType.query.filter_by(id=id).first()
    if not new_work_type:
        return jsonify({"msg": "new_work_type not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_work_type.name = name
    db.session.commit()
    return jsonify(new_work_type.serialize())

@api.route("/WorkType/<int:id>", methods=["DELETE"])
def new_work_type_delete(id):
    new_work_type = WorkType.query.filter_by(id=id).first()
    if not new_work_type:
        return jsonify({"msg": "new_work_type not founded"})
    db.session.delete(new_work_type)
    db.session.commit()
    return jsonify({"msg": "This new_work_type was deleted"})

@api.route("/EmploymentType", methods=["GET"])
def employment_type_get():
    employment_types = EmploymentType.query.order_by(EmploymentType.id.asc()).all()
    return jsonify([et.serialize() for et in employment_types])

@api.route("/EmploymentType/<int:id>", methods=["GET"])
def employment_type_id(id):
    employment_type = EmploymentType.query.filter_by(id=id).first()
    if not employment_type:
        return jsonify({"msg": "employment_type not found"}), 404
    return jsonify(employment_type.serialize())

@api.route("/EmploymentType", methods=["POST"])
def employment_type_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_employment_type = EmploymentType(name=name)
    db.session.add(new_employment_type)
    db.session.commit()
    return jsonify(new_employment_type.serialize())

@api.route("/EmploymentType/<int:id>", methods=["PUT"])
def employment_type_put(id):
    employment_type = EmploymentType.query.filter_by(id=id).first()
    if not employment_type:
        return jsonify({"msg": "employment_type not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    employment_type.name = name
    db.session.commit()
    return jsonify(employment_type.serialize())

@api.route("/EmploymentType/<int:id>", methods=["DELETE"])
def employment_type_delete(id):
    employment_type = EmploymentType.query.filter_by(id=id).first()
    if not employment_type:
        return jsonify({"msg": "employment_type not founded"})
    db.session.delete(employment_type)
    db.session.commit()
    return jsonify({"msg": "This employment_type was deleted"})

@api.route("/posts/my-post-count", methods=["GET"])
@jwt_required()
def count_post():
    current_user = get_jwt_identity()
    count = Postulaciones.query.filter_by(user_id=current_user).count()
    return jsonify({"count": count})

@api.route("/cv", methods=["GET"])
@jwt_required()
def get_my_cv():
    current_user_id = get_jwt_identity()
    cv = CV.query.filter_by(user_id=current_user_id).first()
    if not cv:
        return jsonify({'success': False, 'message': 'CV no encontrado'}), 404
    try:
        datos = json.loads(cv.datos)
    except:
        datos = {}
    return jsonify({
        'success': True,
        'datos': datos,
        'fecha_modificacion': cv.fecha_modificacion.isoformat() if cv.fecha_modificacion else None
    }), 200

@api.route("/cv", methods=["POST"])
@jwt_required()
def save_cv():
    current_user_id = get_jwt_identity()
    data = request.get_json(force=True, silent=False)

    print("DATA RECIBIDA:", data)

    if not data:
        return jsonify({'success': False, 'message': 'No se enviaron datos'}), 400

    try:
        cv = CV.query.filter_by(user_id=current_user_id).first()
        if cv:
            cv.datos = json.dumps(data, ensure_ascii=False)
            cv.fecha_modificacion = datetime.utcnow()
        else:
            cv = CV(
                user_id=current_user_id,
                datos=json.dumps(data, ensure_ascii=False),
                fecha_modificacion=datetime.utcnow()
            )
            db.session.add(cv)

        db.session.commit()
        return jsonify({'success': True, 'message': 'CV guardado correctamente'}), 200

    except Exception as e:
        print("ERROR AL GUARDAR CV:", e)
        return jsonify({'success': False, 'message': str(e)}), 422


@api.route("/cv", methods=["DELETE"])
@jwt_required()
def delete_cv():
    current_user_id = get_jwt_identity()
    cv = CV.query.filter_by(user_id=current_user_id).first()
    if not cv:
        return jsonify({'success': False, 'message': 'CV no encontrado'}), 404
    db.session.delete(cv)
    db.session.commit()
    return jsonify({'success': True, 'message': 'CV eliminado correctamente'}), 200

@api.route("/cv/export", methods=["GET"])
@jwt_required()
def export_cv():
    current_user_id = get_jwt_identity()
    cv = CV.query.filter_by(user_id=current_user_id).first()
    if not cv:
        return jsonify({'success': False, 'message': 'CV no encontrado'}), 404
    datos = json.loads(cv.datos)
    nombre = datos.get('personalInfo', {}).get('nombre', 'cv').replace(' ', '-').lower()
    fecha = datetime.now().strftime('%Y-%m-%d')
    filename = f"cv-{nombre}-{fecha}.json"
    response = jsonify(datos)
    response.headers['Content-Disposition'] = f'attachment; filename={filename}'
    return response, 200
