# Service Overview

This service is a web-based marketplace for live lessons that combines a familiar Web2 user experience with Web3 guarantees on Cardano. Students and teachers interact through a simple interface, while payments, refunds, and penalties are enforced by smart contracts rather than trust alone.

Users can register with traditional methods such as email, Google, or Twitter and connect Cardano wallet for payment. Once registered, students can browse teachers, request lessons, and pay in ADA or other supported native tokens. Teachers see incoming lesson requests, accept or decline them, and manage their schedule from a dedicated dashboard.

## Economic logic

The economic logic of the platform is encoded in Cardano smart contracts. When a student requests a lesson, funds are locked on-chain under a lesson-request contract. If the teacher accepts, additional collateral is added and the lesson moves into an “accepted” contract state. From there, a clear set of rules governs refunds, cancellations, lateness, and final payouts—covering scenarios such as last-minute cancellations, no-shows, and technical issues. A small service fee and a “lock” token ensure the platform and teachers are incentivized to behave correctly.

An off-chain service monitors the blockchain and lesson timeline. It exposes simple endpoints to: list and request lessons, accept or cancel them, trigger refunds for expired requests, and settle lessons after they end. Based on reports (e.g. problems during the lesson) and objective criteria like start time and lateness, it chooses the appropriate payout scenario and executes a final settlement transaction. The result is a transparent, rules-based lesson platform where all participants know in advance how money will move in every situation.
