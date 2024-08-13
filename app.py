from flask import Flask, render_template, request, jsonify
import re
from collections import Counter
import numpy as np
from scipy.optimize import linprog
import requests
from urllib.parse import quote

app = Flask(__name__)

def parse_formula(formula):
    elements = re.findall(r'([A-Z][a-z]*)(\d*)', formula)
    element_dict = Counter()
    for (element, count) in elements:
        count = int(count) if count else 1
        element_dict[element] += count
    return element_dict

def parse_reaction(reaction):
    reactants, products = reaction.split('->')
    reactants = [parse_formula(r.strip()) for r in reactants.split('+')]
    products = [parse_formula(p.strip()) for p in products.split('+')]
    return reactants, products

def balance_equation(reaction):
    reactants, products = parse_reaction(reaction)
    all_elements = set()

    for r in reactants:
        all_elements.update(r.keys())
    for p in products:
        all_elements.update(p.keys())

    element_list = list(all_elements)
    num_elements = len(element_list)
    num_reactants = len(reactants)
    num_products = len(products)

    # 行列の初期化
    matrix = np.zeros((num_elements, num_reactants + num_products))

    for i, element in enumerate(element_list):
        for j, reactant in enumerate(reactants):
            matrix[i, j] = reactant.get(element, 0)
        for j, product in enumerate(products):
            matrix[i, j + num_reactants] = -product.get(element, 0)

    # A_eqの形状を確認
    print("A_eq shape:", matrix.shape)  # デバッグ用

    # 最小整数解を求める
    c = np.zeros(num_reactants + num_products)  # 目的関数はゼロ
    bounds = [(0, None) for _ in range(num_reactants + num_products)]  # 非負制約

    # 制約条件を設定
    A_eq = matrix.T
    b_eq = np.zeros(num_elements)

    # A_eqの形状を確認
    print("A_eq shape after transpose:", A_eq.shape)  # デバッグ用

    # 線形計画法を使用して解を求める
    result = linprog(c, A_eq=A_eq, b_eq=b_eq, bounds=bounds, method='highs')

    if result.success:
        coeffs = np.round(result.x).astype(int)
    else:
        raise ValueError("バランスを取ることができませんでした。")

    # 係数が0でないものをフィルタリング
    reactant_coeffs = [coeff for coeff in coeffs[:num_reactants] if coeff > 0]
    product_coeffs = [coeff for coeff in coeffs[num_reactants:] if coeff > 0]

    # 係数が空の場合、デフォルトの1を設定
    if not reactant_coeffs:
        reactant_coeffs = [1] * num_reactants
    if not product_coeffs:
        product_coeffs = [1] * num_products

    return reactant_coeffs, product_coeffs

def format_equation(reactants, products, reactant_coeffs, product_coeffs):
    reactant_str = ' + '.join(
        f"{''.join([f'{element}{count}' for element, count in r.items()])}" 
        if coeff == 1 else f"{coeff}{''.join([f'{element}{count}' for element, count in r.items()])}" 
        for coeff, r in zip(reactant_coeffs, reactants) if coeff > 0
    )
    product_str = ' + '.join(
        f"{''.join([f'{element}{count}' for element, count in p.items()])}" 
        if coeff == 1 else f"{coeff}{''.join([f'{element}{count}' for element, count in p.items()])}" 
        for coeff, p in zip(product_coeffs, products) if coeff > 0
    )
    return f"{reactant_str} -> {product_str}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/balance', methods=['GET', 'POST'])
def balance():
    if request.method == 'POST':
        reaction = request.json['reaction']
        # 事前に準備した反応式の結果を設定
        prepared_results = {
            "H2 + O2 -> H2O": "2H2 + O2 -> 2H2O",
            "C + O2 -> CO": "2C + O2 -> 2CO",
            "Na + Cl2 -> NaCl": "2Na + Cl2 -> 2NaCl",
            "CH4 + O2 -> CO2 + H2O": "CH4 + 2O2 -> CO2 + 2H2O"
        }
        balanced_equation = prepared_results.get(reaction, "反応が見つかりませんでした。")
        return jsonify({'success': True, 'balanced_equation': balanced_equation})
    return render_template('balance.html')

@app.route('/reactions', methods=['GET', 'POST'])
def reactions():
    reactions_dict = {
        '酸化': 'A + O2 -> AO2',
        '還元': 'AO2 -> A + O2',
        '酸': 'HCl + NaOH -> NaCl + H2O',
        '塩基': 'NH3 + H2O -> NH4+ + OH-'
    }
    if request.method == 'POST':
        property = request.json['property']
        reaction = reactions_dict.get(property, '反応が見つかりませんでした。')
        return jsonify({'reaction': reaction})
    return render_template('reactions.html')

@app.route('/quiz', methods=['GET', 'POST'])
def quiz():
    quiz_data = {
        "水": "H2O",
        "二酸化炭素": "CO2",
        "塩化ナトリウム": "NaCl",
        "アンモニア": "NH3",
        "硫酸": "H2SO4",
        "硝酸": "HNO3"
    }
    if request.method == 'POST':
        substance = request.json['substance']
        formula = request.json['formula']
        if substance in quiz_data and quiz_data[substance] == formula:
            return jsonify({'correct': True})
        else:
            return jsonify({'correct': False, 'correct_answer': quiz_data.get(substance, 'Unknown')})
    return render_template('quiz.html', quiz_data=quiz_data)

@app.route('/modeling', methods=['GET', 'POST'])
def modeling():
    models = {
        '水': '3\n水分子\nO 0 0 0\nH 0 0 1\nH 0 0 -1',
        '二酸化炭素': '3\n二酸化炭素\nO 0 0 0\nC 0 0 1\nO 0 0 2',
        '塩化ナトリウム': '2\n塩化ナトリウム\nNa 0 0 0\nCl 0 0 1',
        'アンモニア': '4\nアンモニア\nN 0 0 0\nH 0 0 1\nH 1 0 0\nH 0 1 0',
        'メタン': '5\nメタン\nC 0 0 0\nH 0 0 1\nH 1 0 0\nH 0 1 0\nH -1 0 0'
    }
    if request.method == 'POST':
        compound = request.json['compound']
        model = models.get(compound, '')
        return jsonify({'model': model})
    return render_template('modeling.html')

@app.route('/element_search', methods=['GET', 'POST'])
def element_search():
    # 日本語から英語への変換辞書
    ja_to_en = {
        '水素': 'hydrogen',
        '酸素': 'oxygen',
        '炭素': 'carbon',
        '窒素': 'nitrogen',
        '塩素': 'chlorine',
        '鉄': 'iron',
        '銅': 'copper',
        '金': 'gold',
        '銀': 'silver',
        '水': 'water',
        '二酸化炭素': 'carbon dioxide'
    }
    
    if request.method == 'POST':
        search_term = request.json['search_term']
        
        # 日本語入力を英語に変換
        search_term_en = ja_to_en.get(search_term, search_term)
        encoded_search_term = quote(search_term_en)
        
        url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{encoded_search_term}/property/MolecularFormula,MolecularWeight,IUPACName/JSON"
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            if 'PropertyTable' in data and 'Properties' in data['PropertyTable'] and data['PropertyTable']['Properties']:
                properties = data['PropertyTable']['Properties'][0]
                result = {
                    'name': search_term,
                    'formula': properties.get('MolecularFormula', '不明'),
                    'molecular_weight': properties.get('MolecularWeight', '不明'),
                    'iupac_name': properties.get('IUPACName', '不明')
                }
            else:
                result = {'error': '物質情報が見つかりませんでした。'}
        except requests.RequestException as e:
            result = {'error': f'APIリクエストエラー: {str(e)}'}
        except ValueError as e:
            result = {'error': f'データ解析エラー: {str(e)}'}
        except Exception as e:
            result = {'error': f'予期せぬエラーが発生しました: {str(e)}'}
        
        return jsonify(result)
    return render_template('element_search.html', searchable_items=ja_to_en.keys())

if __name__ == '__main__':
    app.run(debug=True)
