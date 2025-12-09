import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY is None:
    raise RuntimeError("Please set GEMINI_API_KEY in environment or .env")



genai.configure(api_key=API_KEY)

app = Flask(__name__)
CORS(app)  # allow requests from your React frontend

# Choose a model from gemini
MODEL = "gemini-2.5-flash"

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    professional_mode = data.get("professionalMode", False)

    # System prompt
    if professional_mode:
        system_prompt = (
            "You are a supportive mental health professional. "
            "Respond with empathy, avoid giving direct medical advice, "
            "and encourage well-being and coping strategies."
        )
    else:
        system_prompt = (
            "You are a helpful, friendly assistant — not a professional. "
            "Answer user queries clearly and politely."
        )

    # Start a chat session
    model = genai.GenerativeModel(MODEL)
    chat = model.start_chat()

    # Send system message
    chat.send_message(system_prompt)

    # Send the user message
    response = chat.send_message(user_message)
    reply = response.text.strip()

    return jsonify({
        "sender": "professional" if professional_mode else "bot",
        "text": reply
    }), 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
