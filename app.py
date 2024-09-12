import os
import zipfile
from flask import Flask, request, send_file, render_template, redirect, url_for
from fpdf import FPDF
import pytesseract
from pdf2image import convert_from_path
import matplotlib.pyplot as plt

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'

# フォルダの作成
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# Tesseractのインストールパスを指定（必要に応じて変更）
pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'

def extract_text_from_pdf(pdf_path):
    """PDFから画像を抽出し、OCRでテキストを読み取る"""
    pages = convert_from_path(pdf_path)
    text = ""
    for page in pages:
        text += pytesseract.image_to_string(page, lang='jpn')  # 日本語OCR
    return text

def grade_answers(answer_text, correct_answers):
    """OCRで取得したテキストを基に採点する"""
    score = 0
    total_questions = len(correct_answers)
    for i, correct_answer in enumerate(correct_answers):
        if correct_answer in answer_text:
            score += 1
    return score, total_questions

def create_scoring_pdf(score, total, output_path):
    """採点結果のPDFを作成する"""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, f'Scoring Results', 0, 1)
    pdf.cell(0, 10, f'Score: {score} out of {total}', 0, 1)
    pdf.output(output_path)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'files' not in request.files:
            return redirect(request.url)
        
        files = request.files.getlist('files')
        
        # 解答データの設定（例）
        correct_answers = ["解答1", "解答2", "解答3"]  # 必要に応じて修正
        
        total_score = 0
        total_questions = 0
        
        for file in files:
            if file.filename.endswith('.pdf'):
                filepath = os.path.join(UPLOAD_FOLDER, file.filename)
                file.save(filepath)
                answer_text = extract_text_from_pdf(filepath)
                score, questions = grade_answers(answer_text, correct_answers)
                total_score += score
                total_questions += questions
        
        # 結果PDFの生成
        result_pdf_path = os.path.join(RESULT_FOLDER, 'scoring_result.pdf')
        create_scoring_pdf(total_score, total_questions, result_pdf_path)
        
        return send_file(result_pdf_path, as_attachment=True)
    
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
