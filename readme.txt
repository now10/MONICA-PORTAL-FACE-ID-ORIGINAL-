

  <div class="dashboard">
    <div class="header">
      <div class="greeting">Welcome Back, Monica</div>
      <div class="settings-btn" id="settingsBtn">☰</div>

      <!-- Settings Menu -->
      <div class="settings-menu" id="settingsMenu">
        <div class="settings-option" data-modal="accountModal"><i class="fas fa-user-circle"></i> Account</div>
        <div class="settings-option" data-modal="securityModal"><i class="fas fa-shield-alt"></i> Security</div>
        <div class="settings-option" data-modal="notificationsModal"><i class="fas fa-bell"></i> Notifications</div>
        <div class="settings-option" data-modal="walletModal"><i class="fas fa-wallet"></i> Wallet</div>
        <div class="settings-option" data-modal="transactionsModal"><i class="fas fa-history"></i> Transactions</div>
        <div class="settings-option" data-modal="appearanceModal"><i class="fas fa-moon"></i> Appearance</div>
        <div class="settings-option" data-modal="helpModal"><i class="fas fa-question-circle"></i> Help</div>
      </div>
    </div>
  </div>

  <!-- Account Modal -->
  <div class="modal" id="accountModal">
    <div class="modal-content">
      <h2>Account Settings</h2>
      <form>
        <label>Username</label>
        <input type="text" placeholder="Enter your username">
        
        <label>Email</label>
        <input type="email" placeholder="Enter your email">

        <button type="submit">Save Changes</button>
      </form>
      <button class="close-modal">Close</button>
    </div>
  </div>

  <!-- Security Modal -->
  <div class="modal" id="securityModal">
    <div class="modal-content">
      <h2>Security Settings</h2>
      <form>
        <label>Change Password</label>
        <input type="password" placeholder="New password">

        <label>Two-Factor Authentication</label>
        <select>
          <option>Disabled</option>
          <option>Email</option>
          <option>SMS</option>
          <option>Authenticator App</option>
        </select>

        <button type="submit">Update Security</button>
      </form>
      <button class="close-modal">Close</button>
    </div>
  </div>

  <!-- Notifications Modal -->
  <div class="modal" id="notificationsModal">
    <div class="modal-content">
      <h2>Notifications</h2>
      <label><input type="checkbox" checked> Email Alerts</label><br>
      <label><input type="checkbox"> SMS Alerts</label><br>
      <label><input type="checkbox" checked> Push Notifications</label>
      <button class="close-modal">Close</button>
    </div>
  </div>

  <!-- Wallet Modal -->
  <div class="modal" id="walletModal">
    <div class="modal-content">
      <h2>Wallet</h2>
      <p><strong>Balance:</strong> $1,250.00</p>
      <button>Add Funds</button>
      <button>Withdraw</button>
      <button class="close-modal">Close</button>
    </div>
  </div>

  <!-- Transactions Modal -->
  <div class="modal" id="transactionsModal">
    <div class="modal-content">
      <h2>Transaction History</h2>
      <table>
        <tr><th>Date</th><th>Type</th><th>Amount</th></tr>
        <tr><td>2025-09-01</td><td>Deposit</td><td>$500</td></tr>
        <tr><td>2025-09-10</td><td>Withdrawal</td><td>$200</td></tr>
      </table>
      <button class="close-modal">Close</button>
    </div>
  </div>

  <!-- Appearance Modal -->
  <div class="modal" id="appearanceModal">
    <div class="modal-content">
      <h2>Appearance</h2>
      <p>Switch between light and dark mode.</p>
      <button class="toggle-theme-btn">Toggle Theme</button>
      <button class="close-modal">Close</button>
    </div>
  </div>

  <!-- Help Modal -->
  <div class="modal" id="helpModal">
    <div class="modal-content">
      <h2>Help & Support</h2>
      <p>Find answers or contact support below:</p>
      <ul>
        <li><a href="#">FAQs</a></li>
        <li><a href="#">Contact Support</a></li>
        <li><a href="#">Live Chat</a></li>
      </ul>
      <button class="close-modal">Close</button>
    </div>
  </div>

  