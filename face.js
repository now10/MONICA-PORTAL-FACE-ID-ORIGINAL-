// =======================
// face.js (latest update)
// =======================
const FaceSystem = (() => {
    let video, canvas, loginMessage;
    let registeredFaces = JSON.parse(localStorage.getItem("userFaceData") || "[]");

    function init() {
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        loginMessage = document.getElementById("login-message");

        // Show Face modal
        document.getElementById("faceModal").style.display = "flex";

        startCamera(() => {
            verifyFace();
        });

        // Try Again button
        const tryAgainBtn = document.getElementById("tryAgainBtn");
        if (tryAgainBtn) {
            tryAgainBtn.addEventListener("click", () => {
                loginMessage.textContent = "Retrying...";
                verifyFace();
            });
        }
    }

    function startCamera(callback) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
            .then(stream => {
                video.srcObject = stream;
                if (callback) callback();
            })
            .catch(() => {
                loginMessage.textContent = "Camera access denied.";
            });
    }

    function captureFrame() {
        const ctx = canvas.getContext("2d");
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
        return avgDiff < 50; // tolerance
    }

    function verifyFace() {
        loginMessage.textContent = "🔍 Verifying face...";
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

            // stop after ~4 seconds (4 attempts)
            if (attempts >= 4) {
                clearInterval(checkInterval);

                if (matched) {
                    loginMessage.textContent = "✅ Face Verified!";
                    setTimeout(() => {
                        document.getElementById("faceModal").style.display = "none";
                        document.getElementById("loginForm").style.display = "block"; // show Certificate + Hash
                    }, 800);
                } else {
                    loginMessage.textContent = "❌ Face not recognized. VIP PASS VTL GOOD";
                    setTimeout(() => {
                        document.getElementById("faceModal").style.display = "none";
                        document.getElementById("loginForm").style.display = "block"; // fallback to Certificate + Hash
                    }, 1500);
                }
            }
        }, 1000);
    }

    return { init };
})();
