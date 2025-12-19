import { io } from "socket.io-client";

/**
 * WebSocket Service wrapping Socket.io-client
 * Provides connection management, reconnection logic, and event subscription.
 */
class WebSocketService {
  constructor() {
    this.socket = null;
    this.url = "";
    this.listeners = new Map(); // Internal listeners for connection status
  }

  /**
   * Initialize and connect to the WebSocket server
   * @param {string} url - Server URL (default: http://localhost:3000)
   */
  connect(url = "http://localhost:3000") {
    if (this.socket && this.socket.connected) {
      console.warn("[WebSocket] Already connected.");
      return;
    }
    
    // If switching URLs, disconnect first
    if (this.socket && this.url !== url) {
      this.disconnect();
    }

    this.url = url;

    console.log(`[WebSocket] Connecting to ${url}...`);

    this.socket = io(url, {
      path: '/ws', // 对齐后端 Socket.IO 路径
      reconnection: true,
      reconnectionAttempts: 5, // Max 5 retries
      reconnectionDelay: 1000, // Start with 1s
      reconnectionDelayMax: 5000, // Max 5s
      randomizationFactor: 0.5, // Jitter
      timeout: 10000, // Connection timeout
      autoConnect: true,
    });

    this._setupLifecycleEvents();
  }

  /**
   * Setup internal lifecycle event listeners
   */
  _setupLifecycleEvents() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log(`[WebSocket] Connected (ID: ${this.socket.id})`);
      this._emitStatus({ connected: true, socketId: this.socket.id });
    });

    this.socket.on("disconnect", (reason) => {
      console.warn(`[WebSocket] Disconnected: ${reason}`);
      this._emitStatus({ connected: false, reason });
      
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      // Suppress noisy polling errors when backend is offline
      if (error.message === "xhr poll error") {
        console.warn("[WebSocket] Connection failed: Backend might be offline (xhr poll error)");
      } else {
        console.error(`[WebSocket] Connection Error: ${error.message}`);
      }
    });

    this.socket.on("reconnect_attempt", (attempt) => {
      console.log(`[WebSocket] Reconnect attempt #${attempt}`);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("[WebSocket] Reconnection failed after maximum attempts.");
    });
  }

  /**
   * Disconnect the socket
   */
  disconnect() {
    if (this.socket) {
      console.log("[WebSocket] Disconnecting...");
      this.socket.disconnect();
      this.socket = null;
      this._emitStatus({ connected: false, reason: "manual" });
    }
  }

  /**
   * Subscribe to a server event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   */
  subscribe(event, callback) {
    if (!this.socket) {
      console.warn(`[WebSocket] Cannot subscribe to '${event}': Socket not initialized.`);
      return;
    }
    this.socket.on(event, callback);
  }

  /**
   * Unsubscribe from a server event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler to remove
   */
  unsubscribe(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  /**
   * Emit an event to the server
   * @param {string} event - Event name
   * @param {any} data - Data to send
   */
  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`[WebSocket] Cannot emit '${event}': Socket not connected.`);
    }
  }

  /**
   * Listen for connection status changes
   * @param {Function} callback - Receives { connected: boolean, reason?: string }
   * @returns {Function} Unsubscribe function
   */
  onStatusChange(callback) {
    if (!this.listeners.has("status")) {
      this.listeners.set("status", new Set());
    }
    this.listeners.get("status").add(callback);
    
    // Immediately invoke with current status if socket exists
    if (this.socket) {
        callback({ connected: this.socket.connected });
    }

    return () => {
      const set = this.listeners.get("status");
      if (set) set.delete(callback);
    };
  }

  /**
   * Internal: Notify status listeners
   */
  _emitStatus(status) {
    if (this.listeners.has("status")) {
      this.listeners.get("status").forEach((cb) => cb(status));
    }
  }
  
  /**
   * Check if connected
   */
  get isConnected() {
      return this.socket ? this.socket.connected : false;
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
