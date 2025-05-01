# Organization Membership Deleted Event

Example Organization Membership Deleted Event:

```json
{
  "data": {
    "created_at": 1654013847054,
    "id": "orgmem_29wAbjiJs6aZuPq7AzmkW9dwmyl",
    "object": "organization_membership",
    "organization": {
      "created_at": 1654013202977,
      "created_by": "user_1vq84bqWzw7qmFgqSwN4CH1Wp0n",
      "id": "org_29w9IfBrPmcpi0IeBVaKtA7R94W",
      "image_url": "https://img.clerk.com/xxxxxx",
      "logo_url": null,
      "name": "Acme Inc",
      "object": "organization",
      "public_metadata": {},
      "slug": "acme-inc",
      "updated_at": 1654013567994
    },
    "public_user_data": {
      "first_name": null,
      "identifier": "example@example.org",
      "image_url": "https://img.clerk.com/xxxxxx",
      "last_name": null,
      "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
      "user_id": "user_29wACSk1DjeUCwsS6SbbgIgilMy"
    },
    "role": "basic_member",
    "updated_at": 1654013847054
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654013847054,
  "type": "organizationMembership.deleted"
}
```
