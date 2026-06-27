// WebCrypto utility for AES-GCM encryption
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(text: string, password: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();
  
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(text)
  );
  
  const saltArray = Array.from(salt);
  const ivArray = Array.from(iv);
  const cipherArray = Array.from(new Uint8Array(ciphertext));
  
  const payload = { s: saltArray, i: ivArray, c: cipherArray };
  return btoa(JSON.stringify(payload));
}

export async function decryptData(encryptedBase64: string, password: string): Promise<string> {
  try {
    const payload = JSON.parse(atob(encryptedBase64));
    const salt = new Uint8Array(payload.s);
    const iv = new Uint8Array(payload.i);
    const ciphertext = new Uint8Array(payload.c);
    
    const key = await deriveKey(password, salt);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      ciphertext
    );
    
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (e) {
    throw new Error("Invalid password or corrupted data");
  }
}
