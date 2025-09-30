// Toggle menu open/close
const settingsBtn = document.getElementById("settingsBtn");
const settingsMenu = document.getElementById("settingsMenu");
const settingsContent = document.getElementById("settingsContent");

settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent click bubbling
  settingsMenu.classList.toggle("active");
});

// Data for each settings option
const settingsData = {
  account: `
    <h2>Account Settings</h2>
    <p><strong>Name:</strong> Monica Bullerri</p>
    <p><strong>Email:</strong> monica.bulleri@gmail.com</p>
    <p><strong>Username:</strong>VVIP User00571J1</p>
  `,
  security: `
    <h2>Security Settings</h2>
    <p><strong>Password:</strong> ••••••••</p>
    <p><strong>2FA:</strong> Enabled</p>
    <p><strong>Last Login:</strong> Sep 28, 2025</p>
  `,
  notifications: `
    <h2>Notification Settings</h2>
    <p>Email Notifications: On</p>
    <p>SMS Alerts: Off</p>
    <p>Push Notifications: On</p>
  `,
  wallet: `
    <h2>Wallet</h2>
    <p><strong>Balance:</strong> $1xx,xxx.xx</p>
    <p><strong>Wallet ID:</strong> WLT-984721</p>
  `,
  transactions: `
    <h2>Transaction History</h2>
    <ul>
      <li>09/25/2025 - $200 Payment Received</li>
      <li>09/20/2025 - $50 Sent</li>
      <li>09/10/2025 - $500 Deposit</li>
    </ul>
  `,
  appearance: `
    <h2>Appearance</h2>
    <p>Theme: Light</p>
    <p>Font Size: Medium</p>
  `,
  help: `
    <h2>Help & Support</h2>
    <p>For assistance, contact supportwallet02trevo@incmail.com, trevogmailofficial</p>
    <p>FAQ: <a href="#">Click here</a></p>
  `
};

// Attach click listeners to each settings option
document.querySelectorAll(".settings-option").forEach(option => {
  option.addEventListener("click", (e) => {
    e.stopPropagation();

    const key = option.getAttribute("data-option");

    // Make sure content box is visible when something is clicked
    settingsContent.classList.add("active");

    // Fade-out effect before inserting new content
    settingsContent.classList.add("fade-out");

    setTimeout(() => {
      settingsContent.innerHTML = settingsData[key] || "<p>No data available.</p>";
      settingsContent.classList.remove("fade-out");
    }, 400); // matches CSS transition

    // Auto close menu
    settingsMenu.classList.remove("active");
  });
});

// Close menu if clicked outside
document.addEventListener("click", (e) => {
  if (!settingsMenu.contains(e.target) && e.target !== settingsBtn) {
    settingsMenu.classList.remove("active");
  }
});
