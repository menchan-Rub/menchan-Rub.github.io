document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const resultDiv = document.getElementById('result');
    const searchableList = document.getElementById('searchableList');

    const elementData = {
        '水素': { name: '水素', formula: 'H2', molecular_weight: '2.016', iupac_name: 'Hydrogen' },
        '酸素': { name: '酸素', formula: 'O2', molecular_weight: '31.998', iupac_name: 'Oxygen' },
        '炭素': { name: '炭素', formula: 'C', molecular_weight: '12.011', iupac_name: 'Carbon' },
        '窒素': { name: '窒素', formula: 'N2', molecular_weight: '28.014', iupac_name: 'Nitrogen' },
        '塩素': { name: '塩素', formula: 'Cl2', molecular_weight: '70.906', iupac_name: 'Chlorine' },
        '鉄': { name: '鉄', formula: 'Fe', molecular_weight: '55.845', iupac_name: 'Iron' },
        '銅': { name: '銅', formula: 'Cu', molecular_weight: '63.546', iupac_name: 'Copper' },
        '金': { name: '金', formula: 'Au', molecular_weight: '196.967', iupac_name: 'Gold' },
        '銀': { name: '銀', formula: 'Ag', molecular_weight: '107.868', iupac_name: 'Silver' },
        '水': { name: '水', formula: 'H2O', molecular_weight: '18.015', iupac_name: 'Water' },
        '二酸化炭素': { name: '二酸化炭素', formula: 'CO2', molecular_weight: '44.009', iupac_name: 'Carbon dioxide' }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchInput = document.getElementById('searchInput').value;
        const data = elementData[searchInput];

        if (data) {
            resultDiv.innerHTML = `
                <h3>${data.name}</h3>
                <p><strong>分子式:</strong> ${data.formula}</p>
                <p><strong>分子量:</strong> ${data.molecular_weight}</p>
                <p><strong>IUPAC名:</strong> ${data.iupac_name}</p>
            `;
        } else {
            resultDiv.innerHTML = '<p class="error">物質情報が見つかりませんでした。</p>';
        }
    });
});
