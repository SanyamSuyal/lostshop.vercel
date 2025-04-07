# Testing New Storage Methods

This document explains how to test the newly implemented storage methods for features like coupons, subscriptions, audit logs, and forums.

## Interactive Testing via API

For interactive testing from a web client or API tool (like Postman), use these routes:

### 1. Create Admin Account
```
POST /api/create-admin-account
```
This creates an admin user with username `admin` and password `adminpass123`.

### 2. Login as Admin
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "adminpass123"
}
```

### 3. Run Feature Tests
```
POST /api/test/storage
Content-Type: application/json

{
  "feature": "coupons" // or "subscriptions", "audit", "forum"
}
```

## Testing with Node.js Script

Two testing scripts are provided:

### 1. Interactive Script
Run the interactive test script that will prompt you to choose which features to test:
```
node test-storage.js
```

### 2. Automated Script
Run the automated test script that tests all features sequentially:
```
node test-storage-non-interactive.js
```

## Features Being Tested

### Coupons
- Creating coupons with discount percent
- Validating coupon codes
- Retrieving all coupons

### Subscriptions
- Creating user subscriptions
- Retrieving user subscriptions
- Getting active subscriptions

### Audit Logs
- Creating audit log entries
- Getting audit logs by user
- Getting all audit logs

### Forums
- Creating forum topics
- Adding replies to topics
- Pinning topics and marking replies as answers
- Tracking topic views

## Notes

- These implementations have been added to both the `MemStorage` interface for in-memory storage and defined for the `DatabaseStorage` implementation when using PostgreSQL.
- Type safety checks are in place to ensure proper data structure and validation.
- These tests verify the implementation is working correctly but note that there are still some TypeScript LSP warnings that will be addressed in a future update.