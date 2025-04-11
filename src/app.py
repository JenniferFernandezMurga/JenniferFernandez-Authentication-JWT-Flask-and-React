"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_jwt_extended.exceptions import NoAuthorizationError
from sqlalchemy.exc import NoResultFound


# from flask_bcrypt import Bcrypt 

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

#comprobar usuario
@app.route('/user', methods=['GET'])
def get_user():
    data = db.session.scalars(db.select(User)).all()
    result = list(map(lambda item: item.serialize(),data))

    if result == []:
        return jsonify({"msg":"there are no users"}), 404

    response_body = {
        "results": result
    }

    return jsonify(response_body), 200


#signup

@app.route('/signup', methods=['POST'])
def create_user():
    data = request.get_json()
   
    new_user = User(
        email=data["email"],
        password=data["password"]
)
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "El usuario ya existe"}), 400

    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201



#login
@app.route("/login", methods=["POST"])
def login():
    try:

        email = request.json.get("email", None)
        password = request.json.get("password", None)

        #buqueda usuario en el cuerpo de la petición
        user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one()
        print(user)
        if email != user.email or password != user.password:

        # if email != "test" or password != "test":

            return jsonify({"msg": "Bad email or password"}), 401

        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token)
    except NoResultFound:
        return jsonify({"msg": "error"})




#verificación token

@app.route("/verify-token", methods=["GET"])
def verify_token():
    try:
        verify_jwt_in_request()  # Verifica la validez del token
        identity = get_jwt_identity()  # Obtiene el usuario del token
        return jsonify({"valid": True, "user": identity}), 200
    except NoAuthorizationError:
        return jsonify({"valid": False, "message": "Token inválido o no proporcionado"}), 401






# @api.route('/login', methods=['POST'])
# def login_user():

#     body = request.get_json()

#     if not body or "email" not in body or "password" not in body:
#         return jsonify({"msg": "credenciales no validas"}), 400 

#     email = body["email"]
#     password = body["password"]
#     user = User.query.filter_by(email=email).first()
#     print(user)
#     #if bcrypt.check_password_hash(user.password, body["password"]):
#     if user != None and bcrypt.check_password_hash(user.password, body["password"]):
#         token=create_access_token(identity=user.email)
#         user_data = {
#             "id": user.id,
#             "email": user.email,
#             "name": user.name
#         }
        
#         return jsonify({"msg": "inicio de sesion exitoso", "token": token, "user": user_data}), 200
#     return jsonify({"msg": "credenciales no validas"}), 400 



#private
#Vista privada del usuario CON el token

@app.route("/private", methods=["GET"])
@jwt_required()
def private():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


# @app.route('/private', methods=['GET'])
# @jwt_required()
# def get_user_info():

#     current_user_email = get_jwt_identity()

#     user = User().query.filter_by(email=current_user_email).first()

#     if not user:
#         return jsonify({"msg": "usuario no encontrado"}), 400

#     user_data = {
#         "id": user.id,
#         "email": user.email,
#         "name": user.name
#     }

#     return jsonify(user_data), 200






# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
