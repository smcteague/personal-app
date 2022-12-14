from flask import Blueprint, request, jsonify

from sqlalchemy import func
from datetime import datetime, timezone

from personal_app.helpers import token_required
from personal_app.models import db, Item, SlackUser, item_schema, items_schema, slack_user_schema, slack_users_schema


db_api = Blueprint('db_api', __name__, url_prefix = '/db/api')

########################################################################
# Item Info
# ----------------------------------------------------------------------
@db_api.route('/items', methods=['POST'])
@token_required
def create_item(token):
    category = request.json['category']
    item = request.json['item']
    date_created = datetime.now(tz=timezone.utc)
    date_due = request.json['date_due']
    date_reminder = request.json['date_reminder']
    user_token = token 

    item = Item(category, item, date_created, date_due, date_reminder, user_token)

    db.session.add(item)
    db.session.commit()

    response = item_schema.dump(item)

    return jsonify(response)

@db_api.route('/items', methods=['GET'])
@token_required
def get_items(token):
    owner = token
    items = Item.query.filter_by(user_token=owner)\
        .order_by(Item.date_created.desc())\
            .all()

    response = items_schema.dump(items)

    return jsonify(response)

@db_api.route('/items/query_category/<category>', methods=['GET'])
@token_required
def get_items_query_category(token, category):
    owner = token
    items = Item.query.filter(Item.user_token == owner, \
        func.lower(Item.category) == category)\
                .order_by(Item.date_due.asc())

    response = items_schema.dump(items)

    return jsonify(response)

@db_api.route('/items/query_item/<keyword>', methods=['GET'])
@token_required
def get_items_query_keyword(token, keyword):
    owner = token
    items = Item.query.filter(Item.user_token == owner, \
        (Item.item.like('%' + keyword + '%') \
            | Item.category.like('%' + keyword + '%')))\
                .order_by(Item.date_due.asc())

    response = items_schema.dump(items)

    return jsonify(response)

@db_api.route('/items/<id>', methods = ['POST', 'PUT'])
@token_required
def update_item(token, id):
    item = Item.query.get(id)
    if request.json['category']:
        item.category = request.json['category']
    if request.json['item']:
        item.item = request.json['item']
    item.date_created = datetime.now(tz=timezone.utc)
    if request.json['date_due']:
        item.date_due = request.json['date_due']
    if request.json['date_reminder']:
        item.date_reminder = request.json['date_reminder']
    item.user_token = token

    db.session.commit()
    response = item_schema.dump(item)
    return jsonify(response)

@db_api.route('/items/<id>', methods=['DELETE'])
@token_required
def delete_character(token, id):
    item = Item.query.get(id)

    db.session.delete(item)
    db.session.commit()

    response = item_schema.dump(item)

    return jsonify(response)

########################################################################
# Slack User Info
# ----------------------------------------------------------------------
@db_api.route('/slack_user', methods=['POST'])
@token_required
def create_slack_user(token):
    slack_workspace_url = request.json['slack_workspace_url']
    slack_user_id = request.json['slack_user_id']
    date_recorded = datetime.now(tz=timezone.utc)
    user_token = token 

    slack_user = SlackUser(slack_workspace_url, slack_user_id, date_recorded, user_token)

    db.session.add(slack_user)
    db.session.commit()

    response = item_schema.dump(slack_user)

    return jsonify(response)

@db_api.route('/slack_user/<slack_workspace_url>/<slack_user_id>', methods=['GET'])
# @token_required
def get_slack_user(slack_workspace_url, slack_user_id):
    slack_user = SlackUser.query.filter(SlackUser.slack_workspace_url == slack_workspace_url, \
        SlackUser.slack_user_id == slack_user_id).first()

    response = slack_user_schema.dump(slack_user)

    return jsonify(response)