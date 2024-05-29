from flask import Flask, jsonify, request , session, render_template
from flask_cors import CORS
from datetime import datetime
import json
import http.client
import random

# Load environment variables
from dotenv import load_dotenv
import os
load_dotenv()



app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)
 
app.secret_key = os.getenv('SECRET_KEY')
app.config["SESSION_TYPE"] = "filesystem"

#Session(app)

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
        with open(log_file, 'a+', encoding='utf-8') as file:
            file.seek(0)  # start of the file
            first_character = file.read(1)  # first character

            #  new line only if  is not empty
            if first_character:
                file.write("\n")

            # Log formatting for session log
            if log_type == 'session':
                if is_new_day(log_file, current_time):
                    file.write(f"*********** | New Day started: {formatted_time} | **********************\n")
                else:
                    file.write(f"======== | New Session started: {formatted_time} | =============\n")
            
            # Log formatting for page reload 
            elif log_type == 'page_reload':
                file.write(f"{formatted_time} | SessionStart: Same Session | Page reload!\n")
            
            # General log entry 
            log_entry = f"{formatted_time} | {message}\n"
            file.write(log_entry)

def log_new_session(reload=False):
    """
    Logs  start new session  + time.
    """
    if reload:
        log_to_file('page_reload', 'Page reloaded')
    else:
        log_to_file('session', 'New session started')



def is_new_day(log_file, current_time):
    try:
        with open(log_file, 'r', encoding='utf-8') as file:
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
        pass  
    return True  

# Main page
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

def random_helpyou_phrase():
    phrases = load_phrases()
    selected_phrase = random.choice(phrases)
    print(f"Random help-you phrase selected: {selected_phrase}")  # Log the selected phrase
    return jsonify(phrase=selected_phrase)

@app.route('/logError', methods=['POST'])
def log_error():
    error_info = request.json
    log_to_file('error', f"{error_info['where']} | {error_info['error']}")
    return jsonify({"status": "error logged"})


@app.route('/logConversation', methods=['POST'])
def log_conversation():
    conversation_info = request.json
    if 'sender' in conversation_info and 'message' in conversation_info:
        # Determine the sender's name based on the session or default
        sender_name = session.get('userName', 'User') if conversation_info['sender'] == 'User' else session.get('botName', 'Bot')

        # Log the conversation using the resolved sender name
        log_to_file('conversation', f"{sender_name} | {conversation_info['message']}")
        print(f"Logging conversation: {sender_name} | {conversation_info['message']}")

        return jsonify({"status": "conversation logged"})
    else:
        # Error if necessary data is missing
        return jsonify({"status": "invalid data received"})

@app.route('/sendMessage', methods=['POST'])
def send_message():
    user_message = request.json['message']
    print(f"Received message: {user_message}")  # console for debugging

    user_name = session.get('userName', 'User')  # Use session value
    bot_name = session.get('botName', 'Bot')  # Use session value

    # Call NLP function and get response
    nlp_response = my_nlp_function(user_message)
    print(f"NLP response: {nlp_response}")  # NLP console for debugging

    # Log the conversation with the bot response 
    log_to_file('conversation', f"{user_name}: {user_message}")
    if nlp_response.get('answer'):
        log_to_file('conversation', f"{bot_name}: {nlp_response['answer']}")
    else:
        log_to_file('conversation', f"{bot_name}: I'm not sure how to respond to that.")

    # Update session with current names
    if nlp_response.get('userName'):
        session['userName'] = nlp_response['userName']
    if nlp_response.get('botName'):
        session['botName'] = nlp_response['botName']

    # Return a JSON response
    return jsonify(nlp_response)
    


def my_nlp_function(message):
    conn = http.client.HTTPConnection('127.0.0.1', 3000)  # Node.js server running on port 3000
    try:
        payload = json.dumps({'message': message})
        headers = {'Content-Type': 'application/json'}
        conn.request('POST', '/nlp-process-message', payload, headers)
        response = conn.getresponse()
        data = response.read().decode('utf-8')
        print(f"NLP function response: {data}")  # Log the response
        if response.status == 200:
            data = json.loads(data)
            return data
        else:
            print(f"Failed to get a valid response, status code: {response.status}")
            return {"answer": "There was an error processing your message."}
    finally:
        conn.close()

def get_message():
    print("getMessage called")  # Log the function call
    return jsonify({"message": "Hello, how can I help you?"})


@app.route('/setNames', methods=['POST'])
def set_names():
    names_info = request.get_json()  # Get the JSON data from the request
    updated = False

    # Check and update botName if provided
    if 'botName' in names_info and names_info['botName'] != session.get('botName'):
        session['botName'] = names_info['botName']
        log_to_file('bot_name_change', f"Bot name changed to: {session['botName']}")
        updated = True

    # Check and update userName if provided
    if 'userName' in names_info and names_info['userName'] != session.get('userName'):
        session['userName'] = names_info['userName']
        log_to_file('user_name_change', f"User name changed to: {session['userName']}")
        updated = True

    if updated:
        return jsonify({"status": "Names updated successfully"})
    else:
        return jsonify({"status": "No changes detected"})


@app.route('/clearChatSession', methods=['POST'])
def clear_chat_session():
    # Reset user and bot names to defaults
    session['userName'] = 'User'
    session['botName'] = 'Bot'
    # Optionally clear other session variables if needed
    return jsonify({"status": "Chat session cleared"})

@app.route('/startNewSession', methods=['POST'])
def start_new_session():
    # Reset session data
    session.clear()
    session['userName'] = 'User'
    session['botName'] = 'Bot'
    log_to_file('session', 'New session started')
    return jsonify({"status": "New session started"})

if __name__ == '__main__':
    app.run(debug=True)