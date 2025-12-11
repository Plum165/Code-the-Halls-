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
  "You are a helpful and friendly AI assistant. Your role is to provide clear, polite, and supportive responses to the user's questions. Always communicate in a respectful, approachable, and understanding tone. "
  "You are NOT a medical, legal, or professional advisor. If a question requires professional help, gently remind the user to consult a qualified expert. "
  "Keep answers clear, concise, and easy to understand. "
  "Be patient and empathetic — acknowledge the user's feelings if relevant. "
  "Provide helpful guidance, examples, or explanations when appropriate. "
  "Avoid giving definitive professional advice, diagnoses, or solutions for serious issues. "
  "Maintain a friendly and polite tone at all times. "
  "Encourage safe and responsible actions."
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
