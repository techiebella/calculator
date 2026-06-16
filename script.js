// ======================
// ELEMENTS
// ======================

const display = document.getElementById("display");

const buttons = document.querySelectorAll(
    ".buttons button, .scientific-buttons button"
);

const historyList =
    document.getElementById("historyList");

const clearHistoryBtn =
    document.getElementById("clearHistory");

const themeToggle =
    document.getElementById("themeToggle");

const scientificToggle =
    document.getElementById("scientificToggle");

const scientificButtons =
    document.getElementById("scientificButtons");

// ======================
// FACTORIAL
// ======================

function factorial(n) {

    n = Number(n);

    if (n < 0 || !Number.isInteger(n)) {
        return "Error";
    }

    let result = 1;

    for (let i = 2; i <= n; i++) {
        result *= i;
    }

    return result;
}

// ======================
// CALCULATE
// ======================

function calculate() {

    try {

        const originalExpression =
            display.value;

        let expression =
            originalExpression
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/π/g, Math.PI)
                .replace(/√\(/g, "Math.sqrt(")
                .replace(/sin\(/g, "Math.sin(Math.PI/180*")
                .replace(/cos\(/g, "Math.cos(Math.PI/180*")
                .replace(/tan\(/g, "Math.tan(Math.PI/180*");

        const result = Function(
            `"use strict"; return (${expression})`
        )();

        addToHistory(
            originalExpression,
            result
        );

        display.value = result;

    } catch {

        display.value = "Error";

    }
}

// ======================
// HISTORY
// ======================

function addToHistory(
    expression,
    result
) {

    if (!historyList) return;

    const li =
        document.createElement("li");

    li.textContent =
        `${expression} = ${result}`;

    historyList.prepend(li);

    saveHistory();
}

function saveHistory() {

    if (!historyList) return;

    localStorage.setItem(
        "calculatorHistory",
        historyList.innerHTML
    );
}

function loadHistory() {

    if (!historyList) return;

    const savedHistory =
        localStorage.getItem(
            "calculatorHistory"
        );

    if (savedHistory) {
        historyList.innerHTML =
            savedHistory;
    }
}

clearHistoryBtn?.addEventListener(
    "click",
    () => {

        historyList.innerHTML = "";

        localStorage.removeItem(
            "calculatorHistory"
        );

    }
);

// ======================
// THEME
// ======================

function loadTheme() {

    const theme =
        localStorage.getItem("theme");

    if (theme === "light") {

        document.body.classList.add(
            "light"
        );

        themeToggle.textContent =
            "☀️";
    }
}

themeToggle?.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );

        const isLight =
            document.body.classList.contains(
                "light"
            );

        themeToggle.textContent =
            isLight
                ? "☀️"
                : "🌙";

        localStorage.setItem(
            "theme",
            isLight
                ? "light"
                : "dark"
        );

    }
);

// ======================
// SCIENTIFIC MODE
// ======================

scientificToggle?.addEventListener(
    "click",
    () => {

        scientificButtons.classList.toggle(
            "active"
        );

    }
);

// ======================
// BUTTON CLICKS
// ======================

buttons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const value =
                button.textContent.trim();

            if (
                display.value === "Error" &&
                value !== "="
            ) {
                display.value = "";
            }

            switch (value) {

                case "C":
                    display.value = "";
                    break;

                case "⌫":
                    display.value =
                        display.value.slice(
                            0,
                            -1
                        );
                    break;

                case "=":
                    calculate();
                    break;

                case "(":
                    display.value += "(";
                    break;

                case ")":
                    display.value += ")";
                    break;

                case "sin":
                    display.value += "sin(";
                    break;

                case "cos":
                    display.value += "cos(";
                    break;

                case "tan":
                    display.value += "tan(";
                    break;

                case "π":
                    display.value += "π";
                    break;

                case "√":
                    display.value += "√(";
                    break;

                case "x²":
                    display.value += "**2";
                    break;

                case "xʸ":
                    display.value += "**";
                    break;

                case "!":
                    display.value =
                        factorial(
                            display.value
                        );
                    break;

                default:
                    display.value += value;

            }

        }
    );

});

// ======================
// KEYBOARD SUPPORT
// ======================

document.addEventListener(
    "keydown",
    event => {

        const key = event.key;

        if (
            display.value === "Error"
        ) {
            display.value = "";
        }

        if (
            /^[0-9+\-*/.%()]$/
            .test(key)
        ) {

            display.value += key;

        }

        if (key === ".") {

            display.value += ".";

        }

        if (key === "Enter") {

            event.preventDefault();

            calculate();

        }

        if (key === "Backspace") {

            display.value =
                display.value.slice(
                    0,
                    -1
                );

        }

        if (key === "Escape") {

            display.value = "";

        }

    }
);

// ======================
// STARTUP
// ======================

window.addEventListener(
    "load",
    () => {

        loadTheme();
        loadHistory();

    }
);

