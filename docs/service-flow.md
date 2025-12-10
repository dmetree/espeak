# Lesson Service Flow

This document describes the end-to-end flow of a lesson on the platform: from the moment a student requests a lesson, to teacher decisions, to cancellations and withdrawals.

## 1. High-Level Journey

1. The **student searches for a teacher** and creates a lesson request.
2. The **teacher accepts or rejects** the request.
3. If accepted, the **lesson takes place via video call**.
4. After the lesson, **funds are settled on-chain** according to the rules (normal completion, cancel, withdraw).

Under the hood, two smart contracts manage funds:

- **Request contract** – holds funds while a lesson is only requested.
- **Accept contract** – holds funds for accepted lessons until cancellation or withdrawal.

The **front-end (FE)** handles user interaction and wallet signing, while the **back-end (BE)** builds and submits Cardano transactions.

---

## 2. Student Requests a Lesson

**User action:** The student finds a teacher, chooses a time, and clicks **Submit**.

- **Front-end:**
  - Handler: `onSubmit`
  - The FE validates input (teacher, start time, duration, payment asset) and asks the BE to build a transaction.

- **Back-end:** build request transaction
  - Builds a **request transaction CBOR** that:
    - Locks the student's funds in the **request contract**.
    - Writes lesson metadata into the datum (teacher, start time, duration, etc.).
  - Returns the unsigned **tx CBOR** to the FE.

- **Front-end:** wallet signing
  - Uses the connected Cardano wallet (via Lucid) to **sign the tx CBOR**.
  - Returns the signed part to the BE.

- **Back-end:** assemble and submit
  - Assembles the full transaction and **submits it** to Cardano.
  - Stores an off-chain record linking the lesson request to the on-chain UTXO.

**Result:**
- Funds are locked in the **request contract**.
- The teacher sees a new pending request in their calendar.

---

## 3. Teacher Decision: Accept or Refuse

Once a request appears in the teacher's calendar, they can either **refuse** or **accept**.

### 3.1 Teacher Refuses the Lesson (Refund Student)

> Concept defined; implementation will be added.

- **Front-end:** teacher clicks **Refuse**.
- **Back-end:**
  - Builds a **refund transaction CBOR** that spends from the **request contract** and sends funds back to the student (according to your fee rules).
  - Returns unsigned tx CBOR to the FE.
- **Front-end:** wallet signs the tx CBOR and returns it.
- **Back-end:** assembles, submits the transaction, and marks the request as **refused/refunded**.

**Result:** the request is closed and the student's funds are returned.

### 3.2 Teacher Accepts the Lesson

- **Front-end:**
  - Handler: `onSpecialistAccept`
  - Teacher clicks **Accept** on a specific request.

- **Back-end:** move funds into the accept contract
  - Builds an **accept transaction CBOR** that:
    - Spends the UTXO from the **request contract**.
    - Moves funds (and teacher collateral, if applicable) into the **accept contract**.
    - Creates a new datum representing the accepted lesson (student, teacher, start, duration, lessonPrice, lessonLock, etc.).
  - Returns unsigned tx CBOR to the FE.

- **Front-end:** wallet signing
  - Teacher's wallet signs the tx CBOR.
  - Signed data is sent back to the BE.

- **Back-end:** assemble and submit
  - Assembles and **submits** the transaction.
  - Marks the lesson as **Accepted** in off-chain storage.

**Result:**
- Funds move from the **request contract** to the **accept contract**.
- The lesson is now firmly booked.

---

## 4. Lesson Via Video Call

At the scheduled `lessonStartTime`, both student and teacher join a video call (e.g. using LiveKit or WebRTC-based components).

- The UI shows upcoming accepted lessons and provides a **Join call** button.
- No on-chain state changes occur during the call itself; funds remain locked in the **accept contract** until a later action (cancel or withdraw).

---

## 5. After Acceptance: Cancellation Scenarios

Once accepted, both teacher and student can trigger cancellations under certain rules. Each cancellation is an on-chain transaction that spends from the **accept contract** and redistributes funds.

### 5.1 Teacher Cancels the Lesson

- **Front-end:**
  - Handler: `onSpecialistCancelAccept`
  - Teacher clicks **Cancel**.

- **Back-end:**
  - Builds a **cancel transaction CBOR** that:
    - Spends from the **accept contract**.
    - Sends the **locked amount** (e.g. `lessonLock`) to the **admin/service**.
    - Sends the **lesson price** back to the **student**.
  - Returns unsigned tx CBOR to FE.

- **Front-end:** teacher's wallet signs the tx CBOR and returns it.
- **Back-end:** assembles and submits the transaction; lesson is marked as **canceled by teacher**.

**Result:**
- Student is fully refunded the lesson price.
- Service receives the lock as compensation/penalty for the cancellation.

### 5.2 Student Cancels an Accepted Lesson

- **Front-end:** student clicks **Cancel** on an accepted lesson.
- **Back-end:**
  - Calculates teacher vs student shares of the **lesson price** based on how early or late the cancellation is.
  - Builds a **cancel transaction CBOR** that:
    - Spends from the **accept contract**.
    - Sends the **locked amount** to **admin/service**.
    - Splits the **lesson price** between **teacher** and **student** according to the timing rules.
  - Returns unsigned tx CBOR to FE.

- **Front-end:** student's wallet signs the tx CBOR and returns it.
- **Back-end:** assembles and submits the transaction; lesson is marked as **canceled by student**.

**Result:**
- Teacher and student receive their respective portions of the lesson price.
- Service keeps the lock token/amount.

---

## 6. Completion: Teacher Withdraws After the Lesson

When the lesson has taken place and is considered finished successfully, the teacher can withdraw their earnings.

- **Front-end:**
  - Handler: `onSpecialistClaimRewards`
  - Teacher clicks **Withdraw** on eligible lessons.

- **Back-end:**
  - Verifies the lesson is over and eligible for withdrawal.
  - Builds a **withdraw transaction CBOR** that:
    - Spends from the **accept contract**.
    - Sends the **locked amount** to **admin/service**.
    - Sends the **lesson price** to the **teacher**.
  - Returns unsigned tx CBOR to FE.

- **Front-end:** teacher's wallet signs the tx CBOR.
- **Back-end:** assembles and submits the transaction; lesson is marked as **completed/paid**.

**Result:**
- Teacher receives full payment for the lesson.
- Service obtains the lock as fee or staking reward.
- The lesson lifecycle is fully completed on-chain and off-chain.

---

## 7. Summary

- **Front-end**: handles UX and wallet signing only.
- **Back-end**: builds CBOR transactions, enforces which contract is used (request vs accept), and submits transactions to Cardano.
- **Contracts**:
  - Request contract holds funds while the lesson is only a request.
  - Accept contract holds funds once the teacher accepts the lesson.
- **Flows**:
  - Request Refuse/Refund or Accept, Cancel or Withdraw.
  - Each step is: user click on FE, BE builds tx CBOR, wallet signs on FE, BE assembles and submits.
