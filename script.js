const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const lengthVal = document.getElementById('length-val');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const baseWordEl = document.getElementById('baseword');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthMeter = document.getElementById('strength-meter');

// Diccionario Leet filtrado solo con tus símbolos permitidos
const leetMap = {
    'a': ['4', '@'], 'e': ['3'], 'i': ['1'], 'o': ['0'],
    's': ['5', '$'], 't': ['7'], 'b': ['8'], 'g': ['9']
};

lengthEl.addEventListener('input', () => {
    lengthVal.innerText = lengthEl.value;
    generatePassword(); // Genera automáticamente al mover el slider
});

generateBtn.addEventListener('click', generatePassword);

function generatePassword() {
    const length = +lengthEl.value;
    const hasUpper = uppercaseEl.checked;
    const hasLower = lowercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;
    const baseWord = baseWordEl.value.trim();

    if (!(hasUpper || hasLower || hasNumber || hasSymbol)) {
        resultEl.value = '';
        updateStrength(0, false, false, false);
        return;
    }

    let password = '';

    if (baseWord) {
        password = transformToLeet(baseWord, hasUpper, hasNumber, hasSymbol);
    }

    while (password.length < length) {
        password += getRandomChar(hasUpper, hasLower, hasNumber, hasSymbol);
    }

    // Mezclamos un poco para que no siempre empiece con la palabra base
    if (!baseWord) {
        password = password.split('').sort(() => 0.5 - Math.random()).join('');
    }

    resultEl.value = password.slice(0, length);
    updateStrength(length, hasUpper, hasNumber, hasSymbol);
}

function transformToLeet(word, upper, num, sym) {
    return word.split('').map(char => {
        const lowerChar = char.toLowerCase();
        if (leetMap[lowerChar] && Math.random() > 0.3) {
            // Filtrar opciones según lo que el usuario activó
            const options = leetMap[lowerChar].filter(c =>
                (num && /\d/.test(c)) || (sym && /[@#$%]/.test(c))
            );
            return options.length > 0 ? options[Math.floor(Math.random() * options.length)] : char;
        }
        return upper && Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
    }).join('');
}

function getRandomChar(upper, lower, num, sym) {
    let charset = "";
    if (upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (num) charset += "0123456789";
    if (sym) charset += "@#$%"; // Solo tus símbolos permitidos

    return charset.charAt(Math.floor(Math.random() * charset.length));
}

function updateStrength(len, u, n, s) {
    // Calculamos el porcentaje de la barra
    let percentage = (len / 50) * 100;
    strengthMeter.style.width = `${percentage}%`;

    // Lógica de colores solicitada
    if (len >= 14 && (u || n || s)) {
        // Verde si tiene 14+ caracteres
        strengthMeter.style.background = '#10b981';
        strengthMeter.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.4)';
    } else if (len >= 10) {
        // Ámbar para seguridad media
        strengthMeter.style.background = '#f59e0b';
        strengthMeter.style.boxShadow = 'none';
    } else {
        // Rojo para contraseñas cortas
        strengthMeter.style.background = '#ef4444';
        strengthMeter.style.boxShadow = 'none';
    }
}

copyBtn.addEventListener('click', () => {
    if (!resultEl.value) return;
    navigator.clipboard.writeText(resultEl.value);

    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = '✔';
    copyBtn.style.background = '#10b981';

    setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
        copyBtn.style.background = '#6366f1';
    }, 1500);
});

// Generar una clave al cargar la página
window.onload = generatePassword;