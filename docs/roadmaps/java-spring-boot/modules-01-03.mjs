/**
 * Java & Spring Boot — modules 1–3, days 1–15.
 *
 * Core Java, collections and functional style, then the build tool and the
 * database. Titles, summaries, objectives and links are the original spec's;
 * the day-page model is new.
 */
export default [
  {
    title: "Java 17+ core & object-oriented engineering",
    weekRange: "Week 1",
    objective:
      "Write and run modern Java with a working mental model of the JVM, real OOP judgement, and the 17+ features interviews now expect.",
    deliverable:
      "A small console project using records, sealed interfaces, switch expressions and honest exception handling — pushed to GitHub.",
    estHours: 6.75,
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
        whyToday:
          "Every later day assumes a working JDK and an IDE that compiles on save. It also assumes you know that Java is compiled and interpreted, because half the interview questions about performance start there.",
        principle:
          "Java is compiled to bytecode, then interpreted, then compiled again by the JIT once a method proves hot. Three stages, and people who name two get caught.",
        commonMistake:
          "Installing Java 8 because a tutorial said so. Over half the free Java content online still teaches it, the syntax in this roadmap will not compile, and no employer is hiring for it in 2026.",
        challenge:
          "Install a 17+ JDK, run `java -version` and confirm the number. Then write a class with a `main`, compile it with `javac`, and run it with `java` — from the terminal, not the IDE's green arrow. You need to have seen the two steps separately once.",
        challengeMinutes: 40,
        estMinutes: 90,
        points: 30,
        difficulty: "intro",
        topics: [
          {
            title: "The pipeline",
            detail:
              "javac produces bytecode in a .class file. The class loader pulls it in, the JVM interprets it, and the JIT compiles the hot paths to native code while the program runs.",
          },
          {
            title: "Where memory lives",
            detail:
              "Objects on the heap, local variables and call frames on the stack, class metadata in metaspace. Almost every OutOfMemoryError names which one.",
          },
          {
            title: "Pass-by-value, always",
            detail:
              "Java passes references by value. Reassigning a parameter inside a method changes nothing outside it; mutating what it points at does. The distinction gets asked.",
          },
          {
            title: "Garbage collection",
            detail:
              "The collector frees objects nothing reachable points at. You do not choose when. Knowing that much prevents most of the folklore.",
          },
          {
            title: "Take an LTS",
            detail:
              "17 and 21 are long-term support. Everything in this roadmap targets 17 or newer, and the modern syntax is the point rather than a flourish.",
          },
        ],
        checks: [
          {
            question: "Is Java compiled or interpreted?",
            answer:
              "Both, in stages: javac compiles to bytecode, the JVM interprets it, and the JIT compiles hot methods to native code at runtime.",
          },
          {
            question: "What does 'Java is pass-by-value' mean for objects?",
            answer:
              "The reference is copied. Reassigning the parameter has no effect outside the method; mutating the object it points at does.",
          },
          {
            question: "Why take 17 or 21 rather than the newest release?",
            answer:
              "They are LTS versions with long support windows, which is what employers run. Java 8 in particular will not compile the syntax used here.",
          },
          {
            question:
              "Is Java compiled or interpreted? Walk me through what happens to your code.",
            answer:
              "Both. javac compiles source to platform-independent bytecode in a .class file. At runtime the class loader loads it, the JVM interprets the bytecode, and the JIT compiler compiles methods to native code once they prove hot. That third stage is the one candidates miss, and it is why a Java benchmark's first iterations are slower than its later ones.",
            kind: "interview",
            difficulty: "easy",
            askedInInterviews: true,
          },
          {
            question:
              "Java is pass-by-value. Then why does mutating an object inside a method change it outside?",
            answer:
              "Because the value passed is the reference, and the copy points at the same object. Mutating through the copy mutates the shared object. Reassigning the parameter only repoints the local copy and is invisible to the caller. Both facts follow from the same rule, which is why 'Java is pass-by-reference for objects' is the wrong way to remember it.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
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
            editorNote:
              "The official learning track; the gold standard when a tutorial and the spec disagree.",
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
        whyToday:
          "The pillars are asked in every fresher interview and taught as vocabulary. What separates a good answer is judgement about when each is wrong, which is what today is actually for.",
        principle:
          "Inheritance is for 'is a', and almost everything you want it for is really 'has a'. Composition is the default; inheritance earns its place.",
        commonMistake:
          "Building a deep class hierarchy because a textbook showed Animal → Dog. Real codebases go two levels at most, and every extra level is a coupling you cannot undo later.",
        challenge:
          "Write a small hierarchy with an overridden method, call it through a base-type reference, and confirm which implementation runs. Then rewrite the same behaviour with composition and say which version you would rather maintain.",
        challengeMinutes: 45,
        estMinutes: 90,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The four access levels",
            detail:
              "private, package-private (no keyword), protected, public. Package-private is the one people forget exists and the right default more often than public.",
          },
          {
            title: "Overloading vs overriding",
            detail:
              "Overloading is same name, different parameters, resolved at compile time. Overriding is same signature in a subclass, resolved at runtime. Different mechanisms entirely.",
          },
          {
            title: "Dynamic dispatch",
            detail:
              "A call through a base-type reference runs the subclass implementation. That runtime decision is the whole of polymorphism in practice.",
          },
          {
            title: "When inheritance is wrong",
            detail:
              "When you want reuse rather than substitutability. If a subclass has to throw on an inherited method, the relationship was never 'is a'.",
          },
        ],
        checks: [
          {
            question: "Overloading and overriding are resolved when?",
            answer:
              "Overloading at compile time by the parameter types; overriding at runtime by the actual object's class.",
          },
          {
            question: "What is the tell that inheritance is the wrong tool?",
            answer:
              "A subclass that has to throw or no-op an inherited method. The relationship is not substitutability, so it is not 'is a'.",
          },
          {
            question: "What does package-private give you?",
            answer:
              "Visibility inside the package only. It is a better default than public for anything not part of a deliberate API.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "dev.java — object-oriented programming",
            url: "https://dev.java/learn/oop/",
            sourceName: "dev.java (Oracle)",
            editorNote: "The official track. Read it before any video on the same topic.",
          },
          {
            type: "video",
            title: "Encapsulation in Java",
            url: "https://www.youtube.com/watch?v=YbqneqDIZh8",
            sourceName: "Telusko (YouTube)",
            youtubeVideoId: "YbqneqDIZh8",
            durationSec: 701,
            estSizeMb: 89,
            editorNote:
              "Episode 40 of his numbered Java series; inheritance is 48 and polymorphism is 55, both short. Skip anything in the series teaching Java 8-era idioms — the guardrails in this roadmap name them.",
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
        whyToday:
          "The answer most candidates give — 'interfaces cannot have implementations' — has been wrong since Java 8. Knowing the current distinction is a cheap way to sound like somebody who reads release notes.",
        principle:
          "State is the real difference. An interface can carry behaviour; it still cannot carry instance fields. That is what decides between them.",
        commonMistake:
          "Creating an interface for every class on principle. An interface with exactly one implementation that will never have another is indirection with no payoff, and it makes the codebase harder to read.",
        challenge:
          "Take a class you would naturally write and extract an interface only if you can name a second real implementation. If you cannot name one, leave it — and write down why, because that is the judgement being trained.",
        challengeMinutes: 30,
        estMinutes: 60,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "What each can hold",
            detail:
              "Abstract classes: instance fields, constructors, any access level. Interfaces: constants, default and static methods, and no instance state.",
          },
          {
            title: "default methods",
            detail:
              "Added so interfaces could grow without breaking every implementer. Use them for that, not as a backdoor to multiple inheritance.",
          },
          {
            title: "Single inheritance still applies",
            detail:
              "A class extends one class and implements many interfaces. When you need to mix in behaviour from two places, interfaces are the only route.",
          },
          {
            title: "Over-abstraction",
            detail:
              "An interface per class, named IThing or ThingImpl, is a smell. Add the seam when a second implementation actually exists.",
          },
        ],
        checks: [
          {
            question: "What can an abstract class hold that an interface still cannot?",
            answer:
              "Instance state — fields — plus constructors. Behaviour is no longer the distinction; state is.",
          },
          {
            question: "Why were default methods added?",
            answer:
              "So an interface could gain a method without breaking every existing implementer. Interface evolution, not multiple inheritance.",
          },
          {
            question: "When should you not extract an interface?",
            answer:
              "When you cannot name a second real implementation. One-implementation interfaces are indirection without payoff.",
          },
        ],
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
        whyToday:
          "Every DTO from day 22 onward is a record. Learning them now means the REST module is about HTTP rather than about boilerplate you are still writing by hand.",
        principle:
          "A record is a name, a list of components, and nothing else. Constructor, accessors, equals, hashCode and toString come free and stay correct.",
        commonMistake:
          "Reaching for Lombok reflexively. It exists because Java lacked records; for immutable data carriers the language now does the job with no annotation processor, no IDE plugin and no build-time magic.",
        challenge:
          "Define a sealed interface with two record implementations, then write a switch expression over it with no default branch. The compiler should accept it — and should reject it the moment you add a third permitted type. Watch that happen.",
        challengeMinutes: 50,
        estMinutes: 90,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Records",
            detail:
              "Immutable, final, with generated accessors named after the components — `id()` rather than `getId()`. Compact constructors exist for validation.",
          },
          {
            title: "Sealed types",
            detail:
              "`sealed interface Shape permits Circle, Square` closes the hierarchy. The compiler then knows every case, which is what makes exhaustive switch possible.",
          },
          {
            title: "Pattern matching",
            detail:
              "`if (o instanceof String s)` binds and casts in one step. In a switch it lets you branch on type without a chain of instanceof.",
          },
          {
            title: "Exhaustiveness",
            detail:
              "A switch over a sealed type needs no default, and adding a new subtype turns every unhandled switch into a compile error. That is the real payoff.",
          },
          {
            title: "Text blocks",
            detail:
              "Triple-quoted multi-line strings. Useful for the JSON in your tests and the JPQL in day 28.",
          },
        ],
        checks: [
          {
            question: "What does a record generate for you?",
            answer:
              "A canonical constructor, component accessors, equals, hashCode and toString. The class is final and the fields immutable.",
          },
          {
            question: "What does sealing a type buy you?",
            answer:
              "The compiler knows every permitted subtype, so a switch can be exhaustive without a default — and adding a subtype breaks the build where cases are missing.",
          },
          {
            question: "Why prefer a record over Lombok for a DTO?",
            answer:
              "It is a language feature: no annotation processor, no IDE plugin, no build-time generation, and it cannot drift from the class it describes.",
          },
          {
            question:
              "You need a DTO with fifteen fields, some optional, built in stages. Is a record still right?",
            answer:
              "Probably not on its own. Records are positional and immutable, so a fifteen-component canonical constructor is unreadable and staged construction is impossible. Either decompose it into smaller records that model real groupings, or keep the record and add a builder for construction. The record is right for the shape; what is wrong is a flat fifteen-field shape.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
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
        whyToday:
          "Day 24 builds one global error shape for the whole API, and it can only map exceptions to status codes if the exceptions carry meaning. That starts here.",
        principle:
          "An exception should say what went wrong specifically enough that the handler can decide what to do. `catch (Exception e)` throws that information away.",
        commonMistake:
          "Swallowing an exception — catching it, logging it, and continuing as if nothing happened. The bug then surfaces three layers away with no stack trace pointing at its cause, which is strictly worse than crashing.",
        challenge:
          "Write a custom exception carrying one piece of context (an id, a field name). Throw it, catch it at a boundary, and confirm the context survives. Then open a resource with try-with-resources and prove it closes on the exception path.",
        challengeMinutes: 45,
        estMinutes: 75,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Checked vs unchecked",
            detail:
              "Checked extends Exception and must be declared or caught. Unchecked extends RuntimeException and need not be. Most application errors are better unchecked.",
          },
          {
            title: "Custom exceptions",
            detail:
              "One per meaningful failure — NotFound, Conflict, Validation. Carry the context in fields, not in a formatted message string.",
          },
          {
            title: "try-with-resources",
            detail:
              "Anything AutoCloseable declared in the parentheses is closed in reverse order, on both the normal and exception paths. Replaces every finally block you used to write.",
          },
          {
            title: "Never swallow",
            detail:
              "If you cannot handle it, let it propagate. A caught-and-ignored exception is a bug that will resurface with no trace of where it started.",
          },
          {
            title: "Multi-catch",
            detail:
              "`catch (IOException | SQLException e)` when the handling is genuinely identical. When it is not, two blocks.",
          },
        ],
        checks: [
          {
            question: "What is the difference between checked and unchecked?",
            answer:
              "Checked exceptions extend Exception and the compiler forces you to declare or catch them. Unchecked extend RuntimeException and do not.",
          },
          {
            question: "What does try-with-resources guarantee?",
            answer:
              "Every AutoCloseable declared in the parentheses is closed in reverse order, on both the normal and the exception path.",
          },
          {
            question:
              "Why is catching and logging an exception often worse than not catching it?",
            answer:
              "Execution continues in a broken state and the failure resurfaces elsewhere with no trace of its origin. Propagating keeps the stack trace attached to the cause.",
          },
          {
            question: "Checked or unchecked for your own application exceptions, and why?",
            answer:
              "Unchecked, in most modern designs. A checked exception forces every caller in the chain to declare or catch it, which in practice produces empty catch blocks and throws clauses that propagate up through layers that cannot act on them. Reserve checked for a genuinely recoverable condition the immediate caller is expected to handle. The stronger point is that whichever you choose, the exception should carry the context — an id, a field — in fields rather than only in a formatted message.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "dev.java — exceptions",
            url: "https://dev.java/learn/exceptions/",
            sourceName: "dev.java (Oracle)",
            editorNote:
              "The official treatment. Note the section on when a checked exception is the right choice — it is rarer than the tutorials suggest.",
          },
        ],
      },
    ],
  },
  {
    title: "Collections, generics & functional Java",
    weekRange: "Week 2",
    objective:
      "Choose the right collection for the job, explain HashMap internals in an interview, and process data with streams instead of loops.",
    deliverable:
      "A data-processing exercise set: the same transformations written imperatively and with streams, with a note on which reads better and why.",
    estHours: 6.25,
    nodes: [
      {
        title: "Generics",
        summary: "Type parameters, bounds and wildcards — compile-time safety without casts.",
        learningObjectives: [
          "Type parameters <T>, <E>, <K, V>; bounded types",
          "Wildcards: ? extends T vs ? super T",
          "Type erasure and what it means at runtime",
        ],
        whyToday:
          "Every collection and every repository interface from here on is generic. Reading `JpaRepository<Product, Long>` fluently starts with understanding what the angle brackets do.",
        principle:
          "Generics are a compile-time contract. At runtime the type argument is gone, which explains every strange limitation you will hit.",
        commonMistake:
          "Assuming the type is available at runtime — trying `new T[]` or `instanceof List<String>`. Erasure removes it, and the compiler error will not explain why.",
        challenge:
          "Write a generic method with a bounded parameter, then write one taking `List<? extends Number>` and try to add to it. The compiler will refuse. Work out why before reading the answer.",
        challengeMinutes: 40,
        estMinutes: 75,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Type parameters",
            detail:
              "`<T>` on a class or method. Bounds narrow it: `<T extends Comparable<T>>` means anything usable with compareTo.",
          },
          {
            title: "PECS",
            detail:
              "Producer extends, consumer super. `? extends T` is a source you can read from; `? super T` is a sink you can write to. That mnemonic is the whole rule.",
          },
          {
            title: "Type erasure",
            detail:
              "The compiler checks types then discards them. At runtime a `List<String>` is just a List, which is why you cannot test for it or create arrays of it.",
          },
          {
            title: "Raw types",
            detail:
              "Using `List` with no parameter compiles with a warning and gives up every guarantee. It exists for pre-2004 code, not for yours.",
          },
        ],
        checks: [
          {
            question: "What is type erasure?",
            answer:
              "The compiler verifies generic types then removes them from the bytecode. At runtime the type argument does not exist.",
          },
          {
            question: "What does PECS stand for and mean?",
            answer:
              "Producer extends, consumer super. Read from a `? extends T`, write to a `? super T`.",
          },
          {
            question: "Why can you not add to a `List<? extends Number>`?",
            answer:
              "The compiler only knows it is some subtype of Number — possibly Integer — so no specific value is guaranteed safe to insert.",
          },
          {
            question: "What is type erasure, and name something it stops you doing.",
            answer:
              "The compiler checks generic types then removes them, so at runtime a List<String> is just a List. That is why you cannot write `new T[]`, cannot test `instanceof List<String>`, and cannot overload two methods differing only by type argument — after erasure they have identical signatures. It exists for backward compatibility with pre-generics bytecode.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "dev.java — generics",
            url: "https://dev.java/learn/generics/",
            sourceName: "dev.java (Oracle)",
            editorNote: "The wildcards section is the one worth slowing down for.",
          },
          {
            type: "read",
            title: "Baeldung — Java generics",
            url: "https://www.baeldung.com/java-generics",
            sourceName: "Baeldung",
            editorNote:
              "Shorter and more example-driven than the official track. Read it second.",
          },
        ],
      },
      {
        title: "Lists and Sets",
        summary:
          "ArrayList vs LinkedList, and the three Sets — with the O() costs said out loud.",
        learningObjectives: [
          "ArrayList (contiguous array) vs LinkedList (doubly-linked): O(1) index vs O(n) search",
          "HashSet, LinkedHashSet, TreeSet — hashing, insertion order, red-black sorting",
          "Choosing by access pattern, not by habit",
        ],
        whyToday:
          "The choice is asked in interviews and it matters in code. Both facts point the same way: know the costs rather than the names.",
        principle:
          "Pick the collection from the access pattern. Index-heavy reads want ArrayList; ordered iteration wants LinkedHashSet; sorted iteration wants TreeSet.",
        commonMistake:
          "Choosing LinkedList for 'fast inserts'. Insertion is O(1) only if you already hold the node — reaching the position is O(n), and ArrayList wins in practice almost every time because of memory locality.",
        challenge:
          "Put the same 100,000 elements through an ArrayList and a LinkedList, timing random-index access on each. The gap will be larger than the big-O suggests. Then say why.",
        challengeMinutes: 40,
        estMinutes: 75,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "ArrayList",
            detail:
              "A contiguous array that grows by copying. O(1) index access, O(n) middle insertion, and excellent cache behaviour. The default.",
          },
          {
            title: "LinkedList",
            detail:
              "Doubly-linked nodes. O(1) insertion at a held node, O(n) to reach any position, and poor locality. Rarely the right answer.",
          },
          {
            title: "The three Sets",
            detail:
              "HashSet is unordered and O(1). LinkedHashSet keeps insertion order for a small cost. TreeSet keeps sorted order in a red-black tree at O(log n).",
          },
          {
            title: "Big-O is not the whole story",
            detail:
              "Cache locality often dominates at realistic sizes. ArrayList beating LinkedList on paper-equal operations is the standard demonstration.",
          },
        ],
        checks: [
          {
            question: "Why does ArrayList usually beat LinkedList even for insertions?",
            answer:
              "Reaching the insertion point is O(n) in a LinkedList, and ArrayList's contiguous memory gives far better cache behaviour at realistic sizes.",
          },
          {
            question: "What distinguishes the three Set implementations?",
            answer:
              "HashSet is unordered, O(1). LinkedHashSet preserves insertion order. TreeSet keeps elements sorted in a red-black tree at O(log n).",
          },
          {
            question: "What should drive the choice of collection?",
            answer: "The access pattern — how you read it, not how you fill it.",
          },
          {
            question:
              "ArrayList or LinkedList for a list you insert into frequently? Most people answer this wrong.",
            answer:
              "ArrayList, almost always. LinkedList's O(1) insertion assumes you already hold the node; reaching the position is O(n), and its nodes are scattered in memory so every traversal misses cache. ArrayList's array copy is a fast contiguous block operation. The big-O comparison favours LinkedList and real measurements at realistic sizes favour ArrayList — which is the actual point of the question.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "dev.java — the collections framework",
            url: "https://dev.java/learn/api/collections-framework/",
            sourceName: "dev.java (Oracle)",
            editorNote: "The official map of the whole framework. Skim it once, in full.",
          },
          {
            type: "read",
            title: "Baeldung — Java collections guide",
            url: "https://www.baeldung.com/java-collections",
            sourceName: "Baeldung",
            editorNote: "An index into the series. Follow the List and Set articles today.",
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
        whyToday:
          "This is the single most-asked Java data-structure question in the market this roadmap targets. It is also genuinely worth knowing, which is rarer than it sounds.",
        principle:
          "hashCode picks the bucket, equals picks the entry within it. Both must agree, or the map loses your keys.",
        commonMistake:
          "Overriding equals without hashCode. Two objects that are equal then land in different buckets, so a get() with an equal key returns null and the bug looks like data loss.",
        challenge:
          "Write a class, override equals but not hashCode, put an instance in a HashMap and try to retrieve it with an equal instance. Watch it fail. Then add hashCode and watch it work.",
        challengeMinutes: 45,
        estMinutes: 75,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "put(), step by step",
            detail:
              "Compute hashCode, spread the bits, mask to a bucket index, then walk the bucket comparing with equals. Insert or replace.",
          },
          {
            title: "Collisions",
            detail:
              "Two keys landing in one bucket form a linked list. At eight entries in a bucket, with the table at least 64 wide, it becomes a red-black tree — O(n) degrades to O(log n).",
          },
          {
            title: "The equals/hashCode contract",
            detail:
              "Equal objects must have equal hash codes. The reverse is not required. Breaking the first direction breaks the map.",
          },
          {
            title: "Resizing",
            detail:
              "At load factor 0.75 the table doubles and every entry is rehashed. Sizing a map you know the size of avoids that cost.",
          },
          {
            title: "ConcurrentHashMap",
            detail:
              "Thread-safe with per-bin locking rather than one global lock. Use it when multiple threads write; a plain HashMap corrupts under concurrent modification.",
          },
        ],
        checks: [
          {
            question: "Walk through what happens on a put().",
            answer:
              "hashCode is computed and spread, masked to a bucket index, then the bucket is walked comparing keys with equals — replacing a match or appending a new entry.",
          },
          {
            question: "What happens at eight entries in one bucket?",
            answer:
              "The bucket's linked list becomes a red-black tree (given a table of at least 64), turning O(n) lookups within the bucket into O(log n).",
          },
          {
            question: "What breaks if you override equals but not hashCode?",
            answer:
              "Equal objects can hash to different buckets, so a lookup with an equal key misses. It presents as silent data loss.",
          },
          {
            question:
              "Your service stores a mutable object as a HashMap key and entries start disappearing. What happened?",
            answer:
              "The key was mutated after insertion, changing its hashCode. The entry still sits in the bucket chosen by the old hash, but every lookup now computes the new one and looks in the wrong bucket. The entry is unreachable and will not even be removed by remove(). Keys must be immutable, or at least immutable in the fields hashCode reads.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
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
        summary:
          "Predicate, Function, Consumer, Supplier — the four shapes everything else is made of.",
        learningObjectives: [
          "java.util.function core types and when each fits",
          "Lambda syntax; method references Class::methodName",
          "Writing your own functional interface, once, to demystify it",
        ],
        whyToday:
          "Streams tomorrow are built entirely out of these four shapes. Learning them separately means tomorrow is about the pipeline rather than about the syntax inside it.",
        principle:
          "A lambda is an implementation of a single-method interface. Nothing more magical is happening, and knowing that makes the type errors readable.",
        commonMistake:
          "Writing a lambda where a method reference would do. `x -> x.getName()` is `Product::getName`, and the shorter form is not just terser — it says the intent is delegation rather than logic.",
        challenge:
          "Declare your own interface with one abstract method, annotate it `@FunctionalInterface`, and pass a lambda to something that takes it. Then add a second abstract method and watch the annotation reject it.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The four shapes",
            detail:
              "Predicate<T> returns boolean, Function<T,R> transforms, Consumer<T> takes and returns nothing, Supplier<T> returns without input. Everything else is a variation.",
          },
          {
            title: "What a lambda is",
            detail:
              "An instance of an interface with exactly one abstract method. The compiler infers which interface from the context.",
          },
          {
            title: "Method references",
            detail:
              "Four forms: static, bound instance, unbound instance, and constructor. `Product::getName` is unbound — the receiver becomes the argument.",
          },
          {
            title: "@FunctionalInterface",
            detail:
              "Optional, and worth adding. It makes the compiler enforce the single-abstract-method rule so a later edit cannot silently break every lambda.",
          },
        ],
        checks: [
          {
            question: "What are the four core functional shapes?",
            answer:
              "Predicate (T to boolean), Function (T to R), Consumer (T to nothing), Supplier (nothing to T).",
          },
          {
            question: "What is a lambda, mechanically?",
            answer:
              "An implementation of an interface with exactly one abstract method, with the target type inferred from context.",
          },
          {
            question: "What does @FunctionalInterface do?",
            answer:
              "Makes the compiler enforce that the interface has exactly one abstract method, so a later addition cannot silently break callers.",
          },
        ],
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
        whyToday:
          "This is the module's deliverable: the same transformations written twice. Streams are also what Spring Data returns and what every code reviewer expects to see.",
        principle:
          "A stream pipeline is lazy. Intermediate operations build a plan; nothing executes until a terminal operation asks for a result.",
        commonMistake:
          "Calling `.get()` on an Optional. It reintroduces exactly the null-pointer failure the type exists to prevent, and `orElseThrow()` says the same thing while naming the failure.",
        challenge:
          "Take a loop with a filter and an accumulation, rewrite it as a stream, and then write one sentence on which reads better. Sometimes the loop wins — say so when it does.",
        challengeMinutes: 50,
        estMinutes: 90,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The three parts",
            detail:
              "A source (collection, range, generator), any number of intermediate operations returning a stream, and exactly one terminal operation producing a result.",
          },
          {
            title: "Laziness",
            detail:
              "Intermediate operations are recorded, not run. Without a terminal operation nothing happens at all — a common first surprise.",
          },
          {
            title: "map vs flatMap",
            detail:
              "map transforms each element one-to-one; flatMap transforms each into a stream and concatenates them. Use flatMap when the transform produces collections.",
          },
          {
            title: "Optional properly",
            detail:
              "Chain with map and filter, resolve with orElse, orElseGet or orElseThrow. Never call get(), and never return Optional from a field or a collection.",
          },
          {
            title: "When a loop is better",
            detail:
              "Side effects, early exit with complex conditions, and anything where the stream version needs a comment to explain it.",
          },
        ],
        checks: [
          {
            question: "What does laziness mean in a stream pipeline?",
            answer:
              "Intermediate operations only build the plan. Nothing executes until a terminal operation demands a result.",
          },
          {
            question: "When do you need flatMap rather than map?",
            answer:
              "When the transform produces a stream or collection per element and you want one flat stream rather than a stream of collections.",
          },
          {
            question: "Why avoid Optional.get()?",
            answer:
              "It throws on empty, reintroducing the null-pointer failure Optional exists to prevent. orElseThrow does the same thing while naming the failure.",
          },
          {
            question: "Why does this stream pipeline produce no output?",
            answer:
              "There is no terminal operation. Intermediate operations like map and filter are lazy — they record the plan and nothing executes until something demands a result with collect, forEach, reduce or findFirst. It is the most common first surprise with streams, and the fix is one method call.",
            kind: "interview",
            difficulty: "easy",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Baeldung — guide to Optional",
            url: "https://www.baeldung.com/java-optional",
            sourceName: "Baeldung",
            editorNote: "Read the anti-patterns section; it names the get() habit directly.",
          },
          {
            type: "video",
            title: "Stream API in Java",
            url: "https://www.youtube.com/watch?v=tklkyVa7KZo",
            sourceName: "Telusko (YouTube)",
            youtubeVideoId: "tklkyVa7KZo",
            durationSec: 1563,
            estSizeMb: 198,
            editorNote:
              "Twenty-six minutes covering the whole pipeline. Watch for the laziness demonstration — it is the part that explains why a pipeline with no terminal operation does nothing.",
          },
        ],
      },
    ],
  },
  {
    title: "Build tools, PostgreSQL & JDBC",
    weekRange: "Week 3",
    objective:
      "Own the build (Maven), model and query a relational database properly, and touch the raw JDBC layer Spring will later hide.",
    deliverable:
      "A Maven project that connects to PostgreSQL over JDBC with PreparedStatement and prints a joined, aggregated report.",
    estHours: 6.75,
    nodes: [
      {
        title: "Maven and the build lifecycle",
        summary: "pom.xml stops being magic: coordinates, dependencies, plugins, lifecycle.",
        learningObjectives: [
          "Directory conventions: src/main/java, src/test/java",
          "GroupId, ArtifactId, Version; dependency scopes",
          "clean, compile, test, package, install",
        ],
        whyToday:
          "Spring Initializr hands you a pom.xml on day 20. Being able to read it — and add a dependency without copying a whole file from Stack Overflow — starts here.",
        principle:
          "Maven is convention over configuration. Put files where it expects them and the build needs almost no configuration at all.",
        commonMistake:
          "Pasting a dependency without a scope. Test libraries that ship in the production jar bloat the artefact and occasionally change runtime behaviour; `<scope>test</scope>` exists for that.",
        challenge:
          "Create a Maven project by hand — directories, a minimal pom — add one dependency, and run `mvn package`. Then open the jar and confirm what did and did not get packaged.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 25,
        difficulty: "intro",
        topics: [
          {
            title: "Coordinates",
            detail:
              "groupId, artifactId, version identify every artefact uniquely. They are how the whole dependency graph is addressed.",
          },
          {
            title: "The lifecycle",
            detail:
              "validate, compile, test, package, verify, install, deploy. Running a phase runs every phase before it, which is why `mvn package` also compiles and tests.",
          },
          {
            title: "Scopes",
            detail:
              "compile is the default. test keeps it out of the artefact, provided expects the container to supply it, runtime is needed to run but not to compile.",
          },
          {
            title: "Transitive dependencies",
            detail:
              "Your dependencies bring their own. `mvn dependency:tree` is how you find out what is actually on the classpath and why.",
          },
        ],
        checks: [
          {
            question: "What happens when you run `mvn package`?",
            answer:
              "Every lifecycle phase up to and including package runs — validate, compile, test, then package. Phases are cumulative.",
          },
          {
            question: "What does `<scope>test</scope>` do?",
            answer:
              "Makes the dependency available when compiling and running tests, and keeps it out of the packaged artefact.",
          },
          {
            question: "How do you find out why a library is on your classpath?",
            answer:
              "`mvn dependency:tree` shows the transitive graph and which direct dependency pulled it in.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Maven — getting started guide",
            url: "https://maven.apache.org/guides/getting-started/",
            sourceName: "Apache Maven",
            editorNote:
              "Long, and worth skimming in full once so you know what is in it. The lifecycle section is the part to read properly.",
          },
        ],
      },
      {
        title: "Relational modelling and core SQL",
        summary:
          "Keys, constraints and the four verb families — the database half of every backend interview.",
        learningObjectives: [
          "Primary keys, foreign keys, unique constraints, sequences",
          "DDL (CREATE, ALTER), DML (INSERT, UPDATE, DELETE)",
          "SELECT with WHERE, GROUP BY, HAVING",
        ],
        whyToday:
          "JPA in module 6 generates SQL for you, and you cannot debug generated SQL you cannot read. Every JPA problem is ultimately a SQL problem.",
        principle:
          "Constraints belong in the database. Application-level validation can be bypassed by the next service that connects; a foreign key cannot.",
        commonMistake:
          "Leaving referential integrity to the application 'for flexibility'. What it buys is orphan rows nobody notices for months, and no way to tell which of them were legitimate.",
        challenge:
          "Model two related tables with a real foreign key, insert valid rows, then try to insert a child pointing at a missing parent. The database should refuse. Then try to delete a referenced parent.",
        challengeMinutes: 45,
        estMinutes: 90,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Keys",
            detail:
              "A primary key identifies a row uniquely and never changes. A foreign key points at one, and the database enforces that the target exists.",
          },
          {
            title: "Constraints",
            detail:
              "NOT NULL, UNIQUE, CHECK, and the keys. Each is a fact about the data the database will not let anything violate.",
          },
          {
            title: "DDL vs DML",
            detail:
              "DDL changes structure (CREATE, ALTER, DROP); DML changes rows (INSERT, UPDATE, DELETE). In PostgreSQL DDL is transactional, which is unusual and useful.",
          },
          {
            title: "GROUP BY and HAVING",
            detail:
              "WHERE filters rows before grouping, HAVING filters groups after. Putting an aggregate in WHERE is the classic error.",
          },
        ],
        checks: [
          {
            question: "What is the difference between WHERE and HAVING?",
            answer:
              "WHERE filters rows before aggregation; HAVING filters the resulting groups after. Aggregates can only appear in HAVING.",
          },
          {
            question: "Why enforce referential integrity in the database rather than the app?",
            answer:
              "Any other client that connects bypasses application validation. A foreign key cannot be bypassed.",
          },
          {
            question: "What does a UNIQUE constraint give you beyond validation?",
            answer:
              "An index, and a guarantee that holds under concurrency — two simultaneous inserts cannot both succeed.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "PostgreSQL tutorial — getting started",
            url: "https://www.postgresql.org/docs/current/tutorial-start.html",
            sourceName: "PostgreSQL documentation",
            editorNote:
              "The official tutorial. Install PostgreSQL locally and type the examples rather than reading them.",
          },
          {
            type: "tool",
            title: "SQLBolt interactive lessons",
            url: "https://sqlbolt.com/",
            sourceName: "SQLBolt",
            editorNote:
              "If you did the Data analyst roadmap, this is revision; do the review sets. It marks your answers, which nothing else here does.",
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
        whyToday:
          "Joins are where SQL stops being a lookup language, and they are where the N+1 problem on day 29 gets fixed. The fix is a JOIN FETCH, and it will not mean anything without today.",
        principle:
          "Check the row count after every join. A join that multiplies rows is the most common silent bug in reporting SQL, and the numbers stay plausible.",
        commonMistake:
          "Joining on a non-unique column and reading the resulting totals as truth. Every aggregate is then inflated by the duplication factor, and nothing about the output looks wrong.",
        challenge:
          "Write a query joining two tables, note the row count, then deliberately join on a column with duplicates and note it again. Then find the anti-join: rows in one table with no match in the other.",
        challengeMinutes: 45,
        estMinutes: 90,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The join types",
            detail:
              "INNER keeps matches only. LEFT keeps every row from the left plus matches. FULL keeps everything. RIGHT is LEFT with the tables swapped and is rarely worth using.",
          },
          {
            title: "Anti-joins",
            detail:
              "LEFT JOIN then WHERE the right side IS NULL — rows with no match. The standard way to ask 'which of these are missing from that'.",
          },
          {
            title: "CTEs",
            detail:
              "WITH names a subquery so a multi-step query reads top to bottom. Almost always clearer than nesting, at no cost in PostgreSQL.",
          },
          {
            title: "Row-count sanity",
            detail:
              "Count before and after. If the join added rows, the join key was not unique on one side and every aggregate downstream is wrong.",
          },
        ],
        checks: [
          {
            question: "How do you find rows in A with no match in B?",
            answer:
              "LEFT JOIN B, then filter WHERE the joined column IS NULL. That is an anti-join.",
          },
          {
            question: "Why check the row count after a join?",
            answer:
              "A non-unique join key multiplies rows, inflating every downstream aggregate while the output still looks plausible.",
          },
          {
            question: "What does a CTE buy you over a nested subquery?",
            answer:
              "Readability — the query reads as named steps top to bottom, at no performance cost in PostgreSQL.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "PostgreSQL tutorial — joins between tables",
            url: "https://www.postgresql.org/docs/current/tutorial-join.html",
            sourceName: "PostgreSQL documentation",
            editorNote: "Short. The official statement of the semantics.",
          },
          {
            type: "tool",
            title: "pgexercises",
            url: "https://pgexercises.com/",
            sourceName: "pgexercises",
            editorNote:
              "Marks your SQL against the real answer. Do the joins and aggregates sets today — this is the second of only two resources in this roadmap that check your work.",
          },
        ],
      },
      {
        title: "Indexes and transactions",
        summary:
          "B-tree intuition and ACID — the two words 'performance' and 'consistency' actually mean.",
        learningObjectives: [
          "What a B-tree index accelerates and what it cannot",
          "ACID properties; what a transaction boundary is",
          "Reading a query plan without fear",
        ],
        whyToday:
          "Day 29's @Transactional and day 37's concurrent stock deduction both rest on knowing what a transaction actually guarantees. And EXPLAIN is how you will diagnose the N+1.",
        principle:
          "An index is a sorted structure the database can seek into. That is why it helps equality and range lookups and does nothing for a leading wildcard.",
        commonMistake:
          "Adding an index to every column. Each one slows every write and consumes space, and an index the planner never chooses is pure cost.",
        challenge:
          "Run EXPLAIN on a query over an unindexed column and note the sequential scan. Add the index, run it again, and read the plan change. Then try a `LIKE '%foo'` and watch the index be ignored.",
        challengeMinutes: 45,
        estMinutes: 75,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What a B-tree does",
            detail:
              "Keeps keys sorted so the engine can binary-search rather than scan. Helps equality, ranges and ORDER BY on the same column.",
          },
          {
            title: "What it cannot do",
            detail:
              "A leading wildcard has no prefix to seek on. Neither does a function applied to the column, unless you built the index on that expression.",
          },
          {
            title: "ACID",
            detail:
              "Atomicity (all or nothing), consistency (constraints hold), isolation (concurrent transactions do not see each other's partial work), durability (committed means committed).",
          },
          {
            title: "Transaction boundaries",
            detail:
              "Everything between BEGIN and COMMIT succeeds or none of it does. Where you put those two statements is a design decision, and day 29 makes it an annotation.",
          },
          {
            title: "Reading a plan",
            detail:
              "Seq Scan means reading everything; Index Scan means seeking. The estimated row counts matter more than the costs when something is wrong.",
          },
        ],
        checks: [
          {
            question: "Why does an index not help `LIKE '%foo'`?",
            answer:
              "A B-tree seeks by prefix, and a leading wildcard leaves no prefix to seek on. The planner falls back to a scan.",
          },
          {
            question: "What is the cost of an index?",
            answer:
              "Every write must maintain it, and it consumes space. An index the planner never chooses is pure cost.",
          },
          {
            question: "What does isolation guarantee?",
            answer:
              "Concurrent transactions do not observe each other's uncommitted work. The exact guarantee depends on the isolation level.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "PostgreSQL — indexes",
            url: "https://www.postgresql.org/docs/current/indexes.html",
            sourceName: "PostgreSQL documentation",
            editorNote:
              "Read the introduction and the B-tree section; skip the exotic index types for now.",
          },
          {
            type: "doc",
            title: "PostgreSQL — using EXPLAIN",
            url: "https://www.postgresql.org/docs/current/using-explain.html",
            sourceName: "PostgreSQL documentation",
            editorNote:
              "The single most useful page in the manual for a backend developer. Come back to it on day 29.",
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
        whyToday:
          "Everything from module 6 onward hides this layer. Seeing it once, by hand, is what makes JPA comprehensible rather than magical — and it is where SQL injection is prevented or not.",
        principle:
          "A PreparedStatement sends the query and the parameters separately. That separation is what makes injection impossible, not any escaping you might do.",
        commonMistake:
          "Building SQL by string concatenation. It is the single most exploited web vulnerability in history and the fix — a `?` placeholder — is shorter than the bug.",
        challenge:
          "Connect to PostgreSQL over raw JDBC, run a parameterised query with PreparedStatement, and read the ResultSet. Then try passing `' OR '1'='1` as the parameter and confirm nothing happens.",
        challengeMinutes: 50,
        estMinutes: 90,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The four objects",
            detail:
              "DriverManager gives a Connection, the Connection makes a PreparedStatement, executing it returns a ResultSet. Close all of them — try-with-resources does it for you.",
          },
          {
            title: "Why PreparedStatement",
            detail:
              "Query text and parameter values travel separately, so a value can never be parsed as SQL. It is also faster on repeated execution.",
          },
          {
            title: "Connections are expensive",
            detail:
              "A TCP handshake, authentication and a server-side process per connection. Opening one per request does not survive any real load.",
          },
          {
            title: "HikariCP",
            detail:
              "Boot 3's default pool. It keeps connections open and hands them out, so a request borrows rather than creates one.",
          },
          {
            title: "Pool sizing",
            detail:
              "Smaller than people expect. A pool larger than the database can usefully serve makes throughput worse, not better.",
          },
        ],
        checks: [
          {
            question: "Why does a PreparedStatement prevent SQL injection?",
            answer:
              "The query text and the parameter values are sent separately, so a value is never parsed as SQL regardless of its content.",
          },
          {
            question: "Why does a connection pool exist?",
            answer:
              "Opening a connection costs a handshake, authentication and a server-side process. The pool keeps them open and lends them out.",
          },
          {
            question: "Is a bigger pool faster?",
            answer:
              "No. Beyond what the database can usefully serve concurrently, a larger pool increases contention and reduces throughput.",
          },
          {
            question:
              "Why does a PreparedStatement prevent SQL injection where escaping does not?",
            answer:
              "The query text and the parameter values travel to the database separately. The statement is parsed once with placeholders, so a value can never be interpreted as SQL no matter what it contains — there is no string for an attacker to break out of. Escaping tries to neutralise dangerous characters in a concatenated string, which depends on getting every case right against every dialect. One is structural, the other is a filter.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "video",
            title: "Java Database Connectivity | JDBC",
            url: "https://www.youtube.com/watch?v=7v2OnUti2eM",
            sourceName: "Telusko (YouTube)",
            youtubeVideoId: "7v2OnUti2eM",
            durationSec: 1234,
            estSizeMb: 156,
            editorNote:
              "Twenty minutes on the raw layer Spring will hide from you next week. Watch him use PreparedStatement rather than concatenation.",
          },
          {
            type: "doc",
            title: "HikariCP",
            url: "https://github.com/brettwooldridge/HikariCP",
            sourceName: "GitHub — brettwooldridge",
            editorNote:
              "Read the README's 'pool sizing' link — a classic that prevents cargo-cult configs.",
          },
        ],
      },
    ],
  },
];
