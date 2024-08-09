document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reactionForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const propertyInput = document.getElementById('propertyInput').value;

        fetch('/reactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ property: propertyInput })
        })
        .then(response => response.json())
        .then(data => {
            resultDiv.innerHTML = `<strong>反応:</strong> ${data.reaction}`;
        })
        .catch(error => {
            resultDiv.innerHTML = `<strong>エラー:</strong> ${error.message}`;
        });
    });
});
