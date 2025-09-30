<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
  <link rel="stylesheet" href="element.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
  <!-- MAIN DASHBOARD -->
  <div class="dashboard">

    <div class="dashboard">
      <div class="header">
        <div class="greeting">Welcome Back, Monica</div>
        <div class="settings-btn" id="settingsBtn">☰</div>

        <!-- Settings Menu (hidden by default) -->
        <div class="settings-menu" id="settingsMenu">
          <div class="settings-option" data-option="account"><i class="fas fa-user-circle"></i> Account</div>
          <div class="settings-option" data-option="security"><i class="fas fa-shield-alt"></i> Security</div>
          <div class="settings-option" data-option="notifications"><i class="fas fa-bell"></i> Notifications</div>
          <div class="settings-option" data-option="wallet"><i class="fas fa-wallet"></i> Wallet</div>
          <div class="settings-option" data-option="transactions"><i class="fas fa-history"></i> Transactions</div>
          <div class="settings-option" data-option="appearance"><i class="fas fa-moon"></i> Appearance</div>
          <div class="settings-option" data-option="help"><i class="fas fa-question-circle"></i> Help</div>
        </div>
      </div>

      <!-- Dynamic content goes here -->
      <div id="settingsContent" class="settings-content"></div>
    </div>

  </div>
  <script src="element.js"></script>
</body>
</html>
