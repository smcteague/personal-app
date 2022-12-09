from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
import uuid

import secrets

from datetime import datetime


db = SQLAlchemy()

