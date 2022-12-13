from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow

import uuid
import secrets
from datetime import datetime


db = SQLAlchemy()
ma = Marshmallow()


class Item(db.Model):
    id = db.Column(db.String, primary_key = True)
    category = db.Column(db.String(150), nullable = True, default = '')
    item = db.Column(db.String(500), nullable = True, default = '')
    date_created = db.Column(db.DateTime, nullable = False, default = datetime.utcnow())
    date_due = db.Column(db.DateTime, nullable = True, default = '')
    date_reminder = db.Column(db.DateTime, nullable = True, default = '')
    user_token = db.Column(db.String, default = '', unique = False)

    def __init__(self, category, item, date_created, date_due, date_reminder, user_token, id = ''):
        self.id = self.set_id()
        self.category = category
        self.item = item
        self.date_created = date_created
        self.date_due = date_due
        self.date_reminder = date_reminder
        self.user_token = user_token

    def set_id(self):
        return secrets.token_urlsafe()

    def __repr__(self):
        return f"The following item has been added to {self.category} category!"


class ItemSchema(ma.Schema):
    class Meta:
        fields = ['id', 'category', 'item', 'date_created', 'date_due', 'date_reminder', 'user_token']


item_schema = ItemSchema()
items_schema = ItemSchema(many = True)

class SlackUser(db.Model):
    id = db.Column(db.String, primary_key = True)
    slack_workspace_url = db.Column(db.String(50), nullable = True, default = '')
    slack_user_id = db.Column(db.String(50), nullable = True, default = '')
    date_recorded = db.Column(db.DateTime, nullable = False, default = datetime.utcnow())
    user_token = db.Column(db.String, default = '', unique = False)

    def __init__(self, slack_workspace_url, slack_user_id, date_recorded, user_token, id = ''):
        self.id = self.set_id()
        self.slack_workspace_url = slack_workspace_url
        self.slack_user_id = slack_user_id
        self.date_recorded = date_recorded
        self.user_token = user_token

    def set_id(self):
        return secrets.token_urlsafe()

    def __repr__(self):
        return f"The following Slack workspace and Slack user has been added: {self.slack_workspace_url}, {self.slack_user_id}!"


class SlackUserSchema(ma.Schema):
    class Meta:
        fields = ['id', 'slack_workspace_url', 'slack_user_id', 'date_recorded']


slack_user_schema = SlackUserSchema()
slack_users_schema = SlackUserSchema(many = True)

