# 📚 MemoGarden API Reference

MemoGarden uses [Supabase](https://supabase.com/docs/guides/api)[4] as its backend, providing a secure, RESTful API automatically generated from the database schema. This API enables you to interact with boards, widgets, users, and more—perfect for integrations, automation, or advanced usage.

---

## 🔑 Authentication

All API requests require authentication via a Supabase JWT or API key.  
- **Header:** `apikey: <your-anon-or-service-key>`
- **User Auth:** Use the `Authorization: Bearer <user-access-token>` header for user-level access.

---

## 🌳 API Endpoints Overview

Base URL:  

https://<your-project-ref>.supabase.co/rest/v1/

text

### Common Resources

| Resource      | Path             | Description                        |
|---------------|------------------|------------------------------------|
| Boards        | `/boards`        | User-created corkboards            |
| Widgets       | `/notes`         | All widgets (notes, images, etc.)  |
| Profiles      | `/profiles`      | User profiles                      |
| Board Members | `/board_members` | Board collaborators                |

---

## 📋 CRUD Operations

### Boards

- **List Boards**

GET /boards

text
Query params: `?owner_id=eq.<user_id>` or `?is_public=eq.true`

- **Get Board**

GET /boards?id=eq.<board_id>

text

- **Create Board**

POST /boards
{
"title": "My Board",
"owner_id": "<user_id>",
"is_public": false
}

text

- **Update Board**

PATCH /boards?id=eq.<board_id>
{
"title": "Updated Title"
}

text

- **Delete Board**

DELETE /boards?id=eq.<board_id>

text

---

### Widgets (Notes, Images, etc.)

- **List Widgets on a Board**

GET /notes?board_id=eq.<board_id>

text

- **Get Widget**

GET /notes?id=eq.<widget_id>

text

- **Create Widget**

POST /notes
{
"board_id": "<board_id>",
"widget_type": "note", // or "image", "weather", etc.
"content": "Hello!",
"x": 100,
"y": 200,
"widget_settings": { ... }
}

text

- **Update Widget**

PATCH /notes?id=eq.<widget_id>
{
"content": "Updated!",
"widget_settings": { ... }
}

text

- **Delete Widget**

DELETE /notes?id=eq.<widget_id>

text

---

### User Profiles

- **Get Profile**

GET /profiles?id=eq.<user_id>

text

- **Update Profile**

PATCH /profiles?id=eq.<user_id>
{
"username": "newname",
"avatar_url": "..."
}

text

---

### Board Members (Collaboration)

- **List Board Members**

GET /board_members?board_id=eq.<board_id>

text

- **Add Member**

POST /board_members
{
"board_id": "<board_id>",
"user_id": "<user_id>",
"role": "editor" // or "viewer"
}

text

- **Remove Member**

DELETE /board_members?board_id=eq.<board_id>&user_id=eq.<user_id>

text

---

## 🔄 Real-Time & Subscriptions

- **Realtime Updates:**  
Subscribe to changes on any table (e.g., `/notes`, `/boards`) using [Supabase Realtime](https://supabase.com/docs/guides/realtime).

---

## 📦 File Storage (Images)

- **Upload Image:**  
Use Supabase Storage via the dashboard or [Storage API](https://supabase.com/docs/guides/storage/api).

---

## 🔒 Security

- All endpoints are protected by Row Level Security (RLS).
- Users can only access boards and widgets they own or have been granted access to.

---

## 🧑‍💻 Example: Fetching Public Boards

GET /boards?is_public=eq.true
apikey: <your-anon-key>

text

## 🧑‍💻 Example: Creating a Sticky Note

POST /notes
apikey: <your-anon-key>
Authorization: Bearer <user-access-token>
Content-Type: application/json

{
"board_id": "abc123",
"widget_type": "note",
"content": "Remember to water the plants!",
"x": 120,
"y": 200,
"widget_settings": {}
}

text

---

## 📖 More Info

- [Supabase REST API Docs](https://supabase.com/docs/guides/api)[4]
- [Widget System Guide](./widgets.md)

---

## 📝 Notes

- The API is auto-generated and reflects your current database schema.
- For advanced queries, use [Supabase's query filters](https://supabase.com/docs/guides/api/filters).

---

**Questions or issues?**  
Open an [issue](https://github.com/itsemtuk/memo-garden-verse/issues) or see the [Supabase Docs](https://supabase.com/docs/guides/api)[4].
