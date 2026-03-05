import random
from fastapi import APIRouter

router = APIRouter(prefix="/quotes", tags=["Quotes"])

QUOTES = [
    {"quote": "The secret of getting ahead is getting started.", "author": "Mark Twain"},
    {"quote": "It does not matter how slowly you go as long as you do not stop.", "author": "Confucius"},
    {"quote": "Success is the sum of small efforts, repeated day in and day out.", "author": "Robert Collier"},
    {"quote": "Motivation is what gets you started. Habit is what keeps you going.", "author": "Jim Ryun"},
    {"quote": "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", "author": "Aristotle"},
    {"quote": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
    {"quote": "Don't watch the clock; do what it does. Keep going.", "author": "Sam Levenson"},
    {"quote": "Believe you can and you're halfway there.", "author": "Theodore Roosevelt"},
    {"quote": "Your limitation — it's only your imagination.", "author": "Unknown"},
    {"quote": "Push yourself, because no one else is going to do it for you.", "author": "Unknown"},
    {"quote": "Great things never come from comfort zones.", "author": "Unknown"},
    {"quote": "Dream it. Wish it. Do it.", "author": "Unknown"},
    {"quote": "Stay focused and never give up.", "author": "Unknown"},
    {"quote": "Little by little, one travels far.", "author": "J.R.R. Tolkien"},
    {"quote": "The habit of persistence is the habit of victory.", "author": "Herbert Kaufman"},
    {"quote": "Discipline is the bridge between goals and accomplishment.", "author": "Jim Rohn"},
    {"quote": "A journey of a thousand miles begins with a single step.", "author": "Lao Tzu"},
    {"quote": "What you do every day matters more than what you do once in a while.", "author": "Gretchen Rubin"},
    {"quote": "First forget inspiration. Habit is more dependable.", "author": "Octavia Butler"},
    {"quote": "Small daily improvements are the key to staggering long-term results.", "author": "Unknown"},
]


@router.get("")
def get_random_quote():
    """Return a random motivational quote for the cat widget."""
    return random.choice(QUOTES)
