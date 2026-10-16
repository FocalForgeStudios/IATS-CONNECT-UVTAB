/* IATS CONNECT direct-message E2EE primitives.
 * Browser Web Crypto; private CryptoKey is persisted in IndexedDB, never Supabase.
 * Integration into the production send/receive path must follow key verification
 * and multi-device recovery work; this file alone does not enable E2EE.
 */
const DB_NAME = "iats-connect-e2ee";
const STORE = "identities";
const PREFIX = "IATS-E2EE:v1:";
function openKeyDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function keyGet(key) {
  const db = await openKeyDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(key);
    request.onsuccess = () => { db.close(); resolve(request.result); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}
async function keyPut(key, value) {
  const db = await openKeyDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}
const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64 = (value) => Uint8Array.from(atob(value), c => c.charCodeAt(0));
export const ChatCrypto = {
  _identityPromises: new Map(),
  async ensureIdentity(supabase, userId) {
    if (this._identityPromises.has(userId)) return this._identityPromises.get(userId);
    const task = this._ensureIdentity(supabase, userId);
    this._identityPromises.set(userId, task);
    try { return await task; }
    finally { this._identityPromises.delete(userId); }
  },
  async _ensureIdentity(supabase, userId) {
    if (!globalThis.crypto?.subtle || !globalThis.indexedDB) throw new Error("This device does not support secure chat encryption.");
    let local = await keyGet(userId);
    if (!local?.privateKey || !local?.publicJwk) {
      const pair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]);
      const publicJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
      local = { privateKey: pair.privateKey, publicJwk };
      await keyPut(userId, local);
    }
    const { error } = await supabase.from("profiles").update({ chat_public_key: local.publicJwk, chat_key_version: 1 }).eq("id", userId);
    if (error) throw new Error("Could not publish your chat encryption key.");
    return local.publicJwk;
  },
  async deriveConversationKey(supabase, userId, peerId, conversationId) {
    if (!peerId || peerId === userId || !conversationId) throw new Error("This conversation has no verified recipient.");
    const local = await keyGet(userId);
    if (!local?.privateKey) throw new Error("Your encryption key is missing on this device.");
    const { data: peer, error } = await supabase.from("profiles").select("chat_public_key,chat_key_version").eq("id", peerId).single();
    if (error || !peer?.chat_public_key || peer.chat_key_version !== 1) throw new Error("The recipient has not set up secure messaging yet.");
    const peerPublic = await crypto.subtle.importKey("jwk", peer.chat_public_key, { name: "ECDH", namedCurve: "P-256" }, false, []);
    const secret = await crypto.subtle.deriveBits({ name: "ECDH", public: peerPublic }, local.privateKey, 256);
    const material = await crypto.subtle.importKey("raw", secret, "HKDF", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({
      name: "HKDF", hash: "SHA-256",
      salt: new TextEncoder().encode("iats-connect:" + conversationId),
      info: new TextEncoder().encode("direct-message:v1"),
    }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  },
  async encryptText(supabase, userId, peerId, conversationId, text) {
    const key = await this.deriveConversationKey(supabase, userId, peerId, conversationId);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text));
    return PREFIX + JSON.stringify({ iv: b64(iv), ciphertext: b64(cipher), version: 1 });
  },
  async decryptText(supabase, userId, peerId, conversationId, envelope) {
    if (typeof envelope !== "string" || !envelope.startsWith(PREFIX)) return envelope;
    const payload = JSON.parse(envelope.slice(PREFIX.length));
    if (payload.version !== 1) throw new Error("Unsupported encrypted message version.");
    const key = await this.deriveConversationKey(supabase, userId, peerId, conversationId);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(payload.iv) }, key, unb64(payload.ciphertext));
    return new TextDecoder().decode(plain);
  },
  async encryptBlob(supabase, userId, peerId, conversationId, file) {
    const key = await this.deriveConversationKey(supabase, userId, peerId, conversationId);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, await file.arrayBuffer());
    const out = new Uint8Array(12 + cipher.byteLength);
    out.set(iv, 0); out.set(new Uint8Array(cipher), 12);
    return new Blob([out], { type: "application/octet-stream" });
  },
  async decryptBlob(supabase, userId, peerId, conversationId, encryptedBlob, mimeType) {
    const bytes = new Uint8Array(await encryptedBlob.arrayBuffer());
    if (bytes.length < 29) throw new Error("Encrypted attachment is invalid.");
    const key = await this.deriveConversationKey(supabase, userId, peerId, conversationId);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12) }, key, bytes.slice(12));
    return new Blob([plain], { type: mimeType || "application/octet-stream" });
  },
};
