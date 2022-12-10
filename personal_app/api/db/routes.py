from flask import Blueprint, request, jsonify

from datetime import datetime

from personal_app.helpers import token_required
from personal_app.models import db, Item, item_schema, items_schema


db_api = Blueprint('db_api', __name__, url_prefix = '/db/api')


@db_api.route('/items', methods=['POST'])
@token_required
def create_item(current_user_token):
    category = request.json['category']
    item = request.json['item']
    date_created = datetime.utcnow()
    date_due = request.json['date_due']
    date_reminder = request.json['date_reminder']
    user_token = current_user_token.token

    item = Item(category, item, date_created, date_due, date_reminder, user_token)

    db.session.add(item)
    db.session.commit()

    response = item_schema.dump(item)

    return jsonify(response)

@db_api.route('/items', methods=['GET'])
@token_required
def get_items(current_user_token):
    owner = current_user_token.token
    items = Item.query.filter_by(user_token = owner).all()
    response = items_schema.dump(items)
    return jsonify(response)

