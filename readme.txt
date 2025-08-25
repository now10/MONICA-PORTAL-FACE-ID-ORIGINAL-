<script>
document.getElementById("confirmFetTransfer").addEventListener("click", function () {
    const amount = document.getElementById("fetAmount").value.trim();
    const name = document.getElementById("fetRecipientName").value.trim();
    const iban = document.getElementById("fetIban").value.trim();
    const bic = document.getElementById("fetBic").value.trim();
    const reference = document.getElementById("fetReference").value.trim();
    const messageBox = document.getElementById("fetSuccessMessage");

    // Basic validation
    if (!amount || !name || !iban || !bic || !reference) {
        alert("Please fill in all the fields before confirming the transfer.");
        return;
    }

    // Show processing message
    messageBox.textContent = "Processing to FET VVIP SHIELD CALL VERIFICATION";
    messageBox.style.display = "block";

    // Wait 2.5 seconds before redirecting
    setTimeout(function () {
        window.location.href = "call/index.html";
    }, 2500);
});
</script>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page title</title>
</head>
<body>
    
</body>
</html>


xxxxxxx.success-message {
    margin-top: 20px;
    color: #28a745;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
}
