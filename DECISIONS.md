# Architecture Decision Records (ADR-lite)

## ADR-001: Backend Framework Selection

**Problem**: Choose a Python web framework for the REST API

**Options**:
- FastAPI: Modern, async, automatic OpenAPI generation
- Flask: Lightweight, flexible, mature ecosystem
- Django REST: Full-featured, batteries included

**Decision**: FastAPI

**Reasons**:
- Automatic OpenAPI/Swagger documentation generation
- Built-in request/response validation with Pydantic
- Excellent performance with async support
- Type hints integration
- Modern Python features support

**Consequences**:
- ✅ Faster development with auto-generated docs
- ✅ Better type safety and IDE support
- ✅ High performance for concurrent requests
- ❌ Smaller ecosystem compared to Flask/Django
- ❌ Learning curve for async programming

---

## ADR-002: Database Choice

**Problem**: Select database for development and initial deployment

**Options**:
- SQLite: File-based, zero configuration
- PostgreSQL: Full-featured, production-ready
- MySQL: Popular, well-supported

**Decision**: SQLite

**Reasons**:
- Zero configuration required
- Perfect for development and demos
- File-based storage simplifies deployment
- Sufficient performance for expected load
- Easy to migrate to PostgreSQL later

**Consequences**:
- ✅ Immediate development start
- ✅ Simple deployment and backup
- ✅ No external dependencies
- ❌ Limited concurrent write performance
- ❌ Not suitable for high-load production
- ❌ Limited advanced SQL features

---

## ADR-003: Frontend Framework Selection

**Problem**: Choose frontend technology for the user interface

**Options**:
- React + Vite: Component-based, fast development server
- Next.js: Full-stack React framework with SSR
- Astro: Static site generator with component islands

**Decision**: React + Vite

**Reasons**:
- Component-based architecture fits UI requirements
- Vite provides fast development experience
- Large ecosystem and community support
- Team familiarity with React patterns
- Good balance of features vs complexity

**Consequences**:
- ✅ Fast development and hot reload
- ✅ Rich ecosystem of components and tools
- ✅ Good performance for SPA requirements
- ❌ Client-side rendering only (no SEO benefits)
- ❌ Larger bundle size compared to vanilla JS
- ❌ Runtime dependency on JavaScript

---

## ADR-004: State Management Strategy

**Problem**: Manage application state in React frontend

**Options**:
- React useState/useEffect: Built-in hooks
- Redux Toolkit: Predictable state container
- Zustand: Lightweight state management
- React Query: Server state management

**Decision**: React useState/useEffect

**Reasons**:
- Application state is relatively simple
- No complex state sharing between distant components
- Reduces bundle size and complexity
- Sufficient for current requirements
- Easy to migrate to more complex solution later

**Consequences**:
- ✅ Simple and straightforward implementation
- ✅ No additional dependencies
- ✅ Easy to understand and debug
- ❌ Manual state synchronization required
- ❌ No built-in caching or optimistic updates
- ❌ Prop drilling for deep component trees

---

## ADR-005: Styling Approach

**Problem**: Choose styling solution for React components

**Options**:
- Tailwind CSS: Utility-first CSS framework
- Styled Components: CSS-in-JS solution
- CSS Modules: Scoped CSS files
- Inline Styles: JavaScript style objects

**Decision**: Inline Styles (with Tailwind as backup)

**Reasons**:
- Rapid prototyping and development
- Component-scoped styles prevent conflicts
- No build step configuration required
- Easy to make dynamic based on props/state
- Sufficient for demo/MVP requirements

**Consequences**:
- ✅ Fast development without build configuration
- ✅ No CSS specificity conflicts
- ✅ Dynamic styling based on component state
- ❌ No CSS features (variables, mixins, media queries)
- ❌ Larger JavaScript bundle size
- ❌ Limited reusability of style definitions

---

## ADR-006: API Design Pattern

**Problem**: Structure REST API endpoints and responses

**Options**:
- RESTful with HTTP verbs: Standard REST conventions
- GraphQL: Query language for APIs
- RPC-style: Function-based API calls

**Decision**: RESTful with HTTP verbs

**Reasons**:
- Industry standard and well-understood
- Good fit for CRUD operations on notes
- HTTP caching and middleware support
- Simple client-side implementation
- FastAPI excellent support for REST patterns

**Consequences**:
- ✅ Standard conventions easy to understand
- ✅ Good HTTP caching and middleware support
- ✅ Simple client implementation with axios
- ❌ Over-fetching data in some cases
- ❌ Multiple requests needed for related data
- ❌ Less flexible than GraphQL for complex queries

---

## ADR-007: Error Handling Strategy

**Problem**: Consistent error handling across frontend and backend

**Options**:
- HTTP status codes only: Simple, standard approach
- Structured error responses: Detailed error information
- Error codes with messages: Machine and human readable

**Decision**: Structured error responses with codes

**Reasons**:
- Provides both human-readable messages and machine-readable codes
- Consistent format across all endpoints
- Includes timestamps for debugging
- Supports internationalization in future
- Better debugging and monitoring capabilities

**Consequences**:
- ✅ Consistent error handling across application
- ✅ Better debugging and user experience
- ✅ Machine-readable for automated handling
- ❌ Slightly more complex implementation
- ❌ Larger response payloads for errors
- ❌ Need to maintain error code documentation

---

## ADR-008: CORS Configuration

**Problem**: Configure Cross-Origin Resource Sharing for security

**Options**:
- Wildcard origins: Allow all origins (*)
- Specific origins: Whitelist known domains
- Dynamic origins: Runtime origin validation

**Decision**: Specific origins whitelist

**Reasons**:
- Better security than wildcard approach
- Prevents unauthorized domain access
- Clear documentation of allowed clients
- Supports both development and production environments
- Follows security best practices

**Consequences**:
- ✅ Enhanced security posture
- ✅ Clear documentation of trusted origins
- ✅ Prevents CSRF attacks from unknown domains
- ❌ Requires configuration updates for new domains
- ❌ More complex setup than wildcard
- ❌ Potential issues if misconfigured