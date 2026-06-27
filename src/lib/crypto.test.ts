import { describe, it, expect } from 'vitest';
import { encryptData, decryptData } from './crypto';

// Setup WebCrypto polyfill for jsdom environment if necessary.
// @ts-ignore
import { webcrypto } from 'crypto';
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = webcrypto;
}

describe('Crypto Utility', () => {
  it('encrypts and decrypts data correctly with correct password', async () => {
    const secretMessage = "nvapi-some-secret-token";
    const password = "masterPassword123!";
    
    const encrypted = await encryptData(secretMessage, password);
    expect(encrypted).not.toBe(secretMessage);
    expect(encrypted.length).toBeGreaterThan(0);
    
    const decrypted = await decryptData(encrypted, password);
    expect(decrypted).toBe(secretMessage);
  });

  it('fails to decrypt data with incorrect password', async () => {
    const secretMessage = "nvapi-some-secret-token";
    const password = "masterPassword123!";
    const wrongPassword = "wrongPassword456";
    
    const encrypted = await encryptData(secretMessage, password);
    
    await expect(decryptData(encrypted, wrongPassword)).rejects.toThrow("Invalid password or corrupted data");
  });
});
