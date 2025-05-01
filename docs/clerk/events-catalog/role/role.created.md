# Role Created Event

Example Role Created Event:

```json
{
  "data": {
    "created_at": 1701116920137,
    "description": "My custom role",
    "id": "role_2Ym4Iu9JcfMpa4wsTmsRgnY83MX",
    "is_creator_eligible": false,
    "key": "org:my_custom_role",
    "name": "custom role",
    "object": "role",
    "permissions": [
      {
        "created_at": 1700689838703,
        "description": "Permission to read the members of an organization.",
        "id": "perm_2YY5nPgYDurovN5AGWegx5n9JPE",
        "key": "org:sys_memberships:read",
        "name": "Read members",
        "object": "permission",
        "type": "system",
        "updated_at": 1700689838703
      }
    ],
    "updated_at": 1654013202977
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654013202977,
  "type": "role.created"
}
```
