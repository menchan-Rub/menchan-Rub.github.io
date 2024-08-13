document.addEventListener('DOMContentLoaded', () => {
    let questions = [];
    let currentQuestion = 0;
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const submitButton = document.getElementById('submit-button');
    const resultDiv = document.getElementById('result');

    fetch('/static/quiz_data.json')
        .then(response => response.json())
        .then(data => {
            questions = data.sort(() => 0.5 - Math.random()).slice(0, 5);
            loadQuestion();
        });

    function loadQuestion() {
        const question = questions[currentQuestion];
        questionElement.textContent = question.question;
        optionsElement.innerHTML = ''; // 既存の選択肢をクリア

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            optionElement.value = index;
            optionsElement.appendChild(optionElement);
        });
    }

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedOption = optionsElement.value;
        checkAnswer(selectedOption);
    });

    function checkAnswer(selectedAnswer) {
        const question = questions[currentQuestion];
        if (selectedAnswer == question.correctAnswer) {
            alert('正解！');
        } else {
            alert('不正解...');
        }

        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        questionElement.textContent = 'クイズが終了しました！';
        optionsElement.style.display = 'none';
        submitButton.style.display = 'none';
        resultDiv.innerHTML = `<strong>あなたのスコア:</strong> ${currentQuestion} / ${questions.length}`;
    }
});
