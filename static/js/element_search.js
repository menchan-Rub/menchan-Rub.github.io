document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchInput = document.getElementById('searchInput').value;

        fetch('/element_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ search_term: searchInput })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
            } else {
                resultDiv.innerHTML = `
                    <h3>${data.name}</h3>
                    <p><strong>分子式:</strong> ${data.formula}</p>
                    <p><strong>分子量:</strong> ${data.molecular_weight}</p>
                    <p><strong>IUPAC名:</strong> ${data.iupac_name}</p>
                `;
            }
        })
        .catch(error => {
            resultDiv.innerHTML = `<p class="error">エラーが発生しました: ${error.message}</p>`;
        });
    });
});
