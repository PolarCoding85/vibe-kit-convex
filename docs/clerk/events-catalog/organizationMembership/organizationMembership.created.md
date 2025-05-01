# Organization Membership Created Event

Example Organization Membership Created Event:

```json
{
  "data": {
    "created_at": 1654013203217,
    "id": "orgmem_29w9IptNja3mP8GDXpquBwN2qR9",
    "object": "organization_membership",
    "organization": {
      "created_at": 1654013202977,
      "created_by": "user_1vq84bqWzw7qmFgqSwN4CH1Wp0n",
      "id": "org_29w9IfBrPmcpi0IeBVaKtA7R94W",
      "image_url": "https://img.clerk.com/xxxxxx",
      "logo_url": "https://example.com/example.png",
      "name": "Acme Inc",
      "object": "organization",
      "public_metadata": {},
      "slug": "acme-inc",
      "updated_at": 1654013202977
    },
    "public_user_data": {
      "first_name": "Example",
      "identifier": "example@example.org",
      "image_url": "https://img.clerk.com/xxxxxx",
      "last_name": "Example",
      "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
      "user_id": "user_29w83sxmDNGwOuEthce5gg56FcC"
    },
    "role": "admin",
    "updated_at": 1654013203217
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654013203217,
  "type": "organizationMembership.created"
}
```
