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

addLevel.addEventListener("click", function () {
    const levels = levelsContainer.querySelectorAll(".level");
    const newLevel = createLevel();
    const transition = createTransition();
    if (levels.length > 0) levelsContainer.insertBefore(transition, levels[levels.length - 1].nextSibling);
    levelsContainer.appendChild(newLevel);
    renumberLevels();
    updateInstructionRange();
});

removeLevel.addEventListener("click", function () {
    const levels = levelsContainer.querySelectorAll(".level");
    if (levels.length <= 1) return;
    const transitions = levelsContainer.querySelectorAll(".transition");
    if (transitions.length) transitions[transitions.length - 1].remove();
    levels[levels.length - 1].remove();
    renumberLevels();
    updateInstructionRange();
});

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
            ticketTransitions,
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

function setupDecryptLevel(level) {    level.querySelector(
        ".methodSelect"
    ).addEventListener(
        "change",
        function () {
            updateDecryptKeyVisibility(
                level
            );
        }
    );

    level.querySelector(
        ".deleteLevel"
    ).addEventListener(
        "click",
        function () {
            const levels =
                decryptLevelsContainer.querySelectorAll(
                    ".level"
                );

            if (levels.length <= 1) {
                alert(
                    "Deve rimanere almeno un livello."
                );
                return;
            }

            level.remove();
            renumberDecryptLevels();
            rebuildDecryptTransitions();
        }
    );

    updateDecryptKeyVisibility(level);
}

function renumberDecryptLevels() {
    const levels =
        decryptLevelsContainer.querySelectorAll(
            ".level"
        );

    levels.forEach(
        function (level, index) {
            const title =
                level.querySelector("h4");

            if (title) {
                title.textContent =
                    "Livello " +
                    (index + 1);
            }
        }
    );
}

function createDecryptLevel() {
    const level =
        document.createElement("div");

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

    setupDecryptLevel(level);

    return level;
}

decryptAddLevel.addEventListener("click", function () {
    const levels = decryptLevelsContainer.querySelectorAll(".level");
    const newLevel = createDecryptLevel();
    const transition = createDecryptTransition();
    if (levels.length > 0) decryptLevelsContainer.insertBefore(transition, levels[levels.length - 1].nextSibling);
    decryptLevelsContainer.appendChild(newLevel);
    renumberDecryptLevels();
});

decryptRemoveLevel.addEventListener("click", function () {
    const levels = decryptLevelsContainer.querySelectorAll(".level");
    if (levels.length <= 1) return;
    const transitions = decryptLevelsContainer.querySelectorAll(".transition");
    if (transitions.length) transitions[transitions.length - 1].remove();
    levels[levels.length - 1].remove();
    renumberDecryptLevels();
});

function createDecryptTransition() {
    const transition =
        document.createElement("div");

    transition.className =
        "transition";

    transition.innerHTML = `
        <div class="transitionHeader">
            <strong>Noise</strong>
        </div>

        <div class="noiseList"></div>

        <button class="addNoiseButton">
            + NOISE
        </button>
    `;

    transition.querySelector(
        ".addNoiseButton"
    ).addEventListener(
        "click",
        function () {
            addDecryptNoise(
                transition
            );
        }
    );

    return transition;
}

function addDecryptNoise(transition) {
    const noiseList =
        transition.querySelector(
            ".noiseList"
        );

    const noise =
        document.createElement("div");

    noise.className =
        "noise";

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
        noise.querySelector(
            ".noiseMethod"
        );

    const character =
        noise.querySelector(
            ".noiseCharacter"
        );

    const word =
        noise.querySelector(
            ".noiseWord"
        );

    method.addEventListener(
        "change",
        function () {
            if (
                method.value ===
                "character"
            ) {
                character.classList.remove(
                    "hidden"
                );

                word.classList.add(
                    "hidden"
                );
            } else {
                character.classList.add(
                    "hidden"
                );

                word.classList.remove(
                    "hidden"
                );
            }
        }
    );

    noise.querySelector(
        ".deleteNoise"
    ).addEventListener(
        "click",
        function () {
            noise.remove();
        }
    );

    noiseList.appendChild(noise);
}

function rebuildDecryptTransitions() {
    const levels =
        Array.from(
            decryptLevelsContainer.querySelectorAll(
                ".level"
            )
        );

    const oldTransitions =
        Array.from(
            decryptLevelsContainer.querySelectorAll(
                ".transition"
            )
        );

    decryptLevelsContainer.innerHTML =
        "";

    levels.forEach(
        function (level, index) {
            decryptLevelsContainer.appendChild(
                level
            );

            if (
                index <
                levels.length - 1
            ) {
                const transition =
                    oldTransitions[index] ||
                    createDecryptTransition();

                decryptLevelsContainer.appendChild(
                    transition
                );
            }
        }
    );

    renumberDecryptLevels();
}

function readDecryptNoise(noise) {
    const method =
        noise.querySelector(
            ".noiseMethod"
        ).value;

    const interval =
        parseInt(
            noise.querySelector(
                ".noiseInterval"
            ).value,
            10
        );

    return {
        method,
        interval,
        character:
            noise.querySelector(
                ".noiseCharacter"
            ).value,
        word:
            noise.querySelector(
                ".noiseWord"
            ).value
    };
}


// ========================================
// DECIFRA
// ========================================

decryptButton.addEventListener(
    "click",
    function () {
        let result =
            decryptInputMessage.value;

        const levels =
            Array.from(
                decryptLevelsContainer.querySelectorAll(
                    ".level"
                )
            );

        const transitions =
            Array.from(
                decryptLevelsContainer.querySelectorAll(
                    ".transition"
                )
            );

        for (
            let i = levels.length - 1;
            i >= 0;
            i--
        ) {
            const level =
                levels[i];

            const method =
                level.querySelector(
                    ".methodSelect"
                ).value;

            if (method === "base64") {
                try {
                    result =
                        base64ToUtf8(result);
                } catch (error) {
                    alert(
                        "Il testo non è un Base64 valido."
                    );
                    return;
                }
            } else {
                const key =
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
                    cesareInverse(
                        result,
                        key
                    );
            }

            if (i > 0) {
                const transition =
                    transitions[i - 1];

                if (transition) {
                    const noises =
                        Array.from(
                            transition.querySelectorAll(
                                ".noise"
                            )
                        );

                    for (
                        let n =
                            noises.length - 1;
                        n >= 0;
                        n--
                    ) {
                        const data =
                            readDecryptNoise(
                                noises[n]
                            );

                        const interval =
                            parseInt(
                                data.interval,
                                10
                            );

                        if (
                            !Number.isInteger(
                                interval
                            ) ||
                            interval <= 0
                        ) {
                            alert(
                                "Ogni Noise deve avere un intervallo maggiore di 0."
                            );
                            return;
                        }

                        if (
                            data.method ===
                            "character"
                        ) {
                            result =
                                removeCharacterNoise(
                                    result,
                                    interval
                                );
                        } else {
                            result =
                                removeWordNoise(
                                    result,
                                    interval
                                );
                        }
                    }
                }
            }
        }

        decryptedMessage.value =
            result;

        decryptResultContainer.classList.remove(
            "hidden"
        );

        saveLastDecryptionTicket(
            buildDecryptBugTicket()
        );
    }
);


// ========================================
// USCITA
// ========================================

exitCifra.addEventListener(
    "click",
    function () {
        inputMessage.value = "";
        encryptedMessage.value = "";
        instructionsInput.value = "";

        resultContainer.classList.add(
            "hidden"
        );

        resetLevels();
        resetInstructionPosition();

        lastTicket = "";

        navigate("home");
    }
);

exitDecrypt.addEventListener(
    "click",
    function () {
        decryptInputMessage.value = "";
        decryptedMessage.value = "";

        decryptResultContainer.classList.add(
            "hidden"
        );

        resetDecryptLevels();

        navigate("home");
    }
);


// ========================================
// GESTIONE FILE
// ========================================

openFileManagerCifra.addEventListener(
    "click",
    function () {
        openFileManager("cifra");
    }
);

openFileManagerDecifra.addEventListener(
    "click",
    function () {
        openFileManager("decifra");
    }
);

function openFileManager(target) {
    fileManagerTarget =
        target;

    pendingFiles = [];

    selectedFiles.innerHTML =
        "<p>Nessun file selezionato.</p>";

    fileManagerOverlay.classList.remove(
        "hidden"
    );
}

closeFileManager.addEventListener(
    "click",
    function () {
        fileManagerOverlay.classList.add(
            "hidden"
        );
    }
);

chooseFiles.addEventListener(
    "click",
    function () {
        fileInput.click();
    }
);

fileInput.addEventListener(
    "change",
    function () {
        pendingFiles =
            Array.from(
                fileInput.files
            );

        renderSelectedFiles();
    }
);

function renderSelectedFiles() {
    if (pendingFiles.length === 0) {
        selectedFiles.innerHTML =
            "<p>Nessun file selezionato.</p>";

        return;
    }

    selectedFiles.innerHTML = "";

    pendingFiles.forEach(
        function (file) {
            const p =
                document.createElement(
                    "p"
                );

            p.textContent =
                file.name;

            selectedFiles.appendChild(
                p
            );
        }
    );
}

dropZone.addEventListener(
    "dragover",
    function (event) {
        event.preventDefault();
    }
);

dropZone.addEventListener(
    "drop",
    function (event) {
        event.preventDefault();

        pendingFiles =
            Array.from(
                event.dataTransfer.files
            );

        renderSelectedFiles();
    }
);

filesLoadedButton.addEventListener(
    "click",
    async function () {
        if (
            pendingFiles.length === 0
        ) {
            alert(
                "Seleziona almeno un file."
            );
            return;
        }

        for (
            const file of pendingFiles
        ) {
            await processFile(
                file,
                fileManagerTarget
            );
        }

        fileManagerOverlay.classList.add(
            "hidden"
        );
    }
);

async function processFile(
    file,
    target
) {
    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();

    if (extension === "txt") {
        const text =
            await file.text();

        applyLoadedText(
            text,
            target
        );

        return;
    }

    if (extension === "pdf") {
        try {
            const buffer =
                await file.arrayBuffer();

            const pdf =
                await pdfjsLib.getDocument({
                    data: buffer
                }).promise;

            let text = "";

            for (
                let pageNumber = 1;
                pageNumber <= pdf.numPages;
                pageNumber++
            ) {
                const page =
                    await pdf.getPage(
                        pageNumber
                    );

                const content =
                    await page.getTextContent();

                text +=
                    content.items
                        .map(
                            function (item) {
                                return item.str;
                            }
                        )
                        .join(" ") +
                    "\n";
            }

            applyLoadedText(
                text,
                target
            );
        } catch (error) {
            alert(
                "Impossibile leggere il PDF."
            );
        }

        return;
    }

    alert(
        "Formato file non supportato."
    );
}

function applyLoadedText(
    text,
    target
) {
    const cleanText =
        text.trim();

    if (
        cleanText.startsWith(
            "DECRYPT:cr"
        )
    ) {
        const message =
            cleanText
                .replace(
                    /^DECRYPT:cr\s*/i,
                    ""
                );

        inputMessage.value =
            message;

        updateInstructionRange();

        if (target === "decifra") {
            decryptInputMessage.value =
                message;
        }

        return;
    }

    if (
        cleanText.startsWith(
            "DECRYPT:dr"
        )
    ) {
        const message =
            cleanText
                .replace(
                    /^DECRYPT:dr\s*/i,
                    ""
                );

        decryptInputMessage.value =
            message;

        return;
    }

    if (
        cleanText.startsWith(
            "DECRYPT:c"
        )
    ) {
        const configText =
            cleanText
                .replace(
                    /^DECRYPT:c\s*/i,
                    ""
                );

        try {
            const config =
                JSON.parse(
                    configText
                );

            applyConfiguration(
                config,
                target
            );
        } catch (error) {
            alert(
                "Configurazione non valida."
            );
        }

        return;
    }

    if (target === "cifra") {
        inputMessage.value =
            cleanText;

        updateInstructionRange();
    } else {
        decryptInputMessage.value =
            cleanText;
    }
}


// ========================================
// CONFIGURAZIONE
// ========================================

function getConfiguration() {
    const levels =
        getLevels();

    const transitions =
        getTransitions();

    return {
        message:
            inputMessage.value,

        levels:
            levels.map(
                function (level) {
                    return {
                        method:
                            level.querySelector(
                                ".methodSelect"
                            ).value,

                        key:
                            level.querySelector(
                                ".keyInput"
                            ).value
                    };
                }
            ),

        noiseBlocks:
            transitions.flatMap(
                function (transition, index) {
                    const noises =
                        transition.querySelectorAll(
                            ".noise"
                        );

                    return Array.from(
                        noises
                    ).map(
                        function (noise) {
                            const data =
                                readNoise(
                                    noise
                                );

                            return {
                                afterLevel:
                                    index + 1,
                                method:
                                    data.method,
                                interval:
                                    data.interval,
                                character:
                                    data.character,
                                word:
                                    data.word
                            };
                        }
                    );
                }
            ),

        instructions:
            instructionsInput.value,

        instructionPosition:
            parseInt(
                instructionPosition.value,
                10
            ) || 0
    };
}

function applyConfiguration(
    config,
    target
) {
    if (target === "decifra") {
        applyConfigurationToDecifra(
            config
        );
    } else {
        applyConfigurationToCifra(
            config
        );
    }
}

function applyConfigurationToCifra(
    config
) {
    if (
        config.message !== undefined &&
        config.message !== null
    ) {
        inputMessage.value =
            config.message;
    }

    resetLevels();

    const levels =
        config.levels || [];

    levels.forEach(
        function (levelData, index) {
            if (index === 0) {
                const level =
                    levelsContainer.querySelector(
                        ".level"
                    );

                level.querySelector(
                    ".methodSelect"
                ).value =
                    levelData.method ||
                    "cesare";

                level.querySelector(
                    ".keyInput"
                ).value =
                    levelData.key ||
                    "";

                updateKeyVisibility(
                    level
                );
            } else {
                addLevel.click();

                const currentLevels =
                    levelsContainer.querySelectorAll(
                        ".level"
                    );

                const level =
                    currentLevels[
                        currentLevels.length - 1
                    ];

                level.querySelector(
                    ".methodSelect"
                ).value =
                    levelData.method ||
                    "cesare";

                level.querySelector(
                    ".keyInput"
                ).value =
                    levelData.key ||
                    "";

                updateKeyVisibility(
                    level
                );
            }
        }
    );

    const noiseBlocks =
        config.noiseBlocks || [];

    noiseBlocks.forEach(
        function (noiseData) {
            const transition =
                getTransitions()[
                    noiseData.afterLevel - 1
                ];

            if (!transition) {
                return;
            }

            addNoise(
                transition
            );

            const noises =
                transition.querySelectorAll(
                    ".noise"
                );

            const noise =
                noises[
                    noises.length - 1
                ];

            noise.querySelector(
                ".noiseMethod"
            ).value =
                noiseData.method ||
                "character";

            noise.querySelector(
                ".noiseInterval"
            ).value =
                noiseData.interval ||
                1;

            noise.querySelector(
                ".noiseCharacter"
            ).value =
                noiseData.character ||
                "";

            noise.querySelector(
                ".noiseWord"
            ).value =
                noiseData.word ||
                "";

            noise.querySelector(
                ".noiseMethod"
            ).dispatchEvent(
                new Event("change")
            );
        }
    );
    instructionsInput.value =
        config.instructions ||
        "";

    instructionPosition.value =
        config.instructionPosition ||
        0;

    updateInstructionRange();
}

function applyConfigurationToDecifra(
    config
) {
    decryptInputMessage.value =
        config.message || "";

    resetDecryptLevels();

    const levels =
        config.levels || [];

    levels.forEach(
        function (levelData, index) {
            if (index === 0) {
                const level =
                    decryptLevelsContainer.querySelector(
                        ".level"
                    );

                level.querySelector(
                    ".methodSelect"
                ).value =
                    levelData.method ||
                    "cesare";

                level.querySelector(
                    ".keyInput"
                ).value =
                    levelData.key ||
                    "";

                updateDecryptKeyVisibility(
                    level
                );
            } else {
                decryptAddLevel.click();

                const currentLevels =
                    decryptLevelsContainer.querySelectorAll(
                        ".level"
                    );

                const level =
                    currentLevels[
                        currentLevels.length - 1
                    ];

                level.querySelector(
                    ".methodSelect"
                ).value =
                    levelData.method ||
                    "cesare";

                level.querySelector(
                    ".keyInput"
                ).value =
                    levelData.key ||
                    "";

                updateDecryptKeyVisibility(
                    level
                );
            }
        }
    );

    const noiseBlocks =
        config.noiseBlocks || [];

    noiseBlocks.forEach(
        function (noiseData) {
            const transition =
                decryptLevelsContainer.querySelectorAll(
                    ".transition"
                )[
                    noiseData.afterLevel - 1
                ];

            if (!transition) {
                return;
            }

            addDecryptNoise(
                transition
            );

            const noises =
                transition.querySelectorAll(
                    ".noise"
                );

            const noise =
                noises[
                    noises.length - 1
                ];

            noise.querySelector(
                ".noiseMethod"
            ).value =
                noiseData.method ||
                "character";

            noise.querySelector(
                ".noiseInterval"
            ).value =
                noiseData.interval ||
                1;

            noise.querySelector(
                ".noiseCharacter"
            ).value =
                noiseData.character ||
                "";

            noise.querySelector(
                ".noiseWord"
            ).value =
                noiseData.word ||
                "";

            noise.querySelector(
                ".noiseMethod"
            ).dispatchEvent(
                new Event("change")
            );
        }
    );
}


// ========================================
// RESET
// ========================================

function resetLevels() {
    levelsContainer.innerHTML = "";

    const level =
        createLevel();

    levelsContainer.appendChild(
        level
    );

    updateInstructionRange();
}

function resetInstructionPosition() {
    instructionPosition.value =
        0;

    instructionPositionValue.textContent =
        "0";

    updateInstructionRange();
}

function resetDecryptLevels() {
    decryptLevelsContainer.innerHTML =
        "";

    const level =
        createDecryptLevel();

    decryptLevelsContainer.appendChild(
        level
    );
}


// ========================================
// DESK
// ========================================

const btnDesk =
    document.getElementById("btnDesk");

const deskScreen =
    document.getElementById("deskScreen");

const deskHome =
    document.getElementById("deskHome");

const backFromDeskHome =
    document.getElementById("backFromDeskHome");

const deskCreator =
    document.getElementById("deskCreator");

const deskLoader =
    document.getElementById("deskLoader");

const deskSets =
    document.getElementById("deskSets");

const deskSetChoice =
    document.getElementById("deskSetChoice");

const createDeskButton =
    document.getElementById("createDeskButton");

const loadDeskButton =
    document.getElementById("loadDeskButton");

const deskTitleInput =
    document.getElementById("deskTitleInput");

const deskSetsContainer =
    document.getElementById(
        "deskSetsContainer"
    );

const addDeskSet =
    document.getElementById(
        "addDeskSet"
    );

const deskCodeOutput =
    document.getElementById(
        "deskCodeOutput"
    );

const copyDeskCode =
    document.getElementById(
        "copyDeskCode"
    );

const backFromDeskCreator =
    document.getElementById(
        "backFromDeskCreator"
    );

const deskFileInput =
    document.getElementById(
        "deskFileInput"
    );

const deskCodeInput =
    document.getElementById(
        "deskCodeInput"
    );

const applyDeskButton =
    document.getElementById(
        "applyDeskButton"
    );

const backFromDeskLoader =
    document.getElementById(
        "backFromDeskLoader"
    );

const loadedDeskTitle =
    document.getElementById(
        "loadedDeskTitle"
    );

const loadedDeskDescription =
    document.getElementById(
        "loadedDeskDescription"
    );

const deskSetList =
    document.getElementById(
        "deskSetList"
    );

const backFromDeskSets =
    document.getElementById(
        "backFromDeskSets"
    );

const selectedSetTitle =
    document.getElementById(
        "selectedSetTitle"
    );

const selectedSetDescription =
    document.getElementById(
        "selectedSetDescription"
    );

const useSetCifra =
    document.getElementById(
        "useSetCifra"
    );

const useSetDecifra =
    document.getElementById(
        "useSetDecifra"
    );

const backFromSetChoice =
    document.getElementById(
        "backFromSetChoice"
    );

let currentDesk =
    null;

let selectedDeskSet =
    null;

function hideDeskPanels() {
    deskHome.classList.add(
        "hidden"
    );

    deskCreator.classList.add(
        "hidden"
    );

    deskLoader.classList.add(
        "hidden"
    );

    deskSets.classList.add(
        "hidden"
    );

    deskSetChoice.classList.add(
        "hidden"
    );
}

function showDeskHome() {
    hideDeskPanels();

    deskHome.classList.remove(
        "hidden"
    );
}

backFromDeskHome.addEventListener(
    "click",
    function () {
        navigate("home");
    }
);

btnDesk.addEventListener(
    "click",
    function () {
        navigate("desk");
        showDeskHome();
    }
);

createDeskButton.addEventListener(
    "click",
    function () {
        hideDeskPanels();

        deskCreator.classList.remove(
            "hidden"
        );

        if (
            deskSetsContainer.children.length === 0
        ) {
            addDeskSetEditor();
        }

        updateDeskCode();
    }
);

loadDeskButton.addEventListener(
    "click",
    function () {
        hideDeskPanels();

        deskLoader.classList.remove(
            "hidden"
        );
    }
);

backFromDeskCreator.addEventListener(
    "click",
    showDeskHome
);

backFromDeskLoader.addEventListener(
    "click",
    showDeskHome
);

function addDeskSetEditor(
    initialData = null
) {
    const wrapper = document.createElement("div");

    wrapper.className = "desk-set-editor";

    wrapper.innerHTML = `
        <div class="deskSetHeader">
            <div>
                <span class="deskSetNumber">SET</span>
                <h4>Configurazione Set</h4>
            </div>

            <button class="deleteDeskSet">
                ELIMINA SET
            </button>
        </div>

        <input
            class="deskSetTitle"
            type="text"
            placeholder="Titolo del Set"
        >

        <textarea
            class="deskSetDescription"
            placeholder="Descrizione del Set"
        ></textarea>

        <div class="deskSetLevels"></div>

        <button class="addDeskLevel">
            + LIVELLO
        </button>
    `;

    const levelsContainer = wrapper.querySelector(".deskSetLevels");

    function renderNoise(transition, transitionIndex, noiseData) {
        const noise = document.createElement("div");
        noise.className = "desk-set-noise";

        noise.innerHTML = `
            <select class="deskNoiseMethod">
                <option value="character">Lettera</option>
                <option value="word">Parola</option>
            </select>

            <input
                class="deskNoiseInterval"
                type="number"
                min="1"
                value="2"
                placeholder="Intervallo"
            >

            <input
                class="deskNoiseCharacter"
                type="text"
                maxlength="1"
                placeholder="Carattere"
            >

            <input
                class="deskNoiseWord"
                type="text"
                placeholder="Parola"
            >

            <button class="deleteDeskNoise">
                ELIMINA NOISE
            </button>
        `;

        const method = noise.querySelector(".deskNoiseMethod");
        const interval = noise.querySelector(".deskNoiseInterval");
        const character = noise.querySelector(".deskNoiseCharacter");
        const word = noise.querySelector(".deskNoiseWord");

        method.value = noiseData?.method || "character";
        interval.value = noiseData?.interval || 2;
        character.value = noiseData?.character || "";
        word.value = noiseData?.word || "";

        function updateVisibility() {
            if (method.value === "character") {
                character.classList.remove("hidden");
                word.classList.add("hidden");
            } else {
                character.classList.add("hidden");
                word.classList.remove("hidden");
            }
        }

        method.addEventListener("change", function () {
            updateVisibility();
            updateDeskCode();
        });

        interval.addEventListener("input", updateDeskCode);
        character.addEventListener("input", updateDeskCode);
        word.addEventListener("input", updateDeskCode);

        noise.querySelector(".deleteDeskNoise").addEventListener(
            "click",
            function () {
                noise.remove();
                updateDeskCode();
            }
        );

        updateVisibility();
        transition.querySelector(".deskNoiseList").appendChild(noise);
    }

    function createTransition(transitionIndex, initialNoises = []) {
        const transition = document.createElement("div");
        transition.className = "deskLevelNoise";

        transition.innerHTML = `
            <div class="deskNoiseHeader">
                <div>
                    <strong>NOISE</strong>
                    <span>DOPO LIVELLO ${transitionIndex + 1} → LIVELLO ${transitionIndex + 2}</span>
                </div>

                <button class="addDeskNoise">
                    + NOISE
                </button>
            </div>

            <div class="deskNoiseList"></div>
        `;

        transition.querySelector(".addDeskNoise").addEventListener(
            "click",
            function () {
                renderNoise(
                    transition,
                    transitionIndex,
                    {
                        method: "character",
                        interval: 2,
                        character: "x",
                        word: ""
                    }
                );

                updateDeskCode();
            }
        );

        initialNoises.forEach(function (noiseData) {
            renderNoise(
                transition,
                transitionIndex,
                noiseData
            );
        });

        return transition;
    }

    function addDeskLevelEditor(levelData = null, levelIndex = 0) {
        const level = document.createElement("div");
        level.className = "desk-set-level";

        level.innerHTML = `
            <div class="deskLevelHeader">
                <strong>LIVELLO ${levelIndex + 1}</strong>

                <button class="deleteDeskLevel">
                    ELIMINA LIVELLO
                </button>
            </div>

            <select class="deskLevelMethod">
                <option value="cesare">Cesare</option>
                <option value="base64">Base64</option>
            </select>

            <input
                class="deskLevelKey"
                type="number"
                placeholder="Chiave Cesare"
            >
        `;

        const method = level.querySelector(".deskLevelMethod");
        const key = level.querySelector(".deskLevelKey");

        method.value = levelData?.method || "cesare";
        key.value = levelData?.key ?? "";

        function updateKeyVisibility() {
            if (method.value === "cesare") {
                key.classList.remove("hidden");
            } else {
                key.classList.add("hidden");
            }
        }

        method.addEventListener("change", function () {
            updateKeyVisibility();
            updateDeskCode();
        });

        key.addEventListener("input", updateDeskCode);

        level.querySelector(".deleteDeskLevel").addEventListener(
            "click",
            function () {
                const levels = levelsContainer.querySelectorAll(".desk-set-level");

                if (levels.length <= 1) {
                    alert("Deve rimanere almeno un livello.");
                    return;
                }

                level.remove();

                const remainingLevels =
                    Array.from(
                        wrapper.querySelectorAll(".desk-set-level")
                    ).map(function (remainingLevel, index) {
                        const data = {
                            method:
                                remainingLevel.querySelector(".deskLevelMethod").value,
                            key:
                                remainingLevel.querySelector(".deskLevelKey").value,
                            noises: []
                        };

                        const transitions =
                            wrapper.querySelectorAll(".deskLevelNoise");

                        if (index > 0 && transitions[index - 1]) {
                            data.noises =
                                Array.from(
                                    transitions[index - 1].querySelectorAll(".desk-set-noise")
                                ).map(function (noise) {
                                    return {
                                        method:
                                            noise.querySelector(".deskNoiseMethod").value,
                                        interval:
                                            parseInt(
                                                noise.querySelector(".deskNoiseInterval").value,
                                                10
                                            ) || 1,
                                        character:
                                            noise.querySelector(".deskNoiseCharacter").value,
                                        word:
                                            noise.querySelector(".deskNoiseWord").value
                                    };
                                });
                        }

                        return data;
                    });

                initialData = {
                    title: wrapper.querySelector(".deskSetTitle").value,
                    description: wrapper.querySelector(".deskSetDescription").value,
                    levels: remainingLevels
                };

                renderDeskLevels();
                updateDeskCode();
            }
        );

        updateKeyVisibility();
        levelsContainer.appendChild(level);
    }

    function renderDeskLevels() {
        levelsContainer.innerHTML = "";

        const levelDataList =
            initialData && Array.isArray(initialData.levels)
                ? initialData.levels
                : [{ method: "cesare", key: "" }];

        levelDataList.forEach(function (levelData, levelIndex) {
            addDeskLevelEditor(levelData, levelIndex);

            if (levelIndex < levelDataList.length - 1) {
                const transitionNoises =
                    levelDataList[levelIndex + 1].noises || [];

                levelsContainer.appendChild(
                    createTransition(
                        levelIndex,
                        transitionNoises
                    )
                );
            }
        });
    }

    wrapper.querySelector(".addDeskLevel").addEventListener(
        "click",
        function () {
            const currentLevels =
                Array.from(
                    wrapper.querySelectorAll(".desk-set-level")
                ).map(function (level, index) {
                    const data = {
                        method:
                            level.querySelector(".deskLevelMethod").value,
                        key:
                            level.querySelector(".deskLevelKey").value,
                        noises: []
                    };

                    const transitions =
                        wrapper.querySelectorAll(".deskLevelNoise");

                    if (index > 0 && transitions[index - 1]) {
                        data.noises =
                            Array.from(
                                transitions[index - 1].querySelectorAll(".desk-set-noise")
                            ).map(function (noise) {
                                return {
                                    method:
                                        noise.querySelector(".deskNoiseMethod").value,
                                    interval:
                                        parseInt(
                                            noise.querySelector(".deskNoiseInterval").value,
                                            10
                                        ) || 1,
                                    character:
                                        noise.querySelector(".deskNoiseCharacter").value,
                                    word:
                                        noise.querySelector(".deskNoiseWord").value
                                };
                            });
                    }

                    return data;
                });

            currentLevels.push({
                method: "cesare",
                key: "",
                noises: []
            });

            initialData = {
                title: wrapper.querySelector(".deskSetTitle").value,
                description: wrapper.querySelector(".deskSetDescription").value,
                levels: currentLevels
            };

            renderDeskLevels();
            updateDeskCode();
        }
    );

    function renderDeskLevelsFromDom() {
        const levels =
            Array.from(
                wrapper.querySelectorAll(".desk-set-level")
            );

        levels.forEach(function (level, index) {
            const title =
                level.querySelector("strong");

            if (title) {
                title.textContent =
                    "LIVELLO " + (index + 1);
            }
        });
    }

    wrapper.querySelector(".deleteDeskSet").addEventListener(
        "click",
        function () {
            wrapper.remove();
            updateDeskCode();
        }
    );

    wrapper.querySelector(".deskSetTitle").addEventListener(
        "input",
        updateDeskCode
    );

    wrapper.querySelector(".deskSetDescription").addEventListener(
        "input",
        updateDeskCode
    );

    deskSetsContainer.appendChild(wrapper);

    if (initialData) {
        wrapper.querySelector(".deskSetTitle").value =
            initialData.title || "";

        wrapper.querySelector(".deskSetDescription").value =
            initialData.description || "";
    }

    renderDeskLevels();

    return wrapper;
}


function updateDeskNoiseVisibility(
    noise
) {
    const method =
        noise.querySelector(
            ".deskNoiseMethod"
        ).value;

    const character =
        noise.querySelector(
            ".deskNoiseCharacter"
        );

    const word =
        noise.querySelector(
            ".deskNoiseWord"
        );

    if (method === "character") {
        character.classList.remove(
            "hidden"
        );

        word.classList.add(
            "hidden"
        );
    } else {
        character.classList.add(
            "hidden"
        );

        word.classList.remove(
            "hidden"
        );
    }
}

function collectDeskData() {
    const desk = {
        title: deskTitleInput.value.trim(),
        description: "",
        sets: []
    };

    const editors =
        deskSetsContainer.querySelectorAll(".desk-set-editor");

    editors.forEach(function (editor) {
        const set = {
            title: editor.querySelector(".deskSetTitle").value.trim(),
            description: editor.querySelector(".deskSetDescription").value.trim(),
            levels: [],
            instructions: "",
            instructionPosition: 0
        };

        const levels =
            Array.from(
                editor.querySelectorAll(".desk-set-level")
            );

        const transitions =
            Array.from(
                editor.querySelectorAll(".deskLevelNoise")
            );

        levels.forEach(function (level, index) {
            const levelData = {
                method: level.querySelector(".deskLevelMethod").value,
                key: level.querySelector(".deskLevelKey").value,
                noises: []
            };

            if (index > 0 && transitions[index - 1]) {
                levelData.noises =
                    Array.from(
                        transitions[index - 1].querySelectorAll(".desk-set-noise")
                    ).map(function (noise) {
                        return {
                            method: noise.querySelector(".deskNoiseMethod").value,
                            interval: parseInt(
                                noise.querySelector(".deskNoiseInterval").value,
                                10
                            ) || 1,
                            character: noise.querySelector(".deskNoiseCharacter").value,
                            word: noise.querySelector(".deskNoiseWord").value
                        };
                    });
            }

            set.levels.push(levelData);
        });

        desk.sets.push(set);
    });

    return desk;
}

function deskToCode(desk) {
    let code = "DECRYPT_DESK 1\n";

    code +=
        'DESK "' +
        escapeDeskString(desk.title) +
        '" {\n';

    code += "  KIT {\n";

    desk.sets.forEach(function (set) {
        code +=
            '    SET "' +
            escapeDeskString(set.title) +
            '" {\n';

        code +=
            '      description = "' +
            escapeDeskString(set.description) +
            '";\n';

        set.levels.forEach(function (level, index) {
            code +=
                "      level " +
                (index + 1) +
                " {\n";

            code +=
                "        method = " +
                level.method +
                ";\n";

            if (level.method === "cesare") {
                code +=
                    "        key = " +
                    (level.key || 0) +
                    ";\n";
            }

            code += "      }\n";

            if (index < set.levels.length - 1) {
                const noises =
                    set.levels[index + 1].noises || [];

                noises.forEach(function (noise) {
                    code +=
                        "      after level " +
                        (index + 1) +
                        " {\n";

                    code +=
                        "        type = " +
                        noise.method +
                        ";\n";

                    code +=
                        "        interval = " +
                        noise.interval +
                        ";\n";

                    if (noise.method === "character") {
                        code +=
                            '        character = "' +
                            escapeDeskString(noise.character) +
                            '";\n';
                    } else {
                        code +=
                            '        word = "' +
                            escapeDeskString(noise.word) +
                            '";\n';
                    }

                    code += "      }\n";
                });
            }
        });

        if (set.instructions) {
            code += "      instructions {\n";
            code +=
                '        text = "' +
                escapeDeskString(set.instructions) +
                '";\n';
            code +=
                "        position = " +
                set.instructionPosition +
                ";\n";
            code += "      }\n";
        }

        code += "    }\n";
    });

    code += "  }\n";
    code += "}\n";

    return code;
}

function updateDeskCode() {
    const desk = collectDeskData();
    deskCodeOutput.value = deskToCode(desk);
}


function escapeDeskString(
    value
) {
    return String(value || "")
        .replace(
            /\\/g,            "\\\\"
        )
        .replace(
            /"/g,
            '\\"'
        )
        .replace(
            /\n/g,
            "\\n"
        );
}

function updateDeskCode() {
    const desk =
        collectDeskData();

    deskCodeOutput.value =
        deskToCode(desk);
}

addDeskSet.addEventListener(
    "click",
    function () {
        addDeskSetEditor();
        updateDeskCode();
    }
);

deskSetsContainer.addEventListener(
    "input",
    function () {
        updateDeskCode();
    }
);

copyDeskCode.addEventListener(
    "click",
    async function () {
        try {
            await copyTextToClipboard(
                deskCodeOutput.value
            );

            alert(
                "Codice Desk copiato negli appunti."
            );
        } catch (error) {
            alert(
                "Impossibile copiare il codice Desk."
            );
        }
    }
);

deskFileInput.addEventListener(
    "change",
    async function () {
        const file =
            deskFileInput.files[0];

        if (!file) {
            return;
        }

        try {
            deskCodeInput.value =
                await file.text();
        } catch (error) {
            alert(
                "Impossibile leggere il file Desk."
            );
        }
    }
);

applyDeskButton.addEventListener(
    "click",
    function () {
        const code =
            deskCodeInput.value.trim();

        if (!code) {
            alert(
                "Inserisci il codice del Desk."
            );
            return;
        }

        try {
            currentDesk =
                parseDeskCode(code);

            showLoadedDesk();
        } catch (error) {
            alert(
                "Codice Desk non valido."
            );
        }
    }
);

function parseDeskCode(code) {
    const deskMatch =
        code.match(
            /DESK\s+"((?:\\.|[^"])*)"\s*\{([\s\S]*)\}/
        );

    if (!deskMatch) {
        throw new Error(
            "Desk non trovato."
        );
    }

    const desk = {
        title:
            unescapeDeskString(
                deskMatch[1]
            ),

        description: "",

        sets: []
    };

    const body =
        deskMatch[2];

    const setRegex =
        /SET\s+"((?:\\.|[^"])*)"\s*\{([\s\S]*?)\n\s*\}/g;

    let setMatch;

    while (
        (setMatch =
            setRegex.exec(body))
    ) {
        const setBody =
            setMatch[2];

        const set = {
            title:
                unescapeDeskString(
                    setMatch[1]
                ),

            description: "",

            levels: [],

            instructions: "",

            instructionPosition: 0
        };

        const descriptionMatch =
            setBody.match(
                /description\s*=\s*"((?:\\.|[^"])*)"\s*;/
            );

        if (descriptionMatch) {
            set.description =
                unescapeDeskString(
                    descriptionMatch[1]
                );
        }

        const levelRegex =
            /level\s+(\d+)\s*\{([\s\S]*?)\}/g;

        let levelMatch;

        while (
            (levelMatch =
                levelRegex.exec(
                    setBody
                ))
        ) {
            const levelBody =
                levelMatch[2];

            const methodMatch =
                levelBody.match(
                    /method\s*=\s*(cesare|base64)\s*;/
                );

            const keyMatch =
                levelBody.match(
                    /key\s*=\s*(-?\d+)\s*;/
                );

            set.levels.push({
                method:
                    methodMatch
                        ? methodMatch[1]
                        : "cesare",

                key:
                    keyMatch
                        ? keyMatch[1]
                        : "",

                noises: []
            });
        }

        const noiseRegex =
            /after\s+level\s+(\d+)\s*\{([\s\S]*?)\}/g;

        let noiseMatch;

        while (
            (noiseMatch =
                noiseRegex.exec(
                    setBody
                ))
        ) {
            const afterLevel =
                parseInt(
                    noiseMatch[1],
                    10
                );

            const noiseBody =
                noiseMatch[2];

            const typeMatch =
                noiseBody.match(
                    /type\s*=\s*(character|word)\s*;/
                );

            const intervalMatch =
                noiseBody.match(
                    /interval\s*=\s*(\d+)\s*;/
                );

            const characterMatch =
                noiseBody.match(
                    /character\s*=\s*"((?:\\.|[^"])*)"\s*;/
                );

            const wordMatch =
                noiseBody.match(
                    /word\s*=\s*"((?:\\.|[^"])*)"\s*;/
                );

            if (
                set.levels[
                    afterLevel - 1
                ]
            ) {
                set.levels[
                    afterLevel - 1
                ].noises.push({
                    method:
                        typeMatch
                            ? typeMatch[1]
                            : "character",

                    interval:
                        intervalMatch
                            ? parseInt(
                                intervalMatch[1],
                                10
                            )
                            : 1,

                    character:
                        characterMatch
                            ? unescapeDeskString(
                                characterMatch[1]
                            )
                            : "",

                    word:
                        wordMatch
                            ? unescapeDeskString(
                                wordMatch[1]
                            )
                            : ""
                });
            }
        }

        const instructionsMatch =
            setBody.match(
                /instructions\s*\{([\s\S]*?)\}/
            );

        if (instructionsMatch) {
            const instructionBody =
                instructionsMatch[1];

            const textMatch =
                instructionBody.match(
                    /text\s*=\s*"((?:\\.|[^"])*)"\s*;/
                );

            const positionMatch =
                instructionBody.match(
                    /position\s*=\s*(\d+)\s*;/
                );

            if (textMatch) {
                set.instructions =
                    unescapeDeskString(
                        textMatch[1]
                    );
            }

            if (positionMatch) {
                set.instructionPosition =
                    parseInt(
                        positionMatch[1],
                        10
                    );
            }
        }

        desk.sets.push(
            set
        );
    }

    if (
        desk.sets.length === 0
    ) {
        throw new Error(
            "Nessun Set trovato."
        );
    }

    return desk;
}

function unescapeDeskString(
    value
) {
    return String(value || "")
        .replace(
            /\\n/g,
            "\n"
        )
        .replace(
            /\\"/g,
            '"'
        )
        .replace(
            /\\\\/g,
            "\\"
        );
}

function showLoadedDesk() {
    hideDeskPanels();

    deskSets.classList.remove(
        "hidden"
    );

    loadedDeskTitle.textContent =
        currentDesk.title;

    loadedDeskDescription.textContent =
        currentDesk.description ||
        "";

    deskSetList.innerHTML =
        "";

    currentDesk.sets.forEach(
        function (set, index) {
            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "desk-set-list-item";

            item.innerHTML = `
                <h4></h4>
                <p></p>
                <button>APRI SET</button>
            `;

            item.querySelector(
                "h4"
            ).textContent =
                set.title;

            item.querySelector(
                "p"
            ).textContent =
                set.description;

            item.querySelector(
                "button"
            ).addEventListener(
                "click",
                function () {
                    selectedDeskSet =
                        currentDesk.sets[
                            index
                        ];

                    selectedSetTitle.textContent =
                        selectedDeskSet.title;

                    selectedSetDescription.textContent =
                        selectedDeskSet.description;

                    deskSets.classList.add(
                        "hidden"
                    );

                    deskSetChoice.classList.remove(
                        "hidden"
                    );
                }
            );

            deskSetList.appendChild(
                item
            );
        }
    );
}

function applyDeskSetToCifra(
    set
) {
    const config = {
        message: null,

        levels:
            set.levels.map(
                function (level) {
                    return {
                        method:
                            level.method,

                        key:
                            level.key
                    };
                }
            ),

        noiseBlocks: [],

        instructions:
            set.instructions || "",

        instructionPosition:
            set.instructionPosition || 0
    };

    set.levels.forEach(
        function (level, index) {
            (level.noises || [])
                .forEach(
                    function (noise) {
                        config.noiseBlocks.push({
                            afterLevel:
                                index + 1,

                            method:
                                noise.method,

                            interval:
                                noise.interval,

                            character:
                                noise.character,

                            word:
                                noise.word
                        });
                    }
                );
        }
    );

    applyConfigurationToCifra(
        config
    );

    navigate("cifra");
}

function applyDeskSetToDecifra(
    set
) {
    const config = {
        message: null,

        levels:
            set.levels
                .slice()
                .reverse()
                .map(
                    function (level) {
                        return {
                            method:
                                level.method,

                            key:
                                level.key
                        };
                    }
                ),

        noiseBlocks: [],

        instructions:
            set.instructions || "",

        instructionPosition:
            set.instructionPosition || 0
    };

    set.levels
        .slice()
        .reverse()
        .forEach(
            function (level, index) {
                (level.noises || [])
                    .forEach(
                        function (noise) {
                            config.noiseBlocks.push({
                                afterLevel:
                                    index + 1,

                                method:
                                    noise.method,

                                interval:
                                    noise.interval,

                                character:
                                    noise.character,

                                word:
                                    noise.word
                            });
                        }
                    );
            }
        );

    applyConfigurationToDecifra(
        config
    );

    navigate("decifra");
}

useSetCifra.addEventListener(
    "click",
    function () {
        if (selectedDeskSet) {
            applyDeskSetToCifra(
                selectedDeskSet
            );
        }
    }
);

useSetDecifra.addEventListener(
    "click",
    function () {
        if (selectedDeskSet) {
            applyDeskSetToDecifra(
                selectedDeskSet
            );
        }
    }
);

backFromDeskSets.addEventListener(
    "click",
    showDeskHome
);

backFromSetChoice.addEventListener(
    "click",
    function () {
        deskSetChoice.classList.add(
            "hidden"
        );

        deskSets.classList.remove(
            "hidden"
        );
    }
);


// ========================================
// COPIA RISULTATI
// ========================================

const copyEncrypted =
    document.getElementById(
        "copyEncrypted"
    );

const copyDecrypted =
    document.getElementById(
        "copyDecrypted"
    );

async function copyTextToClipboard(
    text
) {
    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {
        await navigator.clipboard.writeText(
            text
        );

        return;
    }

    const temporary =
        document.createElement(
            "textarea"
        );

    temporary.value =
        text;

    temporary.style.position =
        "fixed";

    temporary.style.opacity =
        "0";

    document.body.appendChild(
        temporary
    );

    temporary.focus();
    temporary.select();

    const copied =
        document.execCommand(
            "copy"
        );

    temporary.remove();

    if (!copied) {
        throw new Error(
            "Copia non riuscita."
        );
    }
}

async function copyResult(
    text,
    message
) {
    if (!text) {
        return;
    }

    try {
        await copyTextToClipboard(
            text
        );

        alert(message);
    } catch (error) {
        alert(
            "Impossibile copiare automaticamente il risultato."
        );
    }
}

copyEncrypted.addEventListener(
    "click",
    function () {
        copyResult(
            encryptedMessage.value,
            "Messaggio cifrato copiato negli appunti."
        );
    }
);

copyDecrypted.addEventListener(
    "click",
    function () {
        copyResult(
            decryptedMessage.value,
            "Messaggio decifrato copiato negli appunti."
        );
    }
);


// ========================================
// SEGNALAZIONE BUG
// ========================================

function saveLastEncryptionTicket(
    ticket
) {
    try {
        localStorage.setItem(
            "decrypt_last_encryption_ticket",
            ticket
        );
    } catch (error) {
        // Il programma continua anche se localStorage non è disponibile.
    }
}

function saveLastDecryptionTicket(
    ticket
) {
    try {
        localStorage.setItem(
            "decrypt_last_decryption_ticket",
            ticket
        );
    } catch (error) {
        // Il programma continua anche se localStorage non è disponibile.
    }
}

function getLastEncryptionTicket() {
    try {
        return (
            localStorage.getItem(
                "decrypt_last_encryption_ticket"
            ) || ""
        );
    } catch (error) {
        return "";
    }
}

function getLastDecryptionTicket() {
    try {
        return (
            localStorage.getItem(
                "decrypt_last_decryption_ticket"
            ) || ""
        );
    } catch (error) {
        return "";
    }
}

function buildDecryptBugTicket() {
    const input =
        decryptInputMessage.value;

    const result =
        decryptedMessage.value;

    const levels =
        Array.from(
            decryptLevelsContainer.querySelectorAll(
                ".level"
            )
        );

    const transitions =
        Array.from(
            decryptLevelsContainer.querySelectorAll(
                ".transition"
            )
        );

    let ticket = "";

    ticket +=
        "==============================\n";

    ticket +=
        "DECRYPT - TICKET DI DECIFRATURA\n";

    ticket +=
        "==============================\n\n";

    ticket +=
        "MESSAGGIO INSERITO:\n";

    ticket += (
        input === ""
            ? "Nessun messaggio.\n"
            : input + "\n"
    ) + "\n";

    ticket +=
        "PROCEDURA DI DECIFRATURA:\n\n";

    levels.forEach(
        function (level, index) {
            const method =
                level.querySelector(
                    ".methodSelect"
                ).value;

            ticket +=
                "LIVELLO " +
                (index + 1) +
                ":\n";

            ticket +=
                "Metodo: " +
                (
                    method === "cesare"
                        ? "Cesare"
                        : "Base64"
                ) +
                "\n";

            if (
                method === "cesare"
            ) {
                ticket +=
                    "Chiave: " +
                    level.querySelector(
                        ".keyInput"
                    ).value +
                    "\n";
            }

            ticket += "\n";

            if (
                index <
                levels.length - 1
            ) {
                const transition =
                    transitions[index];

                ticket +=
                    "NOISE TRA LIVELLO " +
                    (index + 1) +
                    " E LIVELLO " +
                    (index + 2) +
                    ":\n";

                if (!transition) {
                    ticket +=
                        "Nessun Noise.\n\n";

                    return;
                }

                const noises =
                    transition.querySelectorAll(
                        ".noise"
                    );

                if (
                    noises.length === 0
                ) {
                    ticket +=
                        "Nessun Noise.\n\n";

                    return;
                }

                noises.forEach(
                    function (
                        noise,
                        noiseIndex
                    ) {
                        const data =
                            readDecryptNoise(
                                noise
                            );

                        ticket +=
                            "Noise " +
                            (noiseIndex + 1) +
                            ":\n";

                        if (
                            data.method ===
                            "character"
                        ) {
                            ticket +=
                                "Metodo: Noise lettera\n";

                            ticket +=
                                "Carattere: " +
                                data.character +
                                "\n";

                            ticket +=
                                "Intervallo: ogni " +
                                data.interval +
                                " caratteri\n\n";
                        } else {
                            ticket +=
                                "Metodo: Noise parola\n";

                            ticket +=
                                "Parola: " +
                                data.word +
                                "\n";

                            ticket +=
                                "Intervallo: ogni " +
                                data.interval +
                                " lettere\n\n";
                        }
                    }
                );
            }
        }
    );

    ticket +=
        "RISULTATO DECIFRATO:\n";

    ticket += (
        result === ""
            ? "Nessun risultato ancora disponibile.\n"
            : result + "\n"
    );

    ticket +=
        "\n==============================\n";

    ticket +=
        "FINE TICKET DI DECIFRATURA\n";

    ticket +=
        "==============================";

    return ticket;
}

function buildBugReport() {
    const encryptionTicket =
        getLastEncryptionTicket();

    const decryptionTicket =
        getLastDecryptionTicket();

    let report = "";

    report +=
        "==============================\n";

    report +=
        "DECRYPT - SEGNALAZIONE BUG\n";

    report +=
        "==============================\n\n";

    report +=
        "TITOLO DEL BUG:\n";

    report +=
        bugTitle.value.trim() +
        "\n\n";

    report +=
        "DESCRIZIONE DEL BUG:\n";

    report +=
        bugDescription.value.trim() +
        "\n\n";

    report +=
        "COSA È SUCCESSO:\n";

    report +=
        bugWhatHappened.value.trim() +
        "\n\n";

    report +=
        "==============================\n";

    report +=
        "TICKET DI CIFRATURA\n";

    report +=
        "==============================\n\n";

    report +=
        encryptionTicket !== ""
            ? encryptionTicket
            : "L'utente non ha cifrato nessun messaggio.\n";

    report +=
        "\n\n";

    report +=
        "==============================\n";
    report +=
        "TICKET DI DECIFRATURA\n";

    report +=
        "==============================\n\n";

    report +=
        decryptionTicket !== ""
            ? decryptionTicket
            : "L'utente non ha decifrato nessun messaggio.\n";

    return report;
}

function updateBugReportButton() {
    const complete =
        bugTitle.value.trim() !== "" &&
        bugDescription.value.trim() !== "" &&
        bugWhatHappened.value.trim() !== "";

    bugReportResult.classList.toggle(
        "hidden",
        !complete
    );
}

bugTitle.addEventListener(
    "input",
    updateBugReportButton
);

bugDescription.addEventListener(
    "input",
    updateBugReportButton
);

bugWhatHappened.addEventListener(
    "input",
    updateBugReportButton
);

copyBugReport.addEventListener(
    "click",
    async function () {
        if (
            bugTitle.value.trim() === "" ||
            bugDescription.value.trim() === "" ||
            bugWhatHappened.value.trim() === ""
        ) {
            return;
        }

        try {
            await copyTextToClipboard(
                buildBugReport()
            );

            const original =
                copyBugReport.textContent;

            copyBugReport.textContent =
                "COPIATA";

            setTimeout(
                function () {
                    copyBugReport.textContent =
                        original;
                },
                1000
            );
        } catch (error) {
            alert(
                "Impossibile copiare automaticamente la segnalazione."
            );
        }
    }
);