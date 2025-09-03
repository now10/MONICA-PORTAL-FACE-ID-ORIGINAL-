// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const homeScreen = document.querySelector('.home-screen');
    const callingScreen = document.querySelector('.calling-screen');
    const incomingCallScreen = document.querySelector('.incoming-call-screen');
    const activeCallScreen = document.querySelector('.active-call-screen');
    const startCallButton = document.getElementById('start-call');
    const answerCallButton = document.getElementById('answer-call');
    const declineCallButton = document.getElementById('decline-call');
    const endCallButton = document.getElementById('end-call');
    const muteButton = document.getElementById('mute-button');
    const speakerButton = document.getElementById('speaker-button');
    const subtitles = document.getElementById('subtitles');
    const inputStatus = document.getElementById('input-status');
    const ringtone = document.getElementById('ringtone');
    const callAnswerSound = document.getElementById('call-answer-sound');
    const callDeclineSound = document.getElementById('call-decline-sound');
    const callTimer = document.querySelector('.call-timer');
    const swipeHandle = document.getElementById('swipe-handle');
    const progressSteps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4'),
        document.getElementById('step-5')
    ];

    const keys = document.querySelectorAll('.key');

    // State
    let callActive = false;
    let callDuration = 0;
    let callInterval;
    let currentStep = 0;
    let userInput = "";
    let errorCount = 0;

    const expectedPin = "101029";

    const verificationData = {
        name: "Monica Bulleri",
        pin: expectedPin,
        accountNumber: "1010299",
        transferAmount: "$11000",
        beneficiary: "Monica Belluri",
        fee: "$88.88"
    };

    // Show screen
    function showScreen(screen) {
        document.querySelectorAll('.screen > div').forEach(div => div.classList.remove('active'));
        screen.classList.add('active');
    }

    // Start call
    startCallButton.addEventListener('click', function() {
        showScreen(callingScreen);
        ringtone.play().catch(e => console.log("Audio play failed:", e));
        setTimeout(() => showScreen(incomingCallScreen), 2000);
    });

    // Answer call
    function answerCall() {
        showScreen(activeCallScreen);
        ringtone.pause();
        ringtone.currentTime = 0;
        callAnswerSound.play();
        callActive = true;
        currentStep = 0;
        startCallTimer();
        setTimeout(() => startVerificationProcess(), 1000);
    }

    // Decline call
    function declineCall() {
        showScreen(homeScreen);
        ringtone.pause();
        ringtone.currentTime = 0;
        callDeclineSound.play();
    }

    // Swipe answer/decline
    let startY = 0, currentY = 0;
    swipeHandle.addEventListener('touchstart', e => startY = e.touches[0].clientY);
    swipeHandle.addEventListener('touchmove', e => {
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > -100 && diff < 100) swipeHandle.style.transform = `translateY(${diff}px)`;
    });
    swipeHandle.addEventListener('touchend', () => {
        const diff = currentY - startY;
        if (diff < -50) answerCall();
        else if (diff > 50) declineCall();
        swipeHandle.style.transform = 'translateY(0)';
    });

    // Buttons
    answerCallButton.addEventListener('click', answerCall);
    declineCallButton.addEventListener('click', declineCall);

    // End call
    endCallButton.addEventListener('click', function() {
        showScreen(homeScreen);
        callActive = false;
        clearInterval(callInterval);
        callDuration = 0;
        resetVerificationProcess();
    });

    // Keypad
    keys.forEach(key => {
        key.addEventListener('click', function() {
            if (!callActive) return;
            const digit = this.textContent;
            handleKeyPress(digit);
        });
    });

    function handleKeyPress(digit) {
        if (digit === '#') {
            processUserInput();
            userInput = "";
            return;
        } else if (digit === '*') {
            userInput = "";
            updateInputStatus();
            return;
        }
        userInput += digit;
        updateInputStatus();
    }

    function updateInputStatus() {
        if (currentStep === 1) inputStatus.textContent = '*'.repeat(userInput.length);
        else inputStatus.textContent = userInput;
    }

    function processUserInput() {
        switch(currentStep) {
            case 0:
                if (userInput === "1") {
                    speak("Thank you. Please enter your VTL-VOLT PIN followed by the pound key.");
                    progressSteps[0].classList.add('completed');
                    progressSteps[1].classList.add('active');
                    currentStep = 1; errorCount = 0;
                } else handleError("Please press 1 for yes or 2 for no.");
                break;

            case 1:
                if (userInput === verificationData.pin) {
                    speak("PIN verified successfully. Please enter your account number/Iban number followed by the pound key.");
                    progressSteps[1].classList.add('completed');
                    progressSteps[2].classList.add('active');
                    currentStep = 2; errorCount = 0;
                } else handleError("Invalid PIN. Please try again.");
                break;

            case 2:
                if (userInput === verificationData.accountNumber) {
                    speak("Account number verified. Please enter the transfer amount followed by the pound key.");
                    progressSteps[2].classList.add('completed');
                    progressSteps[3].classList.add('active');
                    currentStep = 3; errorCount = 0;
                } else handleError("Account number does not match. Please try again.");
                break;

            case 3:
                const amountDigits = verificationData.transferAmount.replace(/[$,]/g, '');
                if (userInput === amountDigits) {
                    speak("Transfer amount verified. Please enter the beneficiary name. Press 1 for Monica Belluri, press 2 for Sarah Johnson.");
                    progressSteps[3].classList.add('completed');
                    progressSteps[4].classList.add('active');
                    currentStep = 4; errorCount = 0;
                } else handleError("Transfer amount does not match. Please try again.");
                break;

            case 4:
                if (userInput === "1") {
                    speak("Beneficiary verified. Your transfer requires a security fee of $88.88 to complete the procedure. Press 1 to confirm and proceed with payment, press 2 to cancel.");
                    progressSteps[4].classList.add('completed');
                    currentStep = 5; errorCount = 0;
                } else handleError("Beneficiary does not match. Please try again.");
                break;

            case 5:
                if (userInput === "1") {
                    // ✅ final confirmation → auto redirect after speech
                    const finalText = "Thank you for confirming. Your transfer is now being processed with the security fee.";
                    speak(finalText, () => {
                        subtitles.textContent = "Redirecting to Telegram…";
                        setTimeout(() => redirectToTelegram(), 2000);
                    });
                    currentStep = 6;
                } else if (userInput === "2") {
                    speak("Transfer cancelled. Thank you for using our verification system.");
                    setTimeout(() => endCallButton.click(), 3000);
                }
                break;
        }
    }

    function handleError(message) {
        errorCount++;
        if (errorCount >= 2) {
            speak("Too many incorrect attempts. Verification failed. Goodbye.");
            setTimeout(() => endCallButton.click(), 3000);
        } else speak(message);
    }

    // ✅ Redirect function
    function redirectToTelegram() {
        const message = "I am here to make Payment fee of $88.88 (dollars) to confirm and progress my initiated transfer using FET SERVICE...";
        const encodedMessage = encodeURIComponent(message);
        const telegramAppUrl = `tg://resolve?domain=messageivan&text=${encodedMessage}`;
        const telegramWebUrl = `https://t.me/messageivan?text=${encodedMessage}`;

        // Try app first, fallback to web
        window.location.href = telegramAppUrl;
        setTimeout(() => { window.location.href = telegramWebUrl; }, 1500);
    }

    // TTS
    function speak(text, onEnd) {
        subtitles.textContent = text;
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            speech.volume = 1;
            speech.rate = 0.9;
            speech.pitch = 1;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(speech);
            if (onEnd) speech.onend = onEnd;
        }
    }

    // Start verification
    function startVerificationProcess() {
        speak("Hello, Investor Monica Bulleri. For your security, we will now complete verification of your recent transfer. Please confirm your identity. Press 1 for yes, press 2 for no.");
        progressSteps[0].classList.add('active');
    }

    // Reset
    function resetVerificationProcess() {
        currentStep = 0;
        userInput = "";
        errorCount = 0;
        inputStatus.textContent = "Please wait...";
        progressSteps.forEach(step => step.classList.remove('active', 'completed'));
    }

    // Timer
    function startCallTimer() {
        callInterval = setInterval(() => {
            callDuration++;
            const minutes = Math.floor(callDuration / 60).toString().padStart(2, '0');
            const seconds = (callDuration % 60).toString().padStart(2, '0');
            callTimer.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    // Mute / Speaker
    muteButton.addEventListener('click', function() {
        this.classList.toggle('active');
        this.textContent = this.classList.contains('active') ? "Unmute" : "Mute";
    });
    speakerButton.addEventListener('click', function() {
        this.classList.toggle('active');
        this.textContent = this.classList.contains('active') ? "Speaker On" : "Speaker Off";
    });
});
