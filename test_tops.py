import json
import xml.etree.ElementTree as ET
import re

tree = ET.parse('balotario.xml')
root = tree.getroot()

for page in root.findall('page'):
    for text_elem in page.findall('text'):
        if text_elem.text is None:
            content = "".join(text_elem.itertext()).strip()
        else:
            content = "".join(text_elem.itertext()).strip()
        
        left = int(text_elem.attrib.get('left', 0))
        top = int(text_elem.attrib.get('top', 0))
        font = text_elem.attrib.get('font', '')
        
        if left < 80 and re.match(r'^\d+$', content) and font == '5':
            print(f"Q{content} top={top} page={page.attrib.get('number')}")
