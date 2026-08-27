/**
 * Java & Spring Boot — modules 7–8, days 30–38.
 *
 * Stateless security, then testing, Docker and the capstone. Titles,
 * summaries, objectives and links are the original spec's.
 *
 * Day 37 carries no external link, deliberately: the capstone build is a day
 * where the work is building rather than reading. It renders five sections
 * without a Read & do, which is honest.
 */
export default [
  {
    title: "Stateless security with Spring Security 6 & JWT",
    weekRange: "Week 7",
    objective:
      "Secure the API the Boot 3 way: SecurityFilterChain bean, stateless sessions, JWT issue-and-verify — none of the removed Boot 2 patterns.",
    deliverable:
      "Registration and login issuing JWTs (BCrypt-hashed passwords), a JwtAuthenticationFilter, and role-gated admin routes.",
    estHours: 5,
    nodes: [
      {
        title: "Security architecture: the filter chain",
        summary: "Where security actually happens — before your controller ever runs.",
        learningObjectives: [
          "DelegatingFilterProxy and the security filter chain",
          "Authentication vs authorization",
          "What 'stateless' costs and buys",
        ],
        whyToday:
          "Spring Security is the framework people cargo-cult hardest, because the configuration looks arbitrary until you know it is describing a chain of servlet filters. One day of architecture makes the next three comprehensible.",
        principle:
          "Security runs as servlet filters, before any controller. If a request is rejected, your code never executed — which is why breakpoints in the controller tell you nothing.",
        commonMistake:
          "Debugging a 403 by adding logging to the controller. The request never reached it. The decision happened in a filter, and that is where the logging belongs.",
        challenge:
          "Add the Spring Security starter to a working app and watch every endpoint start returning 401. Then turn on security debug logging and read which filter rejected the request.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The chain",
            detail:
              "A DelegatingFilterProxy hands requests to an ordered list of security filters. Each may reject, transform or pass the request along.",
          },
          {
            title: "Authentication vs authorization",
            detail:
              "Authentication is who you are (401 when it fails). Authorization is what you may do (403). Two questions, two filters, two status codes.",
          },
          {
            title: "SecurityContextHolder",
            detail:
              "A thread-local holding the authenticated principal for the current request. Filters populate it; your code reads it.",
          },
          {
            title: "Stateless",
            detail:
              "No server-side session. Every request re-authenticates from its token, which costs a verification per request and buys horizontal scaling with no shared session store.",
          },
        ],
        checks: [
          {
            question: "Where in the request lifecycle does security run?",
            answer:
              "In servlet filters, before any controller method. A rejected request never reaches your code.",
          },
          {
            question: "Which status code goes with which question?",
            answer:
              "401 for authentication — who are you. 403 for authorization — you are known but not permitted.",
          },
          {
            question: "What does stateless cost and buy?",
            answer:
              "Costs a token verification on every request; buys horizontal scaling with no shared session store and no sticky sessions.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "Java Brains — Spring Security concepts",
            url: "https://www.youtube.com/@Java.Brains",
            sourceName: "Java Brains (YouTube)",
            editorNote:
              "His architecture explanations are the best free ones — but write your CONFIG from the current docs, not his older videos: WebSecurityConfigurerAdapter is gone.",
          },
          {
            type: "doc",
            title: "Spring Security reference",
            url: "https://docs.spring.io/spring-security/reference/index.html",
            sourceName: "Spring documentation",
            editorNote: "The architecture chapter today; the configuration chapter tomorrow.",
          },
        ],
      },

      {
        title: "SecurityFilterChain configuration",
        summary:
          "Guardrail node: SecurityFilterChain @Bean with requestMatchers() — the Boot 2 adapter and antMatchers() are removed, not deprecated.",
        learningObjectives: [
          "csrf disabled for stateless REST; SessionCreationPolicy.STATELESS",
          "requestMatchers() route rules: permitAll, hasRole, authenticated",
          "PasswordEncoder bean with BCrypt",
        ],
        whyToday:
          "Almost every free Spring Security tutorial predates version 6 and shows `WebSecurityConfigurerAdapter`. That class no longer exists, so following one produces a compile error with no clue what replaced it.",
        principle:
          "Configuration is a `SecurityFilterChain` @Bean. There is no adapter to extend any more — you build and return the chain.",
        commonMistake:
          "Disabling CSRF without understanding why it is safe here. It is safe because the API is stateless and authenticates by header, not cookie — a cookie-authenticated API with CSRF off is genuinely vulnerable.",
        challenge:
          "Write a SecurityFilterChain bean: CSRF off, sessions stateless, `/auth/**` permitted, everything else authenticated. Add a BCryptPasswordEncoder bean. Then hash the same password twice and confirm the two hashes differ.",
        challengeMinutes: 55,
        estMinutes: 90,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The bean, not the adapter",
            detail:
              "A method returning SecurityFilterChain, taking HttpSecurity. WebSecurityConfigurerAdapter was removed in Security 6 — it is not deprecated, it is gone.",
          },
          {
            title: "requestMatchers()",
            detail:
              "Replaces antMatchers() and mvcMatchers(). Order matters: the first matching rule wins, so put specific paths before broad ones.",
          },
          {
            title: "Why CSRF off is safe here",
            detail:
              "CSRF exploits credentials the browser sends automatically — cookies. A token in an Authorization header is not sent automatically, so there is nothing to forge.",
          },
          {
            title: "STATELESS",
            detail:
              "Tells Spring never to create or use an HttpSession. Without it the framework may still create one and the API is not really stateless.",
          },
          {
            title: "BCrypt",
            detail:
              "Deliberately slow and salted per-hash, so the same password hashes differently every time. Never store a password any other way.",
          },
        ],
        checks: [
          {
            question: "What replaced WebSecurityConfigurerAdapter?",
            answer:
              "A SecurityFilterChain @Bean built from HttpSecurity. The adapter class was removed in Security 6, not deprecated.",
          },
          {
            question: "Why is disabling CSRF acceptable for this API?",
            answer:
              "CSRF relies on credentials browsers send automatically. A bearer token in a header is not automatic, so there is nothing to forge.",
          },
          {
            question: "Why do two BCrypt hashes of one password differ?",
            answer:
              "Each hash embeds a fresh random salt. Verification re-derives using the stored salt rather than comparing strings.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Spring Security reference",
            url: "https://docs.spring.io/spring-security/reference/index.html",
            sourceName: "Spring documentation",
            editorNote:
              "The Java-configuration chapter — current, unlike most tutorials.",
          },
        ],
      },

      {
        title: "JWT: structure and verification",
        summary: "Header, payload, signature — and what a server actually checks.",
        learningObjectives: [
          "The three parts and base64url encoding",
          "Claims worth putting in; secrets management",
          "Expiry, clock skew, and rotation basics",
        ],
        whyToday:
          "Tomorrow you write the filter that verifies these. Knowing what a token is — and specifically that it is readable by anyone — decides what you are willing to put in one.",
        principle:
          "A JWT is signed, not encrypted. Anybody holding it can read every claim; the signature only proves nobody changed them.",
        commonMistake:
          "Putting anything sensitive in the payload. It is base64, not encryption — paste any token into a decoder and read it. Roles are fine; anything private is not.",
        challenge:
          "Decode a JWT by hand: split on the dots and base64-decode the first two parts. Read your own claims. Then change one character of the payload and confirm verification fails.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Three parts",
            detail:
              "header.payload.signature, each base64url-encoded and joined by dots. The first two are plainly readable by anyone.",
          },
          {
            title: "What the signature proves",
            detail:
              "That the header and payload have not changed since signing, by somebody holding the secret. It proves nothing about confidentiality.",
          },
          {
            title: "Claims worth carrying",
            detail:
              "Subject, issued-at, expiry, and roles. Enough to authorise without a database lookup, and nothing you would mind a user reading.",
          },
          {
            title: "Expiry",
            detail:
              "Short-lived tokens limit the damage from a leaked one. A token cannot be revoked before expiry without server-side state, which is the real cost of stateless.",
          },
          {
            title: "The secret",
            detail:
              "From the environment, never from application.yml, and long enough for the algorithm. It is the only thing standing between a user and an admin token.",
          },
        ],
        checks: [
          {
            question: "Is a JWT encrypted?",
            answer:
              "No — signed. The payload is base64url and readable by anyone holding the token; the signature only proves it was not altered.",
          },
          {
            question: "What can go in the payload?",
            answer:
              "Subject, expiry, roles — anything you would not mind the user reading. Never anything sensitive.",
          },
          {
            question: "Why do short expiries matter in a stateless design?",
            answer:
              "A token cannot be revoked before it expires without server-side state, so the expiry window is the exposure window.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Introduction to JSON Web Tokens",
            url: "https://jwt.io/introduction",
            sourceName: "jwt.io",
            editorNote:
              "Short and authoritative on the format. The site's decoder is the fastest way to prove to yourself that the payload is readable.",
          },
        ],
      },

      {
        title: "The JwtAuthenticationFilter",
        summary:
          "OncePerRequestFilter: extract, validate, populate the SecurityContextHolder.",
        learningObjectives: [
          "Reading the Authorization header; validating the signature",
          "Building the Authentication and setting SecurityContextHolder",
          "Wiring the filter before UsernamePasswordAuthenticationFilter",
        ],
        whyToday:
          "This is the piece that connects the last three days: the filter chain from day 30, the configuration from day 31, and the token from day 32. It is also the module's hardest single class.",
        principle:
          "The filter's job is narrow: if a valid token is present, populate the SecurityContextHolder. It never rejects — the authorization rules do that downstream.",
        commonMistake:
          "Throwing from the filter when no token is present. Public endpoints then break, because a request to `/auth/login` legitimately has no token. Pass it along unauthenticated and let the rules decide.",
        challenge:
          "Write the filter, register it before UsernamePasswordAuthenticationFilter, and prove three cases: valid token authenticates, absent token reaches a public endpoint fine, tampered token is rejected with 401.",
        challengeMinutes: 60,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "OncePerRequestFilter",
            detail:
              "Guarantees one execution per request even with forwards and includes. The base class to extend, not the raw Filter interface.",
          },
          {
            title: "The happy path",
            detail:
              "Read the Authorization header, strip `Bearer `, verify the signature and expiry, build an Authentication with the roles, set it on the context.",
          },
          {
            title: "No token is not an error",
            detail:
              "Call the next filter and return. Public routes must work, and the authorization rules will produce the 401 if one is needed.",
          },
          {
            title: "Filter ordering",
            detail:
              "Before UsernamePasswordAuthenticationFilter, so the context is already populated when the authorization filters run.",
          },
          {
            title: "Clear on the way out",
            detail:
              "The SecurityContextHolder is thread-local and threads are pooled. Spring clears it per request; know that it must happen.",
          },
        ],
        checks: [
          {
            question: "Why extend OncePerRequestFilter?",
            answer:
              "It guarantees a single execution per request even across forwards and includes, which a raw Filter does not.",
          },
          {
            question: "What should the filter do when there is no token?",
            answer:
              "Pass the request down the chain unauthenticated. Public endpoints must still work; the authorization rules produce the 401 if needed.",
          },
          {
            question: "Why register it before UsernamePasswordAuthenticationFilter?",
            answer:
              "So the SecurityContextHolder is already populated by the time the authorization filters make their decision.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Spring Security reference",
            url: "https://docs.spring.io/spring-security/reference/index.html",
            sourceName: "Spring documentation",
            editorNote:
              "Cross-check any JWT tutorial against the servlet-authentication chapter here; most free ones predate Security 6.",
          },
        ],
      },
    ],
  },

  {
    title: "Testing, Docker & the capstone",
    weekRange: "Week 8",
    objective:
      "Prove the service works (JUnit 5, Mockito, MockMvc), containerize it, and deploy the capstone that carries your placement interviews.",
    deliverable:
      "The Order Execution & Inventory Reservation Service, deployed: JWT auth with BCrypt, validated CRUD for products and orders, transactional stock that cannot go negative under concurrent hits, 80%+ coverage, and a repo with architecture diagram, Postman collection and docker-compose.",
    estHours: 7.75,
    nodes: [
      {
        title: "Unit testing with JUnit 5",
        summary:
          "@Test, @BeforeEach, @ParameterizedTest, assertThrows — tests as the spec you keep.",
        learningObjectives: [
          "The JUnit 5 lifecycle and assertions",
          "Parameterized tests for the boring-but-vital cases",
          "assertThrows for the failure paths",
        ],
        whyToday:
          "The capstone asks for 80% coverage, and coverage written at the end is coverage of what the code does rather than what it should do. Starting here means the last three days are about behaviour.",
        principle:
          "Test the behaviour, not the implementation. A test that breaks when you rename a private method was testing the wrong thing.",
        commonMistake:
          "Only testing the happy path. The failure paths are where the bugs are, and `assertThrows` is one line — a test suite with no expected exceptions is a suite that has not looked.",
        challenge:
          "Write tests for one service method covering the success case, a boundary, and a failure with assertThrows. Then convert the three near-identical boundary cases into one @ParameterizedTest.",
        challengeMinutes: 45,
        estMinutes: 75,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The lifecycle",
            detail:
              "@BeforeEach runs before every test, @BeforeAll once for the class and must be static. Fresh state per test is the default and the right one.",
          },
          {
            title: "assertThrows",
            detail:
              "Returns the thrown exception so you can assert on its message or fields. Asserting only the type is usually not enough.",
          },
          {
            title: "@ParameterizedTest",
            detail:
              "One test body, many inputs, via @ValueSource or @CsvSource. Turns five copy-pasted tests into one that is easier to extend.",
          },
          {
            title: "Naming",
            detail:
              "The name should state the behaviour: `returnsNotFoundWhenProductMissing`. It is the sentence that appears when the build fails.",
          },
        ],
        checks: [
          {
            question: "Why does assertThrows return the exception?",
            answer:
              "So you can assert on its message and fields. Asserting only the type often passes for the wrong reason.",
          },
          {
            question: "What is the sign a test is coupled to implementation?",
            answer:
              "It breaks on a refactor that does not change behaviour — a renamed private method, a reordered internal call.",
          },
          {
            question: "What does @BeforeAll require?",
            answer:
              "It must be static, because it runs once for the class rather than per instance.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "JUnit 5 user guide",
            url: "https://junit.org/junit5/docs/current/user-guide/",
            sourceName: "JUnit",
            editorNote: "Reference-grade. Read the writing-tests chapter and keep the rest for lookup.",
          },
          {
            type: "read",
            title: "Baeldung — JUnit 5 guide",
            url: "https://www.baeldung.com/junit-5",
            sourceName: "Baeldung",
            editorNote: "The faster route in. Read this first, the user guide second.",
          },
        ],
      },

      {
        title: "Mockito and MockMvc",
        summary:
          "Isolate the service layer with mocks; hit controllers without a server.",
        learningObjectives: [
          "@Mock, @InjectMocks, when(...).thenReturn(...), verify(...)",
          "MockMvc: status().isOk(), jsonPath(...)",
          "What to mock and what to leave real",
        ],
        whyToday:
          "Day 17's constructor injection pays off here: a service with constructor dependencies can be tested with hand-made stubs or mocks and no container at all. That is what makes 80% coverage achievable in a week.",
        principle:
          "Mock what you own the boundary to, not what you own. Mocking your own value objects makes the test assert that the code calls itself in a particular order.",
        commonMistake:
          "Mocking everything, including the class under test's own collaborating logic. The test then passes regardless of whether the code is correct — it only proves the mocks were called.",
        challenge:
          "Test a service with a mocked repository, then test the controller above it with MockMvc and a mocked service. Assert on status and on one jsonPath. Then break the service deliberately and confirm the right test fails.",
        challengeMinutes: 55,
        estMinutes: 90,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "@Mock and @InjectMocks",
            detail:
              "@Mock creates a stub, @InjectMocks builds the class under test with them. With constructor injection this is unambiguous, which is another reason for day 17's rule.",
          },
          {
            title: "Stub then verify",
            detail:
              "`when(...).thenReturn(...)` sets behaviour; `verify(...)` asserts an interaction happened. Verify sparingly — over-verifying couples the test to implementation.",
          },
          {
            title: "MockMvc",
            detail:
              "Exercises the full web layer — routing, validation, serialisation, exception handling — with no server and no port.",
          },
          {
            title: "jsonPath",
            detail:
              "Asserts on the response body by path. Assert the fields that matter, not the whole document, or every additive change breaks the test.",
          },
          {
            title: "What to leave real",
            detail:
              "Value objects, records, mappers, anything pure. Mock the things that cross a boundary: repositories, clients, clocks.",
          },
        ],
        checks: [
          {
            question: "What should you mock?",
            answer:
              "Things that cross a boundary — repositories, HTTP clients, clocks. Leave pure logic and value objects real.",
          },
          {
            question: "What does MockMvc test that a plain unit test does not?",
            answer:
              "The web layer: routing, validation, serialisation and exception handling — without starting a server.",
          },
          {
            question: "Why use verify() sparingly?",
            answer:
              "It asserts on interactions rather than outcomes, which couples the test to implementation detail.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Baeldung — Mockito series",
            url: "https://www.baeldung.com/mockito-series",
            sourceName: "Baeldung",
            editorNote: "An index. The annotations and the argument-matchers articles are today's.",
          },
          {
            type: "tool",
            title: "Mockito",
            url: "https://site.mockito.org/",
            sourceName: "Mockito",
            editorNote: "The official site; the javadoc on the Mockito class is a surprisingly good tutorial.",
          },
        ],
      },

      {
        title: "Docker: multi-stage builds and compose",
        summary:
          "A production-shaped Dockerfile for a Boot jar, plus PostgreSQL beside it in compose.",
        learningObjectives: [
          "Multi-stage Dockerfile: build stage, slim runtime stage",
          "docker-compose.yml wiring app + PostgreSQL",
          "Environment variables as the config seam",
        ],
        whyToday:
          "The capstone deliverable includes a compose file that works on a stranger's machine. That is the single thing that makes a portfolio repo evaluable in five minutes rather than abandoned.",
        principle:
          "Build in one stage, run in another. The runtime image needs a JRE and a jar — not Maven, not the source, not the .m2 cache.",
        commonMistake:
          "Baking configuration into the image. The same image should run in dev and prod with different environment variables; an image with a hard-coded database URL is one image per environment.",
        challenge:
          "Write a multi-stage Dockerfile and compare the final image size against a single-stage one. Then wire it to PostgreSQL in compose and confirm `docker compose up` gives a working app on a clean machine.",
        challengeMinutes: 55,
        estMinutes: 90,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Multi-stage",
            detail:
              "The first stage has Maven and the source and produces the jar. The second copies only the jar onto a JRE base. Hundreds of megabytes smaller.",
          },
          {
            title: "Layer caching",
            detail:
              "Copy the pom and resolve dependencies before copying source. Then a code change does not re-download the world.",
          },
          {
            title: "compose",
            detail:
              "Declares app and database as services on one network. The app reaches the database by service name, not by localhost.",
          },
          {
            title: "Environment as the seam",
            detail:
              "Day 21's profiles and environment overrides are what make one image run anywhere. Nothing environment-specific belongs in the image.",
          },
          {
            title: "depends_on is not readiness",
            detail:
              "It controls start order, not whether PostgreSQL is accepting connections. A healthcheck or a retry on startup is what actually works.",
          },
        ],
        checks: [
          {
            question: "What does a multi-stage build achieve?",
            answer:
              "The runtime image contains only a JRE and the jar — no Maven, no source, no dependency cache — cutting hundreds of megabytes.",
          },
          {
            question: "Why copy the pom before the source?",
            answer:
              "Dependency resolution is then cached as its own layer, so a source change does not re-download every dependency.",
          },
          {
            question: "Does depends_on guarantee the database is ready?",
            answer:
              "No — only that it started. Readiness needs a healthcheck or a connection retry in the application.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Docker — multi-stage builds",
            url: "https://docs.docker.com/build/building/multi-stage/",
            sourceName: "Docker documentation",
            editorNote: "Short and exactly the pattern you need.",
          },
          {
            type: "doc",
            title: "Docker Compose",
            url: "https://docs.docker.com/compose/",
            sourceName: "Docker documentation",
            editorNote: "The getting-started and the services reference. Skip the swarm material.",
          },
        ],
      },

      {
        title: "Capstone build: Order Execution & Inventory Reservation",
        summary:
          "The whole stack in one service: JWT auth, validated CRUD, and transactional stock that cannot go negative when hit concurrently.",
        learningObjectives: [
          "Registration/login with BCrypt and JWT issuance",
          "Products and Orders CRUD under jakarta validation",
          "@Transactional inventory deduction proven safe under concurrent requests",
          "80%+ coverage with JUnit 5 + Mockito",
        ],
        whyToday:
          "Every previous day contributes one piece. The part that makes this a real project rather than a tutorial is the concurrency requirement — stock that cannot go negative is a problem no single-threaded test will find.",
        principle:
          "A read-then-write on shared state is a race unless the database serialises it. `select stock` then `update stock` from two requests at once oversells, and both requests succeed.",
        commonMistake:
          "Checking stock in Java and then deducting it. Between the check and the write another transaction does the same, both see enough stock, and you sell inventory you do not have. @Transactional alone does not prevent it — the default isolation permits it.",
        challenge:
          "Build it. Then fire concurrent order requests at a product with stock of one and confirm exactly one succeeds. If both succeed, you have found the reason this requirement is in the capstone — fix it with a conditional update or a pessimistic lock.",
        challengeMinutes: 120,
        estMinutes: 120,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "Scope it honestly",
            detail:
              "Two entities, auth, and the reservation logic. A capstone that tries to be a marketplace never gets deployed, and a deployed small service beats an unfinished large one.",
          },
          {
            title: "The race",
            detail:
              "Read stock, decide, write stock. Two transactions interleaving between the read and the write both see the old value.",
          },
          {
            title: "Two fixes",
            detail:
              "A conditional update — `update ... set stock = stock - ? where id = ? and stock >= ?` and check the affected row count — or a pessimistic lock on the row.",
          },
          {
            title: "Prove it",
            detail:
              "A test firing parallel requests at stock of one. Asserting one success and one rejection is the only evidence that matters.",
          },
          {
            title: "Coverage as a floor",
            detail:
              "80% is a threshold, not a goal. Cover the reservation logic and the error paths first; getters do not need tests.",
          },
        ],
        checks: [
          {
            question: "Why is check-then-deduct a bug?",
            answer:
              "Two transactions can both read the old stock before either writes, so both pass the check and the product oversells.",
          },
          {
            question: "Does @Transactional prevent it?",
            answer:
              "No. The default isolation level permits this interleaving. You need a conditional update or an explicit lock.",
          },
          {
            question: "How do you demonstrate the fix?",
            answer:
              "Fire concurrent requests against stock of one and assert exactly one succeeds. Sequential tests cannot show it.",
          },
        ],
        resources: [],
      },

      {
        title: "Deploy and document",
        summary:
          "A running URL and a repo a stranger can evaluate in five minutes — that is what a fresher portfolio is.",
        learningObjectives: [
          "Deploy the jar to a free tier (Render, Railway or similar); managed PostgreSQL (Supabase/Neon)",
          "README: architecture diagram, setup steps, Postman collection",
          "docker-compose.yml that works on a stranger's machine",
        ],
        whyToday:
          "An undeployed project is a claim; a URL is evidence. Reviewers spend a few minutes on a repository, and what they can run in that time is what counts.",
        principle:
          "Optimise the first five minutes. A reviewer who cannot run it or understand it quickly moves on, however good the code is.",
        commonMistake:
          "A README that is the framework's generated placeholder. It tells a reviewer nothing was finished, and it is the first thing they see.",
        challenge:
          "Deploy to a free tier with a managed database and confirm the URL responds. Then hand the repo to somebody who has never seen it and time how long until they have it running locally. Fix whatever slowed them down.",
        challengeMinutes: 60,
        estMinutes: 90,
        points: 40,
        difficulty: "core",
        topics: [
          {
            title: "Free tiers",
            detail:
              "Render, Railway and similar run a container from your repo. Managed PostgreSQL from Supabase or Neon. Expect a cold start on the free plan and say so in the README.",
          },
          {
            title: "Secrets in the platform",
            detail:
              "Database URL and JWT secret as environment variables in the platform's dashboard, never in the repository. Day 21 built this seam.",
          },
          {
            title: "The README",
            detail:
              "What it does, the architecture in one diagram, how to run it in one command, and the endpoint list. Four sections, above the fold.",
          },
          {
            title: "The Postman collection",
            detail:
              "Committed to the repo, with a login request that stores the token. A reviewer can then exercise every endpoint without reading code.",
          },
          {
            title: "Test on a clean machine",
            detail:
              "Clone into a fresh directory and follow your own instructions literally. The missing step is always obvious from there and invisible from your own setup.",
          },
        ],
        checks: [
          {
            question: "What should the README's first screen contain?",
            answer:
              "What the service does, an architecture diagram, a one-command run, and the endpoint list.",
          },
          {
            question: "Where do the database URL and JWT secret live in a deployment?",
            answer:
              "Environment variables configured in the hosting platform, never committed to the repository.",
          },
          {
            question: "How do you find the missing setup step?",
            answer:
              "Clone into a fresh directory and follow your own instructions literally. It is invisible from a machine that already works.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "About READMEs",
            url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
            sourceName: "GitHub Docs",
            editorNote: "Conventions and rendering rules. The structure above matters more than the syntax.",
          },
        ],
      },
    ],
  },
];
