import json

def generate_markdown():
    with open('parsed_questions_clean.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)

    md_content = "# Verificación de 200 Preguntas MTC A1\n\n"
    md_content += "A continuación se listan las 200 preguntas extraídas. Las respuestas correctas detectadas están sombreadas en **negrita** y con el símbolo `[CORRECTA]`.\n"
    md_content += "Por favor, revisa y confirma si las respuestas sombreadas son las correctas.\n\n"

    for q in questions:
        md_content += f"### Pregunta {q['id']}\n"
        md_content += f"**{q['question']}**\n\n"
        
        for idx, opt in enumerate(q['options']):
            if idx == q['correctAnswer']:
                md_content += f"- **{chr(97+idx)}) {opt} [CORRECTA]**\n"
            else:
                md_content += f"- {chr(97+idx)}) {opt}\n"
        
        md_content += "\n---\n"

    with open('verificacion_preguntas.md', 'w', encoding='utf-8') as f:
        f.write(md_content)

generate_markdown()
