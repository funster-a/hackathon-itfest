
from openai import OpenAI
import os
client = OpenAI(
    api_key='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',
    base_url="https://api.groq.com/openai/v1",
)

def requestAI(data):
    response = client.responses.create(
        input=data,
        model="openai/gpt-oss-20b",
    )
    return response.output_text
