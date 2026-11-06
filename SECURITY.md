# Security Policy

## 🛡️ Supported Versions

Placement Cockpit is actively maintained on the `main` branch. Security patches and dependencies are updated continuously.

| Branch / Version | Supported          |
| ---------------- | ------------------ |
| `main`           | :white_check_mark: |
| Old tags/forks   | :x:                |

---

## 🔒 Security Architecture & Guarantees

Placement Cockpit is built on a **privacy-first, client-side zero-trust architecture**:

1. **BYOK (Bring Your Own Key) Protection**:
   - The platform never hosts a centralized, shared LLM API key on the public internet.
   - Users provide their own personal free key from NVIDIA NIM.
   - Keys are kept exclusively on the client machine and are never transmitted to any third-party server other than NVIDIA's inference endpoints.

2. **Client-Side Master Password Encryption**:
   - Users can optionally encrypt their stored API key using **WebCrypto AES-GCM-256** with PBKDF2 key derivation (100,000 iterations + SHA-256).
   - The salt and initialization vector (IV) are generated via cryptographically secure random values (`crypto.getRandomValues`).

3. **In-Browser Document Parsing**:
   - The ATS Resume Grader extracts and analyzes PDF text entirely inside an in-browser Web Worker using `pdfjs-dist`.
   - Resumes, names, contact information, and project contents are never uploaded to any remote file storage or analytics pipeline.

4. **Cloud Firestore Isolation**:
   - Cloud Firestore rules enforce strict owner-only access:
     ```javascript
     match /users/{userId} {
       allow read, write: if request.auth != null && request.auth.uid == userId;
     }
     ```
   - No user can read, query, or modify another student's profile, roadmap, or notes.

---

## ⚠️ Contributor Security Guidelines

When contributing code:
- **Never hardcode secrets**: Do not commit API keys, personal access tokens, private keys, or credentials to any file, test fixture, or mock.
- **Client environment variables**: Any variable prefixed with `VITE_` is baked into the public client JavaScript bundle. Only public Firebase identifiers (`VITE_FIREBASE_API_KEY`, etc.) should be in `.env.example`.
- **No unsafe DOM injection**: Do not use `dangerouslySetInnerHTML` with un-sanitized user strings. Use [`src/components/MarkdownRenderer.tsx`](file:///d:/Project/Placement%20Roadmap/src/components/MarkdownRenderer.tsx).
- **No external executable script tags**: All dependencies must be audited npm packages defined in `package.json`.

---

## 🚨 Reporting a Vulnerability

If you discover a potential security vulnerability in Placement Cockpit, please report it responsibly:

1. **Do NOT open a public GitHub issue** describing the vulnerability.
2. Please use GitHub's private vulnerability reporting feature:
   - Go to the **Security** tab of [MR-1124/Placement-cockpit](https://github.com/MR-1124/Placement-cockpit).
   - Click **"Report a vulnerability"** to open a confidential discussion with the maintainers.
   - Alternatively, contact the maintainers directly via their GitHub profile contact info.

Please include:
- A clear description of the vulnerability.
- Steps to reproduce or proof-of-concept code.
- Impact assessment.

We strive to acknowledge receipt of security reports within 48 hours and work with you to test and deploy a fix before any public disclosure.
