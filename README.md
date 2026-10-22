# MyCoach

A React single-page application where coaches and clients share fitness posts, discuss active living, and discover coaches.

Educational project for the [SoftUni React course](https://softuni.bg/modules/153/react-septemvri-2026/1555).

**Demo Link:** To be added after deployment.

**Repository:** https://github.com/hristopiperkov/MyCoach

## Documentation

### Architecture

Built with React, Vite, React Router, and Supabase.

- `components/` — pages, reusable UI, and route guards.
- `contexts/` — shared authentication state.
- `hooks/` — reusable authentication and post-loading logic.
- `services/` — post requests and validation.
- `App.jsx` — routes and shared member data.
- `supabase.js` and `request.js` — backend communication.
- External CSS files — shared theme and component styling.

Supabase provides authentication, PostgreSQL storage, and Row Level Security (RLS).

## Installation

Requires Node.js compatible with the project's Vite version and npm.

```bash
git clone https://github.com/hristopiperkov/MyCoach.git
cd MyCoach
npm ci
```

Create `.env.local` in the project root:

```env
VITE_API_KEY=your_supabase_publishable_key
```

Use the publishable key belonging to the Supabase project configured in the source. A different backend requires its URL, tables, authentication trigger, and RLS policies to be configured.

```bash
npm run dev
```

Production build and preview:

```bash
npm run build
npm run preview
```

## Functional Guide

### 1. Project Overview

**Application Name:** MyCoach  
**Application Category / Topic:** Health and fitness social network.

**Main Purpose:** MyCoach connects coaches and clients through posts and discussions. Users can discover coaches by specialty and maintain profiles with coaching information or fitness goals.

### 2. User Access & Permissions

**Guest (Not Authenticated):**
Guests can browse Community, posts, comments, the coach catalog, and coach details. Login and registration are available, but creating content and editing profiles require authentication.

**Authenticated User:**
Members can edit their own profile, create posts, view My posts, and add comments. Only authors can edit/delete their posts or delete their comments.

Coaches can set specialties, descriptions, locations, hourly rates, and currencies. Clients can provide fitness goals.

### 3. Authentication & Session Handling

**Authentication Flow:**

1. On startup, `AuthProvider` checks the Supabase session and subscribes to authentication changes.
2. Login authenticates the user. Registration creates an account and a linked `public.users` profile through a database trigger.
3. Successful authentication updates Context and redirects to the requested private page or Community.
4. Logout clears the current browser session and returns to Community.

Email confirmation is disabled for this course project.

**Session Persistence:**
Supabase stores the session in local storage and refreshes tokens automatically. On refresh, `AuthProvider` restores authentication state through the SDK. Route guards wait for this check before redirecting.

### 4. Routing Structure

**Route Guards Logic:**
`ProtectedRoute` redirects guests to Login. `GuestRoute` redirects authenticated users away from Login and Register. Post editing additionally checks ownership.

**Main Routes:**
The application has ten page routes, a root redirect, and a fallback.

| Route | Page | Access |
| --- | --- | --- |
| `/` | Redirect to Community | Public |
| `/posts` | Community | Public |
| `/posts/:postId` | Post details | Public |
| `/coaches` | Coach catalog | Public |
| `/coaches/:coachId` | Coach details | Public |
| `/login` | Login | Guests |
| `/register` | Register | Guests |
| `/profile` | Edit profile | Authenticated |
| `/my-posts` | Own posts | Authenticated |
| `/posts/new` | Create post | Authenticated |
| `/posts/:postId/edit` | Edit post | Author |
| `*` | Page not found | Public |

**Nested & Parameterized Routes:**
Private and guest-only routes are nested under pathless guards using `Outlet`. Post details, post editing, and coach details read their identifiers through `useParams`.

### 5. List → Details Flow

**Catalog / List Page:**
Community displays posts newest first, including author information, text, optional images, and comments. My posts filters the list by author.

The coach catalog displays profiles and rates, with name/specialty search and Strength, Nutrition, and Movement filters.

**Details Page:**
Clicking a post title or image opens its details through `Link`. Coach cards link to coach details. Each details page reads the record ID from the URL and fetches its data from Supabase.

### 6. Data Source & Backend

**Backend Type:** Supabase Backend-as-a-Service.

Authentication uses Supabase Auth. Persistent data is accessed through REST requests and the Supabase SDK.

- `users` — profiles linked to authentication accounts.
- `posts` — community posts linked to authors.
- `comments` — comments linked to posts and authors.

RLS restricts writes to authorized users. Deleting a post also deletes its related comments.

### 7. Data Operations (CRUD)

The `posts` collection supports all four operations:

- **Create (POST):** Authenticated users submit a validated title, content, and optional image URL. Success clears the form; the post appears when the feed is fetched.
- **Read (GET):** Community fetches all posts, My posts filters by author, and Post details fetches one record.
- **Update (PATCH):** Authors edit prefilled values. The request filters by post and author IDs, then redirects to details showing the updated data.
- **Delete (DELETE):** Authors confirm deletion. The request filters by post and author IDs, then redirects to the refreshed My posts page.

Comments support creation and author-only deletion. Component state updates the visible comments immediately after successful requests.

### 8. Forms & Validation

**Forms Used:** Registration, login, profile editing, post creation/editing, and comment creation. The coach catalog also includes search/filter controls.

Most forms use controlled inputs and React event handlers. Registration reads submitted values with `FormData`.

**Validation Rules:**

| Field | Rules |
| --- | --- |
| Post title | Required, trimmed, 3–120 characters |
| Post content | Required, trimmed, 10–10,000 characters |
| Post image URL | Optional; HTTP/HTTPS URL without whitespace |
| Comment | Required, trimmed, 1–2,000 characters |
| Registration password | At least 8 characters; confirmation must match |
| First and last name | Required; cannot contain only whitespace |
| Hourly rate | Optional; finite, non-negative number |

Validation errors are displayed, and submission is disabled while requests are pending.

### 9. React-Specific Techniques

**Hooks & Component Lifecycle:**
`useState` manages forms, data, and interface states. `useEffect` fetches data and manages authentication subscriptions. Router hooks handle parameters and navigation. Custom hooks include `useAuth` and `usePost`.

For example, Coach details fetches data on mount, fetches again when `coachId` changes, and aborts the previous request during cleanup.

**Context API:**
`AuthContext` shares the user, session, loading state, and authentication error. Navigation, route guards, profiles, posts, and comments consume it through `useAuth`.

**Component Styling:**
Shared and component-specific external CSS files provide the theme and responsive layouts.

### 10. Typical User Flow

1. Browse Community and discover coaches.
2. Register or log in and complete a profile.
3. Create a post and find it in Community or My posts.
4. Open post details to edit or delete an owned post.
5. Add comments to discussions.
6. Log out and continue browsing public content.

### 11. Error & Edge Case Handling

- **Authentication errors:** Login and registration display failures; guards wait while authentication loads.
- **Network or data errors:** Components display loading/error states, with retry controls where implemented.
- **Empty data:** Lists display messages when no posts, comments, or matching coaches exist.
- **Missing records:** Invalid or missing IDs display unavailable states; unknown routes show Page not found.
- **Unauthorized actions:** Ownership checks and database policies restrict editing and deletion.
- **Submission errors:** Forms display feedback and prevent repeated submission while saving.

## Author

**Hristo Piperkov**

GitHub: https://github.com/hristopiperkov