document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reactionForm');
    const resultDiv = document.getElementById('result');

    const reactionsData = {
        '酸化': 'A + O2 -> AO2',
        '還元': 'AO2 -> A + O2',
        '酸': 'HCl + NaOH -> NaCl + H2O',
        '塩基': 'NH3 + H2O -> NH4+ + OH-'
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const property = document.getElementById('propertySelect').value;
        const reaction = reactionsData[property] || '反応が見つかりませんでした。';
        resultDiv.innerHTML = `<p><strong>反応式:</strong> ${reaction}</p>`;
    });
});
