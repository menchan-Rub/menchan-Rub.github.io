from flask import Flask, render_template, request, jsonify
import numpy as np
import re
import matplotlib.pyplot as plt
import os

app = Flask(__name__)

def parse_formula(formula):
    """
    化学式を解析し、元素とその数を辞書として返します。
    """
    elements = re.findall(r'([A-Z][a-z]*)(\d*)', formula)
    element_dict = {}
    for (element, count) in elements:
        count = int(count) if count else 1
        element_dict[element] = element_dict.get(element, 0) + count
    return element_dict

def parse_reaction(reaction):
    """
    化学反応式を反応物と生成物に分割し、元素と係数を計算します。
    """
    reactants, products = reaction.split('->')
    reactants = [parse_formula(r.strip()) for r in reactants.split('+')]
    products = [parse_formula(p.strip()) for p in products.split('+')]
    return reactants, products

def balance_equation(reaction):
    """
    化学反応式のバランスを取ります。
    """
    reactants, products = parse_reaction(reaction)
    elements = sorted(set(sum([list(r.keys()) for r in reactants + products], [])))

    num_reactants = len(reactants)
    num_products = len(products)
    num_elements = len(elements)

    matrix = np.zeros((num_elements, num_reactants + num_products))

    for i, element in enumerate(elements):
        for j, reactant in enumerate(reactants):
            if element in reactant:
                matrix[i, j] = reactant[element]
        for j, product in enumerate(products):
            if element in product:
                matrix[i, j + num_reactants] = -product[element]

    solution, _, _, _ = np.linalg.lstsq(matrix, np.zeros(num_elements), rcond=None)
    lcm = np.lcm.reduce([np.abs(int(round(coeff))) for coeff in solution if coeff != 0])
    solution *= lcm
    solution = np.round(solution).astype(int)

    return solution[:num_reactants], solution[num_reactants:]

def format_equation(reactants, products, reactant_coeffs, product_coeffs):
    """
    係数を用いて反応式をフォーマットします。
    """
    reactant_str = ' + '.join(f"{reactant_coeffs[i]}{r}" for i, r in enumerate(reactants))
    product_str = ' + '.join(f"{product_coeffs[i]}{p}" for i, p in enumerate(products))
    return f"{reactant_str} -> {product_str}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/balance', methods=['GET', 'POST'])
def balance():
    if request.method == 'POST':
        reaction = request.json['reaction']
        reactants, products = reaction.split('->')
        reactants = [r.strip() for r in reactants.split('+')]
        products = [p.strip() for p in products.split('+')]
        try:
            reactant_coeffs, product_coeffs = balance_equation(reaction)
            balanced_equation = format_equation(reactants, products, reactant_coeffs, product_coeffs)
            return jsonify({'success': True, 'balanced_equation': balanced_equation})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
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
        '水': [
            {'element': 'H', 'x': 50, 'y': 200},
            {'element': 'O', 'x': 200, 'y': 200},
            {'element': 'H', 'x': 350, 'y': 200}
        ],
        '二酸化炭素': [
            {'element': 'O', 'x': 50, 'y': 200},
            {'element': 'C', 'x': 200, 'y': 200},
            {'element': 'O', 'x': 350, 'y': 200}
        ]
    }
    if request.method == 'POST':
        compound = request.json['compound']
        model = models.get(compound, [])
        return jsonify({'model': model})
    return render_template('modeling.html')

@app.route('/energy', methods=['GET', 'POST'])
def energy():
    if request.method == 'POST':
        try:
            reactants_energy = float(request.json['reactants_energy'])
            products_energy = float(request.json['products_energy'])
            filename = f'static/images/energy_change_{reactants_energy}_{products_energy}.png'

            plt.figure()
            plt.plot([0, 1], [reactants_energy, products_energy], marker='o', color='red')
            plt.xticks([0, 1], ['Reactants', 'Products'])
            plt.ylabel('Energy (kJ/mol)')
            plt.title('Energy Change in Reaction')
            plt.savefig(filename)
            plt.close()

            return jsonify({'success': True, 'image_path': filename})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    return render_template('energy.html')

if __name__ == '__main__':
    app.run(debug=True)
