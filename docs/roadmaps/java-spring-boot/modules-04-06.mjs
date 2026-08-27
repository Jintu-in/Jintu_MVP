/**
 * Java & Spring Boot — modules 4–6, days 16–29.
 *
 * The container, then Boot and REST, then persistence. Titles, summaries,
 * objectives and links are the original spec's; the day-page model is new.
 *
 * The Boot 3 guardrails from the spec header ride as principles and mistakes
 * on the days where each trap actually bites: jakarta over javax (23, 25),
 * constructor injection over field @Autowired (17), records as DTOs (22).
 */
export default [
  {
    title: "Spring core & dependency injection",
    weekRange: "Week 4",
    objective:
      "Understand what the container actually does — IoC, DI, bean lifecycle — before Boot makes it look like magic.",
    deliverable:
      "A plain Spring (no Boot) console app wiring three collaborating beans by constructor injection, with scopes demonstrated.",
    estHours: 4.25,
    nodes: [
      {
        title: "Inversion of control and the container",
        summary: "The one idea the whole framework is built on: you stop calling new.",
        learningObjectives: [
          "IoC philosophy: instantiation and lifecycle delegated to the framework",
          "ApplicationContext vs BeanFactory",
          "What a 'bean' actually is",
        ],
        whyToday:
          "Boot's auto-configuration looks like magic to anybody who skipped this. It is not magic; it is a container reading your classpath and registering beans, and today is where that becomes visible.",
        principle:
          "You stop calling new. The container constructs your objects, wires their collaborators, and manages their lifetime — and that inversion is the whole framework.",
        commonMistake:
          "Starting with Boot and never learning what the container is. Everything then works until it does not, and the error message assumes you know what a bean definition is.",
        challenge:
          "Build a plain Spring app with no Boot: an ApplicationContext, two beans, one depending on the other. Print something from each. Feeling the amount Boot does for you is the point of doing it the hard way once.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What a bean is",
            detail:
              "An object the container created and manages. Not a special type — an ordinary class the container knows about.",
          },
          {
            title: "The container",
            detail:
              "BeanFactory is the minimal interface; ApplicationContext extends it with events, internationalisation and resource loading. You always use ApplicationContext.",
          },
          {
            title: "Why invert control",
            detail:
              "The object no longer chooses its collaborators, so tests can supply different ones and configuration can change wiring without touching code.",
          },
          {
            title: "Bean definitions",
            detail:
              "The container holds definitions — how to build a bean — and instantiates from them. The distinction explains scopes tomorrow.",
          },
        ],
        checks: [
          {
            question: "What is a Spring bean?",
            answer:
              "An ordinary object whose construction, wiring and lifecycle the container manages. Nothing about the class itself is special.",
          },
          {
            question: "What does inverting control actually buy you?",
            answer:
              "The object stops choosing its own collaborators, so tests can substitute them and configuration can change wiring without code changes.",
          },
          {
            question: "ApplicationContext or BeanFactory?",
            answer:
              "ApplicationContext — it is BeanFactory plus events, resource loading and internationalisation. BeanFactory is the minimal interface underneath.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "Java Brains — Spring framework core",
            url: "https://www.youtube.com/@Java.Brains",
            sourceName: "Java Brains (YouTube)",
            editorNote:
              "The best free conceptual explanation of IoC/DI anywhere. Search the channel; the concepts have not moved even where the syntax has.",
          },
          {
            type: "doc",
            title: "Spring Framework — the IoC container",
            url: "https://docs.spring.io/spring-framework/reference/core/beans.html",
            sourceName: "Spring documentation",
            editorNote: "The introduction and 'container overview' sections today.",
          },
        ],
      },

      {
        title: "Dependency injection, three ways — and why constructor wins",
        summary:
          "Guardrail node: field @Autowired is the pattern every stale tutorial teaches and no reviewer accepts.",
        learningObjectives: [
          "Component scanning: @Component, @Service, @Repository, @Controller",
          "Constructor injection (final fields, no @Autowired needed) vs setter vs field",
          "Why constructor injection is testable and field injection is not",
        ],
        whyToday:
          "This is the single most visible marker of whether somebody learned Spring from current material. Every class you write from here uses constructor injection, so the habit forms now.",
        principle:
          "Constructor injection makes dependencies mandatory, visible and final. A class you cannot construct without its collaborators cannot exist in a half-wired state.",
        commonMistake:
          "Field `@Autowired`. It hides dependencies from the constructor, prevents final fields, and makes the class untestable without a container — you cannot supply a mock without reflection.",
        challenge:
          "Write a service with a constructor-injected dependency and instantiate it directly in a test with a hand-made stub — no Spring, no Mockito. Then try the same with a field-injected version and observe what you have to do.",
        challengeMinutes: 45,
        estMinutes: 75,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The stereotypes",
            detail:
              "@Component is the base; @Service, @Repository and @Controller are @Component with intent. @Repository also translates persistence exceptions.",
          },
          {
            title: "Constructor injection",
            detail:
              "A single constructor needs no @Autowired at all — Spring uses it automatically. Fields can be final, which the compiler then enforces.",
          },
          {
            title: "Why field injection fails tests",
            detail:
              "There is no way to supply the dependency without reflection or a container. The class has no honest way to be built.",
          },
          {
            title: "Circular dependencies",
            detail:
              "Constructor injection makes a cycle a startup failure rather than a subtle runtime one. That is a feature — the cycle was always a design problem.",
          },
        ],
        checks: [
          {
            question: "Why does constructor injection need no @Autowired?",
            answer:
              "With exactly one constructor, Spring uses it automatically. The annotation is only needed to disambiguate several constructors.",
          },
          {
            question: "What specifically makes field injection untestable?",
            answer:
              "There is no constructor parameter to pass a stub through, so supplying a dependency requires reflection or a running container.",
          },
          {
            question: "Why is a startup failure on a circular dependency a good thing?",
            answer:
              "It surfaces a design problem immediately rather than as subtle runtime behaviour later.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Baeldung — intro to inversion of control and dependency injection",
            url: "https://www.baeldung.com/spring-dependency-injection",
            sourceName: "Baeldung",
            editorNote:
              "Compare its examples against the guardrail above — where it shows field injection, write the constructor version instead.",
          },
        ],
      },

      {
        title: "Bean ambiguity, scopes and lifecycle",
        summary: "@Qualifier, @Primary, singleton vs prototype, and the two lifecycle hooks.",
        learningObjectives: [
          "Resolving ambiguity: @Qualifier and @Primary",
          "Scopes: singleton (default), prototype, request, session",
          "@PostConstruct and @PreDestroy",
        ],
        whyToday:
          "The first time two implementations of one interface exist, the app stops starting. Knowing the two ways to resolve it turns a confusing failure into a one-line fix.",
        principle:
          "Singleton is the default and it means one instance per container, not one per JVM. Everything else about scopes follows from getting that straight.",
        commonMistake:
          "Putting mutable state in a singleton bean. Every request shares it, so what works on your machine corrupts under concurrency in production.",
        challenge:
          "Define two beans of the same interface and watch startup fail. Fix it with @Primary, then with @Qualifier, and say which you would use where. Then add a @PostConstruct and confirm when it runs.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Ambiguity",
            detail:
              "Two candidates for one injection point is a startup error. @Primary picks a default; @Qualifier names one at the injection site.",
          },
          {
            title: "Singleton",
            detail:
              "One instance per container, created eagerly at startup, shared by every injection point. Which is why it must be stateless.",
          },
          {
            title: "Prototype and web scopes",
            detail:
              "Prototype creates a new instance per injection. request and session exist in web contexts and are rarer than they look.",
          },
          {
            title: "Lifecycle hooks",
            detail:
              "@PostConstruct runs after injection completes — the right place for work that needs dependencies. @PreDestroy runs on shutdown.",
          },
        ],
        checks: [
          {
            question: "What does singleton scope actually mean?",
            answer:
              "One instance per application context, shared by every injection point — not one per JVM.",
          },
          {
            question: "Why must a singleton bean be stateless?",
            answer:
              "Every request shares the same instance, so mutable fields are shared mutable state and corrupt under concurrency.",
          },
          {
            question: "When does @PostConstruct run?",
            answer:
              "After the bean is constructed and its dependencies injected — so it can use them, which a constructor body sometimes cannot.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Spring Framework — the IoC container",
            url: "https://docs.spring.io/spring-framework/reference/core/beans.html",
            sourceName: "Spring documentation",
            editorNote: "The bean-scopes and lifecycle sections.",
          },
        ],
      },

      {
        title: "Java-based configuration",
        summary: "@Configuration and @Bean — the shape auto-configuration is made of.",
        learningObjectives: [
          "@Configuration classes and @Bean methods",
          "When explicit @Bean beats component scanning",
          "Reading a third-party starter's auto-config with new eyes",
        ],
        whyToday:
          "Boot's auto-configuration is nothing but @Configuration classes with conditions on them. After today, `@SpringBootApplication` stops being a black box.",
        principle:
          "You cannot annotate a class you do not own. @Bean methods exist for exactly that — third-party types that need to become beans.",
        commonMistake:
          "Using @Bean methods for your own classes when component scanning would do. It doubles the places wiring lives and the two drift.",
        challenge:
          "Write a @Configuration class producing a bean of a third-party type — an ObjectMapper, a RestClient, anything you did not write. Then open one of Boot's own auto-configuration classes and read it. It will look familiar.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "@Bean methods",
            detail:
              "A method in a @Configuration class whose return value becomes a bean, named after the method. The way to register types you did not write.",
          },
          {
            title: "When to use which",
            detail:
              "Component scanning for your own classes; @Bean for third-party types and for anything needing construction logic.",
          },
          {
            title: "Method parameters are injection",
            detail:
              "A @Bean method's parameters are resolved from the container, which is how one configured bean depends on another.",
          },
          {
            title: "Auto-configuration is this",
            detail:
              "Boot's starters are @Configuration classes guarded by @ConditionalOn... annotations. Nothing else is going on.",
          },
        ],
        checks: [
          {
            question: "When do you need a @Bean method rather than a stereotype annotation?",
            answer:
              "When the type is not yours to annotate, or when construction needs logic beyond calling a constructor.",
          },
          {
            question: "How does a @Bean method get its own dependencies?",
            answer:
              "Its parameters are resolved from the container, exactly like constructor injection.",
          },
          {
            question: "What is Boot's auto-configuration made of?",
            answer:
              "@Configuration classes with @ConditionalOn... guards, activated by what is on the classpath.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Spring Framework — the IoC container",
            url: "https://docs.spring.io/spring-framework/reference/core/beans.html",
            sourceName: "Spring documentation",
            editorNote: "The Java-based container configuration section.",
          },
        ],
      },
    ],
  },

  {
    title: "Spring Boot 3 & REST APIs",
    weekRange: "Week 5",
    objective:
      "Ship a validated, honestly-erroring REST API on Spring Boot 3 — records as DTOs, constructor injection, jakarta imports throughout.",
    deliverable:
      "A products API: CRUD endpoints, jakarta validation on every request record, and one global error shape via @RestControllerAdvice.",
    estHours: 5.75,
    nodes: [
      {
        title: "Bootstrapping with Spring Initializr",
        summary:
          "start.spring.io to running app, and what @SpringBootApplication actually expands to.",
        learningObjectives: [
          "Generating a Java 17+, Boot 3.x project on start.spring.io",
          "@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan",
          "The fat jar and how it runs",
        ],
        whyToday:
          "Everything from here is a Boot project. Generating one correctly — right Java version, right Boot version, right starters — takes two minutes and saves a week of version-mismatch errors.",
        principle:
          "@SpringBootApplication is three annotations in a trench coat: @Configuration, @EnableAutoConfiguration and @ComponentScan. Component scanning starts at that class's package.",
        commonMistake:
          "Putting the main class in a package below your code. Component scanning starts from its package downward, so beans in a sibling package are silently never found.",
        challenge:
          "Generate a Boot 3 project with Web and PostgreSQL starters, run it, and confirm it serves on 8080. Then move the main class one package deeper and watch your controller stop being registered.",
        challengeMinutes: 30,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Initializr",
            detail:
              "Pick Java 17 or 21, Boot 3.x, Maven, and only the starters you need. Adding starters later is one pom line.",
          },
          {
            title: "The three annotations",
            detail:
              "@Configuration makes it a bean source, @EnableAutoConfiguration activates the starters, @ComponentScan finds your classes from this package down.",
          },
          {
            title: "The fat jar",
            detail:
              "package produces one jar containing your code, every dependency and an embedded Tomcat. `java -jar` runs it anywhere with a JVM.",
          },
          {
            title: "Package placement",
            detail:
              "The main class belongs at the root of your package tree. Anything above it is invisible to scanning.",
          },
        ],
        checks: [
          {
            question: "What does @SpringBootApplication expand to?",
            answer:
              "@Configuration, @EnableAutoConfiguration and @ComponentScan.",
          },
          {
            question: "Where must the main class live, and why?",
            answer:
              "At the root of your package tree — component scanning starts from its package and works downward only.",
          },
          {
            question: "What is in the fat jar?",
            answer:
              "Your compiled code, every dependency, and an embedded servlet container. It runs with `java -jar` and nothing else installed.",
          },
        ],
        resources: [
          {
            type: "tool",
            title: "Spring Initializr",
            url: "https://start.spring.io/",
            sourceName: "spring.io",
            editorNote: "Generate the project here rather than copying somebody's pom.xml.",
          },
          {
            type: "doc",
            title: "Building an application with Spring Boot",
            url: "https://spring.io/guides/gs/spring-boot",
            sourceName: "spring.io guides",
            editorNote: "Fifteen minutes end to end. Type it rather than reading it.",
          },
        ],
      },

      {
        title: "Configuration and profiles",
        summary: "application.yml, per-environment profiles, and typed configuration.",
        learningObjectives: [
          "application.properties vs application.yml",
          "Profiles: application-dev.yml, application-prod.yml",
          "@Value vs @ConfigurationProperties",
        ],
        whyToday:
          "Day 38 deploys this service somewhere with a different database and a different secret. Configuration that varies by environment has to be a seam from the start, not a retrofit.",
        principle:
          "Configuration that differs between environments belongs in the environment, not in the jar. The same artefact should run in dev and prod.",
        commonMistake:
          "Committing a database password to application.yml. It is in git history permanently, and rotating it later does not remove it from the repository.",
        challenge:
          "Set up application-dev.yml and application-prod.yml, switch between them with a profile, and bind one group of settings with @ConfigurationProperties. Then override a value with an environment variable and confirm it wins.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "yml over properties",
            detail:
              "Same capability, less repetition for nested keys. Pick one and be consistent; mixing both in one project confuses everybody.",
          },
          {
            title: "Profiles",
            detail:
              "application-{profile}.yml layers over application.yml when that profile is active. Activate with a property or an environment variable.",
          },
          {
            title: "@Value vs @ConfigurationProperties",
            detail:
              "@Value injects one key. @ConfigurationProperties binds a whole prefix to a typed object and validates it — better for anything more than a single setting.",
          },
          {
            title: "Precedence",
            detail:
              "Environment variables and command-line arguments override files. That ordering is what lets one jar run everywhere.",
          },
        ],
        checks: [
          {
            question: "When should you prefer @ConfigurationProperties over @Value?",
            answer:
              "For any group of related settings — it binds a whole prefix to a typed, validatable object rather than scattering single keys.",
          },
          {
            question: "What overrides what?",
            answer:
              "Command-line arguments and environment variables beat profile files, which beat the base application.yml.",
          },
          {
            question: "Why should secrets not live in application.yml?",
            answer:
              "The file is committed, so the secret is in git history permanently and rotating it later does not remove it.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Spring Boot reference documentation",
            url: "https://docs.spring.io/spring-boot/index.html",
            sourceName: "Spring documentation",
            editorNote: "The externalized-configuration chapter.",
          },
        ],
      },

      {
        title: "REST principles and the first controller",
        summary:
          "Statelessness, resource URIs, the verb-status vocabulary — then the code, with records as DTOs.",
        learningObjectives: [
          "HTTP methods and status codes: 200/201/400/401/403/404/500",
          "@RestController, @RequestMapping, @GetMapping, @PostMapping",
          "@PathVariable, @RequestParam, @RequestBody; ResponseEntity",
          "Records as request/response DTOs — never getter/setter classes",
        ],
        whyToday:
          "The module deliverable is a working products API and this is the day it starts existing. Every convention set today is one you will not revisit.",
        principle:
          "The URI names a resource; the verb says what to do with it. `POST /products` creates one — `POST /createProduct` is a remote procedure call wearing REST's clothes.",
        commonMistake:
          "Returning entities directly from controllers. The JPA entity then defines your public API, so a column rename becomes a breaking change and lazy relations serialise into surprise queries.",
        challenge:
          "Build CRUD for one resource with records as request and response DTOs. Return 201 with a Location header on create and 404 on a missing id. Then check no entity type appears in any controller signature.",
        challengeMinutes: 60,
        estMinutes: 90,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Resources and verbs",
            detail:
              "Nouns in the path, verbs in the method. GET reads, POST creates, PUT replaces, PATCH updates partially, DELETE removes.",
          },
          {
            title: "Status codes that mean something",
            detail:
              "201 with a Location on create. 400 for a malformed request, 401 unauthenticated, 403 authenticated but not allowed, 404 missing.",
          },
          {
            title: "Statelessness",
            detail:
              "Every request carries what it needs. No server-side session — which is what makes day 31's stateless JWT the natural fit.",
          },
          {
            title: "DTOs, not entities",
            detail:
              "Records at the boundary. The API shape becomes a deliberate decision instead of a side effect of the schema.",
          },
          {
            title: "ResponseEntity",
            detail:
              "Use it when you need control of status or headers. Return the body directly when 200 is always right.",
          },
        ],
        checks: [
          {
            question: "What is wrong with `POST /createProduct`?",
            answer:
              "The verb is in the path. The URI should name the resource and the HTTP method should carry the action: `POST /products`.",
          },
          {
            question: "What is the difference between 401 and 403?",
            answer:
              "401 means not authenticated — no or bad credentials. 403 means authenticated but not permitted.",
          },
          {
            question: "Why not return JPA entities from a controller?",
            answer:
              "It makes the database schema the public API, so column renames break clients and lazy relations trigger surprise queries during serialisation.",
          },
          {
            question:
              "A teammate says PUT and PATCH are interchangeable. Are they?",
            answer:
              "No. PUT replaces the resource entirely — fields absent from the body should be cleared — and is idempotent. PATCH applies a partial update, so absent fields are left alone. Treating PUT as partial means a client that omits a field gets different behaviour from different servers, and it breaks the idempotency callers rely on for safe retries.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Building a RESTful web service",
            url: "https://spring.io/guides/gs/rest-service",
            sourceName: "spring.io guides",
            editorNote: "The official quick start. Type it, then extend it into the deliverable.",
          },
          {
            type: "video",
            title: "Java Brains — Spring Boot",
            url: "https://www.youtube.com/@Java.Brains",
            sourceName: "Java Brains (YouTube)",
            editorNote: "Search the channel; prefer his Boot 3-era uploads over the older series.",
          },
        ],
      },

      {
        title: "Request validation",
        summary:
          "Guardrail node: jakarta.validation.constraints, never javax — the import line is the Boot 3 shibboleth.",
        learningObjectives: [
          "@NotNull, @NotBlank, @Size, @Email, @Min, @Max on request records",
          "@Valid at the controller boundary",
          "What a constraint violation returns by default, and why you will replace it",
        ],
        whyToday:
          "Validation at the boundary is the cheapest bug prevention in the stack, and it is where the javax-to-jakarta rename bites hardest — the annotations look identical and the wrong import silently does nothing.",
        principle:
          "Validate at the boundary, once. A request that reaches your service layer should already be structurally valid.",
        commonMistake:
          "Importing `javax.validation.constraints`. Boot 3 moved to `jakarta.*` and the javax annotations are simply not processed — no error, no validation, and the endpoint accepts anything.",
        challenge:
          "Annotate a request record, add @Valid at the controller, and post something invalid. Then deliberately swap one import to javax and post again — confirm the constraint stops being enforced with no warning anywhere.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "jakarta, not javax",
            detail:
              "Jakarta EE renamed every package. Boot 3 requires jakarta.*; the javax annotations still compile if a stale library is present and are silently ignored.",
          },
          {
            title: "The constraints",
            detail:
              "@NotNull allows empty strings, @NotBlank does not. @Size for length or collection size, @Email, @Min/@Max, @Positive.",
          },
          {
            title: "@Valid triggers it",
            detail:
              "Annotations on the record do nothing until @Valid appears on the controller parameter. That is the single most common validation bug.",
          },
          {
            title: "The default response",
            detail:
              "A MethodArgumentNotValidException becomes a 400 with a verbose body naming your internal field paths. Tomorrow replaces it.",
          },
        ],
        checks: [
          {
            question: "What happens if you import javax.validation instead of jakarta?",
            answer:
              "Nothing is validated. Boot 3 only processes jakarta.* annotations, and there is no warning that the constraint is inert.",
          },
          {
            question: "What is the difference between @NotNull and @NotBlank?",
            answer:
              "@NotNull permits an empty string; @NotBlank requires at least one non-whitespace character.",
          },
          {
            question: "Why might annotated constraints not fire at all?",
            answer:
              "@Valid is missing on the controller parameter. The annotations on the record alone do nothing.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Baeldung — validation in Spring Boot",
            url: "https://www.baeldung.com/spring-boot-bean-validation",
            sourceName: "Baeldung",
            editorNote:
              "Check every import in its examples against the guardrail — anything javax.* is Boot 2 and will not work.",
          },
        ],
      },

      {
        title: "Global exception handling",
        summary:
          "One error shape for the whole API: @RestControllerAdvice and @ExceptionHandler.",
        learningObjectives: [
          "Centralizing with @RestControllerAdvice",
          "Mapping exceptions to status codes deliberately",
          "Designing an error body clients can actually parse",
        ],
        whyToday:
          "Day 5's custom exceptions become HTTP responses here. This is also the day the API stops leaking stack traces, which is a security issue as much as a usability one.",
        principle:
          "One error shape for every failure. A client should be able to parse any error from your API with one piece of code.",
        commonMistake:
          "Letting the default handler return the exception message. Internal class names, SQL fragments and file paths reach the client, which is both unhelpful and an information leak.",
        challenge:
          "Write a @RestControllerAdvice mapping your not-found exception to 404 and validation failures to 400, both in one error record. Then throw an unmapped exception and confirm the fallback returns 500 with no internal detail.",
        challengeMinutes: 45,
        estMinutes: 75,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "@RestControllerAdvice",
            detail:
              "One class handling exceptions across every controller. @ExceptionHandler methods map an exception type to a response.",
          },
          {
            title: "The error record",
            detail:
              "A timestamp, a stable machine-readable code, a human message and — for validation — the per-field detail. A record, like everything else at the boundary.",
          },
          {
            title: "Deliberate status mapping",
            detail:
              "Not-found is 404, conflict is 409, validation is 400, everything unrecognised is 500. Decide once, centrally.",
          },
          {
            title: "Never leak internals",
            detail:
              "Log the stack trace server-side with a correlation id; return the id to the client. They can quote it and you can find it.",
          },
        ],
        checks: [
          {
            question: "What does @RestControllerAdvice give you?",
            answer:
              "One place to handle exceptions across every controller, mapping each type to a deliberate status and response body.",
          },
          {
            question: "Why not return the exception message to the client?",
            answer:
              "It leaks internal class names, SQL and paths. Log it server-side with a correlation id and return the id instead.",
          },
          {
            question: "What makes an error body parseable?",
            answer:
              "A stable machine-readable code, consistent across every failure, rather than a human message clients end up string-matching.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Baeldung — error handling for REST with Spring",
            url: "https://www.baeldung.com/exception-handling-for-rest-with-spring",
            sourceName: "Baeldung",
            editorNote:
              "Long and thorough. The @RestControllerAdvice section is the one to implement from.",
          },
        ],
      },
    ],
  },

  {
    title: "Spring Data JPA & Hibernate 6",
    weekRange: "Week 6",
    objective:
      "Map entities without foot-guns: lazy by default, transactions where they belong, and the N+1 problem found and killed.",
    deliverable:
      "The products API grown a real schema: two related entities, derived queries, one JPQL @Query, and an N+1 caught in the SQL log then fixed with JOIN FETCH.",
    estHours: 7,
    nodes: [
      {
        title: "Entities and the persistence context",
        summary:
          "jakarta.persistence mapping, and the session cache that explains half of JPA's surprises.",
        learningObjectives: [
          "@Entity, @Table, @Id, @GeneratedValue(IDENTITY), @Column, @Enumerated(STRING)",
          "The persistence context: managed vs detached entities",
          "Guardrail: jakarta.persistence imports, never javax.persistence",
        ],
        whyToday:
          "The persistence context is the single concept that explains JPA's confusing behaviour — why a change you never saved was saved, and why an entity you loaded is suddenly stale. Learn it before the annotations.",
        principle:
          "A managed entity's changes are written at flush time whether or not you called save. The persistence context tracks it, and that dirty checking is the behaviour people find spooky.",
        commonMistake:
          "`@Enumerated` left at its ORDINAL default. The enum is stored as its position, so reordering the constants silently reassigns every existing row. Always `@Enumerated(EnumType.STRING)`.",
        challenge:
          "Load an entity inside a transaction, change a field, and never call save. Confirm the UPDATE happens anyway. Then do the same outside a transaction and confirm it does not.",
        challengeMinutes: 50,
        estMinutes: 90,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The persistence context",
            detail:
              "A first-level cache scoped to the transaction. It holds managed entities, guarantees one instance per row, and tracks changes.",
          },
          {
            title: "Managed vs detached",
            detail:
              "Managed entities are tracked and dirty-checked. Once the context closes they are detached, and changes go nowhere.",
          },
          {
            title: "jakarta.persistence",
            detail:
              "Boot 3 uses jakarta.*. A javax.persistence import will not be recognised as a mapping and the entity simply is not one.",
          },
          {
            title: "@Enumerated(STRING)",
            detail:
              "ORDINAL is the default and stores the position. Reordering or inserting an enum constant silently corrupts every stored row.",
          },
          {
            title: "Identity generation",
            detail:
              "@GeneratedValue(strategy = IDENTITY) uses the database's own column. Straightforward, at the cost of no JDBC batching on insert.",
          },
        ],
        checks: [
          {
            question: "Why does a change save without calling save()?",
            answer:
              "The entity is managed by the persistence context, which dirty-checks it and flushes the UPDATE at transaction commit.",
          },
          {
            question: "What is wrong with the default @Enumerated?",
            answer:
              "ORDINAL stores the constant's position, so reordering or inserting a constant silently remaps every existing row. Use STRING.",
          },
          {
            question: "What does detached mean?",
            answer:
              "The persistence context that managed the entity has closed, so it is no longer tracked and changes to it are not written.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Baeldung — JPA/Hibernate persistence context",
            url: "https://www.baeldung.com/jpa-hibernate-persistence-context",
            sourceName: "Baeldung",
            editorNote: "Read this before the annotations. It is the concept everything else rests on.",
          },
          {
            type: "doc",
            title: "Hibernate ORM 6 documentation",
            url: "https://hibernate.org/orm/documentation/6.6/",
            sourceName: "Hibernate",
            editorNote: "Reference, not a tutorial. Know it exists and check it when behaviour surprises you.",
          },
        ],
      },

      {
        title: "Relationships, ownership and fetch types",
        summary:
          "@OneToMany and friends — with LAZY as the default you defend, not a checkbox.",
        learningObjectives: [
          "@OneToOne, @OneToMany, @ManyToOne, @ManyToMany",
          "Owning side vs mappedBy",
          "FetchType.LAZY vs EAGER; CascadeType decisions",
        ],
        whyToday:
          "Nearly every JPA performance problem — including day 29's N+1 — originates in a fetch type or a cascade chosen without thinking. Choosing them deliberately today prevents that.",
        principle:
          "The side without `mappedBy` owns the relationship and its foreign key. Updating the non-owning side changes nothing in the database.",
        commonMistake:
          "Setting EAGER to fix a LazyInitializationException. It loads the relation on every query forever, including the hundred queries that never touch it, and it converts one visible error into permanent invisible cost.",
        challenge:
          "Map a @OneToMany with mappedBy and a @ManyToOne owning side. Add a child by setting only the parent's collection and confirm nothing persists. Then set the owning side and confirm it does.",
        challengeMinutes: 50,
        estMinutes: 90,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Ownership",
            detail:
              "The owning side holds the foreign key. `mappedBy` marks the other side as a mirror — writes there are ignored by the database.",
          },
          {
            title: "Fetch defaults",
            detail:
              "@ManyToOne and @OneToOne are EAGER by default; collections are LAZY. The eager defaults are the ones worth overriding.",
          },
          {
            title: "LazyInitializationException",
            detail:
              "Touching a lazy relation after the context closed. The fix is fetching it deliberately in the query, not switching to EAGER.",
          },
          {
            title: "Cascades",
            detail:
              "CascadeType.ALL includes REMOVE. On a @ManyToOne that means deleting a child deletes its parent, which is almost never intended.",
          },
          {
            title: "@ManyToMany",
            detail:
              "Convenient until the join table needs a column. Modelling it as two @OneToMany relations to an explicit entity ages better.",
          },
        ],
        checks: [
          {
            question: "Which side owns a relationship?",
            answer:
              "The side without mappedBy — it holds the foreign key. Writes to the mapped-by side alone do not change the database.",
          },
          {
            question: "Why is EAGER the wrong fix for LazyInitializationException?",
            answer:
              "It loads the relation on every query forever, including the many that never use it. Fetch it deliberately in the query instead.",
          },
          {
            question: "What is the danger of CascadeType.ALL on a @ManyToOne?",
            answer:
              "It includes REMOVE, so deleting the child cascades to the parent — almost never what was intended.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Baeldung — eager vs lazy loading in Hibernate",
            url: "https://www.baeldung.com/hibernate-lazy-eager-loading",
            sourceName: "Baeldung",
            editorNote: "Read the trade-offs section carefully; it is the decision you will keep making.",
          },
        ],
      },

      {
        title: "Spring Data repositories and derived queries",
        summary: "JpaRepository and method names that become SQL.",
        learningObjectives: [
          "Extending JpaRepository<Entity, ID>",
          "Derived queries: findByEmailAndStatus(...)",
          "When a derived name gets too clever to read",
        ],
        whyToday:
          "This is the payoff for day 6's generics and day 15's JDBC: an interface with no implementation that does everything you wrote by hand two weeks ago.",
        principle:
          "You declare the method; Spring Data writes the query from its name. There is no implementation class, and looking for one is the first confusion.",
        commonMistake:
          "Letting a derived name grow to `findByStatusAndCategoryAndPriceBetweenOrderByCreatedAtDesc`. Past about three conditions the name is harder to read than the JPQL, and tomorrow's @Query is the better tool.",
        challenge:
          "Extend JpaRepository, add two derived queries, and turn on SQL logging to see what each generates. Then write one deliberately over-long derived name and decide for yourself where the line is.",
        challengeMinutes: 40,
        estMinutes: 75,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The interface hierarchy",
            detail:
              "Repository, CrudRepository, PagingAndSortingRepository, JpaRepository. Each adds methods; JpaRepository is the usual choice.",
          },
          {
            title: "Derived query grammar",
            detail:
              "findBy, then property names joined by And/Or, with keywords like Between, LessThan, Containing, IgnoreCase, OrderBy.",
          },
          {
            title: "No implementation exists",
            detail:
              "Spring Data generates a proxy at startup. A typo in a property name is a startup failure, which is the right time to find it.",
          },
          {
            title: "Pagination",
            detail:
              "Take a Pageable parameter and return a Page. Never load an unbounded list from an endpoint — it works until the table grows.",
          },
        ],
        checks: [
          {
            question: "Where is the implementation of a JpaRepository interface?",
            answer:
              "There is none in your code — Spring Data generates a proxy at startup from the method names.",
          },
          {
            question: "What happens if you misspell a property in a derived query name?",
            answer:
              "The application fails to start. The check happens at startup, not at first call.",
          },
          {
            question: "When should a derived query become a @Query?",
            answer:
              "When the method name is harder to read than the query would be — roughly past three conditions.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Spring Data JPA — query methods",
            url: "https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html",
            sourceName: "Spring documentation",
            editorNote: "The keyword table is worth bookmarking — it is the full derived-query grammar.",
          },
          {
            type: "doc",
            title: "Accessing data with JPA",
            url: "https://spring.io/guides/gs/accessing-data-jpa",
            sourceName: "spring.io guides",
            editorNote: "The short official walk-through. Do it, then apply it to your products API.",
          },
        ],
      },

      {
        title: "JPQL and native queries",
        summary: "@Query and @Param for the questions derived methods cannot ask.",
        learningObjectives: [
          "JPQL vs native SQL — entity names vs table names",
          "@Query with @Param binding",
          "Projections: returning records instead of entities",
        ],
        whyToday:
          "Derived queries run out around the third condition, and JOIN FETCH — tomorrow's N+1 fix — can only be written as an explicit query. This is the tool for both.",
        principle:
          "JPQL queries entities and their fields; native SQL queries tables and columns. Mixing the two mental models is where the puzzling errors come from.",
        commonMistake:
          "String-concatenating a parameter into a @Query. It is SQL injection in a different costume — @Param binds properly and is no more work.",
        challenge:
          "Write one JPQL @Query with a bound parameter, then the same as a native query, and note what changes: entity name versus table name, field versus column. Then return a record projection instead of an entity.",
        challengeMinutes: 40,
        estMinutes: 75,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "JPQL",
            detail:
              "`select p from Product p where p.status = :status` — the entity name and its Java field, not the table and column.",
          },
          {
            title: "Native queries",
            detail:
              "`nativeQuery = true` for database-specific SQL. You gain the full dialect and lose portability and some JPA integration.",
          },
          {
            title: "Binding parameters",
            detail:
              "@Param names them. Never concatenate — a bound parameter cannot be parsed as query text, which is the same protection as day 15's PreparedStatement.",
          },
          {
            title: "Projections",
            detail:
              "Select into a record constructor to fetch only the columns you need. Faster, and it keeps entities out of the API layer.",
          },
        ],
        checks: [
          {
            question: "What does JPQL operate on?",
            answer:
              "Entity names and their Java fields, not table and column names. Native SQL is the other way round.",
          },
          {
            question: "Why use @Param rather than string concatenation?",
            answer:
              "A bound parameter cannot be parsed as query text, so injection is impossible. Concatenation reintroduces it.",
          },
          {
            question: "What is a projection good for?",
            answer:
              "Fetching only the columns needed, returned as a record — faster than loading whole entities and it keeps entities out of the API layer.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Baeldung — the persistence layer with Spring Data JPA",
            url: "https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa",
            sourceName: "Baeldung",
            editorNote: "The @Query and projections sections are today's material.",
          },
        ],
      },

      {
        title: "Transactions and the N+1 problem",
        summary:
          "@Transactional semantics, then the performance bug every JPA codebase ships once: find it in the SQL log, kill it with JOIN FETCH.",
        learningObjectives: [
          "Propagation: REQUIRED vs REQUIRES_NEW; readOnly = true",
          "Turning on SQL logging and counting queries",
          "Fixing N+1 with JOIN FETCH or @EntityGraph",
        ],
        whyToday:
          "N+1 is the defining JPA bug: invisible in code, invisible in tests with three rows, and fatal in production. Finding it yourself once is worth more than reading about it ten times.",
        principle:
          "Count the queries. One query that loads N parents and then one query per parent is N+1, and nothing in the Java code looks wrong.",
        commonMistake:
          "Putting @Transactional on a private method or calling an annotated method from inside the same class. The proxy is bypassed, so the annotation does nothing at all — silently.",
        challenge:
          "Turn on SQL logging, load a list of parents and touch a lazy collection on each. Count the queries. Then rewrite with JOIN FETCH and count again. Write both numbers down — that gap is the lesson.",
        challengeMinutes: 55,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "How @Transactional works",
            detail:
              "A proxy wraps the bean and opens a transaction around the call. Self-invocation and private methods bypass the proxy entirely.",
          },
          {
            title: "Propagation",
            detail:
              "REQUIRED joins an existing transaction or starts one — the default and usually right. REQUIRES_NEW suspends and starts a separate one.",
          },
          {
            title: "readOnly",
            detail:
              "Skips dirty checking and hints the driver. Worth setting on query methods; it also documents intent.",
          },
          {
            title: "Spotting N+1",
            detail:
              "Enable `spring.jpa.show-sql` or the Hibernate SQL logger and count. A list page issuing 200 queries is the signature.",
          },
          {
            title: "The two fixes",
            detail:
              "`join fetch` in an explicit JPQL query, or @EntityGraph on a repository method. Both load the relation in one query.",
          },
        ],
        checks: [
          {
            question: "What is the N+1 problem?",
            answer:
              "One query loads N parents, then accessing a lazy relation on each issues one query per parent — N+1 total, with nothing wrong-looking in the Java.",
          },
          {
            question: "Why might @Transactional do nothing?",
            answer:
              "The method is private, or it was called from inside the same class. Either bypasses the proxy that opens the transaction.",
          },
          {
            question: "Name the two fixes for N+1.",
            answer:
              "A JPQL query with `join fetch`, or @EntityGraph on the repository method. Both load the relation in a single query.",
          },
          {
            question:
              "A list endpoint is slow in production and fast in your tests. Where do you look first?",
            answer:
              "Query count, not query speed. Tests seed three rows so an N+1 issues four queries and finishes instantly; production has thousands and issues thousands. Turn on SQL logging against realistic data and count. If the count scales with the row count, it is N+1 — fix it with join fetch or an entity graph, not by adding an index.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Baeldung — @Transactional propagation and isolation",
            url: "https://www.baeldung.com/spring-transactional-propagation-isolation",
            sourceName: "Baeldung",
            editorNote:
              "Read the propagation table, then the self-invocation caveat — that one causes more silent bugs than the rest combined.",
          },
        ],
      },
    ],
  },
];
