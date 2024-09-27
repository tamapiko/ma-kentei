function gradeTest() {
    const name = document.getElementById('name').value;
    const answers = [
        document.getElementById('answer1').value,
        document.getElementById('answer2').value,
        document.getElementById('answer3').value
    ];
    const keys = [
        document.getElementById('key1').value,
        document.getElementById('key2').value,
        document.getElementById('key3').value
    ];
    const points = parseInt(document.getElementById('points').value);
    
    let score = 0;
    let results = [];
    
    answers.forEach((answer, index) => {
        if (answer.toLowerCase() === keys[index].toLowerCase()) {
            score += points;
            results.push('〇');
        } else {
            results.push('×');
        }
    });

    document.getElementById('result').textContent = `氏名: ${name}, スコア: ${score}点`;
    
    document.getElementById('downloadGraded').style.display = 'block';
    document.getElementById('downloadAnalysis').style.display = 'block';
}

function downloadGradedPDF() {
    const name = document.getElementById('name').value;
    const answers = [
        document.getElementById('answer1').value,
        document.getElementById('answer2').value,
        document.getElementById('answer3').value
    ];
    const keys = [
        document.getElementById('key1').value,
        document.getElementById('key2').value,
        document.getElementById('key3').value
    ];
    
    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(20, 20, `氏名: ${name}`);

    answers.forEach((answer, index) => {
        doc.text(20, 40 + (index * 10), `問題 ${index + 1}: ${answer} - 模範解答: ${keys[index]}`);
    });

    doc.save('採点済み答案.pdf');
}

function downloadAnalysisPDF() {
    const name = document.getElementById('name').value;
    const score = document.getElementById('result').textContent;

    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(20, 20, `氏名: ${name}`);
    doc.text(20, 30, `分析結果:`);
    doc.text(20, 40, score);

    doc.save('分析結果.pdf');
}
