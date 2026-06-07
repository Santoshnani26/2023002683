# Notification System Design Document

## Stage 1: Requirements & Problem Statement
### Functional Requirements
- Fetch notifications of different types (Placement, Result, Event) from the central API.
- Display notifications in an intuitive list.
- Support filtering by notification type.
- Implement a Priority Inbox ranking logic (Placement > Result > Event).
- Consider recency (newer notifications ranked higher within the same priority).

### Non-Functional Requirements
- **Performance:** Response time must be <500ms.
- **Scalability:** The system should handle high throughput gracefully.
- **Observability:** Custom logging middleware is mandatory to track API requests, responses, and errors.
- **Security:** Token-based authorization must be proxy-secured on the backend, not exposed on the frontend.

## Stage 2: High-Level Architecture
We chose a **3-tier architecture** with a proxy backend to fulfill security, caching, and CORS requirements.

```text
[ React Frontend ]  <-- (REST API) -->  [ Node.js Backend ]  <-- (Bearer Token) -->  [ Affordmed API Server ]
    (Port 5173)                             (Port 5000)                                (20.244.56.144)
```

**Why a Proxy Backend?**
- **CORS Handling:** Direct browser-to-server calls often fail CORS. The backend resolves this.
- **Token Security:** Keeps the Client ID, Secret, and Bearer token on the server side, preventing XSS extraction.
- **Observability:** Centralized logging middleware logs outgoing requests to Affordmed and incoming frontend requests.

## Stage 3: API Design
The Node.js proxy provides the following normalized API to the frontend:

| Endpoint | Method | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `/api/notifications` | GET | Fetch all or filtered notifications | `type` (optional), `page`, `limit` |
| `/api/notifications/priority` | GET | Fetch Priority Inbox notifications | `page`, `limit` |
| `/api/notifications/count` | GET | Get count statistics for badges | None |

## Stage 4: Data Model & Priority Algorithm
### Data Schema Assumption
```json
{
  "id": "123",
  "title": "New Placement Drive",
  "description": "Details about the drive",
  "type": "placement",
  "timestamp": "2026-06-07T10:00:00Z"
}
```

### Priority Algorithm
1. **Primary Sort:** By Priority Weight (`Placement`=1, `Result`=2, `Event`=3). Lower number = higher priority.
2. **Secondary Sort:** By `timestamp` descending (Recency).

```javascript
// Pseudocode
if (priorityA !== priorityB) {
  return priorityA - priorityB;
}
return timeB - timeA;
```

## Stage 5: Frontend Design
- **Framework:** React + Vite
- **UI Library:** Material UI (MUI) for professional, responsive design.
- **Pages:**
  - `AllNotifications`: Standard chronological view with filter toggles.
  - `PriorityInbox`: Smart sorted view based on the algorithm above.
- **Components:**
  - `NotificationCard`: Displays individual alerts with color-coded chips (Green=Placement, Blue=Result, Orange=Event).
  - `FilterBar`: Toggle group for filtering.
  - `PaginationControls`: Handles offset-based pagination.

## Stage 6: Logging, Monitoring & Scalability
### Logging Strategy
- Implemented a custom `logging-middleware` package using **Winston**.
- Captures: HTTP Method, URL, Status, Response Time, and timestamp.
- Stores logs locally in `app.log` and outputs colorized logs to the console.

### Scalability Considerations (Future Proofing)
- **Caching:** In Stage 3 (Production), we would introduce Redis to cache the `/api/notifications` response with a 1-minute TTL to reduce load on the Affordmed server.
- **Message Queues:** If writing notifications, we'd use RabbitMQ or Kafka to decouple writes from the main thread.
- **Real-time:** Future iterations should adopt WebSockets for push-based notifications rather than client polling.
