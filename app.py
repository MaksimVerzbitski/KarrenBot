from flask import Flask, jsonify, request , session, render_template
from flask_cors import CORS
from datetime import datetime
import json
import http.client
import os
import random
#import requests


app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)
app.secret_key = '555666'

app_started = True


def load_phrases():
    with open('nlp-processor/phrases.json') as f:
        return json.load(f)['helpYouPhrases']

# Unified Log to file function
def log_to_file(log_type, message):
    print(f"Logging {log_type}: {message}")
    log_files = {
        'error': 'logging/error_log.txt',
        'conversation': 'logging/conversation_log.txt',
        'session': 'logging/session_log.txt'
    }
    log_file = log_files.get(log_type)

    current_time = datetime.now()
    formatted_time = current_time.strftime("%d-%m-%Y %H:%M")

    if log_file:
        with open(log_file, 'a+') as file:
            file.seek(0)  # Move to the start of the file
            first_character = file.read(1)  # Read the first character

            # Insert a new line only if the file is not empty
            if first_character:
                file.write("\n")

            # Log formatting for session log
            if log_type == 'session':
                if is_new_day(log_file, current_time):
                    file.write(f"*********** | New Day started: {formatted_time} | **********************\n")
                else:
                    file.write(f"======== | New Session started: {formatted_time} | =============\n")
            
            # Log formatting for page reload - no new line check as it's part of session log
            elif log_type == 'page_reload':
                file.write(f"{formatted_time} | SessionStart: Same Session | Page reload!\n")
            
            # General log entry format for other log types
            log_entry = f"{formatted_time} | {message}\n"
            file.write(log_entry)

def log_new_session(reload=False):
    """
    Logs the start of a new session or a page reload with a timestamp.
    """
    if reload:
        log_to_file('page_reload', 'Page reloaded')
    else:
        log_to_file('session', 'New session started')



def is_new_day(log_file, current_time):
    try:
        with open(log_file, 'r') as file:
            lines = file.readlines()
            if lines:
                last_line = lines[-1]
                # Split the line and check if the date part exists
                parts = last_line.split('|')
                if len(parts) > 1:
                    date_str = parts[0].strip()
                    # Only parse the date if date_str is not empty
                    if date_str:
                        last_log_date = datetime.strptime(date_str, "%d-%m-%Y %H:%M").date()
                        return last_log_date != current_time.date()
    except FileNotFoundError:
        pass  # Treat file not found as a new day
    return True  # If the file is empty or not found, treat as a new day


@app.route("/", methods=["GET"])
def main_page():
    global app_started
    now = datetime.now()
    last_reload_time = session.get('last_reload_time')

    if last_reload_time and isinstance(last_reload_time, str):
        last_reload_time = datetime.fromisoformat(last_reload_time)

    if app_started or not last_reload_time or (now - last_reload_time).total_seconds() > 300:
        log_new_session()  # Log new session
        session['last_reload_time'] = now.isoformat()
    else:
        log_new_session(reload=True)  # Log page reload

    app_started = False
    return render_template("index.html")

@app.route('/api/random-helpyou-phrase')
def random_helpyou_phrase():
    phrases = load_phrases()
    phrase = random.choice(phrases)
    return jsonify({'phrase': phrase})

@app.route('/logError', methods=['POST'])
def log_error():
    error_info = request.json
    log_to_file('error', f"{error_info['where']} | {error_info['error']}")
    return jsonify({"status": "error logged"})

""" @app.route('/logConversation', methods=['POST'])
def log_conversation():
    conversation_info = request.json
    # Check session flag to avoid re-logging if already logged
    if session.get('logged_this_session', False):
        response_status = {"status": "conversation already logged"}
    else:
        log_to_file('conversation', f"{conversation_info['sender']} | {conversation_info['message']}")
        print(f"Logging conversation: {conversation_info['sender']} | {conversation_info['message']}")
        response_status = {"status": "conversation logged"}
        session['logged_this_session'] = True  # Set the flag after logging
    return jsonify(response_status) """


@app.route('/logConversation', methods=['POST'])
def log_conversation():
    # Check if the conversation has already been logged this session
    if session.get('logged_this_session', False):
        return jsonify({"status": "conversation already logged"})

    # Proceed if no log entry for this session exists
    conversation_info = request.json
    if 'sender' in conversation_info and 'message' in conversation_info:
        # Log the conversation with correct data
        log_to_file('conversation', f"{conversation_info['sender']} | {conversation_info['message']}")
        print(f"Logging conversation: {conversation_info['sender']} | {conversation_info['message']}")

        # Set the session flag to prevent duplicate logging
        session['logged_this_session'] = True
        return jsonify({"status": "conversation logged"})
    else:
        # Return an error if required data is missing
        return jsonify({"status": "invalid data received"})


@app.route('/sendMessage', methods=['POST'])
def send_message():
    user_message = request.json['message']
    print(f"Received message: {user_message}")  # Log received message

    nlp_response = my_nlp_function(user_message)  # Process the message with NLP
    print(f"NLP response: {nlp_response}")

    # Make sure to return a JSON response
    return jsonify(nlp_response)

""" @app.route('/sendMessage', methods=['POST'])
def send_message():
    user_message = request.json['message']
    print(f"Received message: {user_message}")  # Log received message to console for debugging

    # Call NLP function and get response
    nlp_response = my_nlp_function(user_message)
    print(f"NLP response: {nlp_response}")  # Log NLP response to console for debugging

    # Log the conversation with the bot response in a more structured format
    log_to_file('conversation', f"User: {user_message}")
    if nlp_response.get('answer'):
        log_to_file('conversation', f"Bot: {nlp_response['answer']}")
    else:
        log_to_file('conversation', f"Bot: I'm not sure how to respond to that.")

    return jsonify({
        "response": nlp_response.get('answer', "I'm not sure how to respond to that."),
        "intent": nlp_response.get('intent', 'unknown'),
        "entities": nlp_response.get('entities', {})
    }) """


def my_nlp_function(message):
    conn = http.client.HTTPConnection('127.0.0.1', 3000)
    try:
        payload = json.dumps({'message': message})
        headers = {'Content-Type': 'application/json'}
        conn.request('POST', '/nlp-process-message', payload, headers)
        response = conn.getresponse()
        data = response.read().decode('utf-8')
        if response.status == 200:
            data = json.loads(data)
            return data  # Return the full response including intent and entities
        else:
            print(f"Failed to get a valid response, status code: {response.status}")
            return {"answer": "There was an error processing your message."}
    finally:
        conn.close()

@app.route('/getMessage', methods=['GET'])
def get_message():
    return jsonify({"message": "Hello, how can I help you?"})




if __name__ == '__main__':
    app.run(debug=True)