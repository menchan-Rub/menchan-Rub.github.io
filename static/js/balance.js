document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('balanceForm');
    const resultDiv = document.getElementById('result');
    const balancedEquationDiv = document.getElementById('balancedEquation');
    const balancedResult = document.getElementById('balancedResult');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const reactionInput = document.getElementById('reactionSelect').value; // Changed this line

        fetch('/balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reaction: reactionInput })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                resultDiv.innerHTML = '';
                balancedEquationDiv.style.display = 'block';
                balancedResult.innerText = data.balanced_equation;
            } else {
                resultDiv.innerHTML = `<strong>エラー:</strong> ${data.error}`;
                balancedEquationDiv.style.display = 'none';
            }
        })
        .catch(error => {
            resultDiv.innerHTML = `<strong>エラー:</strong> ${error.message}`;
            balancedEquationDiv.style.display = 'none';
        });
    });
});
