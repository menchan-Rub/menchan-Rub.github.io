document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quizForm');
    const resultDiv = document.getElementById('result');
    const nextButton = document.getElementById('nextButton');
    const addQuestionButton = document.getElementById('addQuestionButton');
    
    let questions = JSON.parse('{{ quiz_data | tojson | safe }}');
    let currentQuestionIndex = 0;
    let score = 0;

    function displayNextQuestion() {
        const questionKeys = Object.keys(questions);
        if (currentQuestionIndex < questionKeys.length) {
            const substance = questionKeys[currentQuestionIndex];
            document.getElementById('substanceInput').value = substance;
            document.getElementById('formulaInput').value = '';
            resultDiv.innerText = '';
        } else {
            resultDiv.innerHTML = `クイズが終了しました。スコア: ${score}/${questionKeys.length}`;
            nextButton.style.display = 'none';
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const substanceInput = document.getElementById('substanceInput').value;
        const formulaInput = document.getElementById('formulaInput').value;

        fetch('/quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ substance: substanceInput, formula: formulaInput })
        })
        .then(response => response.json())
        .then(data => {
            if (data.correct) {
                score++;
                resultDiv.innerHTML = '<strong>正解！</strong>';
            } else {
                resultDiv.innerHTML = `<strong>不正解。</strong> 正しい答えは ${data.correct_answer} です。`;
            }
            nextButton.style.display = 'block';
        })
        .catch(error => {
            resultDiv.innerHTML = `<strong>エラー:</strong> ${error.message}`;
        });
    });

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        displayNextQuestion();
    });

    addQuestionButton.addEventListener('click', () => {
        const newSubstance = prompt('新しい物質名を入力してください:');
        const newFormula = prompt('その物質の化学式を入力してください:');
        if (newSubstance && newFormula) {
            questions[newSubstance] = newFormula;
            alert('新しい質問が追加されました。');
        }
    });

    displayNextQuestion();
});
