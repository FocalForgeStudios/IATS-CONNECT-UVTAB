IATS CONNECT — Database Backup Bundle
Captured 2026-10-14
Project ref: ojobzjornniyjrqszglk

Files in this folder:
- ../schema.sql: consolidated current schema reference
- migration-ledger.txt: 25 migration entries returned by the live project
- RESTORE-AND-FULL-BACKUP.md: instructions for producing a true data + storage backup and restoring safely

IMPORTANT: this is not a complete production backup by itself. It does not contain production table rows, Auth credentials/secrets, or uploaded Storage object bytes. Do not assume schema.sql alone can restore user profiles, messages, events, or attachments. Preserve production until a native Postgres dump and Storage copy have been made and tested.
