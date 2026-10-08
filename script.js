const homeScreen = document.getElementById("homeScreen");
const cifraScreen = document.getElementById("cifraScreen");
const ticketScreen = document.getElementById("ticketScreen");
const decifraScreen = document.getElementById("decifraScreen");
const deskScreen = document.getElementById("deskScreen");
const bugReportScreen = document.getElementById("bugReportScreen");

const btnCifra = document.getElementById("btnCifra");
const btnDecifra = document.getElementById("btnDecifra");
const btnDesk = document.getElementById("btnDesk");

const bugReportButton = document.getElementById("bugReportButton");
const bugTitle = document.getElementById("bugTitle");
const bugDescription = document.getElementById("bugDescription");
const bugWhatHappened = document.getElementById("bugWhatHappened");
const bugReportResult = document.getElementById("bugReportResult");
const copyBugReport = document.getElementById("copyBugReport");
const backFromBugReport = document.getElementById("backFromBugReport");

const inputMessage = document.getElementById("inputMessage");
const encryptedMessage = document.getElementById("encryptedMessage");

const levelsContainer = document.getElementById("levelsContainer");
const addLevel = document.getElementById("addLevel");
const removeLevel = document.getElementById("removeLevel");

const instructionsInput = document.getElementById("instructionsInput");
const instructionPosition = document.getElementById("instructionPosition");
const instructionPositionValue = document.getElementById("instructionPositionValue");

const encryptButton = document.getElementById("encryptButton");
const resultContainer = document.getElementById("resultContainer");
const ticketButton = document.getElementById("ticketButton");
const takeTicket = document.getElementById("takeTicket");
const backFromTicket = document.getElementById("backFromTicket");

const copyEncrypted = document.getElementById("copyEncrypted");

const backHome = document.getElementById("backHome");
const exitCifra = document.getElementById("exitCifra");

const decryptInputMessage = document.getElementById("decryptInputMessage");
const decryptLevelsContainer = document.getElementById("decryptLevelsContainer");
const decryptAddLevel = document.getElementById("decryptAddLevel");
const decryptRemoveLevel = document.getElementById("decryptRemoveLevel");
const decryptButton = document.getElementById("decryptButton");

const decryptResultContainer = document.getElementById("decryptResultContainer");
const decryptedMessage = document.getElementById("decryptedMessage");
const copyDecrypted = document.getElementById("copyDecrypted");

const backHomeDecrypt = document.getElementById("backHomeDecrypt");
const exitDecrypt = document.getElementById("exitDecrypt");

const openFileManagerCifra = document.getElementById("openFileManagerCifra");
const openFileManagerDecifra = document.getElementById("openFileManagerDecifra");

const fileManagerOverlay = document.getElementById("fileManagerOverlay");
const closeFileManager = document.getElementById("closeFileManager");
const dropZone = document.getElementById("dropZone");
const chooseFiles = document.getElementById("chooseFiles");
const fileInput = document.getElementById("fileInput");
const selectedFiles = document.getElementById("selectedFiles");
const filesLoadedButton = document.getElementById("filesLoadedButton");

const deskHome = document.getElementById("deskHome");
const deskCreator = document.getElementById("deskCreator");
const deskLoader = document.getElementById("deskLoader");
const deskSets = document.getElementById("deskSets");
const deskSetChoice = document.getElementById("deskSetChoice");

const createDeskButton = document.getElementById("createDeskButton");
const loadDeskButton = document.getElementById("loadDeskButton");

const deskTitleInput = document.getElementById("deskTitleInput");
const deskSetsContainer = document.getElementById("deskSetsContainer");
const addDeskSet = document.getElementById("addDeskSet");
const deskCodeOutput = document.getElementById("deskCodeOutput");
const copyDeskCode = document.getElementById("copyDeskCode");
const backFromDeskCreator = document.getElementById("backFromDeskCreator");

const deskFileInput = document.getElementById("deskFileInput");
const deskCodeInput = document.getElementById("deskCodeInput");
const applyDeskButton = document.getElementById("applyDeskButton");
const backFromDeskLoader = document.getElementById("backFromDeskLoader");

const loadedDeskTitle = document.getElementById("loadedDeskTitle");
const loadedDeskDescription = document.getElementById("loadedDeskDescription");
const deskSetList = document.getElementById("deskSetList");
const backFromDeskSets = document.getElementById("backFromDeskSets");

const selectedSetTitle = document.getElementById("selectedSetTitle");
const selectedSetDescription = document.getElementById("selectedSetDescription");
const useSetCifra = document.getElementById("useSetCifra");
const useSetDecifra = document.getElementById("useSetDecifra");
const backFromSetChoice = document.getElementById("backFromSetChoice");

let lastTicket = "";

let currentDesk = null;
let currentDeskSet = null;
let currentDeskMode = "";

let deskSetsData = [];


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

    if (screen === "home") {
        homeScreen.classList.remove("hidden");
    }

    if (screen === "cifra") {
        cifraScreen.classList.remove("hidden");
    }

    if (screen === "ticket") {
        ticketScreen.classList.remove("hidden");
    }

    if (screen === "decifra") {
        decifraScreen.classList.remove("hidden");
    }

    if (screen === "desk") {
        deskScreen.classList.remove("hidden");
    }

    if (screen === "bug") {
        bugReportScreen.classList.remove("hidden");
        updateBugReportButton();
    }
}

function navigate(screen) {
    showScreen(screen);
}


// ========================================
// NAVIGAZIONE PRINCIPALE
// ========================================

btnCifra.addEventListener("click", function () {
    navigate("cifra");
});

btnDecifra.addEventListener("click", function () {
    navigate("decifra");
});

btnDesk.addEventListener("click", function () {
    navigate("desk");
});

bugReportButton.addEventListener("click", function () {
    navigate("bug");
});

backHome.addEventListener("click", function () {
    navigate("home");
});

backHomeDecrypt.addEventListener("click", function () {
    navigate("home");
});

backFromBugReport.addEventListener("click", function () {
    navigate("home");
});


// ========================================
// CESARE
// ========================================

function cesareEncrypt(text, key) {
    const shift = ((key % 26) + 26) % 26;

    return Array.from(text).map(function (char) {
        if (char >= "A" && char <= "Z") {
            return String.fromCharCode(
                ((char.charCodeAt(0) - 65 + shift) % 26) + 65
            );
        }

        if (char >= "a" && char <= "z") {
            return String.fromCharCode(
                ((char.charCodeAt(0) - 97 + shift) % 26) + 97
            );
        }

        return char;
    }).join("");
}

function cesareDecrypt(text, key) {
    return cesareEncrypt(text, -key);
}


// ========================================
// BASE64 UTF-8
// ========================================

function base64Encode(text) {
    const bytes = new TextEncoder().encode(text);

    let binary = "";

    bytes.forEach(function (byte) {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary);
}

function base64Decode(text) {
    try {
        const binary = atob(text);
        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        return new TextDecoder().decode(bytes);
    } catch (error) {
        return null;
    }
}


// ========================================
// NOISE CIFRA
// ========================================

function applyCharacterNoise(text, character, interval) {
    let result = "";
    let count = 0;

    for (const char of text) {
        result += char;
        count++;

        if (count % interval === 0) {
            result += character;
        }
    }

    return result;
}

function applyWordNoise(text, word, interval) {
    let result = "";
    let letterCount = 0;
    let wordIndex = 0;

    for (const char of text) {
        result += char;

        if (
            (char >= "A" && char <= "Z") ||
            (char >= "a" && char <= "z")
        ) {
            letterCount++;

            if (letterCount % interval === 0) {
                result += word[wordIndex % word.length];
                wordIndex++;
            }
        }
    }

    return result;
}


// ========================================
// LETTURA NOISE CIFRA
// ========================================

function readNoise(noise) {
    const method = noise.querySelector(".noiseMethod").value;
    const interval = parseInt(
        noise.querySelector(".noiseInterval").value,
        10
    );

    if (method === "character") {
        return {
            method: "character",
            interval: interval,
            character: noise.querySelector(".noiseCharacter").value
        };
    }

    return {
        method: "word",
        interval: interval,
        word: noise.querySelector(".noiseWord").value
    };
}


// ========================================
// CREAZIONE NOISE
// ========================================

function createNoiseElement() {
    const noise = document.createElement("div");
    noise.className = "noise";

    noise.innerHTML = `
        <select class="noiseMethod">
            <option value="character">Noise lettera</option>
            <option value="word">Noise parola</option>
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

        <button class="removeNoise">
            ELIMINA NOISE
        </button>
    `;

    const method = noise.querySelector(".noiseMethod");
    const character = noise.querySelector(".noiseCharacter");
    const word = noise.querySelector(".noiseWord");

    method.addEventListener("change", function () {
        if (method.value === "character") {
            character.classList.remove("hidden");
            word.classList.add("hidden");
        } else {
            character.classList.add("hidden");
            word.classList.remove("hidden");
        }
    });

    noise.querySelector(".removeNoise").addEventListener("click", function () {
        noise.remove();
    });

    return noise;
}


// ========================================
// TRANSIZIONI CIFRA
// ========================================

function createTransitionElement() {
    const transition = document.createElement("div");
    transition.className = "transition";

    transition.innerHTML = `
        <div class="transitionTitle">
            NOISE
        </div>

        <div class="noiseContainer"></div>

        <button class="addNoise">
            + NOISE
        </button>
    `;

    const noiseContainer =
        transition.querySelector(".noiseContainer");

    transition.querySelector(".addNoise").addEventListener(
        "click",
        function () {
            noiseContainer.appendChild(
                createNoiseElement()
            );
        }
    );

    return transition;
}


// ========================================
// LIVELLI CIFRA
// ========================================

function setupLevel(level) {
    const methodSelect =
        level.querySelector(".methodSelect");

    const keyContainer =
        level.querySelector(".keyContainer");

    methodSelect.addEventListener("change", function () {
        if (methodSelect.value === "cesare") {
            keyContainer.classList.remove("hidden");
        } else {
            keyContainer.classList.add("hidden");
        }
    });

    level.querySelector(".deleteLevel").addEventListener(
        "click",
        function () {
            const levels =
                levelsContainer.querySelectorAll(".level");

            if (levels.length <= 1) {
                return;
            }

            const transitions =
                levelsContainer.querySelectorAll(".transition");

            const levelIndex =
                Array.from(
                    levelsContainer.children
                ).indexOf(level);

            if (
                levelIndex > 0 &&
                transitions[levelIndex - 1]
            ) {
                transitions[levelIndex - 1].remove();
            }

            level.remove();

            renumberLevels();
        }
    );
}

function renumberLevels() {
    const levels =
        levelsContainer.querySelectorAll(".level");

    levels.forEach(function (level, index) {
        level.querySelector("h4").textContent =
            "Livello " + (index + 1);
    });
}

function addCifraLevel() {
    const levels =
        levelsContainer.querySelectorAll(".level");

    const lastLevel =
        levels[levels.length - 1];

    const newLevel =
        document.createElement("div");

    newLevel.className = "level";

    newLevel.innerHTML = `
        <h4>Livello ${levels.length + 1}</h4>

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

    const transition =
        createTransitionElement();

    levelsContainer.insertBefore(
        transition,
        lastLevel.nextSibling
    );

    levelsContainer.appendChild(newLevel);

    setupLevel(newLevel);
}

addLevel.addEventListener("click", addCifraLevel);

removeLevel.addEventListener("click", function () {
    const levels =
        levelsContainer.querySelectorAll(".level");

    if (levels.length <= 1) {
        return;
    }

    const transitions =
        levelsContainer.querySelectorAll(".transition");

    if (transitions.length) {
        transitions[transitions.length - 1].remove();
    }

    levels[levels.length - 1].remove();

    renumberLevels();
});

setupLevel(
    levelsContainer.querySelector(".level")
);


// ========================================
// POSIZIONE ISTRUZIONI
// ========================================

instructionsInput.addEventListener("input", function () {
    instructionPosition.max =
        inputMessage.value.length || 0;

    if (
        parseInt(instructionPosition.value, 10) >
        parseInt(instructionPosition.max, 10)
    ) {
        instructionPosition.value =
            instructionPosition.max;
    }

    instructionPositionValue.textContent =
        instructionPosition.value;
});

inputMessage.addEventListener("input", function () {
    const length =
        inputMessage.value.length;

    instructionPosition.max = length;

    if (
        parseInt(instructionPosition.value, 10) >
        length
    ) {
        instructionPosition.value = length;
    }

    instructionPositionValue.textContent =
        instructionPosition.value;
});

instructionPosition.addEventListener("input", function () {
    instructionPositionValue.textContent =
        instructionPosition.value;
});


// ========================================
// INSERIMENTO ISTRUZIONI
// ========================================

function insertInstructions(text, instructions, position) {
    if (instructions === "") {
        return text;
    }

    return (
        text.slice(0, position) +
        instructions +
        "\n\n" +
        text.slice(position)
    );
}


// ========================================
// CIFRATURA
// ========================================

encryptButton.addEventListener("click", function () {
    const message = inputMessage.value;

    if (message === "") {
        alert("Inserisci un messaggio da cifrare.");
        return;
    }

    let result = message;

    const levels =
        Array.from(
            levelsContainer.querySelectorAll(".level")
        );

    const transitions =
        Array.from(
            levelsContainer.querySelectorAll(".transition")
        );

    const ticketLevels = [];

    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];

        const method =
            level.querySelector(".methodSelect").value;

        if (method === "cesare") {
            const key =
                parseInt(
                    level.querySelector(".keyInput").value,
                    10
                );

            if (Number.isNaN(key)) {
                alert(
                    "Inserisci una chiave valida per il livello " +
                    (i + 1) +
                    "."
                );

                return;
            }

            result =
                cesareEncrypt(result, key);

            ticketLevels.push({
                method: "cesare",
                key: key
            });
        } else {
            result =
                base64Encode(result);

            ticketLevels.push({
                method: "base64"
            });
        }

        if (i < levels.length - 1) {
            const transition =
                transitions[i];

            if (transition) {
                const noises =
                    Array.from(
                        transition.querySelectorAll(".noise")
                    );

                for (const noise of noises) {
                    const data =
                        readNoise(noise);

                    if (
                        !Number.isInteger(data.interval) ||
                        data.interval <= 0
                    ) {
                        alert(
                            "Ogni Noise deve avere un intervallo maggiore di 0."
                        );

                        return;
                    }

                    if (data.method === "character") {
                        if (data.character.length !== 1) {
                            alert(
                                "Il Noise lettera deve contenere esattamente un carattere."
                            );

                            return;
                        }

                        result =
                            applyCharacterNoise(
                                result,
                                data.character,
                                data.interval
                            );
                    } else {
                        if (data.word === "") {
                            alert(
                                "Inserisci una parola per il Noise parola."
                            );

                            return;
                        }

                        result =
                            applyWordNoise(
                                result,
                                data.word,
                                data.interval
                            );
                    }
                }
            }
        }
    }

    const instructions =
        instructionsInput.value;

    const position =
        Math.min(
            parseInt(
                instructionPosition.value,
                10
            ) || 0,
            result.length
        );

    instructionPosition.max =
        result.length;

    instructionPosition.value =
        position;

    instructionPositionValue.textContent =
        position;

    const finalResult =
        insertInstructions(
            result,
            instructions,
            position
        );

    encryptedMessage.value =
        finalResult;

    lastTicket =
        createTicket(
            message,
            instructions,
            position,
            ticketLevels,
            transitions,
            finalResult
        );

    saveLastEncryptionTicket(
        lastTicket
    );

    resultContainer.classList.remove(
        "hidden"
    );
});


// ========================================
// TICKET CIFRATURA
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

    ticket += "==============================\n";
    ticket += "DECRYPT - TICKET DI CIFRATURA\n";
    ticket += "==============================\n\n";

    ticket += "MESSAGGIO INIZIALE:\n";
    ticket += originalMessage + "\n\n";

    ticket += "ISTRUZIONI:\n";

    if (instructions === "") {
        ticket += "Nessuna istruzione.\n";
    } else {
        ticket += instructions + "\n";
    }

    ticket +=
        "Posizione: " +
        position +
        "\n\n";

    ticket += "PROCEDURA DI CIFRATURA:\n\n";

    ticketLevels.forEach(function (level, index) {
        ticket +=
            "LIVELLO " +
            (index + 1) +
            ":\n";

        if (level.method === "cesare") {
            ticket +=
                "Metodo: Cesare\n";

            ticket +=
                "Chiave: " +
                level.key +
                "\n";
        } else {
            ticket +=
                "Metodo: Base64\n";
        }

        ticket += "\n";

        if (index < ticketLevels.length - 1) {
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

            if (noises.length === 0) {
                ticket +=
                    "Nessun Noise.\n\n";

                return;
            }

            noises.forEach(
                function (noise, noiseIndex) {
                    const data =
                        readNoise(noise);

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
    });

    ticket +=
        "RISULTATO CIFRATO:\n";

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


// ========================================
// TICKET CIFRATURA
// ========================================

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
            alert(
                "Non è ancora disponibile un ticket di cifratura."
            );

            return;
        }

        try {
            await copyTextToClipboard(
                lastTicket
            );

            alert(
                "Ticket copiato."
            );
        } catch (error) {
            alert(
                "Impossibile copiare il ticket."
            );
        }
    }
);

backFromTicket.addEventListener(
    "click",
    function () {
        navigate("cifra");
    }
);


// ========================================
// COPIA RISULTATO
// ========================================

async function copyTextToClipboard(text) {
    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {
        await navigator.clipboard.writeText(
            text
        );

        return;
    }

    const textarea =