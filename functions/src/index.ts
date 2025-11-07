import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import {
  getFirestore,
  DocumentData,
  FieldValue,
} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";

export enum EventStatus {
  InProcess = "inprocess",
  Finished = "finished",
}

initializeApp();
const db = getFirestore();

export const updateUserOnNewRequest = onDocumentCreated(
  "requests/{requestId}",
  async (event) => {
    const requestData = event.data?.data() as DocumentData | undefined;
    if (!requestData) return;

    const { specUid, scheduledUnixtime } = requestData;
    if (!specUid || !scheduledUnixtime) return;

    const userRef = db.collection("users").doc(specUid);

    try {
      const userSnap = await userRef.get();
      if (!userSnap.exists) return;

      const userData = userSnap.data() as { freeTimestamps?: number[] };
      if (!userData?.freeTimestamps) return;

      const updatedTimestamps = userData.freeTimestamps.filter(
        (timestamp) => timestamp !== scheduledUnixtime
      );

      await userRef.update({
        freeTimestamps: updatedTimestamps,
      });

      console.log(
        `Updated user ${specUid}, removed timestamp ${scheduledUnixtime}`
      );
    } catch (error) {
      console.error("Error updating user timestamps:", error);
    }
  }
);

export const restoreUserTimestampOnRequestDeletion = onDocumentDeleted(
  "requests/{requestId}",
  async (event) => {
    const deletedRequestData = event.data?.data() as DocumentData | undefined;
    if (!deletedRequestData) return;

    const { specUid, scheduledUnixtime } = deletedRequestData;
    if (!specUid || !scheduledUnixtime) return;

    const userRef = db.collection("users").doc(specUid);

    try {
      const userSnap = await userRef.get();
      if (!userSnap.exists) return;

      const userData = userSnap.data() as { freeTimestamps?: number[] };
      if (!userData) return;

      // Check if scheduledUnixtime is already in the freeTimestamps array
      const updatedTimestamps = userData.freeTimestamps || [];
      if (!updatedTimestamps.includes(scheduledUnixtime)) {
        updatedTimestamps.push(scheduledUnixtime);

        await userRef.update({
          freeTimestamps: updatedTimestamps,
        });

        console.log(
          `Restored timestamp ${scheduledUnixtime} for user ${specUid}`
        );
      }
    } catch (error) {
      console.error("Error restoring user timestamps:", error);
    }
  }
);

// Notificatons to Client when Psych accepts non-personal request
export const notifyClientOnRequestAccepted = onDocumentUpdated(
  "requests/{requestId}",
  async (event) => {
    const before = event.data?.before.data() as DocumentData | undefined;
    const after = event.data?.after.data() as DocumentData | undefined;

    if (!before || !after) return;

    // Check for status change from 0 -> 1
    if (before.status === 0 && after.status === 1) {
      const clientUid = after.clientUid;
      if (!clientUid) return;

      const payload = {
        title: "Your request was accepted!",
        message: "Come at the appointed time & join the call.",
        linkTo: "", // could be `requests/{requestId}`
        created_at: "", // admin.firestore.Timestamp.now(),
        isRead: false,
      };

      try {
        await db
          .collection("users")
          .doc(clientUid)
          .set(
            {
              notifications: FieldValue.arrayUnion(payload),
            },
            { merge: true }
          );

        console.log(`Notification added for client ${clientUid}`);
      } catch (error) {
        console.error("Error adding client notification:", error);
      }
    }
  }
);

export const updateEventStudentsHours = onDocumentUpdated(
  "events/{eventId}",
  async (event) => {
    logger.info("Function triggered params", event.params);
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    const eventId = event.params.eventId; // ✅ access params via event.params

    if (!before || !after) {
      logger.warn("Missing before/after event data.");
      return;
    }

    if (before.status === "inprocess" && after.status === "finished") {
      return; // Do nothing unless it just became finished
    }

    const { students = [], hours = 0 } = after;

    if (!Array.isArray(students) || students.length === 0) {
      logger.info(`No students to update for event ${eventId}.`);
      return;
    }

    logger.info(
      `Incrementing hrEducation by ${hours} for ${students.length} students.`
    );

    const batch = db.batch();

    for (const student of students) {
      const uid = typeof student === "string" ? student : student.uid;
      if (!uid) continue; // skip invalid entries

      const userRef = db.collection("users").doc(uid);
      batch.update(userRef, {
        hrEducation: FieldValue.increment(+hours),
      });
    }

    await batch.commit();

    logger.info(`✅ hrEducation updated for all ${students.length} students.`);
  }
);
