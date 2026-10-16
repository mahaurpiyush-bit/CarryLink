# CarryLink roadmap

## Implemented foundation

- JWT authentication and role-based API authorization
- Normalized users, trips, ordered trip stops, delivery requests, and bookings
- Explicit permitted categories and prohibited-item rejection
- Route overlap scoring using ordered stops
- Capacity reservation under a pessimistic database lock
- Booking state transitions with actor authorization

## Next production-minded modules

1. **Verification**: `verification_submissions`, encrypted document storage, admin review and audit events.
2. **Payments**: payment intent and webhook tables, idempotency keys, escrow/release/refund states.
3. **Trust and safety**: reports, disputes, prohibited-item review, account suspension, immutable audit log.
4. **Location**: provider-neutral Maps adapter for geocoding and route/stop validation.
5. **Notifications**: email first; WebSockets only for delivery status updates where useful.
6. **Operations**: admin dashboard, metrics, rate limits, structured logs, backups and CI/CD.

These should remain modules in this Spring Boot monolith until real scaling evidence justifies separation.
