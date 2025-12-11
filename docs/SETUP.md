# Setup Instructions

Follow the steps below to set up and run the project.

---

## 📦 Requirements

- **Node.js v18+** – Required for the React frontend. Download from https://nodejs.org/
- **npm v9+** (comes with Node.js) – For managing JavaScript packages.
- **Python 3.10+** – Required for the Flask backend.
- **pip** – Python package manager (comes with Python 3.10+)
- **Git** – To clone the repository.
- **Google Gemini API Key** – For AI integration. Set in `.env` file.
- Optional: **VS Code** or any code editor for development.

---

## ⚙️ Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <repo-name>

# 2. Set up backend (Flask)
cd backend
python -m venv venv
# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create a .env file in backend/ with your Gemini API key
# Example .env:
# GEMINI_API_KEY=your_api_key_here

# 3. Set up frontend (React)
cd ../frontend
npm install

## ▶️ Running the Project
``` bash
# 1. Start the Flask backend
cd backend
# Make sure your virtual environment is active
flask run
# By default, it runs on http://127.0.0.1:5000

# 2. Start the React frontend
cd ../frontend
npm start
# By default, it runs on http://localhost:3000

```
After both servers are running, open your browser at http://localhost:3000 to access the VEA chat interface.
