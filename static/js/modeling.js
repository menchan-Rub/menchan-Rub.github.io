document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('modelForm');
    const canvas = document.getElementById('moleculeCanvas');
    const ctx = canvas.getContext('2d');
    const resultDiv = document.getElementById('modelData');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const compoundInput = document.getElementById('compoundInput').value;

        fetch('/modeling', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ compound: compoundInput })
        })
        .then(response => response.json())
        .then(data => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (data.model && data.model.length > 0) {
                data.model.forEach(atom => {
                    ctx.beginPath();
                    ctx.arc(atom.x, atom.y, 20, 0, Math.PI * 2, true);
                    ctx.fillStyle = atom.element === 'O' ? '#FF0000' : '#0000FF';
                    ctx.fill();
                    ctx.closePath();

                    ctx.fillStyle = '#000';
                    ctx.font = '16px Arial';
                    ctx.fillText(atom.element, atom.x - 5, atom.y + 5);
                });
                resultDiv.innerText = `${compoundInput}の分子モデルを生成しました。`;
            } else {
                resultDiv.innerText = '指定された化合物は見つかりませんでした。';
            }
        })
        .catch(error => {
            resultDiv.innerText = `エラー: ${error.message}`;
        });
    });
});
