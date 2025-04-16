"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_jwt_extended.exceptions import NoAuthorizationError
from sqlalchemy.exc import NoResultFound
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


bcrypt = Bcrypt()



#comprobar usuario
@api.route('/users', methods=['GET'])
def get_users():
    data = db.session.scalars(db.select(User)).all()
    result = list(map(lambda item: item.serialize(),data))

    if result == []:
        return jsonify({"msg":"there are no users"}), 404

    response_body = {
        "results": result
    }

    return jsonify(response_body), 200



# @api.route('/user', methods=['GET'])
# @jwt_required()  # Requiere autenticación con JWT
# def get_current_user():
#     try:
#         # 1. Obtener el email del usuario desde el token JWT
#         current_user_email = get_jwt_identity()
        
#         # 2. Buscar SOLO el usuario actual en la base de datos
#         user = User.query.filter_by(email=current_user_email).first()
        
#         if not user:
#             return jsonify({
#                 "status": "error",
#                 "msg": "Usuario no encontrado"
#             }), 404

#         # 3. Devolver SOLO los datos del usuario autenticado
#         return jsonify({
#             "status": "success",
#             "user": user.serialize()  # Asegúrate que tu modelo User tenga este método
#         }), 200

    # except Exception as e:
    #     return jsonify({
    #         "status": "error",
    #         "msg": "Error al obtener usuario",
    #         "error": str(e)
    #     }), 500


    
@api.route('/signup', methods=['POST'])
def create_user():
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"msg": "Email y password son requeridos"}), 400
    
    existing_user = User.query.filter_by(email=data["email"]).first()

    if existing_user:
        return jsonify({
            "msg": "El usuario ya existe",
            "user_exists": True,
            "email": data["email"]
        }), 200
    
    try:
        hashed_pw = bcrypt.generate_password_hash(data["password"]).decode('utf-8')
        new_user = User(email=data["email"], password=hashed_pw)
        # new_user = User(email=data["email"], password=data["password"])
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "msg": "Usuario creado exitosamente",
            "user_exists": False,
            "email": data["email"]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500

#login
# @api.route("/login", methods=["POST"])
# def login():
#     try:

#         email = request.json.get("email", None)
#         password = request.json.get("password", None)

#         #buqueda usuario en el cuerpo de la petición
#         user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one()
#         print(user)
#         if email != user.email or password != user.password:

#         # if email != "test" or password != "test":

#             return jsonify({"msg": "Bad email or password"}), 401

#         access_token = create_access_token(identity=email)
#         return jsonify(access_token=access_token)
#     except NoResultFound:
#         return jsonify({"msg": "error"})
    
@api.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"msg": "Missing email or password"}), 400
        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            return jsonify({"msg": "Bad email or password"}), 401
        access_token = create_access_token(identity=user.email)
        return jsonify({
            "token": access_token,
            "user_id": user.id,
            "email": user.email,
            "msg": "Login successful"
        }), 200
    except Exception as e:
        return jsonify({"msg": f"Login error: {str(e)}"}), 500

# @api.route("/login", methods=["POST"])
# def login():
#     data = request.get_json()
    
#     if not data or 'email' not in data or 'password' not in data:
#         return jsonify({"msg": "Email y password son requeridos"}), 400
    
#     # user = User.query.filter_by(email=data["email"]).first()
#     user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one()
#     print(user)
    
#     if not user or not bcrypt.check_password_hash(user.password, data["password"]):
#         return jsonify({"msg": "Credenciales inválidas"}), 401
    
#     access_token = create_access_token(identity=data["email"])
#     return jsonify({
#         "msg": "Login exitoso",
#         "access_token": access_token,
#         "user": {"email": user.email}
#     }), 200



#verificación token

@api.route('/verify-token', methods=['POST'])
@jwt_required()
def validate_token():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify({"valid": False}), 401
    
    return jsonify({
        "valid": True,
        "user": {
            "id": user.id,
            "email": user.email
        }
    }), 200

# @api.route("/verify-token", methods=["GET"])
# def verify_token():
#     try:
#         verify_jwt_in_request()  
#         identity = get_jwt_identity()
#         return jsonify({"valid": True, "user": identity}), 200
#     except NoAuthorizationError:
#         return jsonify({"valid": False, "message": "Token inválido o no proporcionado"}), 401



#private

# @api.route('/private', methods=['GET'])
# @jwt_required()
# def get_user_info():

#     current_user_email = get_jwt_identity()

#     user = User().query.filter_by(email=current_user_email).first()

#     if not user:
#         return jsonify({"msg": "usuario no encontrado"}), 400

#     user_data = {
#         "id": user.id,
#         "email": user.email,
      
#     }
#     return jsonify(logged_in_as=current_user_email), 200



@api.route('/private', methods=['GET'])
@jwt_required()
def get_user_info():
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()

        if not user:
            
            return jsonify({"msg": "Usuario no encontrado"}), 404

        # Respuesta más estructurada
        # return jsonify({
        #     "status": "success",
        #     "user": {
        #         "id": user.id,
        #         "email": user.email
        #     }
        # }), 200
        return jsonify(logged_in_as=current_user_email), 200
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "msg": "Error interno del servidor"
        }), 500

