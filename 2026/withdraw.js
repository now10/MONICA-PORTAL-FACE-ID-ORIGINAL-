// withdraw.js - Withdrawal page functionality with scrollable success modal

document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const AVAILABLE_BALANCE = 188590.04;
    const MIN_WITHDRAWAL = 50;
    const PROCESSING_FEE_RATE = 0.015; // 1.5%
    const NETWORK_FEE = 2.50;
    const EXCHANGE_RATE = 0.128; // 1 CNY = 0.128 EUR
    const SECURITY_PIN = '005711'; // Fixed security PIN
    
    // Security state
    let pinAttempts = 3;
    let isLocked = false;
    let lockoutEndTime = null;
    
    // DOM Elements
    const amountInput = document.getElementById('amount');
    const availableBalanceEl = document.getElementById('availableBalance');
    const quickAmountBtns = document.querySelectorAll('.quick-amount-btn');
    const maxAmountBtn = document.getElementById('maxAmount');
    const methodCards = document.querySelectorAll('.method-card');
    const urgencyOptions = document.querySelectorAll('.urgency-option');
    const submitBtn = document.getElementById('submitWithdrawal');
    
    // Fee Display Elements
    const feeAmountEl = document.getElementById('feeAmount');
    const processingFeeEl = document.getElementById('processingFee');
    const processingFeeDisplay = document.getElementById('processingFeeDisplay');
    const networkFeeEl = document.getElementById('networkFee');
    const urgencyFeeEl = document.getElementById('urgencyFee');
    const totalReceiveEl = document.getElementById('totalReceive');
    const externalFeeEl = document.getElementById('externalFee');
    const estimatedTimeEl = document.getElementById('estimatedTime');
    const cnyAmountEl = document.getElementById('cnyAmount');
    
    // Modal Elements
    const confirmationModal = document.getElementById('confirmationModal');
    const pinErrorEl = document.getElementById('pinError');
    const lockoutMessageEl = document.getElementById('lockoutMessage');
    const lockoutTimerEl = document.getElementById('lockoutTimer');
    const reviewSectionEl = document.getElementById('reviewSection');
    const attemptsCountEl = document.getElementById('attemptsCount');
    
    // Confirmation Elements
    const confirmAmountEl = document.getElementById('confirmAmount');
    const confirmMethodEl = document.getElementById('confirmMethod');
    const confirmSpeedEl = document.getElementById('confirmSpeed');
    const confirmTotalEl = document.getElementById('confirmTotal');
    const confirmTimeEl = document.getElementById('confirmTime');
    const confirmProcessingFeeEl = document.getElementById('confirmProcessingFee');
    const confirmFeeAmountEl = document.getElementById('confirmFeeAmount');
    const finalConfirmBtn = document.getElementById('finalConfirm');
    const withdrawalPinInput = document.getElementById('withdrawalPin');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    
    // Success Modal Elements
    const successModal = document.getElementById('successModal');
    const successCloseBtn = successModal.querySelector('.success-close-btn');
    const withdrawalIdEl = document.getElementById('withdrawalId');
    const wdTimestampEl = document.getElementById('wdTimestamp');
    const successFeeAmountEl = document.getElementById('successFeeAmount');
    
    // State
    let selectedAmount = 0;
    let selectedMethod = 'bank-transfer';
    let selectedUrgency = 'standard';
    let urgencyFee = 0;
    let processingDays = 7;
    let processingFee = 0;
    
    // Check if user is locked out
    checkLockoutStatus();
    
    // Initialize
    updateFeeCalculator();
    
    // Event Listeners
    amountInput.addEventListener('input', function() {
        selectedAmount = parseFloat(this.value) || 0;
        validateAmount();
        updateFeeCalculator();
    });
    
    // Quick Amount Buttons
    quickAmountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = this.dataset.amount === 'max' ? AVAILABLE_BALANCE : parseFloat(this.dataset.amount);
            amountInput.value = amount;
            selectedAmount = amount;
            
            // Update button states
            quickAmountBtns.forEach(b => b.classList.remove('active'));
            if (this.dataset.amount !== 'max') {
                this.classList.add('active');
            }
            
            validateAmount();
            updateFeeCalculator();
        });
    });
    
    // Max Amount Button
    maxAmountBtn.addEventListener('click', function() {
        amountInput.value = AVAILABLE_BALANCE;
        selectedAmount = AVAILABLE_BALANCE;
        
        // Update button states
        quickAmountBtns.forEach(b => b.classList.remove('active'));
        
        validateAmount();
        updateFeeCalculator();
    });
    
    // Method Selection
    methodCards.forEach(card => {
        card.addEventListener('click', function() {
            methodCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            selectedMethod = this.dataset.method;
        });
    });
    
    // Urgency Selection
    urgencyOptions.forEach(option => {
        option.addEventListener('click', function() {
            urgencyOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            selectedUrgency = this.dataset.urgency;
            
            // Set urgency fee and processing days
            switch(selectedUrgency) {
                case 'standard':
                    urgencyFee = 0;
                    processingDays = 7;
                    break;
                case 'express':
                    urgencyFee = 15;
                    processingDays = 3;
                    break;
                case 'urgent':
                    urgencyFee = 30;
                    processingDays = 1;
                    break;
            }
            
            updateFeeCalculator();
        });
    });
    
    // Default select standard urgency
    document.querySelector('[data-urgency="standard"]').classList.add('selected');
    
    // Submit Button
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check lockout status
        if (isLocked) {
            showLockoutMessage();
            return;
        }
        
        if (!validateWithdrawal()) {
            return;
        }
        
        // Calculate fees
        processingFee = selectedAmount * PROCESSING_FEE_RATE;
        const cnyAmount = selectedAmount / EXCHANGE_RATE;
        
        // Calculate completion date
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + processingDays);
        const formattedDate = completionDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        // Update confirmation modal
        confirmAmountEl.textContent = `€${selectedAmount.toFixed(2)}`;
        confirmMethodEl.textContent = getMethodName(selectedMethod);
        confirmSpeedEl.textContent = `${getUrgencyName(selectedUrgency)} (${processingDays}-${processingDays+2} days)`;
        confirmTotalEl.textContent = `€${selectedAmount.toFixed(2)}`; // Full amount, fee not deducted
        confirmTimeEl.textContent = formattedDate;
        confirmProcessingFeeEl.textContent = `€${processingFee.toFixed(2)}`;
        confirmFeeAmountEl.textContent = `€${processingFee.toFixed(2)}`;
        
        // Update success modal fee amount
        successFeeAmountEl.textContent = `€${processingFee.toFixed(2)}`;
        
        // Reset PIN input and error message
        withdrawalPinInput.value = '';
        pinErrorEl.classList.remove('show');
        lockoutMessageEl.classList.remove('show');
        reviewSectionEl.style.display = 'block';
        
        // Update attempts display
        attemptsCountEl.textContent = `Attempts remaining: ${pinAttempts}`;
        
        // Show confirmation modal
        confirmationModal.style.display = 'flex';
        
        // Reset checkbox
        agreeTermsCheckbox.checked = false;
    });
    
    // Final Confirmation
    finalConfirmBtn.addEventListener('click', function() {
        const pin = withdrawalPinInput.value.trim();
        
        if (isLocked) {
            showLockoutMessage();
            return;
        }
        
        if (!agreeTermsCheckbox.checked) {
            alert('You must agree to the processing fee deposit terms');
            agreeTermsCheckbox.focus();
            return;
        }
        
        // Validate PIN
        if (pin !== SECURITY_PIN) {
            handleWrongPin();
            return;
        }
        
        // PIN is correct - proceed with withdrawal
        processWithdrawal();
    });
    
    // Modal Close Buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Success modal close button
    successCloseBtn.addEventListener('click', closeSuccessModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
        if (e.target.classList.contains('success-modal')) {
            closeSuccessModal();
        }
    });
    
    // Functions
    function checkLockoutStatus() {
        const lockoutEnd = localStorage.getItem('withdrawalLockoutEnd');
        
        if (lockoutEnd) {
            lockoutEndTime = new Date(lockoutEnd);
            const now = new Date();
            
            if (now < lockoutEndTime) {
                isLocked = true;
                startLockoutTimer();
            } else {
                // Lockout period has ended
                localStorage.removeItem('withdrawalLockoutEnd');
                localStorage.removeItem('pinAttempts');
                pinAttempts = 3;
                isLocked = false;
            }
        }
        
        // Get saved attempts
        const savedAttempts = localStorage.getItem('pinAttempts');
        if (savedAttempts) {
            pinAttempts = parseInt(savedAttempts);
        }
    }
    
    function handleWrongPin() {
        pinAttempts--;
        
        if (pinAttempts <= 0) {
            // Lock user out for 24 hours
            isLocked = true;
            lockoutEndTime = new Date();
            lockoutEndTime.setHours(lockoutEndTime.getHours() + 24);
            
            // Save to localStorage
            localStorage.setItem('withdrawalLockoutEnd', lockoutEndTime.toISOString());
            localStorage.setItem('pinAttempts', '0');
            
            showLockoutMessage();
            startLockoutTimer();
        } else {
            // Show error message
            pinErrorEl.classList.add('show');
            reviewSectionEl.style.display = 'none';
            
            // Update attempts display
            attemptsCountEl.textContent = `Attempts remaining: ${pinAttempts}`;
            
            // Save attempts
            localStorage.setItem('pinAttempts', pinAttempts.toString());
        }
    }
    
    function showLockoutMessage() {
        lockoutMessageEl.classList.add('show');
        reviewSectionEl.style.display = 'none';
        pinErrorEl.classList.remove('show');
    }
    
    function startLockoutTimer() {
        if (!lockoutEndTime) return;
        
        function updateTimer() {
            const now = new Date();
            const diff = lockoutEndTime - now;
            
            if (diff <= 0) {
                // Lockout period ended
                isLocked = false;
                lockoutMessageEl.classList.remove('show');
                pinAttempts = 3;
                localStorage.removeItem('withdrawalLockoutEnd');
                localStorage.removeItem('pinAttempts');
                return;
            }
            
            // Calculate hours, minutes, seconds
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            // Update display
            lockoutTimerEl.textContent = 
                `${hours.toString().padStart(2, '0')}:` +
                `${minutes.toString().padStart(2, '0')}:` +
                `${seconds.toString().padStart(2, '0')}`;
            
            // Continue updating
            setTimeout(updateTimer, 1000);
        }
        
        updateTimer();
    }
    
    function processWithdrawal() {
        // Generate withdrawal ID
        const timestamp = new Date().getTime();
        const wdId = `WD-USER00571J1-${timestamp}`;
        
        // Update success modal
        wdTimestampEl.textContent = timestamp;
        
        // Simulate processing
        finalConfirmBtn.innerHTML = '<div class="spinner"></div> Processing...';
        finalConfirmBtn.disabled = true;
        
        setTimeout(() => {
            // Close confirmation modal
            confirmationModal.style.display = 'none';
            
            // Show success modal
            successModal.style.display = 'flex';
            
            // Reset button
            finalConfirmBtn.innerHTML = 'Confirm Withdrawal';
            finalConfirmBtn.disabled = false;
            
            // Reset PIN attempts on successful submission
            pinAttempts = 3;
            localStorage.removeItem('pinAttempts');
            
            // Update used today amount
            const usedTodayEl = document.getElementById('usedToday');
            const currentUsed = parseFloat(usedTodayEl.textContent.replace('€', '')) || 0;
            const newUsed = currentUsed + selectedAmount;
            usedTodayEl.textContent = `€${newUsed.toFixed(2)}`;
            
            // Update progress bar
            const dailyLimit = 25000;
            const progressPercent = Math.min((newUsed / dailyLimit) * 100, 100);
            document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
            
            // Add to transaction history (simulated)
            addToTransactionHistory(wdId, selectedAmount);
            
            // Reset form
            resetForm();
        }, 2000);
    }
    
    function addToTransactionHistory(wdId, amount) {
        // In a real app, this would be sent to a backend
        console.log(`Withdrawal ${wdId} for €${amount.toFixed(2)} submitted with status: PENDING`);
        console.log(`Processing fee required: €${processingFee.toFixed(2)}`);
        console.log(`Status will change to PROCESSING after fee deposit confirmation`);
    }
    
    function closeSuccessModal() {
        successModal.style.display = 'none';
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    }
    
    function validateAmount() {
        if (selectedAmount < MIN_WITHDRAWAL) {
            amountInput.style.borderColor = 'var(--danger-color)';
            return false;
        } else if (selectedAmount > AVAILABLE_BALANCE) {
            amountInput.style.borderColor = 'var(--danger-color)';
            return false;
        } else {
            amountInput.style.borderColor = 'var(--accent-color)';
            return true;
        }
    }
    
    function updateFeeCalculator() {
        if (selectedAmount <= 0) {
            resetFeeDisplay();
            return;
        }
        
        // Calculate fees
        processingFee = selectedAmount * PROCESSING_FEE_RATE;
        const cnyAmount = selectedAmount / EXCHANGE_RATE;
        
        // Full amount sent (fee not deducted)
        const totalReceive = selectedAmount;
        
        // Update display
        feeAmountEl.textContent = `€${selectedAmount.toFixed(2)}`;
        processingFeeEl.textContent = `€${processingFee.toFixed(2)}`;
        processingFeeDisplay.textContent = `€${processingFee.toFixed(2)}`;
        networkFeeEl.textContent = `€${NETWORK_FEE.toFixed(2)}`;
        urgencyFeeEl.textContent = `€${urgencyFee.toFixed(2)}`;
        totalReceiveEl.textContent = `€${totalReceive.toFixed(2)}`;
        externalFeeEl.textContent = `€${processingFee.toFixed(2)}`;
        
        // Set estimated time
        let estimatedTime = '';
        switch(selectedUrgency) {
            case 'standard':
                estimatedTime = '7-10 business days*';
                break;
            case 'express':
                estimatedTime = '3-5 business days*';
                break;
            case 'urgent':
                estimatedTime = '24-48 hours*';
                break;
        }
        estimatedTimeEl.textContent = estimatedTime + ' (*after fee deposit)';
        
        // Update CNY amount
        cnyAmountEl.textContent = `${cnyAmount.toFixed(2)} CNY`;
    }
    
    function resetFeeDisplay() {
        feeAmountEl.textContent = '€0.00';
        processingFeeEl.textContent = '€0.00';
        processingFeeDisplay.textContent = '€0.00';
        networkFeeEl.textContent = '€2.50';
        urgencyFeeEl.textContent = '€0.00';
        totalReceiveEl.textContent = '€0.00';
        externalFeeEl.textContent = '€0.00';
        estimatedTimeEl.textContent = '7-10 business days*';
        cnyAmountEl.textContent = '0.00 CNY';
    }
    
    function validateWithdrawal() {
        if (isLocked) {
            showLockoutMessage();
            return false;
        }
        
        if (!validateAmount()) {
            alert(`Please enter a valid amount between €${MIN_WITHDRAWAL} and €${AVAILABLE_BALANCE}`);
            amountInput.focus();
            return false;
        }
        
        if (selectedAmount < MIN_WITHDRAWAL) {
            alert(`Minimum withdrawal amount is €${MIN_WITHDRAWAL}`);
            amountInput.focus();
            return false;
        }
        
        if (selectedAmount > AVAILABLE_BALANCE) {
            alert('Insufficient balance');
            amountInput.focus();
            return false;
        }
        
        return true;
    }
    
    function getMethodName(method) {
        switch(method) {
            case 'bank-transfer': return 'Bank Transfer';
            case 'paypal': return 'PayPal';
            case 'crypto': return 'Crypto Wallet';
            default: return 'Bank Transfer';
        }
    }
    
    function getUrgencyName(urgency) {
        switch(urgency) {
            case 'standard': return 'Standard';
            case 'express': return 'Express';
            case 'urgent': return 'Urgent';
            default: return 'Standard';
        }
    }
    
    function closeConfirmationModal() {
        confirmationModal.style.display = 'none';
        withdrawalPinInput.value = '';
        pinErrorEl.classList.remove('show');
        lockoutMessageEl.classList.remove('show');
        reviewSectionEl.style.display = 'block';
    }
    
    function resetForm() {
        amountInput.value = '';
        selectedAmount = 0;
        urgencyFee = 0;
        processingDays = 7;
        processingFee = 0;
        
        // Reset urgency selection
        urgencyOptions.forEach(o => o.classList.remove('selected'));
        document.querySelector('[data-urgency="standard"]').classList.add('selected');
        selectedUrgency = 'standard';
        
        // Reset quick amount buttons
        quickAmountBtns.forEach(b => b.classList.remove('active'));
        
        updateFeeCalculator();
    }
    
    // Initialize with example data
    setTimeout(() => {
        // Simulate a pre-filled amount from preliminary form
        const urlParams = new URLSearchParams(window.location.search);
        const prefillAmount = urlParams.get('amount');
        
        if (prefillAmount && !isNaN(parseFloat(prefillAmount))) {
            const amount = parseFloat(prefillAmount);
            if (amount >= MIN_WITHDRAWAL && amount <= AVAILABLE_BALANCE) {
                amountInput.value = amount;
                selectedAmount = amount;
                validateAmount();
                updateFeeCalculator();
                
                // Highlight appropriate quick amount button
                quickAmountBtns.forEach(btn => {
                    if (parseFloat(btn.dataset.amount) === amount) {
                        btn.classList.add('active');
                    }
                });
            }
        }
    }, 500);
    
    // Make closeSuccessModal available globally
    window.closeSuccessModal = closeSuccessModal;
});