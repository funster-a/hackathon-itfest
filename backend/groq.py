
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

def requestAI(data):
    response = client.responses.create(
        input=data,
        model="openai/gpt-oss-20b",
    )
    return response.output_text
