import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found")

genai.configure(api_key=API_KEY)

app = Flask(__name__)
CORS(app)

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
            "Be empathetic, calm, and gently supportive."
        )
    else:
        system_prompt = (
            "You are a friendly and helpful AI assistant. "
            "Be polite, clear, and kind."
        )

    print("\n==============================")
    print("🔥 Incoming Request")
    print("User Message:", user_message)
    print("Professional Mode:", professional_mode)
    print("System Prompt:", system_prompt)
    print("==============================\n")

    try:
        model = genai.GenerativeModel(MODEL)
        chat = model.start_chat(history=[])

        # SEND SYSTEM MESSAGE
        system_response = chat.send_message(system_prompt)
        print("📤 Sent system prompt")
        print("📥 System replied:", system_response.text)

        # SEND USER MESSAGE
        ai_response = chat.send_message(user_message)
        reply_text = ai_response.text.strip()

        print("\n==== Gemini RAW RESPONSE ====")
        print(reply_text)
        print("=============================\n")

        return jsonify({
            "sender": "professional" if professional_mode else "bot",
            "text": reply_text
        }), 200

    except Exception as e:
        print("\n❌ ERROR WHILE CALLING GEMINI")
        print(e)
        print("=============================\n")
        return jsonify({"sender": "bot", "text": "Sorry, there was an error reaching the AI."}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
