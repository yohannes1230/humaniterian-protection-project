# Offline Synchronization

The prototype is configured as a PWA with a service worker. The target field workflow:

1. User downloads assigned cases while online.
2. User loses connectivity.
3. User creates or updates local case drafts.
4. Changes are stored in IndexedDB.
5. When connectivity returns, the sync queue pushes changes to the API.
6. The server validates authorization and schema.
7. Conflicts show both versions and require human resolution.

`OfflineSyncItem` target fields:

- `id`
- `userId`
- `deviceId`
- `operation`
- `entity`
- `entityId`
- `payload`
- `status`
- `attemptCount`
- `lastError`
