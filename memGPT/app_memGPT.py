from flask import Flask, request, jsonify, send_from_directory
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file
app = Flask(__name__, static_folder='static')

# Load the API key from environment variables
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

@app.route('/')
def index():
    return send_from_directory('static', 'index_memGPT.html')

@app.route('/nlp-process-message-memGPT', methods=['POST'])
def process_message():
    data = request.get_json()
    text = data['text']
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are talking to a helpful assistant."}, 
                      {"role": "user", "content": text}]
        )
        return jsonify({'answer': response.choices[0].message['content']})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)