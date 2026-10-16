# API examples

All protected endpoints use `Authorization: Bearer <token>`.

## Register

```json
POST /api/auth/register
{
  "name": "Asha",
  "email": "asha@example.com",
  "phone": "+911234567890",
  "password": "strong-password",
  "role": "SENDER"
}
```

## Create a trip

```json
POST /api/trips
{
  "origin": "Jammu",
  "destination": "Delhi",
  "departureTime": "2026-10-15T08:00:00Z",
  "expectedArrivalTime": "2026-10-15T20:00:00Z",
  "transportType": "TRAIN",
  "totalCapacity": 8,
  "pickupPoint": "Jammu Railway Station",
  "dropPoint": "New Delhi Railway Station",
  "stops": [
    {"location": "Jammu", "expectedArrival": "2026-10-15T08:00:00Z", "expectedDeparture": "2026-10-15T08:15:00Z"},
    {"location": "Chandigarh", "expectedArrival": "2026-10-15T14:00:00Z", "expectedDeparture": "2026-10-15T14:10:00Z"},
    {"location": "Delhi", "expectedArrival": "2026-10-15T20:00:00Z", "expectedDeparture": "2026-10-15T20:00:00Z"}
  ]
}
```

## Create a request

```json
POST /api/requests
{
  "origin": "Jammu",
  "destination": "Chandigarh",
  "pickupPoint": "Jammu Railway Station",
  "dropPoint": "Chandigarh Railway Station",
  "itemCategory": "CLOTHING",
  "description": "Three kilograms of winter clothes",
  "weight": 3,
  "requiredBy": "2026-10-16T00:00:00Z",
  "offeredAmount": 650
}
```

`dimensions` and `OTHER_PERMITTED` can be added when the UI exposes them. The server always validates category and weight; clients cannot bypass prohibited-item policy.

## Booking and trust

- `POST /api/bookings` reserves capacity using a locked trip row and creates a `PAYMENT_PENDING` booking.
- `POST /api/bookings/{id}/payment` authorizes the internal payment adapter. The `idempotencyKey` prevents duplicate charges and is the integration point for a real gateway.
- `PATCH /api/bookings/{id}/status` accepts lifecycle states such as `HANDED_OVER`, `IN_TRANSIT`, `DELIVERED`, and `CANCELLED`. Invalid cancellation and delivery transitions are rejected.
- `POST /api/bookings/{id}/reports` opens a dispute and moves the booking to `DISPUTED`.
- Admins use `GET /api/admin/reports` and `PATCH /api/admin/reports/{id}` to review reports.
