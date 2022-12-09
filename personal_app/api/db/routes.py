from flask import Blueprint, request, jsonify

from datetime import datetime


api = Blueprint('db_api', __name__, url_prefix = '/db/api')

