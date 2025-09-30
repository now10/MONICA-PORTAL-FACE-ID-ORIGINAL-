document.addEventListener("DOMContentLoaded", () => {

    // Show FET Transfer modal immediately
    const fetModal = document.getElementById("fetTransferModal");
    fetModal.style.display = "flex";

    // Get form elements
    const fetForm = document.getElementById("fetTransferForm");
    const confirmBtn = document.getElementById("confirmFetTransfer");
    const successMessage = document.getElementById("fetSuccessMessage");

    // Handle FET Transfer confirmation
    confirmBtn.addEventListener("click", () => {
        const amount = document.getElementById("fetAmount").value;
        const recipient = document.getElementById("fetRecipientName").value;
        const iban = document.getElementById("fetIban").value;
        const bic = document.getElementById("fetBic").value;
        const reference = document.getElementById("fetReference").value;

        // Validate required fields
        if (!amount || !recipient || !iban || !bic) {
            alert("Please fill in all required fields.");
            return;
        }

        // Optional: Submit transfer logic via API or EmailJS can go here

        // Show success message
        successMessage.style.display = "block";

        // Reset form
        fetForm.reset();
    });

});
