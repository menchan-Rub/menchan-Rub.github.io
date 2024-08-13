document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quizForm');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const resultDiv = document.getElementById('result');

    const quizData = {
        "水": "H2O",
        "二酸化炭素": "CO2",
        "塩化ナトリウム": "NaCl",
        "アンモニア": "NH3",
        "硫酸": "H2SO4",
        "硝酸": "HNO3"
    };

    let currentQuestion;

    function loadQuestion() {
        const substances = Object.keys(quizData);
        currentQuestion = substances[Math.floor(Math.random() * substances.length)];
        questionElement.textContent = `${currentQuestion}の化学式は？`;

        optionsElement.innerHTML = '';
        const correctAnswer = quizData[currentQuestion];
        const options = [correctAnswer];

        while (options.length < 4) {
            const randomSubstance = substances[Math.floor(Math.random() * substances.length)];
            const randomFormula = quizData[randomSubstance];
            if (!options.includes(randomFormula)) {
                options.push(randomFormula);
            }
        }

        options.sort(() => Math.random() - 0.5);

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            optionsElement.appendChild(optionElement);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedAnswer = optionsElement.value;
        const correctAnswer = quizData[currentQuestion];

        if (selectedAnswer === correctAnswer) {
            resultDiv.innerHTML = '<p style="color: green;">正解です！</p>';
        } else {
            resultDiv.innerHTML = `<p style="color: red;">不正解です。正解は ${correctAnswer} です。</p>`;
        }

        setTimeout(loadQuestion, 2000);
    });

    loadQuestion();
});
