# Organization Invitation Revoked Event

Example Organization Invitation Revoked Event:

```json
{
  "data": {
    "created_at": 1654014463774,
    "email_address": "example@example.org",
    "id": "orginv_29wBrB4vFM8wqWv9mHSpw3P7QW0",
    "object": "organization_invitation",
    "organization_id": "org_29w9IfBrPmcpi0IeBVaKtA7R94W",
    "role": "basic_member",
    "status": "revoked",
    "updated_at": 1654014516824
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654014516824,
  "type": "organizationInvitation.revoked"
}
```
