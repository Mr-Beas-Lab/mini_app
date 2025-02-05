const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const corsHandler = cors({
  origin: ["https://4569-169-150-218-74.ngrok-free.app"], // Your frontend URL
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

exports.claimTask = functions.https.onRequest((req, res) => {
  // ✅ Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "https://4569-169-150-218-74.ngrok-free.app");
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Credentials", "true");
    return res.status(204).send(""); // No content for OPTIONS request
  }

  corsHandler(req, res, async () => {
    try {
      const { userId, taskId, points } = req.body;

      if (!req.headers.authorization) {
        return res.status(403).json({ error: "User must be authenticated" });
      }

      const idToken = req.headers.authorization.split("Bearer ")[1];
      if (!idToken) {
        return res.status(401).json({ error: "Invalid authorization format" });
      }

      try {
        await admin.auth().verifyIdToken(idToken);
      } catch (authError) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      const userData = userDoc.data();
      const completedTasks = userData?.completedTasks || [];

      if (completedTasks.includes(taskId)) {
        return res.status(400).json({ error: "Task already claimed" });
      }

      await userRef.update({
        completedTasks: admin.firestore.FieldValue.arrayUnion(taskId),
        balance: admin.firestore.FieldValue.increment(points),
      });

      return res.status(200).json({ success: true, message: "Task claimed successfully" });
    } catch (error) {
      console.error("Error claiming task:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

exports.claimAdReward = functions.https.onRequest((req, res) => {
  // ✅ Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Origin", "https://4569-169-150-218-74.ngrok-free.app");
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Credentials", "true");
    return res.status(204).send(""); // No content for OPTIONS request
  }

  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({ error: "Method Not Allowed" });
    }

    try {
      const { telegramId } = req.body;

      if (!telegramId) {
        return res.status(400).json({ message: "telegramId is required" });
      }

      const rewardAmount = 10;

      return res.status(200).json({
        message: `✅ You have received ${rewardAmount} points!`,
      });
    } catch (error) {
      console.error("Error processing claim:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
});
