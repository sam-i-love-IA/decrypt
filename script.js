const btnCifra = document.getElementById("btnCifra");
const btnDecifra = document.getElementById("btnDecifra");

const homeScreen = document.getElementById("homeScreen");
const cifraScreen = document.getElementById("cifraScreen");
const ticketScreen = document.getElementById("ticketScreen");
const decifraScreen = document.getElementById("decifraScreen");
const bugReportScreen = document.getElementById("bugReportScreen");

const bugReportButton = document.getElementById("bugReportButton");
const bugTitle = document.getElementById("bugTitle");
const bugDescription = document.getElementById("bugDescription");
const bugWhatHappened = document.getElementById("bugWhatHappened");
const bugReportResult = document.getElementById("bugReportResult");
const copyBugReport = document.getElementById("copyBugReport");
const backFromBugReport = document.getElementById("backFromBugReport");

const addLevel = document.getElementById("addLevel");
const removeLevel = document.getElementById("removeLevel");
const levelsContainer = document.getElementById("levelsContainer");

const backHome = document.getElementById("backHome");
const exitCifra = document.getElementById("exitCifra");
const backHomeDecrypt = document.getElementById("backHomeDecrypt");
const backFromTicket = document.getElementById("backFromTicket");
const exitDecrypt = document.getElementById("exitDecrypt");

const encryptButton = document.getElementById("encryptButton");
const inputMessage = document.getElementById("inputMessage");
const encryptedMessage = document.getElementById("encryptedMessage");
const instructionsInput = document.getElementById("instructionsInput");
const instructionPosition = document.getElementById("instructionPosition");
const instructionPositionValue = document.getElementById("instructionPositionValue");
const resultContainer = document.getElementById("resultContainer");
const ticketButton = document.getElementById("ticketButton");
const takeTicket = document.getElementById("takeTicket");

const decryptInputMessage = document.getElementById("decryptInputMessage");
const decryptLevelsContainer = document.getElementById("decryptLevelsContainer");
const decryptAddLevel = document.getElementById("decryptAddLevel");
const decryptRemoveLevel = document.getElementById("decryptRemoveLevel");
const decryptButton = document.getElementById("decryptButton");
const decryptResultContainer = document.getElementById("decryptResultContainer");
const decryptedMessage = document.getElementById("decryptedMessage");

const openFileManagerCifra = document.getElementById("openFileManagerCifra");
const openFileManagerDecifra = document.getElementById("openFileManagerDecifra");
const fileManagerOverlay = document.getElementById("fileManagerOverlay");
const closeFileManager = document.getElementById("closeFileManager");
const dropZone = document.getElementById("dropZone");
const chooseFiles = document.getElementById("chooseFiles");
const fileInput = document.getElementById("fileInput");
const selectedFiles = document.getElementById("selectedFiles");
const filesLoadedButton = document.getElementById("filesLoadedButton");

let lastTicket = "";
let fileManagerTarget = "cifra";
let pendingFiles = [];
let skipFileConfirmation = false;


// ========================================
// NAVIGAZIONE
// ========================================

function showScreen(screen) {
    homeScreen.classList.add("hidden");
    cifraScreen.classList.add("hidden");
    ticketScreen.classList.add("hidden");
    decifraScreen.classList.add("hidden");
    deskScreen.classList.add("hidden");
    bugReportScreen.classList.add("hidden");

    if (screen === "home") homeScreen.classList.remove("hidden");
    if (screen === "cifra") cifraScreen.classList.remove("hidden");
    if (screen === "ticket") ticketScreen.classList.remove("hidden");
    if (screen === "decifra") decifraScreen.classList.remove("hidden");
    if (screen === "desk") deskScreen.classList.remove("hidden");
    if (screen === "bug") bugReportScreen.classList.remove("hidden");
}

function navigate(screen, addHistory = true) {
    showScreen(screen);

    if (addHistory) {
        history.pushState({ screen }, "", "#" + screen);
    }
}

btnCifra.addEventListener("click", function () {
    navigate("cifra");
});

btnDecifra.addEventListener("click", function () {
    navigate("decifra");
});

bugReportButton.addEventListener("click", function () {
    navigate("bug");
});

backFromBugReport.addEventListener("click", function () {
    navigate("home");
});

backHome.addEventListener("click", function () {
    navigate("home");
});

backHomeDecrypt.addEventListener("click", function () {
    navigate("home");
});

backFromTicket.addEventListener("click", function () {
    navigate("cifra");
});

window.addEventListener("popstate", function (event) {
    showScreen(
        event.state && event.state.screen
            ? event.state.screen
            : "home"
    );
});

history.replaceState({ screen: "home" }, "", "#home");


// ========================================
// LIVELLI CIFRA
// ========================================

function updateKeyVisibility(level) {
    const method = level.querySelector(".methodSelect").value;
    const keyContainer = level.querySelector(".keyContainer");

    if (method === "cesare") {
        keyContainer.classList.remove("hidden");
    } else {
        keyContainer.classList.add("hidden");
    }
}

function setupLevel(level) {
    level.querySelector(".methodSelect").addEventListener("change", function () {
        updateKeyVisibility(level);
    });

    level.querySelector(".deleteLevel").addEventListener("click", function () {
        const levels = levelsContainer.querySelectorAll(".level");

        if (levels.length <= 1) {
            alert("Deve rimanere almeno un livello.");
            return;
        }

        level.remove();
        renumberLevels();
        rebuildTransitions();
        updateInstructionRange();
    });

    updateKeyVisibility(level);
}

function renumberLevels() {
    const levels = levelsContainer.querySelectorAll(".level");

    levels.forEach(function (level, index) {
        const title = level.querySelector("h4");

        if (title) {
            title.textContent = "Livello " + (index + 1);
        }
    });
}

function createLevel() {
    const level = document.createElement("div");

    level.className = "level";

    level.innerHTML = `
        <h4>Livello</h4>

        <select class="methodSelect">
            <option value="cesare">Cesare</option>
            <option value="base64">Base64</option>
        </select>

        <div class="keyContainer">
            <input
                type="number"
                class="keyInput"
                placeholder="Chiave Cesare"
            >
        </div>

        <button class="deleteLevel">
            ELIMINA LIVELLO
        </button>
    `;

    setupLevel(level);

    return level;
}

function getTransitionAfterLevel(levelIndex) {
    const transitions = levelsContainer.querySelectorAll(".transition");

    return transitions[levelIndex] || null;
}

function createTransition() {
    const transition = document.createElement("div");

    transition.className = "transition";

    transition.innerHTML = `
        <div class="transitionHeader">
            <strong>Noise</strong>
        </div>

        <div class="noiseList"></div>

        <button class="addNoiseButton">
            + NOISE
        </button>
    `;

    const addNoiseButton =
        transition.querySelector(".addNoiseButton");

    addNoiseButton.addEventListener("click", function () {
        addNoise(transition);
    });

    return transition;
}

function addNoise(transition) {
    const noiseList =
        transition.querySelector(".noiseList");

    const noise = document.createElement("div");

    noise.className = "noise";

    noise.innerHTML = `
        <select class="noiseMethod">
            <option value="character">Lettera</option>
            <option value="word">Parola</option>
        </select>

        <input
            type="number"
            class="noiseInterval"
            min="1"
            value="2"
            placeholder="Intervallo"
        >

        <input
            type="text"
            class="noiseCharacter"
            maxlength="1"
            placeholder="Carattere"
        >

        <input
            type="text"
            class="noiseWord hidden"
            placeholder="Parola"
        >

        <button class="deleteNoise">
            ELIMINA NOISE
        </button>
    `;

    const method =
        noise.querySelector(".noiseMethod");

    const character =
        noise.querySelector(".noiseCharacter");

    const word =
        noise.querySelector(".noiseWord");

    method.addEventListener("change", function () {
        if (method.value === "character") {
            character.classList.remove("hidden");
            word.classList.add("hidden");
        } else {
            character.classList.add("hidden");
            word.classList.remove("hidden");
        }
    });

    noise.querySelector(".deleteNoise")
        .addEventListener("click", function () {
            noise.remove();
        });

    noiseList.appendChild(noise);
}

function rebuildTransitions() {
    const levels = Array.from(
        levelsContainer.querySelectorAll(".level")
    );

    const oldTransitions = Array.from(
        levelsContainer.querySelectorAll(".transition")
    );

    const transitionData = oldTransitions.map(function (transition) {
        return transition;
    });

    levelsContainer.innerHTML = "";

    levels.forEach(function (level, index) {
        levelsContainer.appendChild(level);

        if (index < levels.length - 1) {
            const transition =
                transitionData[index] || createTransition();

            levelsContainer.appendChild(transition);
        }
    });

    renumberLevels();
}

function getLevels() {
    return Array.from(
        levelsContainer.querySelectorAll(".level")
    );
}

function getTransitions() {
    return Array.from(
        levelsContainer.querySelectorAll(".transition")
    );
}

function readNoise(noise) {
    const method =
        noise.querySelector(".noiseMethod").value;

    const interval =
        parseInt(
            noise.querySelector(".noiseInterval").value,
            10
        );

    const characterInput =
        noise.querySelector(".noiseCharacter");

    const wordInput =
        noise.querySelector(".noiseWord");

    return {
        method,
        interval,
        character: characterInput.value,
        word: wordInput.value
    };
}


// ========================================
// CIFRARIO DI CESARE
// ========================================

function cesare(text, key) {
    const normalizedKey =
        ((parseInt(key, 10) % 26) + 26) % 26;

    return Array.from(text).map(function (char) {
        const code = char.charCodeAt(0);

        if (code >= 65 && code <= 90) {
            return String.fromCharCode(
                ((code - 65 + normalizedKey) % 26) + 65
            );
        }

        if (code >= 97 && code <= 122) {
            return String.fromCharCode(
                ((code - 97 + normalizedKey) % 26) + 97
            );
        }

        return char;
    }).join("");
}

function cesareInverse(text, key) {
    return cesare(text, -parseInt(key, 10));
}


// ========================================
// BASE64
// ========================================

function utf8ToBase64(text) {
    const bytes =
        new TextEncoder().encode(text);

    let binary = "";

    bytes.forEach(function (byte) {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary);
}

function base64ToUtf8(base64) {
    const binary = atob(base64);

    const bytes =
        Uint8Array.from(
            binary,
            function (char) {
                return char.charCodeAt(0);
            }
        );

    return new TextDecoder().decode(bytes);
}


// ========================================
// NOISE
// ========================================

function insertCharacterNoise(text, interval, character) {
    if (!character) {
        return text;
    }

    let result = "";
    let count = 0;

    for (const char of text) {
        result += char;
        count++;

        if (count === interval) {
            result += character;
            count = 0;
        }
    }

    return result;
}

function insertWordNoise(text, interval, word) {
    if (!word) {
        return text;
    }

    const letters =
        Array.from(word);

    if (letters.length === 0) {
        return text;
    }

    let result = "";
    let count = 0;
    let wordIndex = 0;

    for (const char of text) {
        result += char;

        if (/[A-Za-z]/.test(char)) {
            count++;

            if (count === interval) {
                result += letters[wordIndex];

                wordIndex =
                    (wordIndex + 1) % letters.length;

                count = 0;
            }
        }
    }

    return result;
}

function applyNoise(text, noise) {
    if (noise.method === "character") {
        return insertCharacterNoise(
            text,
            noise.interval,
            noise.character
        );
    }

    return insertWordNoise(
        text,
        noise.interval,
        noise.word
    );
}

function removeCharacterNoise(text, interval) {
    if (!Number.isInteger(interval) || interval <= 0) {
        return text;
    }

    let result = "";
    let count = 0;

    for (const char of text) {
        if (count === interval) {
            count = 0;
            continue;
        }

        result += char;
        count++;
    }

    return result;
}

function removeWordNoise(text, interval) {
    if (!Number.isInteger(interval) || interval <= 0) {
        return text;
    }

    let result = "";
    let count = 0;

    for (const char of text) {
        if (/[A-Za-z]/.test(char)) {
            count++;

            if (count === interval) {
                count = 0;
            }
        }

        result += char;
    }

    return result;
}


// ========================================
// ISTRUZIONI
// ========================================

function updateInstructionRange() {
    const messageLength =
        Array.from(inputMessage.value).length;

    instructionPosition.max =
        messageLength;

    let value =
        parseInt(instructionPosition.value, 10);

    if (value > messageLength) {
        value = messageLength;
    }

    instructionPosition.value = value;
    instructionPositionValue.textContent = value;
}

inputMessage.addEventListener(
    "input",
    updateInstructionRange
);

instructionPosition.addEventListener(
    "input",
    function () {
        instructionPositionValue.textContent =
            instructionPosition.value;
    }
);

function insertInstructions(text, instructions, position) {
    if (!instructions) {
        return text;
    }

    const chars =
        Array.from(text);

    const safePosition =
        Math.max(
            0,
            Math.min(
                parseInt(position, 10) || 0,
                chars.length
            )
        );

    chars.splice(
        safePosition,
        0,
        instructions + "\n\n"
    );

    return chars.join("");
}


// ========================================
// CIFRA
// ========================================

encryptButton.addEventListener(
    "click",
    function () {
        const message =
            inputMessage.value;

        const levels =
            getLevels();

        const transitions =
            getTransitions();

        let result =
            message;

        const ticketLevels = [];
        const ticketTransitions = [];

        for (let i = 0; i < levels.length; i++) {
            const level =
                levels[i];

            const method =
                level.querySelector(
                    ".methodSelect"
                ).value;

            let key = "";

            if (method === "cesare") {
                key =
                    level.querySelector(
                        ".keyInput"
                    ).value;

                if (key === "") {
                    alert(
                        "Inserisci una chiave Cesare."
                    );
                    return;
                }

                result =
                    cesare(result, key);
            } else {
                result =
                    utf8ToBase64(result);
            }

            ticketLevels.push({
                method,
                key
            });

            if (i < levels.length - 1) {
                const transition =
                    transitions[i];

                const transitionNoises = [];

                if (transition) {
                    const noises =
                        transition.querySelectorAll(
                            ".noise"
                        );

                    for (const noise of noises) {
                        const data =
                            readNoise(noise);

                        if (
                            !Number.isInteger(
                                data.interval
                            ) ||
                            data.interval <= 0
                        ) {
                            alert(
                                "Ogni Noise deve avere un intervallo maggiore di 0."
                            );
                            return;
                        }

                        if (
                            data.method === "character" &&
                            !data.character
                        ) {
                            alert(
                                "Inserisci il carattere del Noise."
                            );
                            return;
                        }

                        if (
                            data.method === "word" &&
                            !data.word
                        ) {
                            alert(
                                "Inserisci la parola del Noise."
                            );
                            return;
                        }

                        result =
                            applyNoise(
                                result,
                                data
                            );

                        transitionNoises.push(
                            data
                        );
                    }
                }

                ticketTransitions.push(
                    transitionNoises
                );
            }
        }

        const instructions =
            instructionsInput.value;

        const position =
            parseInt(
                instructionPosition.value,
                10
            ) || 0;

        const finalResult =
            insertInstructions(
                result,
                instructions,
                position
            );

        encryptedMessage.value =
            finalResult;

        lastTicket = createTicket(
            message,
            instructions,
            position,
            ticketLevels,
            transitions,
            finalResult
        );

        saveLastEncryptionTicket(lastTicket);

        resultContainer.classList.remove(
            "hidden"
        );
    }
);


// ========================================
// TICKET
// ========================================

function createTicket(
    originalMessage,
    instructions,
    position,
    ticketLevels,
    transitions,
    finalResult
) {
    let ticket = "";

    ticket +=
        "==============================\n";

    ticket +=
        "DECRYPT - TICKET DI CIFRATURA\n";

    ticket +=
        "==============================\n\n";

    ticket +=
        "MESSAGGIO ORIGINALE:\n";

    ticket +=
        (
            originalMessage === ""
                ? "Nessun messaggio.\n"
                : originalMessage + "\n"
        );

    ticket += "\n";

    ticket +=
        "ISTRUZIONI:\n";

    ticket +=
        (
            instructions === ""
                ? "Nessuna istruzione.\n"
                : instructions + "\n"
        );

    ticket +=
        "Posizione: " +
        position +
        "\n\n";

    ticket +=
        "PROCEDURA DI CIFRATURA:\n\n";

    ticketLevels.forEach(
        function (level, index) {
            ticket +=
                "LIVELLO " +
                (index + 1) +
                ":\n";

            ticket +=
                "Metodo: " +
                (
                    level.method === "cesare"
                        ? "Cesare"
                        : "Base64"
                ) +
                "\n";

            if (level.method === "cesare") {
                ticket +=
                    "Chiave: " +
                    level.key +
                    "\n";
            }

            ticket += "\n";

            if (
                index <
                ticketLevels.length - 1
            ) {
                ticket +=
                    "NOISE TRA LIVELLO " +
                    (index + 1) +
                    " E LIVELLO " +
                    (index + 2) +
                    ":\n";

                const noises =
                    transitions[index] || [];

                if (noises.length === 0) {
                    ticket +=
                        "Nessun Noise.\n\n";
                } else {
                    noises.forEach(
                        function (noise, noiseIndex) {
                            ticket +=
                                "Noise " +
                                (noiseIndex + 1) +
                                ":\n";

                            if (
                                noise.method ===
                                "character"
                            ) {
                                ticket +=
                                    "Metodo: Noise lettera\n";

                                ticket +=
                                    "Carattere: " +
                                    noise.character +
                                    "\n";

                                ticket +=
                                    "Intervallo: ogni " +
                                    noise.interval +
                                    " caratteri\n\n";
                            } else {
                                ticket +=
                                    "Metodo: Noise parola\n";

                                ticket +=
                                    "Parola: " +
                                    noise.word +
                                    "\n";

                                ticket +=
                                    "Intervallo: ogni " +
                                    noise.interval +
                                    " lettere\n\n";
                            }
                        }
                    );
                }
            }
        }
    );

    ticket +=
        "RISULTATO FINALE:\n";

    ticket +=
        finalResult +
        "\n\n";

    ticket +=
        "==============================\n";

    ticket +=
        "FINE TICKET DI CIFRATURA\n";

    ticket +=
        "==============================";

    return ticket;
}

ticketButton.addEventListener(
    "click",
    function () {
        navigate("ticket");
    }
);

takeTicket.addEventListener(
    "click",
    async function () {
        if (lastTicket === "") {
            return;
        }

        try {
            await copyTextToClipboard(
                lastTicket
            );

            alert(
                "Ticket copiato negli appunti."
            );
        } catch (error) {
            alert(
                "Impossibile copiare il ticket."
            );
        }
    }
);


// ========================================
// LIVELLI DECIFRA
// ========================================

function updateDecryptKeyVisibility(level) {
    const method =
        level.querySelector(
            ".methodSelect"
        ).value;

    const keyContainer =
        level.querySelector(
            ".keyContainer"
        );

    if (method === "cesare") {
        keyContainer.classList.remove(
            "hidden"
        );
    } else {
        keyContainer.classList.add(
            "hidden"
        );
    }
}

function setupDecryptLevel(level) {