from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS

from .api.db.routes import db_api
from .api.slack.routes import slack_api
from .models import db as root_db
from config import Config


app = Flask(__name__)
app.register_blueprint(db_api)
app.register_blueprint(slack_api)

app.config.from_object(Config)

root_db.init_app(app)
migrate = Migrate(app, root_db)

CORS(app)