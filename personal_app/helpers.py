from functools import wraps

import secrets

from flask import request, jsonify, json


def token_required(our_flask_function):
    @wraps(our_flask_function)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token'].split()[1]

        if not token:
            return jsonify({'message': 'Token is missing!'})

        try:
            current_user_token = 'test_user_token'

        except:
            current_user_token = 'test_user_token'
        
        return our_flask_function(current_user_token, *args, **kwargs)

    return decorated