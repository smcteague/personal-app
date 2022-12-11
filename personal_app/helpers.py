from functools import wraps

from flask import request, jsonify


def token_required(our_flask_function):
    @wraps(our_flask_function)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token'].split()[1]

        if not token:
            return jsonify({'message': 'Token is missing!'})
        
        return our_flask_function(token, *args, **kwargs)

    return decorated