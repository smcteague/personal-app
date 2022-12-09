from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS

from .api.db.routes import api
from .models import db as root_db, login_manager, ma
from config import Config


app = Flask(__name__)
app.register_blueprint(api)

app.config.from_object(Config)

root_db.init_app(app)
migrate = Migrate(app, root_db)

CORS(app)