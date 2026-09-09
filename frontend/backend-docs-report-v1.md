# Online Clinic Backend API Documentation

This documentation provides a comprehensive overview of the **Clinic** and **Finance** apps in the online clinic backend system. It is intended for the frontend development team to understand the API structure, endpoints, data models, and integration points for implementing the client-side application.

## Table of Contents
1. Overview
2. Authentication
3. Clinic App
   - Models
   - API Endpoints
   - User Flows
4. Finance App
   - Models
   - API Endpoints
   - Integration with Clinic
5. Error Handling
6. Examples
7. Configuration

## Overview
The backend consists of two main Django apps:
- **Clinic App**: Manages doctor availability, appointment scheduling, and booking.
- **Finance App**: Handles payment processing using ZarinPal (Iranian payment gateway).

The system supports role-based access: Patients, Doctors, and Admins. All endpoints require authentication.

## Authentication
- Uses JWT or session-based authentication (configured in the main project).
- Include `Authorization: Bearer <token>` in headers for API requests.
- Roles: `patient`, `doctor`, `admin` – permissions are enforced per endpoint.

## Clinic App

### Clinic Models
Key models include:

#### RecurringAvailabilityModel
- **Fields**: doctor (ForeignKey to User), day_of_week, start_time, end_time, slot_duration, price_irr, appointment_type, valid_from, valid_until
- **Purpose**: Defines regular weekly availability for doctors.

#### AvailabilityExceptionModel
- **Fields**: doctor, exception_type (AVAILABLE/UNAVAILABLE), date, start_time, end_time, reason
- **Purpose**: Handles one-off changes to availability.

#### AppointmentModel
- **Fields**: patient, doctor, appointment_date, start_time, end_time, appointment_type, status (PENDING/CONFIRMED/COMPLETED/CANCELLED/NO_SHOW), price_irr, notes, payment_status, payment_id
- **Purpose**: Represents booked appointments.

### Clinic API Endpoints
Base URL: `/api/v1/clinic/`

#### Appointments
- **GET /appointments/**: List user's appointments (patients see own, doctors see their patients, admins see all).
  - Query params: `status`, `date_from`, `date_to`
  - Response: List of appointments with payment info.

- **POST /appointments/book/**: Book a new appointment.
  - Request body: `{"doctor_id": "uuid", "appointment_date": "YYYY-MM-DD", "start_time": "HH:MM:SS", "end_time": "HH:MM:SS", "appointment_type": "consultation"}`
  - Response: `{"appointment": {...}, "payment": {"id": "uuid", "authority": "AUTH-123", "payment_url": "https://zarinpal.com/pg/StartPay/AUTH-123", "amount_irr": 50000, "status": "pending"}}`

- **POST /appointments/{id}/cancel/**: Cancel an appointment.
  - Request body: `{"reason": "string"}`
  - Response: Updated appointment.

- **GET /appointments/upcoming/**: Get future confirmed appointments.

#### Doctor Availability
- **GET /doctor-availability/{doctor_id}/slots/**: Get available slots.
  - Query params: `start_date`, `end_date` (max 90 days)
  - Response: List of slots: `[{"date": "YYYY-MM-DD", "start_time": "HH:MM:SS", "end_time": "HH:MM:SS", "price_irr": 50000, "available": true}]`

#### Recurring Availability
- **GET /recurring-availability/**: List doctor's recurring availability (doctors only).
- **POST /recurring-availability/**: Create recurring availability.
- **PUT /recurring-availability/{id}/**: Update.
- **DELETE /recurring-availability/{id}/**: Delete.

#### Availability Exceptions
- **GET /availability-exceptions/**: List doctor's exceptions.
- **POST /availability-exceptions/**: Create exception.
- **PUT /availability-exceptions/{id}/**: Update.
- **DELETE /availability-exceptions/{id}/**: Delete.

### Clinic User Flows
1. **Patient Books Appointment**:
   - Check available slots via `/doctor-availability/{doctor_id}/slots/`.
   - Book via `/appointments/book/` – receives payment URL.
   - Redirect to payment URL to complete payment.
   - After payment, appointment is confirmed automatically.

2. **Doctor Manages Availability**:
   - Set recurring availability via `/recurring-availability/`.
   - Add exceptions via `/availability-exceptions/`.

3. **View Appointments**:
   - Patients/doctors view via `/appointments/`.

## Finance App

### Finance Models
#### PaymentModel
- **Fields**: appointment (ForeignKey), amount_irr, status (pending/confirmed/failed/refunded), authority, payment_url, created_at, updated_at, idempotency_key
- **Purpose**: Links appointments to payments.

#### TransactionModel
- **Fields**: payment (ForeignKey), authority, amount, status, provider_payment_id, verified_at, failure_reason
- **Purpose**: Records ZarinPal transactions.

#### RefundModel
- **Fields**: payment, amount_irr, reason, status, processed_at, admin_user
- **Purpose**: Tracks refunds.

### Finance API Endpoints
Base URL: `/api/v1/finance/`

#### Payments
- **GET /payments/**: List user's payments (patients see own, doctors see their patients).
- **GET /payments/{id}/**: Get payment details.
- **POST /payments/{id}/verify/**: Manually verify payment (admin/doctor).
- **POST /payments/{id}/refund/**: Process refund (admin).

#### Transactions
- **GET /transactions/**: List transactions (admin).
- **GET /transactions/{id}/**: Get transaction details.

#### Callback
- **GET /payments/callback/**: ZarinPal callback endpoint (handles payment confirmation).
  - Query params: `Authority`, `Status`
  - Response: Redirects to success/failure page.

### Finance Integration with Clinic
- Booking an appointment in Clinic automatically creates a Payment in Finance.
- Payment confirmation via callback updates the appointment status to CONFIRMED.
- Refunds can be initiated from Finance, affecting appointment status.

## Error Handling
- **HTTP Status Codes**: 200 (success), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error).
- **Response Format**: `{"error": "message", "code": "ERROR_CODE"}`
- Common errors: Invalid slot, payment failed, concurrency issues.
- Rate limiting: Applied to booking endpoints.

## Examples

### Book Appointment
```bash
POST /api/v1/clinic/appointments/book/
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctor_id": "550e8400-e29b-41d4-a716-446655440000",
  "appointment_date": "2025-11-15",
  "start_time": "10:00:00",
  "end_time": "10:30:00",
  "appointment_type": "consultation"
}
```

Response:
```json
{
  "appointment": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "pending",
    "payment_status": "pending"
  },
  "payment": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "authority": "AUTH-123456",
    "payment_url": "https://zarinpal.com/pg/StartPay/AUTH-123456",
    "amount_irr": 50000,
    "status": "pending"
  }
}
```

### Get Available Slots
```bash
GET /api/v1/clinic/doctor-availability/550e8400-e29b-41d4-a716-446655440000/slots/?start_date=2025-11-10&end_date=2025-11-20
Authorization: Bearer <token>
```

Response:
```json
[
  {
    "date": "2025-11-15",
    "start_time": "10:00:00",
    "end_time": "10:30:00",
    "price_irr": 50000,
    "available": true
  }
]
```

This documentation covers the core functionality. For detailed serializer schemas or additional endpoints, refer to the API code or contact the backend team.