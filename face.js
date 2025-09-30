// =======================
// face.js (unified)
// =======================
const FaceSystem = (() => {
    let video, canvas;
    let instructions, saveSection, saveBtn, successMessage;
    let loginMessage, loginForm, faceModal;

    let registeredFaces = JSON.parse(localStorage.getItem("userFaceData") || "[]");

    function init(mode) {
        // Shared
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");

        // Setup-specific
        instructions = document.getElementById("instructions");
        saveSection = document.getElementById("save-section");
        saveBtn = document.getElementById("saveBtn");
        successMessage = document.getElementById("success-message");

        // Login-specific
        loginMessage = document.getElementById("login-message");
        loginForm = document.getElementById("loginForm");
        faceModal = document.getElementById("faceModal");

        if (mode === "setup") {
            runSetup();
        } else if (mode === "login") {
            runLogin();
        }
    }

    // ----------------
    // FACE SETUP FLOW
    // ----------------
    function runSetup() {
        startCamera(() => {
            if (instructions) instructions.textContent = "📸 Hold still, capturing your face...";
            setTimeout(() => {
                if (instructions) instructions.textContent = "✅ Face captured! Please save to continue.";
                if (saveSection) saveSection.style.display = "block";
            }, 4000);
        });

        if (saveBtn) {
            saveBtn.addEventListener("click", () => {
                const faceData = captureFrame();
                if (faceData) {
                    localStorage.setItem("userFaceData", JSON.stringify([canvas.toDataURL()]));
                    if (saveSection) saveSection.style.display = "none";
                    if (instructions) instructions.style.display = "none";
                    if (successMessage) successMessage.style.display = "block";
                }
            });
        }
    }

    // ----------------
    // FACE LOGIN FLOW
    // ----------------
    function runLogin() {
        if (faceModal) faceModal.style.display = "flex";
        if (loginMessage) loginMessage.textContent = "🔍 Initializing camera...";

        startCamera(() => {
            verifyFace();
        });

        const tryAgainBtn = document.getElementById("tryAgainBtn");
        if (tryAgainBtn) {
            tryAgainBtn.addEventListener("click", () => {
                if (loginMessage) loginMessage.textContent = "Retrying...";
                verifyFace();
            });
        }
    }

    function verifyFace() {
        if (loginMessage) loginMessage.textContent = "🔍 Verifying face...";
        let attempts = 0;
        let matched = false;

        const checkInterval = setInterval(() => {
            attempts++;
            const currentFrame = captureFrame();

            matched = registeredFaces.some(fData => {
                const frameData = new Image();
                frameData.src = fData;
                const tempCanvas = document.createElement("canvas");
                const tempCtx = tempCanvas.getContext("2d");
                tempCanvas.width = video.videoWidth;
                tempCanvas.height = video.videoHeight;
                tempCtx.drawImage(frameData, 0, 0);
                return compareFrames(
                    currentFrame,
                    tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
                );
            });

            if (attempts >= 4) {
                clearInterval(checkInterval);

                if (matched) {
                    if (loginMessage) loginMessage.textContent = "✅ Face Verified!";
                    setTimeout(() => {
                        if (faceModal) faceModal.style.display = "none";
                        if (loginForm) loginForm.style.display = "block"; // show Certificate + Hash
                    }, 800);
                } else {
                    if (loginMessage) loginMessage.textContent = "❌ Face not recognized. VIP PASS VTL GOOD";
                    setTimeout(() => {
                        if (faceModal) faceModal.style.display = "none";
                        if (loginForm) loginForm.style.display = "block"; // fallback
                    }, 1500);
                }
            }
        }, 1000);
    }

    // ----------------
    // SHARED FUNCTIONS
    // ----------------
    function startCamera(callback) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
            .then(stream => {
                video.srcObject = stream;
                if (callback) callback();
            })
            .catch(() => {
                if (instructions) instructions.textContent = "⚠️ Camera access denied.";
                if (loginMessage) loginMessage.textContent = "⚠️ Camera access denied.";
            });
    }

    function captureFrame() {
        const ctx = canvas.getContext("2d");
        if (!video.videoWidth || !video.videoHeight) return null;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function compareFrames(frame1, frame2) {
        let diff = 0;
        for (let i = 0; i < frame1.data.length; i += 4) {
            diff += Math.abs(frame1.data[i] - frame2.data[i]);
            diff += Math.abs(frame1.data[i + 1] - frame2.data[i + 1]);
            diff += Math.abs(frame1.data[i + 2] - frame2.data[i + 2]);
        }
        const avgDiff = diff / (frame1.data.length / 4);
        return avgDiff < 50;
    }

    return { init };
})();
