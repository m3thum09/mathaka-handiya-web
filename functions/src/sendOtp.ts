import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getApps, initializeApp } from "firebase-admin/app";
import { createHash, randomInt } from "crypto";

// Initialize Firebase Admin (idempotent)
if (!getApps().length) initializeApp();
const db = getFirestore();

// EmailJS config — set these via: firebase functions:secrets:set EMAILJS_SERVICE_ID (etc.)
// Or for emulator testing, use a .env file inside functions/
const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

/**
 * sendOtp — Callable Cloud Function
 *
 * Generates a secure 6-digit OTP, stores it hashed in Firestore (otpSessions),
 * and sends it to the user's campus email via EmailJS.
 *
 * Input:  { email, name, whatsapp, userType }
 * Output: { success: true }
 */
export const sendOtp = onCall(async (request) => {
  const { email, name, whatsapp, userType } = request.data;

  // ── 1. Input validation ──────────────────────────────────────
  if (!email || !name || !whatsapp || !userType) {
    throw new HttpsError("invalid-argument", "All fields are required.");
  }

  const lowerEmail = String(email).toLowerCase().trim();

  if (
    !lowerEmail.endsWith("@sltc.ac.lk") &&
    !lowerEmail.endsWith("@sltc.edu.lk")
  ) {
    throw new HttpsError(
      "invalid-argument",
      "Please use your official SLTC campus email address."
    );
  }

  if (!["student", "staff"].includes(userType)) {
    throw new HttpsError("invalid-argument", "Invalid user type.");
  }

  // ── 2. Duplicate reservation check ───────────────────────────
  const existing = await db
    .collection("reservations")
    .where("email", "==", lowerEmail)
    .limit(1)
    .get();

  if (!existing.empty) {
    throw new HttpsError(
      "already-exists",
      "A reservation already exists for this email."
    );
  }

  // ── 3. Generate OTP securely ─────────────────────────────────
  const otp = randomInt(100000, 999999).toString();
  const hashedOtp = createHash("sha256").update(otp).digest("hex");

  // ── 4. Store hashed OTP in Firestore ─────────────────────────
  await db.collection("otpSessions").doc(lowerEmail).set({
    hashedOtp,
    name,
    whatsapp,
    userType,
    createdAt: FieldValue.serverTimestamp(),
  });

  // ── 5. Send OTP email via EmailJS REST API ───────────────────
  const emailjsPayload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: {
      to_name: name,
      to_email: lowerEmail,
      otp: otp, // Plain OTP — only sent via email, never returned to client
    },
  };

  const emailResponse = await fetch(EMAILJS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emailjsPayload),
  });

  if (!emailResponse.ok) {
    // Clean up the OTP session if email fails
    await db.collection("otpSessions").doc(lowerEmail).delete();
    throw new HttpsError("internal", "Failed to send OTP email.");
  }

  // ── 6. Return success (OTP is NEVER sent to the client) ──────
  return { success: true };
});
