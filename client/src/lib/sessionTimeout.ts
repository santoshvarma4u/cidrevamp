// Session Timeout Manager
// Handles client-side session timeout warnings and automatic logout

interface SessionStatus {
  valid: boolean;
  timeRemaining: number;
  isWarning: boolean;
  lastActivity: number;
  sessionId: string;
}

interface SessionTimeoutConfig {
  warningTime: number; // seconds before timeout to show warning
  checkInterval: number; // seconds between status checks
  extendOnActivity: boolean; // whether to extend session on user activity
}

class SessionTimeoutManager {
  private config: SessionTimeoutConfig;
  private warningShown: boolean = false;
  private statusCheckInterval: NodeJS.Timeout | null = null;
  private activityTimeout: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();

  constructor(config: Partial<SessionTimeoutConfig> = {}) {
    this.config = {
      warningTime: 300, // 5 minutes warning
      checkInterval: 30, // Check every 30 seconds
      extendOnActivity: true,
      ...config
    };

    this.startActivityTracking();
    this.startStatusChecking();
  }

  private startActivityTracking(): void {
    if (!this.config.extendOnActivity) return;

    // Track user activity events
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetActivityTimeout = () => {
      this.lastActivity = Date.now();
      
      // Extend session on activity
      this.extendSession().catch(error => {
        console.warn('Failed to extend session:', error);
      });
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, resetActivityTimeout, true);
    });

    // Also track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        resetActivityTimeout();
      }
    });
  }

  private startStatusChecking(): void {
    this.statusCheckInterval = setInterval(() => {
      this.checkSessionStatus();
    }, this.config.checkInterval * 1000);
  }

  private async checkSessionStatus(): Promise<void> {
    try {
      const response = await fetch('/api/auth/session-status', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Session expired
        this.handleSessionExpired();
        return;
      }

      if (!response.ok) {
        console.warn('Failed to check session status:', response.status);
        return;
      }

      const status: SessionStatus = await response.json();
      
      if (!status.valid) {
        this.handleSessionExpired();
        return;
      }

      // Check if we should show warning
      if (status.isWarning && !this.warningShown) {
        this.showTimeoutWarning(status.timeRemaining);
      }

      // Update warning if already shown
      if (this.warningShown && status.timeRemaining > 0) {
        this.updateTimeoutWarning(status.timeRemaining);
      }

    } catch (error) {
      console.warn('Session status check failed:', error);
    }
  }

  private async extendSession(): Promise<void> {
    try {
      const response = await fetch('/api/auth/extend-session', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Session extended:', result.message);
        
        // Hide warning if it was shown
        if (this.warningShown) {
          this.hideTimeoutWarning();
        }
      }
    } catch (error) {
      console.warn('Failed to extend session:', error);
    }
  }

  private showTimeoutWarning(timeRemaining: number): void {
    this.warningShown = true;
    
    // Create warning modal
    const modal = document.createElement('div');
    modal.id = 'session-timeout-warning';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const warningBox = document.createElement('div');
    warningBox.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      text-align: center;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Session Timeout Warning';
    title.style.cssText = `
      margin: 0 0 1rem 0;
      color: #dc2626;
      font-size: 1.5rem;
    `;

    const message = document.createElement('p');
    message.textContent = 'Your session will expire due to inactivity. Click "Stay Logged In" to continue.';
    message.style.cssText = `
      margin: 0 0 1.5rem 0;
      color: #374151;
      line-height: 1.5;
    `;

    const countdown = document.createElement('div');
    countdown.id = 'session-countdown';
    countdown.style.cssText = `
      margin: 0 0 1.5rem 0;
      font-size: 1.2rem;
      font-weight: bold;
      color: #dc2626;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 1rem;
      justify-content: center;
    `;

    const extendButton = document.createElement('button');
    extendButton.textContent = 'Stay Logged In';
    extendButton.style.cssText = `
      background: #059669;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
    `;
    extendButton.onclick = () => {
      this.extendSession();
      this.hideTimeoutWarning();
    };

    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout Now';
    logoutButton.style.cssText = `
      background: #dc2626;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
    `;
    logoutButton.onclick = () => {
      this.handleLogout();
    };

    buttonContainer.appendChild(extendButton);
    buttonContainer.appendChild(logoutButton);

    warningBox.appendChild(title);
    warningBox.appendChild(message);
    warningBox.appendChild(countdown);
    warningBox.appendChild(buttonContainer);
    modal.appendChild(warningBox);

    document.body.appendChild(modal);
    this.updateTimeoutWarning(timeRemaining);
  }

  private updateTimeoutWarning(timeRemaining: number): void {
    const countdown = document.getElementById('session-countdown');
    if (countdown) {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      countdown.textContent = `Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  private hideTimeoutWarning(): void {
    const modal = document.getElementById('session-timeout-warning');
    if (modal) {
      modal.remove();
    }
    this.warningShown = false;
  }

  private handleSessionExpired(): void {
    this.hideTimeoutWarning();
    
    // Show session expired message
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const expiredBox = document.createElement('div');
    expiredBox.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      text-align: center;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Session Expired';
    title.style.cssText = `
      margin: 0 0 1rem 0;
      color: #dc2626;
      font-size: 1.5rem;
    `;

    const message = document.createElement('p');
    message.textContent = 'Your session has expired due to inactivity. You will be redirected to the login page.';
    message.style.cssText = `
      margin: 0 0 1.5rem 0;
      color: #374151;
      line-height: 1.5;
    `;

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
    `;
    okButton.onclick = () => {
      this.handleLogout();
    };

    expiredBox.appendChild(title);
    expiredBox.appendChild(message);
    expiredBox.appendChild(okButton);
    modal.appendChild(expiredBox);

    document.body.appendChild(modal);

    // Auto-redirect after 3 seconds
    setTimeout(() => {
      this.handleLogout();
    }, 3000);
  }

  private handleLogout(): void {
    // Call logout API
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(error => {
      console.warn('Logout API call failed:', error);
    }).finally(() => {
      // Clear client-side state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Redirect to login page
      window.location.href = '/admin/login';
    });
  }

  public destroy(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }
    this.hideTimeoutWarning();
  }
}

// Initialize session timeout manager when DOM is ready
let sessionTimeoutManager: SessionTimeoutManager | null = null;

function initializeSessionTimeout(): void {
  if (sessionTimeoutManager) {
    sessionTimeoutManager.destroy();
  }
  
  sessionTimeoutManager = new SessionTimeoutManager({
    warningTime: 300, // 5 minutes warning
    checkInterval: 30, // Check every 30 seconds
    extendOnActivity: true,
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSessionTimeout);
} else {
  initializeSessionTimeout();
}

// Export for manual control if needed
export { SessionTimeoutManager, initializeSessionTimeout };
