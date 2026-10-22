# MyCoach

MyCoach is a React single-page application for coaches and people interested
in health, fitness, and an active lifestyle.

Members can share posts, participate in discussions, discover coaches, and
manage their profiles. Coaches can present their specialties, experience,
location, and hourly rates.

## Live Demo

**Deployment URL:** To be added after deployment.

## Repository

https://github.com/hristopiperkov/MyCoach

## Technologies

- React
- Vite
- React Router
- JavaScript
- Supabase Authentication
- Supabase PostgreSQL and REST API
- Supabase JavaScript SDK
- CSS and Tailwind CSS
- ESLint

## Main Features

- Registration with Coach or Client role selection.
- Login, logout, and persistent authentication sessions.
- Protected routes and guest-only authentication pages.
- Profile editing with photo URLs and location.
- Coach specialties, descriptions, hourly rates, and currencies.
- Client fitness goals.
- Community posts with full CRUD functionality.
- My posts page.
- Inline comments and deletion of owned comments.
- Coach search, specialty filters, and individual coach profiles.
- Responsive layouts.
- Form validation and loading, error, and empty states.

## Installation and Local Setup

### Prerequisites

- Node.js compatible with the Vite version in `package.json`.
- npm.
- Access to the configured Supabase project.

### 1. Clone the Repository

```bash
git clone https://github.com/hristopiperkov/MyCoach.git
cd MyCoach
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Configure Environment Variables

Create `.env.local` in the project root, next to `package.json`:

```env
VITE_API_KEY=your_supabase_publishable_key
```

Use the publishable key for the Supabase project configured in the source.

The project URL is configured in `src/supabase.js` and in direct API
requests elsewhere in the application. When switching to another Supabase
project, update all references to the previous project URL.

Never use a Supabase service-role or secret key in frontend code.

Variables prefixed with `VITE_` are included in the browser application.
The environment file separates configuration from committed code; it does
not make a frontend key secret. Supabase permissions and Row Level
Security protect database access.

Keep `.env.local` out of version control.

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL printed in the terminal.

Restart the development server after changing environment variables.

### Using a Different Supabase Project

A new Supabase project requires the application's tables, foreign keys,
registration trigger, grants, and Row Level Security policies.

Changing the project URL and API key alone does not recreate the database.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Check the code with ESLint |
| `npm run build` | Generate the production build in `dist` |
| `npm run preview` | Preview the production build locally |

## Project Structure

```text
public/
  images/

src/
  components/
    auth/
    coach-catalog/
    coach-details/
    comments/
    community/
    create-post/
    edit-post/
    guards/
    header/
    login/
    my-posts/
    navigation/
    page-not-found/
    post-details/
    posts/
    profile/
    register/
  contexts/
  hooks/
  services/
  App.jsx
  main.jsx
  request.js
  supabase.js
  index.css
  styles.css
  theme.css
```

## Architecture Overview

- `main.jsx` initializes React, the router, and the authentication provider.
- `App.jsx` defines application routes and loads member information.
- `AuthProvider` manages authentication state and session restoration.
- `AuthContext` shares authentication state across the component tree.
- `useAuth` provides access to the authentication context.
- Route guards control access to private and guest-only pages.
- `supabase.js` configures the shared Supabase client.
- `request.js` provides a helper for HTTP requests.
- `postService.js` contains post-related data operations and validation.
- `usePost` manages loading an individual post.
- `PostList` is reused by Community and My posts.
- `Comments` is reused in the community feed and on post details pages.
- External CSS files provide shared and component-specific styling.

## Functional Guide

### 1. Project Overview

**Application Name:** MyCoach

**Application Category / Topic:** Social network for health, fitness,
and active living.

**Main Purpose:**

MyCoach connects coaches and clients through a shared community.
Members can publish posts, discuss their experiences, and discover
coaches by specialty. Coaches can present their background and services,
while clients can maintain a profile with their fitness goals.

### 2. User Access & Permissions

#### Guest (Not Authenticated)

Guests can access:

- `/posts` — community feed.
- `/posts/:postId` — individual post details.
- `/coaches` — coach catalog.
- `/coaches/:coachId` — individual coach profiles.
- `/login` — login form.
- `/register` — registration form.

Public information includes posts, comments, author information, and
coach profiles.

Guests cannot create, edit, or delete posts, add or delete comments,
or access profile editing and My posts.

#### Authenticated User

Authenticated members can:

- Browse all public content.
- Access `/profile` to edit their own profile.
- Access `/my-posts` to view their own posts.
- Access `/posts/new` to create a post.
- Access `/posts/:postId/edit` for posts they authored.
- Delete their own posts.
- Add comments and delete their own comments.

Coach profiles support specialties, a description, an hourly rate,
and a currency. Client profiles support fitness goals.

Both roles can publish posts and participate in discussions.

Post edit and delete controls are available only to the author.
The edit page also checks ownership when opened directly.

Supabase Row Level Security policies restrict database changes to
the appropriate owner.

### 3. Authentication & Session Handling

#### Authentication Flow

1. When the application loads, `AuthProvider` initializes authentication
   state and subscribes to Supabase authentication changes.
2. It requests the current session using `supabase.auth.getSession()`.
3. Route guards display a loading state while authentication is checked.
4. Login sends the supplied email and password to Supabase Authentication.
5. Registration creates an authentication account. A database trigger
   creates a linked profile in `public.users`.
6. Email confirmation is disabled for the current course-project setup.
   Successful registration establishes the returned session.
7. Authentication events update Context and the navigation controls.
8. After authentication, the guest-route guard redirects the member to
   a previously requested private route when available, or to Community.
9. Logout signs out the current browser session and redirects to Community.

#### Session Persistence

The Supabase client is configured to persist sessions and refresh
authentication tokens automatically.

The SDK stores the session in browser local storage. React Context
provides the current session, user, authentication loading state,
and authentication error to components.

After a page refresh, the SDK restores the saved session and
`AuthProvider` updates Context.

The authentication subscription is removed when the provider unmounts.

### 4. Routing Structure

#### Route Guards Logic

- Public routes are accessible to guests and authenticated members.
- `ProtectedRoute` checks authentication before rendering private routes.
  Guests are redirected to Login.
- `GuestRoute` redirects authenticated members away from Login and Register.
- The post-edit component checks whether the current user owns the post.

#### Main Routes

There are ten named page routes, plus a root redirect and a fallback route.

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Redirect to `/posts` | Public |
| `/posts` | Community feed | Public |
| `/posts/:postId` | Post details and comments | Public |
| `/coaches` | Coach catalog | Public |
| `/coaches/:coachId` | Coach details | Public |
| `/login` | Login | Guests |
| `/register` | Registration | Guests |
| `/profile` | Edit own profile | Authenticated |
| `/my-posts` | Own posts | Authenticated |
| `/posts/new` | Create post | Authenticated |
| `/posts/:postId/edit` | Edit post | Post author |
| `*` | Page not found | Public |

#### Nested & Parameterized Routes

Private routes are nested beneath a pathless `ProtectedRoute`.
Login and Register are nested beneath a pathless `GuestRoute`.

Both guards render their permitted child routes through `Outlet`.

Parameterized routes are:

- `/posts/:postId`
- `/posts/:postId/edit`
- `/coaches/:coachId`

Components read the parameters with `useParams` and fetch the
corresponding database records.

### 5. List → Details Flow

#### Catalog / List Page

Community displays posts fetched from Supabase, ordered from newest
to oldest.

Each post includes:

- Author information.
- Creation date.
- Title and content.
- An optional image.
- Comments.

My posts reuses `PostList` with an author filter.

The coach catalog displays coach photos, names, locations, specialties,
descriptions, and hourly rates.

Users can search coaches by name or specialty and filter by Strength,
Nutrition, or Movement. The search and specialty filter work together.

#### Details Page

Post titles and images use React Router `Link` components to navigate
to `/posts/:postId`.

The post details page reads `postId`, fetches the matching record,
and displays its full information and comments. Authors also receive
edit and delete controls.

Each coach card has a Meet link leading to `/coaches/:coachId`.

The coach details page reads `coachId` and fetches the matching
Coach profile.

Only the record identifier is passed through the URL. Record data is
loaded from Supabase.

### 6. Data Source & Backend

**Backend Type:** Supabase Backend-as-a-Service.

The application uses:

- Supabase Authentication for accounts and sessions.
- Supabase PostgreSQL for persistent data.
- REST requests and the Supabase JavaScript SDK for communication.
- Row Level Security for access restrictions.

#### Main Tables

| Table | Purpose |
| --- | --- |
| `users` | Member profiles linked to authentication accounts |
| `posts` | Community posts linked to their authors |
| `comments` | Comments linked to posts and authors |

#### Relationships

- `users.auth_user_id` references an account in `auth.users`.
- `posts.author_id` references a profile's authentication user ID.
- `comments.author_id` references a profile's authentication user ID.
- `comments.post_id` references a post.

A registration trigger creates the linked profile.
Deleting a post also removes its related comments through the database
relationship's cascading delete behavior.

Data persists between visits. Fictional demonstration profiles are stored
in the database and fetched through the API.

Supabase hosts the backend; the React frontend is deployed separately.

### 7. Data Operations (CRUD)

The `posts` collection implements all four CRUD operations.

#### Create (POST)

An authenticated member opens Create post and enters a title, content,
and an optional image URL.

The form trims and validates the input before inserting a record into
Supabase. The database associates the post with the authenticated author.

After success, the form displays feedback and clears its fields.
The new post is fetched when the member opens Community or My posts.

#### Read (GET)

`PostList` fetches posts with their author information and displays them
in Community.

My posts applies an author filter.

The post details page fetches a single record using its URL parameter.

#### Update (PATCH)

The author opens the edit page from their post's details.

The form contains the existing values. After validation, the update
request targets the post ID and author ID.

After a successful update, the application navigates to the post details
page, which loads the updated information.

#### Delete (DELETE)

The author selects Delete on the post details page and confirms the action.

The request targets the post ID and author ID. After success, the
application navigates to My posts, where the list is fetched again.

Related comments are deleted through the database relationship.

#### Additional Interaction: Comments

Authenticated members can add comments associated with a post.

After insertion, the returned comment is added to the current component's
state. After deleting an owned comment, it is removed from state.

These actions update the visible list without refreshing the entire page.

Changes made in another browser require a new fetch. Realtime
subscriptions are not implemented.

### 8. Forms & Validation

#### Forms Used

- Registration.
- Login.
- Profile editing.
- Post creation.
- Post editing.
- Comment creation.
- Coach search and specialty filtering controls.

Login, profile editing, post creation/editing, and comments use
state-controlled inputs.

React event handlers process input changes and submissions.

Registration reads submitted values using `FormData` and handles
submission through React's `onSubmit` event.

#### Validation Rules

| Field | Rules |
| --- | --- |
| Post title | Required; trimmed; between 3 and 120 characters |
| Post content | Required; trimmed; between 10 and 10,000 characters |
| Post image URL | Optional; when supplied, must be an HTTP/HTTPS URL without whitespace |
| Comment content | Required; trimmed; between 1 and 2,000 characters |
| Registration password | At least 8 characters; must match the confirmation password |
| First and last name | Required; cannot consist only of whitespace |
| Profile photo URL | Optional; must use HTTP or HTTPS when supplied |
| Hourly rate | Optional; when provided, must be a finite, non-negative number |
| Currency | Must be one of the supported currency options |

Validation messages are displayed in the interface.

Forms prevent repeated submission while a request is pending.

### 9. React-Specific Techniques

#### Hooks & Component Lifecycle

- `useState` stores form values, fetched records, loading states,
  errors, and search/filter selections.
- `useEffect` loads data and manages authentication subscriptions.
- `useContext`, through `useAuth`, provides shared authentication state.
- `useParams` reads post and coach identifiers.
- `useNavigate` redirects after actions such as editing or deleting.
- `useLocation` supports route-aware behavior and login redirects.
- The custom `usePost` hook manages individual post loading and retries.

Lifecycle example:

1. When the coach details component mounts, its effect fetches a coach.
2. If `coachId` changes, the effect fetches the newly selected coach.
3. Before the effect reruns or the component unmounts, cleanup aborts
   the previous request.

`AuthProvider` also demonstrates cleanup by unsubscribing from
authentication events when it unmounts.

#### Context API

`AuthContext` shares:

- Current user.
- Current session.
- Authentication loading state.
- Authentication error.

Navigation, route guards, profile editing, posts, and comments access
this state through `useAuth`.

#### Component Styling

The application uses external CSS files for shared and
component-specific styling, including:

- `styles.css`
- `theme.css`
- `Community.css`
- `CoachCatalog.css`
- `CoachDetails.css`
- `Profile.css`
- `Comments.css`

Media queries adapt layouts to mobile screens.

The interface uses a dark palette, lime accents, readable typography,
and visible interactive controls.

### 10. Typical User Flow

1. A visitor opens Community and browses posts and comments.
2. They open Coaches, search or filter by specialty, and view a coach's
   details.
3. They register as a Client or Coach and complete their profile.
4. They create a post and find it in Community or My posts.
5. They open the post's details by clicking its title or image.
6. They edit their own post or delete it after confirmation.
7. They comment on another member's post from the feed or details page.
8. They log out. Public browsing remains available, while protected
   actions require login.

### 11. Error & Edge Case Handling

#### Authentication Errors

Login and registration failures are displayed in the form.

Authentication loading states prevent premature route redirects.
Missing Supabase configuration produces an explanatory error.

#### Network or Data Errors

Data-loading components show loading indicators while requests
are pending.

Failed requests display an error message. Post lists and details views
provide retry controls where implemented.

Request cleanup prevents outdated responses from updating components
after navigation.

#### Empty or Missing Data States

- Community displays a message when no posts exist.
- My posts displays a message when the member has no posts.
- Coach search displays a message when no coaches match.
- Posts without comments invite the user to start the conversation.
- Missing or invalid post and coach IDs display an unavailable/not-found
  state.
- Unknown routes display the Page not found component.
- Profiles without a photo URL display initials.
- Missing optional coach information displays explanatory fallback text.

#### Ownership and Submission Errors

Members cannot edit or delete another author's posts.
Comments can be deleted only by their author; comment editing is
not implemented.

Update/delete operations report an error when the targeted post is
unavailable or cannot be modified.

Forms display submission errors and disable submission while saving.

## Verification

The following checks were performed manually during development:

- Registration, login, logout, and session restoration.
- Protected-route redirects.
- Author-only post editing and deletion.
- Author-only comment deletion.
- Blocking comment creation for logged-out visitors.
- Profile editing.
- Post creation, reading, editing, and deletion.
- Comment creation and deletion.
- Coach search, filtering, and details.
- Mobile layouts.
- Validation and empty/error states.

Code checks:

```bash
npm run lint
npm run build
```

Both checks passed during the pre-deployment review.

The production build reports a JavaScript bundle-size warning.
This does not prevent the build from completing.

Live-site verification remains part of deployment.

## Deployment

Supabase hosts the authentication and database services.
The React frontend must be deployed to a static hosting provider.

### Frontend Configuration

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `VITE_API_KEY` |

Configure the host to serve `index.html` for client-side application
routes. This allows direct visits and refreshes on routes such as
`/posts/:postId` and `/coaches/:coachId`.

Configure Supabase authentication URL settings for the deployed frontend.

### Deployment Checklist

- Deploy the latest committed source.
- Configure the frontend environment variable.
- Configure SPA route fallback.
- Update Supabase authentication URLs.
- Verify public pages load while logged out.
- Verify registration, login, logout, and session restoration.
- Verify profile editing, posts CRUD, and comments.
- Verify refreshing detail pages works.
- Add the live frontend URL to this README.

## Project Scope and Limitations

MyCoach is an educational project.

- Some profiles and content are fictional demonstration data.
- Profile and post images use URLs; direct file uploads are not implemented.
- Coach rates are informational. Payments and bookings are not implemented.
- Training plans, session scheduling, and a coach workspace are outside
  the current scope.
- Comments update after the current user's actions; realtime updates
  across different browsers are not implemented.

## Author

**Hristo Piperkov**

GitHub: https://github.com/hristopiperkov