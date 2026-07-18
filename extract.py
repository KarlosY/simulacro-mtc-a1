import json
import re

def extract_questions():
    with open('balotario_layout.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    questions = []
    current_q = None

    # We will try to find lines that match the start of a question.
    # The format often has the number, "AI", "Reglamento..."
    # But because it's a layout PDF, the question text is spread across columns.
    # Actually, pdftotext without layout might be easier if we look for "a) ", "b) ", "c) ", "d) "
    pass

extract_questions()
