from flask import Blueprint, request, current_app as app

from slack_sdk import WebClient

import json

slack_api = Blueprint('slack_api', __name__, url_prefix = '/slack/api')

event_id_dict = {}

@slack_api.route('/event', methods=['POST'])
def slack_event():
    client = WebClient(token=app.config['SLACK_BOT_TOKEN'])
    BOT_ID = client.api_call('auth.test')['user_id']

    bytes_data = request.data
    dict_data = json.loads(bytes_data)
    print(dict_data)

    event_id = dict_data['event_id']
    event_type = dict_data['event']['type']
    user_id = dict_data['event']['user']
    channel_id = dict_data['event']['channel']
    text = dict_data['event']['text'] + ' from ' + event_id

    print(dict_data['event']['text'])
    print(event_id_dict)
    if event_id in event_id_dict:   
        event_id_dict[event_id] += 1

    if BOT_ID == user_id:
        print("---- BOT ----")
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            return request_json
    elif BOT_ID != user_id and event_type == 'message' and event_id not in event_id_dict:            
        event_id_dict[event_id] = 1

        print(f"---- {event_id}: {event_id_dict[event_id]} ---- ok")
        client.chat_postMessage(channel=channel_id, text=text)

        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            return request_json
    else:
        print("---- else ----")
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            return request_json


