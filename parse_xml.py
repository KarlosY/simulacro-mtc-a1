import xml.etree.ElementTree as ET
import json
import re

def parse_pdf_xml():
    tree = ET.parse('balotario.xml')
    root = tree.getroot()
    
    questions = []
    current_q = None
    
    for page in root.findall('page'):
        images = []
        for img in page.findall('image'):
            top = int(img.attrib.get('top', 0))
            height = int(img.attrib.get('height', 0))
            src = img.attrib.get('src', '')
            center = top + (height / 2)
            images.append({'top': top, 'center': center, 'src': src})
            
        page_questions = []
            
        for text_elem in page.findall('text'):
            if text_elem.text is None:
                content = "".join(text_elem.itertext()).strip()
            else:
                content = "".join(text_elem.itertext()).strip()
                
            if not content:
                continue
                
            font = text_elem.attrib.get('font', '')
            if font not in ['5']:
                continue
                
            left = int(text_elem.attrib.get('left', 0))
            top = int(text_elem.attrib.get('top', 0))
            
            if left < 80 and re.match(r'^\d+$', content):
                if current_q:
                    page_questions.append(current_q)
                current_q = {
                    'id': int(content),
                    'top': top,
                    'desc': [],
                    'a1': [],
                    'a2': [],
                    'a3': [],
                    'a4': [],
                    'resp': [],
                    'image': None
                }
                continue
                
            if current_q:
                if 300 <= left < 630:
                    current_q['desc'].append(content)
                elif 630 <= left < 760:
                    current_q['a1'].append(content)
                elif 760 <= left < 890:
                    current_q['a2'].append(content)
                elif 890 <= left < 1020:
                    current_q['a3'].append(content)
                elif 1020 <= left < 1140:
                    current_q['a4'].append(content)
                elif left >= 1140:
                    current_q['resp'].append(content)

        if current_q:
            page_questions.append(current_q)
            current_q = None

        # Assign images to questions on this page based on closest Y center
        for img in images:
            # Ignore header images
            if img['top'] < 100:
                continue
                
            if not page_questions:
                continue
                
            # Find the question with the closest 'top' to the image's center
            closest_q = min(page_questions, key=lambda q: abs(q['top'] - img['center']))
            closest_q['image'] = img['src']
            
        questions.extend(page_questions)
        
    formatted = []
    
    def clean_opt(opt):
        opt = re.sub(r'\s+', ' ', opt).strip()
        opt = re.sub(r'^[a-d]\)\s*', '', opt, flags=re.IGNORECASE)
        return opt

    for q in questions:
        desc = " ".join(q['desc']).replace('- ', '')
        desc = re.sub(r'\s+', ' ', desc).strip()
        
        o1 = clean_opt(" ".join(q['a1']))
        o2 = clean_opt(" ".join(q['a2']))
        o3 = clean_opt(" ".join(q['a3']))
        o4 = clean_opt(" ".join(q['a4']))
        
        ans = "".join(q['resp']).strip().lower()
        
        ans_idx = -1
        if 'a' in ans: ans_idx = 0
        elif 'b' in ans: ans_idx = 1
        elif 'c' in ans: ans_idx = 2
        elif 'd' in ans: ans_idx = 3
        
        formatted.append({
            'id': q['id'],
            'question': desc,
            'options': [o1, o2, o3, o4],
            'correctAnswer': ans_idx,
            'raw_answer': ans,
            'imageUrl': f"/images/{q['image']}" if q.get('image') else None
        })
        
    with open('src/data/questions.json', 'w', encoding='utf-8') as f:
        json.dump(formatted, f, ensure_ascii=False, indent=2)
        
    print(f"Parsed {len(formatted)} questions successfully.")

parse_pdf_xml()
