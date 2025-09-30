document.addEventListener("DOMContentLoaded", () => {
  const settingsOptions = document.querySelectorAll(".settings-option");
  const settingsContent = document.getElementById("settingsContent");

  // Example credentials/data for each section
  const settingsData = {
    account: `
      <h2>Account Information</h2>
      <div class="settings-data"><strong>Name:</strong> Monica James</div>
      <div class="settings-data"><strong>Email:</strong> monica@example.com</div>
      <div class="settings-data"><strong>Certificate ID:</strong> TRV6-BTC-2023</div>
    `,
    security: `
      <h2>Security Settings</h2>
      <div class="settings-data"><strong>2FA:</strong> Enabled</div>
      <div class="settings-data"><strong>Face ID:</strong> Active</div>
      <div class="settings-data"><strong>Last Login:</strong> ${new Date().toLocaleString()}</div>
    `,
    notifications: `
      <h2>Notifications</h2>
      <div class="settings-data">📩 Email alerts: Enabled</div>
      <div class="settings-data">📱 SMS alerts: Disabled</div>
      <div class="settings-data">🔔 Push notifications: Enabled</div>
    `,
    wallet: `
      <h2>Wallet Details</h2>
      <div class="settings-data"><strong>Current Balance:</strong> $111,639.80 (3.42 BTC)</div>
      <div class="settings-data"><strong>Available Balance:</strong> $111,639.80 (3.08 BTC)</div>
    `,
    transactions: `
      <h2>Transactions</h2>
      <div class="settings-data">Latest: FET Transfer -$2500 on ${new Date().toLocaleDateString()}</div>
      <div class="settings-data">Previous: BTC Deposit +$5000</div>
    `,
    appearance: `
      <h2>Appearance Settings</h2>
      <div class="settings-data">Theme: Dark Mode</div>
      <div class="settings-data">Accent Color: Orange (Bitcoin)</div>
    `,
    help: `
      <h2>Help & Support</h2>
      <div class="settings-data">Visit our FAQ page for answers.</div>
      <div class="settings-data">Support Email: support@trevo6wallet.com</div>
    `
  };

  // Attach click events to settings options
  settingsOptions.forEach(option => {
    option.addEventListener("click", () => {
      const key = option.getAttribute("data-option");
      settingsContent.innerHTML = settingsData[key] || "<p>No data available.</p>";
      document.getElementById("settingsMenu").classList.remove("show"); // hide menu after click
    });
  });
});
