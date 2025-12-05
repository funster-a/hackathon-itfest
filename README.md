to install:
1(in bash): python -m venv venv
2:(windows): venv/Scripts/active ; (mac, linux): source venv/bin/activate
3: pip install -r requirements.txt
4: get groq api key -> https://console.groq.com/keys
5: create .env file and paste API_KEY='yourapikey'
6: uvicorn main:app --reload
7: open http://127.0.0.1:8000/docs in your browser