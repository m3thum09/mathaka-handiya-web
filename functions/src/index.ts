import { onRequest } from "firebase-functions/v2/https";

// ── Cloud Function exports ─────────────────────────────────────
export { sendOtp } from "./sendOtp";

/**
 * Health-check endpoint to verify Cloud Functions are deployed and working.
 * 
 * Test locally:  firebase emulators:start --only functions
 * Test deployed: curl https://<region>-mathaka-handiya-official.cloudfunctions.net/healthCheck
 */
export const healthCheck = onRequest((req, res) => {
  res.json({
    status: "ok",
    project: "mathaka-handiya-official",
    timestamp: new Date().toISOString(),
    message: "Cloud Functions are live 🚀",
  });
});
