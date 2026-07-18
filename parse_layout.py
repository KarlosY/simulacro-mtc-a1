import json
import re

def parse_layout():
    with open('balotario_layout.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    questions = []
    current_q = None

    # Find the header to determine column positions
    header_idx = -1
    for i, line in enumerate(lines):
        if "DESCRIPCIÓN DE LA PREGUNTA" in line and "ALTERNATIVA 1" in line:
            header_idx = i
            header_line = line
            break
            
    if header_idx == -1:
        print("Header not found")
        return

    # Let's find the approximate start indices based on the header line
    # "Nº"
    col_desc_start = header_line.find("DESCRIPCIÓN DE LA PREGUNTA")
    col_a1_start = header_line.find("ALTERNATIVA 1")
    col_a2_start = header_line.find("ALTERNATIVA 2")
    col_a3_start = header_line.find("ALTERNATIVA 3")
    col_a4_start = header_line.find("ALTERNATIVA 4")
    col_resp_start = header_line.find("RESPUESTA")

    print(f"Cols: Desc={col_desc_start}, A1={col_a1_start}, A2={col_a2_start}, A3={col_a3_start}, A4={col_a4_start}, Resp={col_resp_start}")

    # A better approach: The columns in pdftotext -layout are separated by multiple spaces.
    # We can detect when a new question starts because the line starts with a number.
    # Lines before the next number belong to the current question.
    
    current_q = None
    
    for i in range(header_idx + 1, len(lines)):
        line = lines[i].rstrip('\n')
        if not line.strip():
            continue
            
        # Check if line starts with a number (e.g. "1 ", "12 ", "200 ")
        match = re.match(r'^(\d+)\s+', line)
        if match:
            # Save previous question if exists
            if current_q:
                questions.append(current_q)
            
            q_num = int(match.group(1))
            current_q = {
                'id': q_num,
                'desc': [],
                'a1': [],
                'a2': [],
                'a3': [],
                'a4': [],
                'resp': []
            }
            
        if current_q:
            # We append text to the respective columns
            # In pdftotext -layout, text is placed at fixed columns
            # But wait, we can just split the line based on multiple spaces? 
            # No, because some columns might be empty on this line.
            # We must use slice indices.
            # Let's use the header indices, adjusting slightly for safety padding.
            
            # The description often starts earlier than the header word.
            # Let's try to extract based on fixed offsets. Let's look at the actual line 11.
            
            # Helper to extract and clean slice
            def get_slice(s, start, end=None):
                if end:
                    res = s[start:end]
                else:
                    res = s[start:]
                return res.strip()
            
            # We will use absolute slices:
            # Desc: 40 to 125
            # A1: 125 to 160
            # A2: 160 to 195
            # A3: 195 to 225
            # A4: 225 to 250
            # Resp: 250 to end
            # Let's verify these slices with the header:
            # Col_desc_start is around 77, but it can start earlier. Let's say 40.
            
            desc = get_slice(line, 45, 120)
            a1 = get_slice(line, 120, 155)
            a2 = get_slice(line, 155, 185)
            a3 = get_slice(line, 185, 220)
            a4 = get_slice(line, 220, 245)
            resp = get_slice(line, 245)
            
            if desc: current_q['desc'].append(desc)
            if a1: current_q['a1'].append(a1)
            if a2: current_q['a2'].append(a2)
            if a3: current_q['a3'].append(a3)
            if a4: current_q['a4'].append(a4)
            if resp: current_q['resp'].append(resp)

    if current_q:
        questions.append(current_q)
        
    # Clean up and format
    formatted = []
    for q in questions:
        desc = " ".join(q['desc']).replace('- ', '')
        # Handle cases where multiple spaces are inside
        desc = re.sub(r'\s+', ' ', desc).strip()
        
        o1 = " ".join(q['a1'])
        o1 = re.sub(r'\s+', ' ', o1).strip()
        
        o2 = " ".join(q['a2'])
        o2 = re.sub(r'\s+', ' ', o2).strip()
        
        o3 = " ".join(q['a3'])
        o3 = re.sub(r'\s+', ' ', o3).strip()
        
        o4 = " ".join(q['a4'])
        o4 = re.sub(r'\s+', ' ', o4).strip()
        
        ans = "".join(q['resp']).strip().lower()
        
        # map a,b,c,d to 0,1,2,3
        ans_idx = -1
        if 'a' in ans: ans_idx = 0
        elif 'b' in ans: ans_idx = 1
        elif 'c' in ans: ans_idx = 2
        elif 'd' in ans: ans_idx = 3
        
        options = [o1, o2, o3, o4]
        
        formatted.append({
            'id': q['id'],
            'question': desc,
            'options': options,
            'correctAnswer': ans_idx,
            'raw_answer': ans
        })
        
    with open('parsed_questions.json', 'w', encoding='utf-8') as f:
        json.dump(formatted, f, ensure_ascii=False, indent=2)
        
    print(f"Extracted {len(formatted)} questions")

parse_layout()
