document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('balanceForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const reactionInput = document.getElementById('reactionInput').value;

        fetch('/balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reaction: reactionInput })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resultDiv.innerHTML = `<strong>バランスの取れた反応式:</strong> ${data.balanced_equation}`;
            } else {
                resultDiv.innerHTML = `<strong>エラー:</strong> ${data.error}`;
            }
        })
        .catch(error => {
            resultDiv.innerHTML = `<strong>エラー:</strong> ${error.message}`;
        });
    });
});
