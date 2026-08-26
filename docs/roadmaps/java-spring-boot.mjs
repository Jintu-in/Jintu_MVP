/**
 * Java & Spring Boot 3 backend developer — 14 weeks (owner curriculum,
 * 2026-08-13). The highest-volume fresher hiring stack in India: IT service
 * majors, GCCs and product firms alike.
 *
 * Explicitly Java 17+ (LTS) and Spring Boot 3.x / Spring Framework 6. The
 * owner's legacy guardrails ride as editor notes on the nodes where the
 * traps actually live, because over half the free Java content online still
 * teaches Java 8 / Spring Boot 2 idioms:
 *   - jakarta.* imports, never javax.*
 *   - SecurityFilterChain @Bean, never WebSecurityConfigurerAdapter
 *   - requestMatchers(), never antMatchers()
 *   - Java Records over verbose DTOs
 *   - constructor injection, never field @Autowired
 *
 * Anchors per the owner's source matrix: dev.java + official docs (core),
 * Telusko and Java Brains (concept videos, channel links until specific
 * ids are verified), Baeldung (patterns), spring.io/guides (walk-throughs).
 * Every URL here resolved live on 2026-08-13; --check re-verifies before
 * any paste can publish.
 */
export default {
  slug: "java-spring-boot",
  title: "Java & Spring Boot backend developer",
  summary:
    "Fourteen weeks from zero to a deployed backend: modern Java 17+, SQL, Spring Boot 3, JPA, security and testing — the highest-volume fresher hiring stack in India, on free content only.",
  subjectTags: ["java", "spring-boot", "backend", "sql", "programming"],
  category: "software",
  difficulty: "beginner",
  estimatedWeeks: 14,
  reviewCadence: "annual",
  // Day one opens a terminal and clones a repository, and the roadmap never
  // says so. 0020 makes that assumption an edge instead of a surprise: a
  // fourteen-week commitment with a two-week first step is a different offer.
  requires: [{ slug: "git-and-github", note: "Day one clones a repository and never explains how." }],
  licenseNote: null, // hand-curated link by link; nothing imported wholesale
  modules: [
    {
      title: "Java 17+ core & object-oriented engineering",
      weekRange: "Weeks 1–3",
      objective:
        "Write and run modern Java with a working mental model of the JVM, real OOP judgement, and the 17+ features interviews now expect.",
      deliverable:
        "A small console project using records, sealed interfaces, switch expressions and honest exception handling — pushed to GitHub.",
      nodes: [
        {
          title: "JDK setup and how the JVM actually runs your code",
          summary:
            "Source → bytecode → class loader → JVM runtime → JIT. Knowing the pipeline is what separates 'it runs' from 'I know why'.",
          learningObjectives: [
            "Install OpenJDK 17 or 21 (Adoptium) and IntelliJ IDEA Community",
            "The execution flow: .java → .class → ClassLoader → Heap/Stack/Metaspace → JIT",
            "Primitives vs reference types; pass-by-value semantics",
            "Garbage collection fundamentals — what it frees and when",
          ],
          estMinutes: 90,
          points: 30,
          difficulty: "intro",
          resources: [
            {
              type: "tool",
              title: "Adoptium — prebuilt OpenJDK",
              url: "https://adoptium.net/",
              sourceName: "Eclipse Adoptium",
              editorNote: "Take the 21 LTS; 17 is also fine. Avoid Java 8 downloads entirely.",
            },
            {
              type: "tool",
              title: "IntelliJ IDEA Community Edition",
              url: "https://www.jetbrains.com/idea/download/",
              sourceName: "JetBrains",
              editorNote: "Community edition is free and enough for everything in this roadmap.",
            },
            {
              type: "doc",
              title: "dev.java — learn Java",
              url: "https://dev.java/learn/",
              sourceName: "dev.java (Oracle)",
              editorNote: "The official learning track; the gold standard when a tutorial and the spec disagree.",
            },
          ],
        },
        {
          title: "Encapsulation, inheritance and polymorphism",
          summary: "The three pillars, done with judgement rather than ceremony.",
          learningObjectives: [
            "Access modifiers: private, package-private, protected, public",
            "Overloading vs overriding; dynamic method dispatch",
            "super and this; when inheritance is the wrong tool",
          ],
          estMinutes: 90,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "dev.java — object-oriented programming",
              url: "https://dev.java/learn/oop/",
              sourceName: "dev.java (Oracle)",
            },
            {
              type: "video",
              title: "Telusko — Core Java playlist",
              url: "https://www.youtube.com/@Telusko",
              sourceName: "Telusko (YouTube)",
              editorNote:
                "Search the channel for the current Core Java playlist. Skip any video teaching Java 8-era idioms — the guardrails in this roadmap name them.",
            },
          ],
        },
        {
          title: "Abstraction: abstract classes vs interfaces",
          summary:
            "Modern interfaces carry default and static methods — the old textbook distinction has moved.",
          learningObjectives: [
            "Abstract classes vs interfaces, and when each earns its place",
            "default and static methods in interfaces",
            "Designing to an interface without over-abstracting",
          ],
          estMinutes: 60,
          points: 25,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "dev.java — learn Java",
              url: "https://dev.java/learn/",
              sourceName: "dev.java (Oracle)",
              editorNote: "The interfaces section under the OOP track.",
            },
          ],
        },
        {
          title: "Records, sealed types and pattern matching",
          summary:
            "The modern-Java trio interviewers use to check you did not learn Java from a 2015 tutorial.",
          learningObjectives: [
            "Records as immutable data carriers — public record UserResponse(Long id, String email) {}",
            "Sealed classes and interfaces: sealed, permits, final",
            "Pattern matching for instanceof; switch expressions",
            "Text blocks for multi-line strings",
          ],
          estMinutes: 90,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "dev.java — records",
              url: "https://dev.java/learn/records/",
              sourceName: "dev.java (Oracle)",
              editorNote:
                "Guardrail: use records for DTOs instead of getter/setter classes or reflexive Lombok.",
            },
          ],
        },
        {
          title: "Exception handling that reveals instead of hides",
          summary: "Checked vs unchecked, custom exceptions, and cleanup that cannot leak.",
          learningObjectives: [
            "The hierarchy: Throwable → Exception vs RuntimeException",
            "Custom exception design; multi-catch",
            "try-with-resources and AutoCloseable",
          ],
          estMinutes: 75,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "dev.java — exceptions",
              url: "https://dev.java/learn/exceptions/",
              sourceName: "dev.java (Oracle)",
            },
          ],
        },
      ],
    },
    {
      title: "Collections, generics & functional Java",
      weekRange: "Weeks 4–5",
      objective:
        "Choose the right collection for the job, explain HashMap internals in an interview, and process data with streams instead of loops.",
      deliverable:
        "A data-processing exercise set: the same transformations written imperatively and with streams, with a note on which reads better and why.",
      nodes: [
        {
          title: "Generics",
          summary: "Type parameters, bounds and wildcards — compile-time safety without casts.",
          learningObjectives: [
            "Type parameters <T>, <E>, <K, V>; bounded types",
            "Wildcards: ? extends T vs ? super T",
            "Type erasure and what it means at runtime",
          ],
          estMinutes: 75,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "dev.java — generics",
              url: "https://dev.java/learn/generics/",
              sourceName: "dev.java (Oracle)",
            },
            {
              type: "read",
              title: "Baeldung — Java generics",
              url: "https://www.baeldung.com/java-generics",
              sourceName: "Baeldung",
            },
          ],
        },
        {
          title: "Lists and Sets",
          summary: "ArrayList vs LinkedList, and the three Sets — with the O() costs said out loud.",
          learningObjectives: [
            "ArrayList (contiguous array) vs LinkedList (doubly-linked): O(1) index vs O(n) search",
            "HashSet, LinkedHashSet, TreeSet — hashing, insertion order, red-black sorting",
            "Choosing by access pattern, not by habit",
          ],
          estMinutes: 75,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "dev.java — the collections framework",
              url: "https://dev.java/learn/api/collections-framework/",
              sourceName: "dev.java (Oracle)",
            },
            {
              type: "read",
              title: "Baeldung — Java collections guide",
              url: "https://www.baeldung.com/java-collections",
              sourceName: "Baeldung",
            },
          ],
        },
        {
          title: "HashMap internals — the interview classic",
          summary:
            "hashCode, buckets, collisions, and the list-to-tree flip at threshold 8. Asked at every level of the Indian hiring market.",
          learningObjectives: [
            "hashCode → bucket index; equals for collision resolution",
            "Bucket lists becoming red-black trees at threshold 8",
            "ConcurrentHashMap and when thread safety is your problem",
          ],
          estMinutes: 75,
          points: 35,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "Baeldung — Java collections guide",
              url: "https://www.baeldung.com/java-collections",
              sourceName: "Baeldung",
              editorNote: "The Map articles in the series; read until you can whiteboard a put().",
            },
          ],
        },
        {
          title: "Functional interfaces and lambdas",
          summary: "Predicate, Function, Consumer, Supplier — the four shapes everything else is made of.",
          learningObjectives: [
            "java.util.function core types and when each fits",
            "Lambda syntax; method references Class::methodName",
            "Writing your own functional interface, once, to demystify it",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "dev.java — learn Java",
              url: "https://dev.java/learn/",
              sourceName: "dev.java (Oracle)",
              editorNote: "The lambda expressions section of the official track.",
            },
          ],
        },
        {
          title: "Streams and Optional",
          summary:
            "Source → intermediate ops → terminal op, and nullability handled without .get() roulette.",
          learningObjectives: [
            "map, filter, flatMap, sorted, distinct; collect, reduce, findFirst",
            "Laziness: nothing runs until the terminal operation",
            "Optional: map, orElseThrow, ifPresent — never bare .get()",
          ],
          estMinutes: 90,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Baeldung — guide to Optional",
              url: "https://www.baeldung.com/java-optional",
              sourceName: "Baeldung",
            },
            {
              type: "video",
              title: "Telusko — streams videos",
              url: "https://www.youtube.com/@Telusko",
              sourceName: "Telusko (YouTube)",
              editorNote: "Search the channel for the current Stream API videos.",
            },
          ],
        },
      ],
    },
    {
      title: "Build tools, PostgreSQL & JDBC",
      weekRange: "Weeks 6–7",
      objective:
        "Own the build (Maven), model and query a relational database properly, and touch the raw JDBC layer Spring will later hide.",
      deliverable:
        "A Maven project that connects to PostgreSQL over JDBC with PreparedStatement and prints a joined, aggregated report.",
      nodes: [
        {
          title: "Maven and the build lifecycle",
          summary: "pom.xml stops being magic: coordinates, dependencies, plugins, lifecycle.",
          learningObjectives: [
            "Directory conventions: src/main/java, src/test/java",
            "GroupId, ArtifactId, Version; dependency scopes",
            "clean, compile, test, package, install",
          ],
          estMinutes: 60,
          points: 25,
          difficulty: "intro",
          resources: [
            {
              type: "doc",
              title: "Maven — getting started guide",
              url: "https://maven.apache.org/guides/getting-started/",
              sourceName: "Apache Maven",
            },
          ],
        },
        {
          title: "Relational modelling and core SQL",
          summary: "Keys, constraints and the four verb families — the database half of every backend interview.",
          learningObjectives: [
            "Primary keys, foreign keys, unique constraints, sequences",
            "DDL (CREATE, ALTER), DML (INSERT, UPDATE, DELETE)",
            "SELECT with WHERE, GROUP BY, HAVING",
          ],
          estMinutes: 90,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "PostgreSQL tutorial — getting started",
              url: "https://www.postgresql.org/docs/current/tutorial-start.html",
              sourceName: "PostgreSQL documentation",
            },
            {
              type: "tool",
              title: "SQLBolt interactive lessons",
              url: "https://sqlbolt.com/",
              sourceName: "SQLBolt",
              editorNote: "If you did the Data analyst roadmap, this is revision; do the review sets.",
            },
          ],
        },
        {
          title: "Joins, subqueries and CTEs",
          summary: "Answering questions no single table can, without double-counting.",
          learningObjectives: [
            "INNER, LEFT, RIGHT, FULL joins; anti-join patterns",
            "Subqueries and WITH (CTEs) for readable multi-step queries",
            "Row-count sanity after every join",
          ],
          estMinutes: 90,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "PostgreSQL tutorial — joins between tables",
              url: "https://www.postgresql.org/docs/current/tutorial-join.html",
              sourceName: "PostgreSQL documentation",
            },
            {
              type: "tool",
              title: "pgexercises",
              url: "https://pgexercises.com/",
              sourceName: "pgexercises",
            },
          ],
        },
        {
          title: "Indexes and transactions",
          summary: "B-tree intuition and ACID — the two words 'performance' and 'consistency' actually mean.",
          learningObjectives: [
            "What a B-tree index accelerates and what it cannot",
            "ACID properties; what a transaction boundary is",
            "Reading a query plan without fear",
          ],
          estMinutes: 75,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "PostgreSQL — indexes",
              url: "https://www.postgresql.org/docs/current/indexes.html",
              sourceName: "PostgreSQL documentation",
            },
            {
              type: "doc",
              title: "PostgreSQL — using EXPLAIN",
              url: "https://www.postgresql.org/docs/current/using-explain.html",
              sourceName: "PostgreSQL documentation",
            },
          ],
        },
        {
          title: "JDBC and connection pooling",
          summary:
            "The raw wire Spring hides: DriverManager, PreparedStatement, ResultSet — and why HikariCP exists.",
          learningObjectives: [
            "Connection, PreparedStatement (SQL injection prevention), ResultSet",
            "Why opening connections is expensive",
            "HikariCP — Spring Boot 3's default pool — and what it manages",
          ],
          estMinutes: 90,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "video",
              title: "Telusko — JDBC videos",
              url: "https://www.youtube.com/@Telusko",
              sourceName: "Telusko (YouTube)",
              editorNote: "Search the channel for the current JDBC series.",
            },
            {
              type: "doc",
              title: "HikariCP",
              url: "https://github.com/brettwooldridge/HikariCP",
              sourceName: "GitHub — brettwooldridge",
              editorNote: "Read the README's 'pool sizing' link — a classic that prevents cargo-cult configs.",
            },
          ],
        },
      ],
    },
    {
      title: "Spring core & dependency injection",
      weekRange: "Week 8",
      objective:
        "Understand what the container actually does — IoC, DI, bean lifecycle — before Boot makes it look like magic.",
      deliverable:
        "A plain Spring (no Boot) console app wiring three collaborating beans by constructor injection, with scopes demonstrated.",
      nodes: [
        {
          title: "Inversion of control and the container",
          summary: "The one idea the whole framework is built on: you stop calling new.",
          learningObjectives: [
            "IoC philosophy: instantiation and lifecycle delegated to the framework",
            "ApplicationContext vs BeanFactory",
            "What a 'bean' actually is",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
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
          estMinutes: 75,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Baeldung — intro to inversion of control and dependency injection",
              url: "https://www.baeldung.com/spring-dependency-injection",
              sourceName: "Baeldung",
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
          estMinutes: 60,
          points: 30,
          difficulty: "core",
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
          estMinutes: 60,
          points: 30,
          difficulty: "core",
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
      weekRange: "Weeks 9–10",
      objective:
        "Ship a validated, honestly-erroring REST API on Spring Boot 3 — records as DTOs, constructor injection, jakarta imports throughout.",
      deliverable:
        "A products API: CRUD endpoints, jakarta validation on every request record, and one global error shape via @RestControllerAdvice.",
      nodes: [
        {
          title: "Bootstrapping with Spring Initializr",
          summary: "start.spring.io to running app, and what @SpringBootApplication actually expands to.",
          learningObjectives: [
            "Generating a Java 17+, Boot 3.x project on start.spring.io",
            "@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan",
            "The fat jar and how it runs",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "tool",
              title: "Spring Initializr",
              url: "https://start.spring.io/",
              sourceName: "spring.io",
            },
            {
              type: "doc",
              title: "Building an application with Spring Boot",
              url: "https://spring.io/guides/gs/spring-boot",
              sourceName: "spring.io guides",
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
          estMinutes: 60,
          points: 30,
          difficulty: "core",
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
          estMinutes: 90,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Building a RESTful web service",
              url: "https://spring.io/guides/gs/rest-service",
              sourceName: "spring.io guides",
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
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Baeldung — validation in Spring Boot",
              url: "https://www.baeldung.com/spring-boot-bean-validation",
              sourceName: "Baeldung",
            },
          ],
        },
        {
          title: "Global exception handling",
          summary: "One error shape for the whole API: @RestControllerAdvice and @ExceptionHandler.",
          learningObjectives: [
            "Centralizing with @RestControllerAdvice",
            "Mapping exceptions to status codes deliberately",
            "Designing an error body clients can actually parse",
          ],
          estMinutes: 75,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Baeldung — error handling for REST with Spring",
              url: "https://www.baeldung.com/exception-handling-for-rest-with-spring",
              sourceName: "Baeldung",
            },
          ],
        },
      ],
    },
    {
      title: "Spring Data JPA & Hibernate 6",
      weekRange: "Weeks 11–12",
      objective:
        "Map entities without foot-guns: lazy by default, transactions where they belong, and the N+1 problem found and killed.",
      deliverable:
        "The products API grown a real schema: two related entities, derived queries, one JPQL @Query, and an N+1 caught in the SQL log then fixed with JOIN FETCH.",
      nodes: [
        {
          title: "Entities and the persistence context",
          summary: "jakarta.persistence mapping, and the session cache that explains half of JPA's surprises.",
          learningObjectives: [
            "@Entity, @Table, @Id, @GeneratedValue(IDENTITY), @Column, @Enumerated(STRING)",
            "The persistence context: managed vs detached entities",
            "Guardrail: jakarta.persistence imports, never javax.persistence",
          ],
          estMinutes: 90,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Baeldung — JPA/Hibernate persistence context",
              url: "https://www.baeldung.com/jpa-hibernate-persistence-context",
              sourceName: "Baeldung",
            },
            {
              type: "doc",
              title: "Hibernate ORM 6 documentation",
              url: "https://hibernate.org/orm/documentation/6.6/",
              sourceName: "Hibernate",
            },
          ],
        },
        {
          title: "Relationships, ownership and fetch types",
          summary: "@OneToMany and friends — with LAZY as the default you defend, not a checkbox.",
          learningObjectives: [
            "@OneToOne, @OneToMany, @ManyToOne, @ManyToMany",
            "Owning side vs mappedBy",
            "FetchType.LAZY vs EAGER; CascadeType decisions",
          ],
          estMinutes: 90,
          points: 35,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "Baeldung — eager vs lazy loading in Hibernate",
              url: "https://www.baeldung.com/hibernate-lazy-eager-loading",
              sourceName: "Baeldung",
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
          estMinutes: 75,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Spring Data JPA — query methods",
              url: "https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html",
              sourceName: "Spring documentation",
            },
            {
              type: "doc",
              title: "Accessing data with JPA",
              url: "https://spring.io/guides/gs/accessing-data-jpa",
              sourceName: "spring.io guides",
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
          estMinutes: 75,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Baeldung — the persistence layer with Spring Data JPA",
              url: "https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa",
              sourceName: "Baeldung",
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
          estMinutes: 90,
          points: 40,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "Baeldung — @Transactional propagation and isolation",
              url: "https://www.baeldung.com/spring-transactional-propagation-isolation",
              sourceName: "Baeldung",
            },
          ],
        },
      ],
    },
    {
      title: "Stateless security with Spring Security 6 & JWT",
      weekRange: "Week 13",
      objective:
        "Secure the API the Boot 3 way: SecurityFilterChain bean, stateless sessions, JWT issue-and-verify — none of the removed Boot 2 patterns.",
      deliverable:
        "Registration and login issuing JWTs (BCrypt-hashed passwords), a JwtAuthenticationFilter, and role-gated admin routes.",
      nodes: [
        {
          title: "Security architecture: the filter chain",
          summary: "Where security actually happens — before your controller ever runs.",
          learningObjectives: [
            "DelegatingFilterProxy and the security filter chain",
            "Authentication vs authorization",
            "What 'stateless' costs and buys",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
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
          estMinutes: 90,
          points: 35,
          difficulty: "stretch",
          resources: [
            {
              type: "doc",
              title: "Spring Security reference",
              url: "https://docs.spring.io/spring-security/reference/index.html",
              sourceName: "Spring documentation",
              editorNote: "The Java-configuration chapter — current, unlike most tutorials.",
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
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Introduction to JSON Web Tokens",
              url: "https://jwt.io/introduction",
              sourceName: "jwt.io",
            },
          ],
        },
        {
          title: "The JwtAuthenticationFilter",
          summary: "OncePerRequestFilter: extract, validate, populate the SecurityContextHolder.",
          learningObjectives: [
            "Reading the Authorization header; validating the signature",
            "Building the Authentication and setting SecurityContextHolder",
            "Wiring the filter before UsernamePasswordAuthenticationFilter",
          ],
          estMinutes: 90,
          points: 40,
          difficulty: "stretch",
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
      weekRange: "Week 14",
      objective:
        "Prove the service works (JUnit 5, Mockito, MockMvc), containerize it, and deploy the capstone that carries your placement interviews.",
      deliverable:
        "The Order Execution & Inventory Reservation Service, deployed: JWT auth with BCrypt, validated CRUD for products and orders, transactional stock that cannot go negative under concurrent hits, 80%+ coverage, and a repo with architecture diagram, Postman collection and docker-compose.",
      nodes: [
        {
          title: "Unit testing with JUnit 5",
          summary: "@Test, @BeforeEach, @ParameterizedTest, assertThrows — tests as the spec you keep.",
          learningObjectives: [
            "The JUnit 5 lifecycle and assertions",
            "Parameterized tests for the boring-but-vital cases",
            "assertThrows for the failure paths",
          ],
          estMinutes: 75,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "JUnit 5 user guide",
              url: "https://junit.org/junit5/docs/current/user-guide/",
              sourceName: "JUnit",
            },
            {
              type: "read",
              title: "Baeldung — JUnit 5 guide",
              url: "https://www.baeldung.com/junit-5",
              sourceName: "Baeldung",
            },
          ],
        },
        {
          title: "Mockito and MockMvc",
          summary: "Isolate the service layer with mocks; hit controllers without a server.",
          learningObjectives: [
            "@Mock, @InjectMocks, when(...).thenReturn(...), verify(...)",
            "MockMvc: status().isOk(), jsonPath(...)",
            "What to mock and what to leave real",
          ],
          estMinutes: 90,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "read",
              title: "Baeldung — Mockito series",
              url: "https://www.baeldung.com/mockito-series",
              sourceName: "Baeldung",
            },
            {
              type: "tool",
              title: "Mockito",
              url: "https://site.mockito.org/",
              sourceName: "Mockito",
            },
          ],
        },
        {
          title: "Docker: multi-stage builds and compose",
          summary: "A production-shaped Dockerfile for a Boot jar, plus PostgreSQL beside it in compose.",
          learningObjectives: [
            "Multi-stage Dockerfile: build stage, slim runtime stage",
            "docker-compose.yml wiring app + PostgreSQL",
            "Environment variables as the config seam",
          ],
          estMinutes: 90,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Docker — multi-stage builds",
              url: "https://docs.docker.com/build/building/multi-stage/",
              sourceName: "Docker documentation",
            },
            {
              type: "doc",
              title: "Docker Compose",
              url: "https://docs.docker.com/compose/",
              sourceName: "Docker documentation",
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
          estMinutes: 120,
          points: 40,
          difficulty: "stretch",
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
          estMinutes: 90,
          points: 40,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "About READMEs",
              url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
              sourceName: "GitHub Docs",
            },
          ],
        },
      ],
    },
  ],
};
