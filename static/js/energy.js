document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('energyForm');
    const energyImage = document.getElementById('energyImage');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const reactantsEnergy = document.getElementById('reactantsEnergyInput').value;
        const productsEnergy = document.getElementById('productsEnergyInput').value;

        fetch('/energy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reactants_energy: reactantsEnergy, products_energy: productsEnergy })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                energyImage.src = data.image_path;
                energyImage.style.display = 'block';
                resultDiv.innerHTML = `<strong>エネルギー変化グラフを生成しました。</strong>`;
            } else {
                resultDiv.innerHTML = `<strong>エラー:</strong> ${data.error}`;
            }
        })
        .catch(error => {
            resultDiv.innerHTML = `<strong>エラー:</strong> ${error.message}`;
        });
    });
});
