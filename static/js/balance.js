document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('balanceForm');
    const resultDiv = document.getElementById('result');
    const balancedEquationDiv = document.getElementById('balancedEquation');
    const balancedResult = document.getElementById('balancedResult');

    const balanceData = {
        "H2 + O2 -> H2O": "2H2 + O2 -> 2H2O",
        "C + O2 -> CO": "2C + O2 -> 2CO",
        "Na + Cl2 -> NaCl": "2Na + Cl2 -> 2NaCl",
        "CH4 + O2 -> CO2 + H2O": "CH4 + 2O2 -> CO2 + 2H2O"
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const reactionInput = document.getElementById('reactionSelect').value;

        const balancedEquation = balanceData[reactionInput];
        if (balancedEquation) {
            resultDiv.innerHTML = '';
            balancedEquationDiv.style.display = 'block';
            balancedResult.innerText = balancedEquation;
        } else {
            resultDiv.innerHTML = '<strong>エラー:</strong> バランスの取れた方程式が見つかりませんでした。';
            balancedEquationDiv.style.display = 'none';
        }
    });
});
