to install:
1(in bash): python -m venv venv
2:(windows): venv/Scripts/active ; (mac, linux): source venv/bin/activate
3: pip install -r requirements.txt
4: uvicorn main:app --reload
5: open http://127.0.0.1:8000/docs in your browser