import requests
import json

# Test the ML API endpoints
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health Check:", response.json())

def test_analyze():
    """Test memory analysis"""
    test_memory = {
        "id": "test_123",
        "title": "Family Vacation to Hawaii",
        "content": "Had an amazing time with my family in Hawaii. We went to the beach, tried local food, and watched beautiful sunsets. The kids loved building sandcastles and swimming in the ocean. It was such a relaxing and joyful experience.",
        "tags": ["vacation"]
    }
    
    response = requests.post(f"{BASE_URL}/analyze", json=test_memory)
    print("Analysis Result:", json.dumps(response.json(), indent=2))

def test_search():
    """Test semantic search"""
    search_query = {
        "query": "beach vacation with family",
        "user_id": "test_user",
        "top_k": 3
    }
    
    response = requests.post(f"{BASE_URL}/search", json=search_query)
    print("Search Results:", json.dumps(response.json(), indent=2))

def test_chat():
    """Test chat functionality"""
    chat_request = {
        "message": "Tell me about my family vacations",
        "user_id": "test_user"
    }
    
    response = requests.post(f"{BASE_URL}/chat", json=chat_request)
    print("Chat Response:", json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    print("Testing ML API...")
    test_health()
    print("\n" + "="*50 + "\n")
    test_analyze()
    print("\n" + "="*50 + "\n")
    test_search()
    print("\n" + "="*50 + "\n")
    test_chat()
