// src/api/auth.js

// Mock Data
const MOCK_USERS = {
  'admin': {
    id: '1',
    username: 'admin',
    name: 'Administrator',
    role: 'admin',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    permissions: ['admin:view', 'admin:edit', 'report:view', 'monitor:view']
  },
  'user': {
    id: '2',
    username: 'user',
    name: 'Operator',
    role: 'user',
    avatar: '',
    permissions: ['monitor:view', 'report:view']
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  /**
   * Login
   * @param {Object} credentials { username, password, remember }
   * @returns {Promise}
   */
  async login(credentials) {
    await delay(800); // Simulate network delay

    const { username, password } = credentials;
    
    // Mock Verification (Password matches username for demo)
    if (MOCK_USERS[username] && password === username) { 
      const user = MOCK_USERS[username];
      const token = `mock-token-${Date.now()}-${btoa(username)}`;
      
      return {
        code: 200,
        message: 'Login successful',
        data: {
          token,
          user,
          permissions: user.permissions
        }
      };
    }

    // Simulate Error
    const error = new Error('用户名或密码错误');
    error.code = 401;
    throw error;
  },

  /**
   * Logout
   * @returns {Promise}
   */
  async logout() {
    await delay(500);
    return {
      code: 200,
      message: 'Logout successful'
    };
  },

  /**
   * Get User Info
   * @returns {Promise}
   */
  async getUserInfo() {
    await delay(600);
    // In real scenario, parse token or call backend
    // Here we just return mock data assuming session is valid
    // Ideally we should match the token to the user, but for static mock we default to admin or check stored user
    return {
      code: 200,
      data: {
        user: MOCK_USERS['admin'],
        permissions: MOCK_USERS['admin'].permissions
      }
    };
  },

  /**
   * Refresh Token
   * @returns {Promise}
   */
  async refreshToken() {
    await delay(500);
    return {
      code: 200,
      data: {
        token: `mock-refreshed-token-${Date.now()}`
      }
    };
  },

  /**
   * Get Users List
   */
  async getUsers(params) {
    await delay(500);
    return {
      code: 200,
      data: {
        list: Object.values(MOCK_USERS).map(u => ({...u, status: 'active', email: `${u.username}@example.com`})),
        total: Object.keys(MOCK_USERS).length
      }
    };
  },

  /**
   * Create User
   */
  async createUser(data) {
    await delay(800);
    const id = Date.now().toString();
    const newUser = { id, ...data, permissions: [] };
    return {
      code: 200,
      message: 'User created',
      data: newUser
    };
  },

  /**
   * Update User
   */
  async updateUser(id, data) {
    await delay(500);
    return {
      code: 200,
      message: 'User updated'
    };
  },

  /**
   * Delete User
   */
  async deleteUser(id) {
    await delay(500);
    return {
      code: 200,
      message: 'User deleted'
    };
  },

  /**
   * Reset Password
   */
  async resetPassword(id) {
    await delay(500);
    return {
      code: 200,
      message: 'Password reset to default'
    };
  },

  /**
   * Get Audit Logs
   */
  async getAuditLogs(params) {
    await delay(500);
    const actions = ['create', 'update', 'delete', 'login', 'logout'];
    const targets = ['user', 'hotspot', 'event', 'system'];
    
    const logs = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      timestamp: Date.now() - Math.floor(Math.random() * 86400000 * 7),
      user: Math.random() > 0.3 ? 'admin' : 'user',
      action: actions[Math.floor(Math.random() * actions.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      details: `Operation details for log ${i + 1}`,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`
    })).sort((a, b) => b.timestamp - a.timestamp);

    return {
      code: 200,
      data: {
        list: logs,
        total: 100 // Mock total
      }
    };
  }
};
