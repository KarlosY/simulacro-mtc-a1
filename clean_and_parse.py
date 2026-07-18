import json
import re

def parse():
    with open('balotario_layout.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    junk = [
        "Materias", "generales", "AI", "AII", "AIII", "Reglamento de Tránsito y", "Manual de Dispositivos de", "Control de Tránsito",
        "Nº", "TIPO DE", "MATERIA", "CLASE /", "CATEGORIA", "TEMA", "DESCRIPCIÓN DE LA PREGUNTA", "ALTERNATIVA 1", "ALTERNATIVA 2", "ALTERNATIVA 3", "ALTERNATIVA 4", "RESPUESTA",
        "LICENCIA DE CONDUCIR PARA CONDUCTORES NO PROFESIONALES",
        "BALOTARIO DE PREGUNTAS PARA LA EVALUACIÓN DE CONOCIMIENTOS EN LA CONDUCCIÓN PARA POSTULANTES A LICENCIAS DE CONDUCIR",
        "DE CLASE A - CATEGORÍA I (Vehículos de la categoría M1, M2 y N1)",
        "Infracciones", "Sanciones", "Primeros Auxilios", "Mecánica Básica", "Conducción Eficiente", "Nacional de Tránsito", "Seguridad Vial"
    ]
    
    # Also page numbers like "\x0c"
    
    cleaned_lines = []
    for line in lines:
        line = line.replace('\x0c', '') # form feed
        # Replace junk words with spaces to maintain layout
        for word in junk:
            # We must be careful not to replace these words if they are part of a question!
            # But the headers are always at specific columns or standalone.
            # Actually, "AI" might appear inside a word like "AIRE". So regex \bAI\b
            # Let's use regex word boundary.
            line = re.sub(r'\b' + re.escape(word) + r'\b', ' ' * len(word), line)
            # Some words don't have boundaries (like /)
            line = line.replace("CLASE /", "       ")
            line = line.replace("DE CLASE A - CATEGORÍA I (Vehículos de la categoría M1, M2 y N1)", " " * 64)
            line = line.replace("BALOTARIO DE PREGUNTAS PARA LA EVALUACIÓN DE CONOCIMIENTOS EN LA CONDUCCIÓN PARA POSTULANTES A LICENCIAS DE CONDUCIR", " "*116)
            line = line.replace("LICENCIA DE CONDUCIR PARA CONDUCTORES NO PROFESIONALES", " "*54)
        cleaned_lines.append(line)
        
    questions = []
    current_q = None
    
    # We will use absolute column slices, but now they are clean of junk!
    # Desc: 50 to 125
    # A1: 125 to 160
    # A2: 160 to 195
    # A3: 195 to 225
    # A4: 225 to 250
    # Resp: 250 to end
    
    # Let's adjust slices to be safer
    # We can detect columns dynamically by looking at the first question line.
    
    for line in cleaned_lines:
        line_r = line.rstrip('\n')
        if not line_r.strip():
            continue
            
        match = re.match(r'^\s*(\d+)\s+', line_r)
        if match:
            if current_q:
                questions.append(current_q)
            q_num = int(match.group(1))
            current_q = {'id': q_num, 'desc': [], 'a1': [], 'a2': [], 'a3': [], 'a4': [], 'resp': []}
            
        if current_q:
            # Slices based on visual inspection of balotario_layout.txt
            # Let's use wide slices because we removed junk
            desc = line_r[45:120].strip()
            a1 = line_r[120:155].strip()
            a2 = line_r[155:185].strip()
            a3 = line_r[185:220].strip()
            a4 = line_r[220:250].strip()
            resp = line_r[250:].strip()
            
            if desc: current_q['desc'].append(desc)
            if a1: current_q['a1'].append(a1)
            if a2: current_q['a2'].append(a2)
            if a3: current_q['a3'].append(a3)
            if a4: current_q['a4'].append(a4)
            if resp: current_q['resp'].append(resp)

    if current_q:
        questions.append(current_q)
        
    formatted = []
    for q in questions:
        desc = " ".join(q['desc']).replace('- ', '')
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
        
        ans_idx = -1
        if 'a' in ans: ans_idx = 0
        elif 'b' in ans: ans_idx = 1
        elif 'c' in ans: ans_idx = 2
        elif 'd' in ans: ans_idx = 3
        
        options = [o1, o2, o3, o4]
        # Clean empty options
        options = [o for o in options if o]
        
        formatted.append({
            'id': q['id'],
            'question': desc,
            'options': options,
            'correctAnswer': ans_idx,
            'raw_answer': ans
        })
        
    with open('parsed_questions_clean.json', 'w', encoding='utf-8') as f:
        json.dump(formatted, f, ensure_ascii=False, indent=2)

parse()
