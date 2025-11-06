// Toggle NEW popup menu open/close
const settingsBtn = document.getElementById("settingsBtn");
const settingsPopupMenu = document.getElementById("settingsPopupMenu");

settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent click bubbling
  settingsPopupMenu.classList.toggle("active");
});

// Data for each settings option
const settingsData = {
  account: `
    <div class="settings-page-content">
      <h2><i class="fas fa-user-circle"></i> Account Settings</h2>
      <div class="settings-section">
        <div class="info-item">
          <label>Full Name:</label>
          <span>Monica Bullerri</span>
        </div>
        <div class="info-item">
          <label>Email:</label>
          <span>monica.bulleri@gmail.com</span>
        </div>
        <div class="info-item">
          <label>Username:</label>
          <span>VVIP User00571J1</span>
        </div>
        <div class="info-item">
          <label>Account Tier:</label>
          <span class="vip-badge">VIP Pro</span>
        </div>
      </div>
    </div>
  `,
  security: `
    <div class="settings-page-content">
      <h2><i class="fas fa-shield-alt"></i> Security Settings</h2>
      <div class="settings-section">
        <div class="info-item">
          <label>Password:</label>
          <span>•••••••• <button class="change-btn">Change</button></span>
        </div>
        <div class="info-item">
          <label>2FA:</label>
          <span class="status-enabled">Enabled</span>
        </div>
        <div class="info-item">
          <label>Last Login:</label>
          <span>Sep 28, 2025</span>
        </div>
        <div class="info-item">
          <label>Face ID:</label>
          <span class="status-enabled">Active</span>
        </div>
      </div>
    </div>
  `,
  notifications: `
    <div class="settings-page-content">
      <h2><i class="fas fa-bell"></i> Notification Settings</h2>
      <div class="settings-section">
        <div class="toggle-item">
          <label>Email Notifications</label>
          <div class="toggle-switch active">
            <div class="toggle-slider"></div>
          </div>
        </div>
        <div class="toggle-item">
          <label>SMS Alerts</label>
          <div class="toggle-switch">
            <div class="toggle-slider"></div>
          </div>
        </div>
        <div class="toggle-item">
          <label>Push Notifications</label>
          <div class="toggle-switch active">
            <div class="toggle-slider"></div>
          </div>
        </div>
        <div class="toggle-item">
          <label>Price Alerts</label>
          <div class="toggle-switch active">
            <div class="toggle-slider"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  wallet: `
    <div class="settings-page-content">
      <h2><i class="fas fa-wallet"></i> Wallet Settings</h2>
      <div class="settings-section">
        <div class="info-item">
          <label>Current Balance:</label>
          <span>$111,639.80</span>
        </div>
        <div class="info-item">
          <label>Available Balance:</label>
          <span>$111,639.80</span>
        </div>
        <div class="info-item">
          <label>Wallet ID:</label>
          <span>WLT-984721</span>
        </div>
        <div class="info-item">
          <label>Wallet Status:</label>
          <span class="status-active">Active</span>
        </div>
      </div>
    </div>
  `,
  transactions: `
    <div class="settings-page-content">
      <h2><i class="fas fa-history"></i> Transaction History</h2>
      <div class="settings-section">
        <div class="transaction-list">
          <div class="transaction-item success">
            <div class="transaction-icon"><i class="fas fa-arrow-down"></i></div>
            <div class="transaction-details">
              <div class="transaction-type">Deposit Received</div>
              <div class="transaction-date">Sep 25, 2025</div>
            </div>
            <div class="transaction-amount">+$200.00</div>
          </div>
          <div class="transaction-item sent">
            <div class="transaction-icon"><i class="fas fa-arrow-up"></i></div>
            <div class="transaction-details">
              <div class="transaction-type">Payment Sent</div>
              <div class="transaction-date">Sep 20, 2025</div>
            </div>
            <div class="transaction-amount">-$50.00</div>
          </div>
          <div class="transaction-item success">
            <div class="transaction-icon"><i class="fas fa-arrow-down"></i></div>
            <div class="transaction-details">
              <div class="transaction-type">Deposit Received</div>
              <div class="transaction-date">Sep 10, 2025</div>
            </div>
            <div class="transaction-amount">+$500.00</div>
          </div>
        </div>
      </div>
    </div>
  `,
  appearance: `
    <div class="settings-page-content">
      <h2><i class="fas fa-moon"></i> Appearance Settings</h2>
      <div class="settings-section">
        <div class="theme-selector">
          <label>Theme:</label>
          <select class="theme-dropdown">
            <option>Dark Theme</option>
            <option>Light Theme</option>
            <option>Auto</option>
          </select>
        </div>
        <div class="theme-selector">
          <label>Font Size:</label>
          <select class="theme-dropdown">
            <option>Small</option>
            <option selected>Medium</option>
            <option>Large</option>
          </select>
        </div>
        <div class="theme-selector">
          <label>Language:</label>
          <select class="theme-dropdown">
            <option selected>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
      </div>
    </div>
  `,
  help: `
    <div class="settings-page-content">
      <h2><i class="fas fa-question-circle"></i> Help & Support</h2>
      <div class="settings-section">
        <div class="support-contact">
          <p><strong>Email Support:</strong> supportwallet02trevo@incmail.com</p>
          <p><strong>Official Contact:</strong> trevogmailofficial</p>
          <p><strong>Response Time:</strong> Within 24 hours</p>
        </div>
        <div class="support-actions">
          <button class="support-btn"><i class="fas fa-envelope"></i> Contact Support</button>
          <button class="support-btn"><i class="fas fa-book"></i> View FAQ</button>
          <button class="support-btn"><i class="fas fa-download"></i> User Guide</button>
        </div>
      </div>
    </div>
  `
};

// Full Screen Settings Modal Elements
const settingsModal = document.getElementById("settingsModal");
const settingsModalTitle = document.getElementById("settingsModalTitle");
const settingsContentArea = document.getElementById("settingsContentArea");
const closeSettings = document.getElementById("closeSettings");
const licenseBanner = document.getElementById("licenseBanner");

// Enhanced banner control with INFINITE scrolling
function showLicenseBanner() {
  if (licenseBanner) {
    // Reset and show banner
    licenseBanner.style.animation = 'none';
    void licenseBanner.offsetHeight; // Trigger reflow
    
    // Ensure banner is visible and start INFINITE scrolling
    licenseBanner.style.display = 'block';
    licenseBanner.style.animation = 'marqueeScroll 20s linear infinite';
    
    // NEVER auto-hide - scrolls till infinity
    // Remove any timeout that might hide it
  }
}

function hideLicenseBanner() {
  if (licenseBanner) {
    // Only hide when manually called (like when closing settings modal)
    licenseBanner.style.animation = 'none';
    setTimeout(() => {
      licenseBanner.style.display = 'none';
    }, 300);
  }
}

// Attach click listeners to each NEW settings popup option
document.querySelectorAll(".settings-popup-option").forEach(option => {
  option.addEventListener("click", (e) => {
    e.stopPropagation();

    const key = option.getAttribute("data-option");
    const optionText = option.textContent.trim();

    // Close popup menu
    settingsPopupMenu.classList.remove("active");

    // Show license banner immediately with INFINITE scrolling
    showLicenseBanner();

    // Open full screen modal after 2 seconds delay
    setTimeout(() => {
      // Set modal title
      if (settingsModalTitle) {
        settingsModalTitle.textContent = optionText;
      }
      
      // Set modal content
      if (settingsContentArea) {
        settingsContentArea.innerHTML = settingsData[key] || "<p>No data available.</p>";
      }
      
      // Show modal with slide-in effect
      if (settingsModal) {
        settingsModal.classList.add("active");
      }
      
    }, 2000);
  });
});

// Close settings modal
if (closeSettings) {
  closeSettings.addEventListener("click", () => {
    if (settingsModal) {
      settingsModal.classList.remove("active");
    }
    // Hide banner when closing settings modal
    hideLicenseBanner();
  });
}

// Close modal when clicking outside content
if (settingsModal) {
  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.remove("active");
      hideLicenseBanner();
    }
  });
}

// Close popup menu when clicking outside
document.addEventListener("click", (e) => {
  if (settingsPopupMenu && !settingsPopupMenu.contains(e.target) && e.target !== settingsBtn) {
    settingsPopupMenu.classList.remove("active");
  }
});

// Handle escape key to close modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (settingsModal && settingsModal.classList.contains('active')) {
      settingsModal.classList.remove('active');
      hideLicenseBanner();
    }
    if (settingsPopupMenu && settingsPopupMenu.classList.contains('active')) {
      settingsPopupMenu.classList.remove('active');
    }
  }
});



// Notification Slider Logic
function showNotification(message, duration = 4000) {
  const slider = document.querySelector('.notification-slider');
  if (!slider) return;

  slider.textContent = message;
  slider.style.transform = 'translateY(0)';

  setTimeout(() => {
    slider.style.transform = 'translateY(-100%)';
  }, duration);
}

document.addEventListener('DOMContentLoaded', () => {
  const notificationText = document.querySelector('.notification-text');

  // Your notification message (can later be updated dynamically from another file)
  const message = 'Hello User and Welcome Back, Please Pay Attention to Subscribe to the Premium Membership Version of your Wallet02 Account to Fully Experience Premium Unlimited Features and Functions in your Wallet02 Account...';

  if (notificationText) {
    notificationText.textContent = message;
  }
});
