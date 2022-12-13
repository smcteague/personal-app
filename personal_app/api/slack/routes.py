from flask import Blueprint, request, current_app as app

from slack_sdk import WebClient

from datetime import datetime, timezone
import requests
import json
import re

from ..db.routes import get_items


slack_api = Blueprint('slack_api', __name__, url_prefix = '/slack/api')

event_id_dict = {}

@slack_api.route('/event', methods=['POST'])
def slack_event():
    ####################################################################
    ####################################################################
    # 
    # Main inbound section before parsing slack api event
    #
    ####################################################################

    # --------------------------------------------------------------
    # Uncomment out the below for initial or updated URL setup in 
    # slack api console only.
    # 
    # Need to respond back to slack api with 200 code hopefully.
    # 
    # --------------------------------------------------------------
    # content_type = request.headers.get('Content-Type')
    # if (content_type == 'application/json'):
    #     request_json = request.json
    #     return request_json
    # --------------------------------------------------------------

    client = WebClient(token=app.config['SLACK_BOT_TOKEN'])
    BOT_ID = client.api_call('auth.test')['user_id']

    bytes_data = request.data
    dict_data = json.loads(bytes_data)

    # --------------------------------------------------------------
    # console logging
    # --------------------------------------------------------------
    print(f"----dict_data: {dict_data} ----")
    # --------------------------------------------------------------

    event_id = dict_data['event_id']
    event_type = dict_data['event']['type']
    user_id = dict_data['event']['user']
    channel_id = dict_data['event']['channel']
    text = dict_data['event']['text']
    # text_debug = text + ' from ' + event_id

    # --------------------------------------------------------------
    # console logging
    # --------------------------------------------------------------
    print(f"---- text: {text} ----")
    print(f"---- event_id_dict: {event_id_dict} ----")
    # --------------------------------------------------------------

    if event_id in event_id_dict:   
        event_id_dict[event_id] += 1

    if BOT_ID == user_id:

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print("---- BOT ----")
        # --------------------------------------------------------------

        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            return request_json

    ####################################################################
    ####################################################################
    # 
    # ADD item
    #
    ####################################################################
    elif BOT_ID != user_id \
                and event_type == 'message' \
                and event_id not in event_id_dict \
                and 'add ' in text.lower():            
        event_id_dict[event_id] = 1

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- event_id_dict: {event_id_dict} ----")
        print(f"---- {event_id}: {event_id_dict[event_id]} ---- ok")
        # --------------------------------------------------------------

        headers = {
            'Content-Type': 'application/json',
            'x-access-token': 'Bearer test_user_token'
        }

        string = text.lower()
        category = re.findall('add\s+\[(.+)\]\s+', string)[0]
        item = re.findall('\]\s+(.+)\s+due', string)[0]
        date_due = re.findall('due\s+([A-Za-z0-9]+\s+[0-9]+\s+[0-9at]+?\s+[0-9:0-9AMPMampm]+)\s+', string)[0]
        date_reminder = re.findall('remind\s+([A-Za-z0-9]+\s+[0-9]+\s+[0-9at]+?\s+[0-9:0-9AMPMampm]+)', string)[0]

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- category: {category} ----")
        print(f"---- item: {item} ----")
        print(f"---- date_due: {date_due} ----")
        print(f"---- date_reminder: {date_reminder} ----")
        # --------------------------------------------------------------

        today = f'{datetime.now(tz=timezone.utc).today().year}'
        print(f'---- today: {today} ----')

        if 'at' in date_due:
            date_due = date_due.replace('at', today)

        if 'at' in date_reminder:
            date_reminder = date_reminder.replace('at', today)

        date_due_obj = datetime.strptime(date_due, '%b %d %Y %I:%M%p')
        date_reminder_obj = datetime.strptime(date_reminder, '%b %d %Y %I:%M%p')

        add_data = {
            'category': category,
            'item': item,
            'date_due': f'{date_due_obj}',
            'date_reminder': f'{date_reminder_obj}'
        }

        response = requests.post(f'{request.root_url}db/api/items', headers=headers, json=add_data)

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- response.text: {response.text} ----")
        # --------------------------------------------------------------

        client.chat_postMessage(channel=channel_id, text=f"Added:\n\n {response.text}")

        # --------------------------------------------------------------
        # Need to respond back to slack api with 200 code hopefully
        # --------------------------------------------------------------
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            return request_json
        # --------------------------------------------------------------

    ####################################################################
    ####################################################################
    # 
    # GET all items by category or keyword
    #
    ####################################################################
    elif BOT_ID != user_id \
                and event_type == 'message' \
                and event_id not in event_id_dict \
                and 'get ' in text.lower():            
        event_id_dict[event_id] = 1

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- event_id_dict: {event_id_dict} ----")
        print(f"---- {event_id}: {event_id_dict[event_id]} ---- ok")
        # --------------------------------------------------------------

        headers = {
            'Content-Type': 'application/json',
            'x-access-token': 'Bearer test_user_token'
        }

        category = ''
        keyword = ''

        string = text.lower()
        try:
            category = re.findall('get\s+\[(.+)\]\s*', string)[0]
        except:
            keyword = re.findall('get\s+(.+)\s*', string)[0]
        
        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- category: {category} ----")
        print(f"---- keyword: {keyword} ----")
        # --------------------------------------------------------------

        if category:
            response = requests.get(f'{request.root_url}db/api/items/query_category/{category}', headers=headers)
        else:
            response = requests.get(f'{request.root_url}db/api/items/query_item/{keyword}', headers=headers)

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- response.text: {response.text} ----")
        # --------------------------------------------------------------

        client.chat_postMessage(channel=channel_id, text=f"Retrieved:\n\n {response.text}")

        # --------------------------------------------------------------
        # Need to respond back to slack api with 200 code hopefully
        # --------------------------------------------------------------
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            return request_json
        # --------------------------------------------------------------

    ####################################################################
    ####################################################################
    # 
    # UPDATE item by id
    #
    ####################################################################
    elif BOT_ID != user_id \
                and event_type == 'message' \
                and event_id not in event_id_dict \
                and 'update ' in text.lower():            
        event_id_dict[event_id] = 1

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- event_id_dict: {event_id_dict} ----")
        print(f"---- {event_id}: {event_id_dict[event_id]} ---- ok")
        # --------------------------------------------------------------

        headers = {
            'Content-Type': 'application/json',
            'x-access-token': 'Bearer test_user_token'
        }

        string = text.lower()

        # use original text due to Id being case-sensitive
        id = re.findall('update\s*([A-Za-z0-9_-][^\s]*)\s*\[', text)[0]

        try:
            category = re.findall('\s*\[([A-Za-z0-9\s]+)\]\s*', string)[0]
        except:
            category = False

        try:
            item = re.findall('item:\s+(.+)\s+due', string)[0]
        except:
            item = False

        try:          
            date_due = re.findall('due:\s+([A-Za-z0-9]+\s+[0-9]+\s+[0-9at]+?\s+[0-9:0-9AMPMampm]+)\s+?', string)[0]
        except:
            date_due = False

        try:
            date_reminder = re.findall('remind:\s+([A-Za-z0-9]+\s+[0-9]+\s+[0-9at]+?\s+[0-9:0-9AMPMampm]+)', string)[0]
        except:
            date_reminder = False

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- id: {id} ----")
        print(f"---- category: {category} ----")
        print(f"---- item: {item} ----")
        print(f"---- date_due: {date_due} ----")
        print(f"---- date_reminder: {date_reminder} ----")
        # --------------------------------------------------------------

        today = f'{datetime.now(tz=timezone.utc).today().year}'
        print(f'---- today: {today} ----')

        if date_due and 'at' in date_due:
            date_due = date_due.replace('at', today)

        if date_reminder and 'at' in date_reminder:
            date_reminder = date_reminder.replace('at', today)

        if date_due:
            date_due_obj = datetime.strptime(date_due, '%b %d %Y %I:%M%p')
            date_due_obj = f'{date_due_obj}'
        else:
            date_due_obj = False
        
        if date_reminder:
            date_reminder_obj = datetime.strptime(date_reminder, '%b %d %Y %I:%M%p')
            date_reminder_obj = f'{date_reminder_obj}'
        else:
            date_reminder_obj = False

        update_data = {
            'id': id,
            'category': category,
            'item': item,
            'date_due': date_due_obj,
            'date_reminder': date_reminder_obj
        }

        response = requests.post(f'{request.root_url}db/api/items/{id}', headers=headers, json=update_data)

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- response.text: {response.text} ----")
        # --------------------------------------------------------------

        client.chat_postMessage(channel=channel_id, text=f"Updated:\n\n {response.text}")

        # --------------------------------------------------------------
        # Need to respond back to slack api with 200 code hopefully
        # --------------------------------------------------------------
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            return request_json
        # --------------------------------------------------------------

    ####################################################################
    ####################################################################
    # 
    # DELETE item by id
    #
    ####################################################################
    elif BOT_ID != user_id \
                and event_type == 'message' \
                and event_id not in event_id_dict \
                and 'delete ' in text.lower():            
        event_id_dict[event_id] = 1

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- event_id_dict: {event_id_dict} ----")
        print(f"---- {event_id}: {event_id_dict[event_id]} ---- ok")
        # --------------------------------------------------------------

        headers = {
            'Content-Type': 'application/json',
            'x-access-token': 'Bearer test_user_token'
        }

        # use original text due to Id being case-sensitive
        try:
            id = re.findall('delete\s+(.*)\s*', text)[0]
        except:
            id = re.findall('Delete\s+(.*)\s*', text)[0]
        
        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- id: {id} ----")
        # --------------------------------------------------------------

        response = requests.delete(f'{request.root_url}db/api/items/{id}', headers=headers)

        # --------------------------------------------------------------
        # console logging
        # --------------------------------------------------------------
        print(f"---- response.text: {response.text} ----")
        # --------------------------------------------------------------

        client.chat_postMessage(channel=channel_id, text=f"Deleted:\n\n {response.text}")

        # --------------------------------------------------------------
        # Need to respond back to slack api with 200 code hopefully
        # --------------------------------------------------------------
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            return request_json
        # --------------------------------------------------------------

    ####################################################################
    ####################################################################
    # 
    # DEFAULT response back to slack api
    #
    ####################################################################
    else:
        # --------------------------------------------------------------
        # Need to respond back to slack api with 200 code hopefully
        # --------------------------------------------------------------
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            return request_json
        # --------------------------------------------------------------

