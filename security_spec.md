# Security Specification - Mocha AI

## 1. Data Invariants
- User settings must always belong to the authenticated user.
- Chat sessions and messages must be tied to a valid user ID.
- Timestamps must be server-generated.
- Field types must be strictly enforced.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Identity Spoofing**: Attempt to write to `/users/another_uid/config/settings`.
2. **Shadow Field Injection**: Adding an `isAdmin: true` field to `UserSettings`.
3. **Type Poisoning**: Sending a string for the `creativity` field (expected number).
4. **Size Exhaustion**: Sending a 1MB bio string.
5. **ID Poisoning**: Using a path like `/users/../../system_config` if matches allow it.
6. **Immutable Field Tampering**: Attempting to change `createdAt` on a Chat document.
7. **Cross-User Leak**: Authenticated User A attempting to list User B's chats.
8. **PII Exposure**: Unauthenticated read of any user document.
9. **State Shortcut**: Forcing a `status: 'processed'` on a resource before logic allows it.
10. **Client Timestamp Spoof**: Sending a hardcoded date instead of `request.time`.
11. **Orphaned Message**: Creating a message in a chat ID that does not exist.
12. **Blanket Query**: Requesting all messages across all users without a `where` clause.

## 3. Test Runner Definition
(Implemented in firestore.rules.test.ts)
