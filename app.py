import requests
import pandas as pd
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

api_key = os.getenv("OPENROUTER_API_KEY")
model_name = "openrouter/free"
chat_history = []
csv_path = "career-analysis.csv"
API_URL = "https://openrouter.ai/api/v1/chat/completions"


def call_ai(message):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "model": model_name,
        "messages": message
    }

    response = requests.post(API_URL, headers=headers, json=data)
    result = response.json()

    answer = result["choices"][0]["message"]["content"]
    return answer


def save_to_csv(question, answer):
    save_data = {
        "Question": [question],
        "AI_Answer": [answer]
    }

    df = pd.DataFrame(save_data)
    file_exists = os.path.exists(csv_path)

    df.to_csv(
        csv_path,
        mode="a",
        index=False,
        header=not file_exists
    )


def ai_career_analyzer(question):
    global chat_history

    chat_history.append({"role": "user", "content": question})

    system_message = {
        "role": "system",
        "content": """
You are an expert AI career advisor.

The user will describe their career goals or problems.

Your task:
1. Identify the user's goal
2. Identify challenges/problems
3. Suggest important skills
4. Give practical next steps

Always assume the user is asking for career guidance.
Do NOT ask unnecessary clarification questions.
Keep answers practical and beginner-friendly.
Return plain clean text only.
Do not use markdown formatting.
Do not use ** or ##.
"""
    }

    message = [system_message] + chat_history

    try:
        answer = call_ai(message)

        chat_history.append({"role": "assistant", "content": answer})

        save_to_csv(question, answer)

        return answer

    except Exception as e:
        return f"Error Occurred: {e}"


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AI Career Analyzer Backend is running"})


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    question = data.get("question", "")

    if question.strip() == "":
        return jsonify({"error": "Question is required"}), 400

    answer = ai_career_analyzer(question)

    return jsonify({"answer": answer})


if __name__ == "__main__":
    app.run()
