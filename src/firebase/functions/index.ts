const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });  
admin.initializeApp();

exports.claimTask = functions.https.onRequest(async (req, res) => {
  // Enable CORS before responding
  cors(req, res, async () => {
    const { userId, taskId, points } = req.body;

    // Ensure the user is authenticated
    if (!req.headers.authorization) {
      return res.status(403).send('User must be authenticated');
    }

    const userRef = admin.firestore().collection("users").doc(userId);

    try {
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).send('User not found');
      }

      const userData = userDoc.data();
      const completedTasks = userData.completedTasks || [];

      // Check if the user has already completed this task
      if (completedTasks.includes(taskId)) {
        return res.status(400).send('Task already claimed');
      }

      // Update user data with the completed task and increment the balance
      await userRef.update({
        completedTasks: admin.firestore.FieldValue.arrayUnion(taskId),
        balance: admin.firestore.FieldValue.increment(points),
      });

      return res.status(200).json({ success: true, message: 'Task claimed successfully' });
    } catch (error) {
      console.error("Error claiming task:", error);
      return res.status(500).send('Error claiming task');
    }
  });
});
