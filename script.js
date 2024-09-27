let zipData = null;
let orientation = 'portrait';

document.getElementById('orientation').addEventListener('change', (event) => {
    orientation = event.target.value;
});

// ZIPファイルと模範解答のアップロード処理
function uploadFiles() {
    const keyFile = document.getElementById('keyFile').files[0];
    const zipFile = document.getElementById('zipFile').files[0];

    if (keyFile && zipFile) {
        const zipReader = new FileReader();
        zipReader.onload = function (event) {
            JSZip.loadAsync(event.target.result).then(function (zip) {
                zipData = zip;
                document.getElementById('result').textContent = 'ZIPファイルが読み込まれました。採点を行います。';
                gradeTest();
            });
        };
        zipReader.readAsArrayBuffer(zipFile);
    }
}

// 選択問題の自動採点ロジック
function gradeTest() {
    const keyFile = document.getElementById('keyFile').files[0];

    // 模範解答を読み込んで採点を実行
    const reader = new FileReader();
    reader.onload = function (event) {
        const keys = event.target.result.split('\n').map(line => line.trim());

        // ZIPファイル内の答案を処理
        zipData.forEach((relativePath, file) => {
            if (!file.dir) {
                file.async('text').then(function (content) {
                    const answers = content.split('\n').map(line => line.trim());
                    let score = 0;

                    // 選択問題の自動採点
                    answers.forEach((answer, index) => {
                        if (answer === keys[index]) {
                            score++;
                        }
                    });

                    // 採点結果の表示
                    document.getElementById('result').textContent += `\nファイル: ${relativePath}, スコア: ${score}/${keys.length}`;
                });
            }
        });

        document.getElementById('downloadGraded').style.display = 'block';
    };

    reader.readAsText(keyFile);
}

// 採点結果をPDFでダウンロード
function downloadGradedPDF() {
    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(20, 20, '採点結果:');

    doc.save('採点結果.pdf');
}
