/**
 * Git & GitHub — twelve days, two weeks.
 *
 * The first short roadmap on Jintu, and the first authored to the full
 * COURSE_STANDARD: every day carries a why-today, a principle, topics with
 * detail lines, a challenge with an artefact, the mistake, and three checks.
 *
 * Six days a week, 40–55 minutes each. That pace is deliberate — the streak
 * resets on a missed day, and three of the four original roadmaps offer
 * 2.1–2.7 days of material a week, which breaks the streak through no fault
 * of the reader. Twelve days over two weeks is a habit somebody can actually
 * keep, and finishing it is the strongest retention event the product has.
 *
 * It is also the prerequisite nobody teaches. Java & Spring Boot assumes Git
 * on day one and never says so; 0020 gives that assumption an edge, and this
 * roadmap is what the edge points at.
 *
 * Sourcing: Pro Git is CC BY-NC-SA 3.0 and free in full, which makes it the
 * spine. Everything else is official documentation or a free interactive.
 * Nothing here is behind a signup.
 */
export default {
  slug: "git-and-github",
  title: "Git & GitHub",
  summary:
    "Twelve days from your first commit to rescuing a repository you thought you had broken — the version control every other roadmap assumes you already know.",
  subjectTags: ["git", "github", "version-control", "command-line", "collaboration"],
  category: "software",
  difficulty: "beginner",
  estimatedWeeks: 2,
  licenseNote:
    "Pro Git (Chacon & Straub) is linked throughout and is CC BY-NC-SA 3.0. We link to it; we host none of it.",

  modules: [
    {
      title: "Committing — the local half",
      weekRange: "Week 1",
      objective:
        "Record work in small, described steps, and move between versions of it without fear.",
      deliverable: "A local repository with a branched, merged history you can read back.",
      estHours: 5,
      nodes: [
        // ── 1 ──────────────────────────────────────────────────────────────
        {
          title: "What version control actually solves",
          summary:
            "Not backup. The ability to say what changed, when, and why — and to go back to any of it.",
          learningObjectives: [
            "Say what a commit is in one sentence, without using the word 'save'",
            "Explain why final-v2-FINAL-real.docx is the problem Git solves",
            "Install Git and prove it works",
          ],
          whyToday:
            "Almost everyone arrives at Git expecting a backup tool and then finds the commands make no sense. They make perfect sense once you know Git stores snapshots of a whole project and gives each one a name — and none at all if you think it stores files.",
          principle:
            "A commit is not a save. It is a claim about what changed and why, addressed to whoever reads it next — including you.",
          commonMistake:
            "Treating commits as backups and committing once at the end of the day with the message 'work'. Six months later that commit is the only place a bug could have come from and it tells you nothing. The size of a commit is a decision, not an accident.",
          challenge:
            "Install Git, run `git --version`, and set your name and email with `git config --global`. Then find any folder on your machine you have edited more than twice and write down, in three lines, what changed between the first version and now. That is what a log would have told you for free.",
          challengeMinutes: 20,
          estMinutes: 40,
          points: 25,
          difficulty: "intro",
          topics: [
            {
              title: "Snapshots, not differences",
              detail:
                "Git records the whole state of the project at each commit and reuses unchanged files. Most other systems record a list of edits per file. Nearly every Git behaviour that surprises people follows from this one choice.",
            },
            {
              title: "Every commit has a name",
              detail:
                "A 40-character SHA-1 hash of the content. Two commits with the same content and history have the same name, everywhere, on every machine — which is why Git can tell whether two people have the same work without asking a server.",
            },
            {
              title: "Almost everything is local",
              detail:
                "History, branches, diffs and blame all live in the .git folder next to your work. You can commit, branch and search history on a train with no signal. Only push and pull need the network.",
            },
            {
              title: "Distributed means every clone is a full copy",
              detail:
                "There is no privileged master copy in the protocol. GitHub is privileged only by agreement — technically your laptop holds as complete a repository as their servers do.",
            },
          ],
          checks: [
            {
              question: "Why can you view a project's whole history offline?",
              answer:
                "Because a clone contains the entire repository — every commit, branch and tag — in the .git folder, not just the current files. Only exchanging work with someone else needs a network.",
            },
            {
              question: "What is a commit hash a hash of?",
              answer:
                "The content of the snapshot plus its metadata and its parent commit. Change any of those and you get a different hash, which is what makes history tamper-evident.",
            },
            {
              question: "Give one thing version control does that copying a folder does not.",
              answer:
                "It records why each change was made and lets you move to any previous state, compare two states, and find which change introduced a behaviour. A folder copy gives you the state and nothing else.",
            },
            {
              question:
                "A colleague says Git is 'basically Dropbox for code'. What is wrong with that?",
              answer:
                "Dropbox syncs the current state continuously and silently; Git records deliberate, described, named snapshots that you choose to make and can compare, revert to, and attribute. The value is the history and the intent, not the sync.",
              kind: "interview",
              difficulty: "easy",
            },
          ],
          resources: [
            {
              type: "read",
              title: "About Version Control",
              url: "https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control",
              sourceName: "Pro Git",
              author: "Scott Chacon and Ben Straub",
              editorNote:
                "The clearest explanation of snapshots-versus-differences anywhere. Read the diagrams, not just the prose — they are the whole idea.",
            },
            {
              type: "doc",
              title: "Installing Git",
              url: "https://git-scm.com/book/en/v2/Getting-Started-Installing-Git",
              sourceName: "Pro Git",
              editorNote: "Per-platform, kept current. Skip to your operating system.",
            },
          ],
        },
        // ── 2 ──────────────────────────────────────────────────────────────
        {
          title: "The three places a change can be",
          summary:
            "Working directory, staging area, repository. Every confusing Git message is about which of the three something is in.",
          learningObjectives: [
            "Name the three states and what moves a change between them",
            "Read `git status` and say what it is telling you",
            "Stage part of your work and commit only that",
          ],
          whyToday:
            "The staging area is the single concept that separates people who find Git baffling from people who find it obvious. It is also the one nearly every tutorial rushes past in a sentence.",
          principle:
            "The staging area exists so that what you commit and what you have been working on can be different things.",
          commonMistake:
            "Reaching for `git add .` every time, which makes the staging area invisible and eventually commits a debug print, a stray secret, or half of an unrelated change. Staging is a chance to read your own work before you sign it.",
          challenge:
            "Make a repository, create two files, and produce a commit that contains only one of them while the other stays uncommitted. Then run `git status` and write down, in your own words, what each of the three sections is telling you.",
          challengeMinutes: 25,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "Working directory",
              detail:
                "The files you can see and edit. Git compares them against what it last recorded, which is how it knows something is modified.",
            },
            {
              title: "Staging area (the index)",
              detail:
                "A draft of your next commit. `git add` copies the current content of a file into it — note 'current': edit the file again afterwards and the staged version is now stale, which is why status can list one file as both staged and modified.",
            },
            {
              title: "The repository",
              detail:
                "Committed history in .git. Once something is committed it is very hard to lose, which is the whole reason to commit often.",
            },
            {
              title: "Reading git status properly",
              detail:
                "Three groups: changes to be committed (staged), changes not staged for commit (modified but not added), and untracked files (Git has never seen them). Status also tells you the command to undo each group.",
            },
            {
              title: "Staging part of a file",
              detail:
                "`git add -p` walks you through each chunk of a change and asks whether to stage it. This is how you separate a real fix from the tidying you did around it.",
            },
          ],
          checks: [
            {
              question: "You edit a file, run `git add`, then edit it again. What does status show?",
              answer:
                "The file appears twice — once under changes to be committed (the version you staged) and once under changes not staged for commit (the edits made since). Committing now records only the staged version.",
            },
            {
              question: "What is the difference between an untracked and a modified file?",
              answer:
                "Untracked means Git has never recorded that file at all. Modified means Git has a previous version and the file differs from it.",
            },
            {
              question: "Why would you ever stage only part of your work?",
              answer:
                "So each commit is one coherent change. If you fixed a bug and reformatted three functions while you were there, those are two commits, and only one of them is worth reading later.",
            },
            {
              question:
                "Walk me through what happens, in Git's internals, between `git add` and `git commit`.",
              answer:
                "`git add` writes the file's content into the object database as a blob and records that blob in the index. `git commit` turns the index into a tree object, writes a commit object pointing at that tree and at the current HEAD as parent, and moves the current branch to the new commit.",
              kind: "interview",
              difficulty: "hard",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "read",
              title: "Recording Changes to the Repository",
              url: "https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository",
              sourceName: "Pro Git",
              editorNote:
                "The lifecycle diagram near the top is the thing to memorise. Everything else on this page is commentary on it.",
            },
            {
              type: "tool",
              title: "Learn Git Branching — Introduction sequence",
              url: "https://learngitbranching.js.org/",
              sourceName: "learngitbranching.js.org",
              editorNote:
                "Free, visual, and it checks itself. Do the first four levels today; you will come back to this on day 5.",
            },
          ],
        },
        // ── 3 ──────────────────────────────────────────────────────────────
        {
          title: "Your first repository, commit by commit",
          summary:
            "init, add, commit, log — and the habit of committing small enough that each one is describable.",
          learningObjectives: [
            "Take a folder from nothing to a repository with several commits",
            "Read `git log` and follow the chain of parents",
            "Decide where one commit should end and the next begin",
          ],
          whyToday:
            "Yesterday was the model; today is the muscle. The commands are few and you will type them thousands of times, so the point of today is repetition until `git status` before every commit is automatic.",
          principle:
            "Commit when you could write one honest sentence about what you just did. If you need 'and', you have waited too long.",
          commonMistake:
            "Committing only when something is finished. Git is not a publishing step — a broken intermediate state on your own branch is exactly what commits are for, and it is what makes the next day's work recoverable.",
          challenge:
            "Take any small piece of writing or code and build it up in at least five commits, each with a message that would still make sense to you in a year. Then run `git log --oneline` and check that the list reads like a description of what you did.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "init and the .git folder",
              detail:
                "`git init` creates one hidden folder. Delete it and you have an ordinary directory again with all your files intact — nothing about Git is woven into your work.",
            },
            {
              title: "The commit chain",
              detail:
                "Each commit points at its parent. A branch is a pointer at one commit; history is what you get by following parents backwards. There is no numbering and no central ledger.",
            },
            {
              title: "Reading the log",
              detail:
                "`git log --oneline --graph --decorate` is the form worth learning: one line per commit, the branch structure drawn, and the branch and tag names shown.",
            },
            {
              title: "How big is one commit",
              detail:
                "One reason. If reverting it would undo two unrelated things, it is two commits. This is the judgement the whole tool rewards, and it takes practice rather than reading.",
            },
          ],
          checks: [
            {
              question: "What does `git init` actually create?",
              answer:
                "A .git directory holding the object database, the index, refs and config. Your files are untouched — Git adds a folder rather than converting anything.",
            },
            {
              question: "How does Git know the order of commits without numbering them?",
              answer:
                "Each commit records its parent, so ordering comes from following the chain. This also means history is a graph, not a list, once branches exist.",
            },
            {
              question: "Give a rule for deciding when to make a commit.",
              answer:
                "When you can describe what you did in one sentence with no 'and'. That keeps commits revertible and makes the log readable as a narrative.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "Getting a Git Repository",
              url: "https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository",
              sourceName: "Pro Git",
              editorNote: "Short. Covers init and clone; you need init today and clone on day 7.",
            },
            {
              type: "read",
              title: "Viewing the Commit History",
              url: "https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History",
              sourceName: "Pro Git",
              editorNote:
                "Skim the formatting options and stop. You need --oneline, --graph and --since; the rest is reference for later.",
            },
          ],
        },
        // ── 4 ──────────────────────────────────────────────────────────────
        {
          title: "Writing a commit message someone can use",
          summary:
            "The subject line is an index entry. The body explains why. Both are read far more often than they are written.",
          learningObjectives: [
            "Write a subject line under 50 characters in the imperative mood",
            "Say in a body why a change was made, not what the diff already shows",
            "Recognise a message that will be useless in six months",
          ],
          whyToday:
            "This is the one Git skill that shows in an interview and in a code review, and it costs nothing to learn. It is also the skill most people skip, which is why it is worth a whole day.",
          principle:
            "The diff says what changed. The message exists to say why — and only you, today, know that.",
          commonMistake:
            "Describing the diff. 'Change timeout to 30' is already visible in the change; 'Raise timeout to 30s — the payment gateway p99 is 22s and we were dropping one order in forty' is the commit somebody thanks you for.",
          challenge:
            "Take the five commits from yesterday and rewrite every message with `git commit --amend` or by starting over. Each subject line under 50 characters, imperative mood, and at least one with a body explaining a why that the diff cannot show.",
          challengeMinutes: 25,
          estMinutes: 45,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "Imperative mood",
              detail:
                "'Add retry to the upload' rather than 'Added' or 'Adds'. Git's own generated messages use it, so a merge commit and yours read the same way — and it completes the sentence 'if applied, this commit will…'.",
            },
            {
              title: "Fifty characters, then a blank line",
              detail:
                "Tools truncate the subject at around 50 and treat the first blank line as the boundary between subject and body. Ignore the blank line and your whole message becomes one long subject.",
            },
            {
              title: "The body answers why",
              detail:
                "What was the situation, what alternatives were rejected, what does this break. Wrap at 72 characters so `git log` stays readable in a terminal.",
            },
            {
              title: "Messages are searchable",
              detail:
                "`git log --grep` searches messages. A body that names the symptom is how someone finds this commit when the bug comes back.",
            },
          ],
          checks: [
            {
              question: "Why the imperative mood?",
              answer:
                "It matches the messages Git generates itself, and it completes the sentence 'if applied, this commit will…'. A history in mixed tenses is harder to scan.",
            },
            {
              question: "What belongs in the body rather than the subject?",
              answer:
                "The reasoning — why the change was needed, what was tried instead, and what it affects. The subject is an index entry; the body is the explanation.",
            },
            {
              question: "What is wrong with 'fix bug'?",
              answer:
                "It identifies nothing. Which bug, in what circumstances, fixed how. When it is one of two hundred such messages the history has no value.",
            },
            {
              question: "How would you describe a good commit message to a junior developer?",
              answer:
                "A subject line in the imperative under about 50 characters saying what the change does, a blank line, then a body explaining why it was needed and anything non-obvious about the approach. The test is whether someone debugging this code in a year would find it useful.",
              kind: "interview",
              difficulty: "easy",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "read",
              title: "How to Write a Git Commit Message",
              url: "https://cbea.ms/git-commit/",
              sourceName: "cbea.ms",
              author: "Chris Beams",
              editorNote:
                "The seven rules that became the convention most teams use. Ten minutes, and it is the highest-return ten minutes in this roadmap.",
            },
            {
              type: "doc",
              title: "git-commit reference",
              url: "https://git-scm.com/docs/git-commit",
              sourceName: "Git documentation",
              editorNote:
                "For --amend, which you need for the challenge. Read the warning about amending pushed commits — day 11 is about exactly that.",
            },
          ],
        },
        // ── 5 ──────────────────────────────────────────────────────────────
        {
          title: "Branches are just labels",
          summary:
            "A branch is a pointer at a commit and nothing more. Once that lands, branching stops being frightening.",
          learningObjectives: [
            "Create, switch and delete branches",
            "Say what HEAD is and how it moves",
            "Draw the commit graph for a branch you just made",
          ],
          whyToday:
            "People avoid branches because they sound like copies of the project. They cost nothing — a branch is a 41-byte file containing a commit hash. Knowing that changes how freely you use them.",
          principle:
            "Branching is free. If you are about to try something you might not keep, there is no reason not to branch.",
          commonMistake:
            "Working on the default branch because branching feels like a commitment, then having no clean way to abandon an experiment. The cost of a branch you did not need is deleting one line; the cost of not branching is untangling.",
          challenge:
            "In your repository, branch, make two commits, switch back, and confirm the files revert. Then draw the graph on paper — commits as circles, branch names as labels — and check it against `git log --oneline --graph --all`.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "What a branch is",
              detail:
                "A file in .git/refs/heads containing one commit hash. Creating one writes 41 bytes; it does not copy your project.",
            },
            {
              title: "HEAD",
              detail:
                "A pointer to the branch you are on. Committing moves the branch, and HEAD follows because it points at the branch rather than the commit.",
            },
            {
              title: "switch and checkout",
              detail:
                "`git switch` changes branches and `git restore` discards changes. `git checkout` still does both, which is why it confused everyone for a decade — prefer the newer pair.",
            },
            {
              title: "Detached HEAD",
              detail:
                "Checking out a commit rather than a branch points HEAD straight at a commit. Commits made there belong to no branch and vanish from view when you leave — recoverable via reflog, which is day 10.",
            },
          ],
          checks: [
            {
              question: "How much disk does creating a branch use?",
              answer:
                "Effectively none — one small file holding a commit hash. No files are copied.",
            },
            {
              question: "What does HEAD point at, normally?",
              answer:
                "The branch you have checked out, not the commit directly. That indirection is why committing advances the branch automatically.",
            },
            {
              question: "What is a detached HEAD and why does it matter?",
              answer:
                "HEAD pointing at a commit rather than a branch, which happens when you check out a commit or tag. Commits made there are not on any branch, so switching away leaves them unreferenced and hard to find.",
            },
            {
              question: "Why is branching in Git so much cheaper than in older systems?",
              answer:
                "Because a branch is only a pointer to an existing commit, and commits share unchanged objects. Older centralised systems often copied the tree on the server, so branching had real time and storage cost, which is why their workflows discouraged it.",
              kind: "interview",
              difficulty: "medium",
            },
          ],
          resources: [
            {
              type: "read",
              title: "Branches in a Nutshell",
              url: "https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell",
              sourceName: "Pro Git",
              editorNote:
                "Follow the diagrams commit by commit. This chapter is the reason Pro Git is the standard reference.",
            },
            {
              type: "tool",
              title: "Learn Git Branching — Ramping Up",
              url: "https://learngitbranching.js.org/",
              sourceName: "learngitbranching.js.org",
              editorNote:
                "Levels 1–4 of the main sequence. Watching the graph redraw as you type is worth more than another page of prose.",
            },
          ],
        },
        // ── 6 ──────────────────────────────────────────────────────────────
        {
          title: "Merging, and what a conflict really is",
          summary:
            "A merge combines two lines of work. A conflict is Git declining to guess — it is a question, not an error.",
          learningObjectives: [
            "Merge a branch and read the resulting graph",
            "Cause a conflict on purpose and resolve it",
            "Explain the difference between a fast-forward and a merge commit",
          ],
          whyToday:
            "Conflicts are the moment most beginners panic and delete the repository. Causing one deliberately, in a repository that does not matter, is how you stop being afraid of them.",
          principle:
            "A conflict means two people changed the same lines and Git refuses to invent an answer. Resolving it is your judgement, not a repair.",
          commonMistake:
            "Resolving a conflict by keeping whichever side looks tidier, without reading both. The markers show two intentions; the resolution usually needs to honour both, and sometimes neither version is right on its own.",
          challenge:
            "Create two branches that change the same line of the same file differently. Merge them, read the conflict markers, resolve it into a version that keeps the intent of both, and commit. Then run `git log --graph` and find the merge commit with its two parents.",
          challengeMinutes: 35,
          estMinutes: 55,
          points: 40,
          difficulty: "core",
          topics: [
            {
              title: "Fast-forward",
              detail:
                "When the target branch has not moved, Git just slides the pointer forward. No merge commit is created because there is nothing to combine.",
            },
            {
              title: "Three-way merge",
              detail:
                "When both branches have moved, Git compares both tips against their common ancestor and combines the changes, producing a commit with two parents.",
            },
            {
              title: "Reading conflict markers",
              detail:
                "`<<<<<<< HEAD` is your side, `=======` divides, `>>>>>>> branch` closes the other side. Delete all three markers as part of resolving — a committed marker is a classic and embarrassing bug.",
            },
            {
              title: "Aborting",
              detail:
                "`git merge --abort` returns you to before the merge. Nothing is lost. Knowing this is what makes trying a merge low-risk.",
            },
          ],
          checks: [
            {
              question: "When does a merge NOT create a merge commit?",
              answer:
                "When it can fast-forward — the branch you are merging into has no commits the other lacks, so Git only moves the pointer.",
            },
            {
              question: "What are the three inputs to a three-way merge?",
              answer:
                "The two branch tips and their most recent common ancestor. The ancestor is what lets Git tell a change from a starting state.",
            },
            {
              question: "Is a conflict a sign something went wrong?",
              answer:
                "No. It is Git declining to guess between two deliberate changes to the same lines. The only failure would be resolving it without reading both sides.",
            },
            {
              question: "Two developers rename the same function differently. What happens, and how do you handle it?",
              answer:
                "Git reports a conflict on the overlapping lines. Resolution is a conversation, not a merge tool decision — pick one name, apply it consistently across both sets of changes, make sure the callers each side added are updated, and commit the resolution with a message saying which name was chosen and why.",
              kind: "interview",
              difficulty: "medium",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "read",
              title: "Basic Branching and Merging",
              url: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging",
              sourceName: "Pro Git",
              editorNote:
                "Work through the hotfix scenario with a real repository open. It is the most realistic worked example in the book.",
            },
            {
              type: "doc",
              title: "About merge conflicts",
              url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts",
              sourceName: "GitHub Docs",
              editorNote:
                "The marker syntax explained plainly, and how the same conflict looks in a pull request.",
            },
          ],
        },
      ],
    },

    {
      title: "Collaborating, and getting out of trouble",
      weekRange: "Week 2",
      objective:
        "Work with other people's repositories, read history to answer questions, and undo anything.",
      deliverable:
        "A merged pull request on a public repository, and a written recovery drill you have actually run.",
      estHours: 5,
      nodes: [
        // ── 7 ──────────────────────────────────────────────────────────────
        {
          title: "Remotes, push and pull",
          summary:
            "A remote is a nickname for another copy of the repository. Push and pull move commits between them.",
          learningObjectives: [
            "Clone a repository and identify its remote",
            "Push a branch and set its upstream",
            "Say what fetch does that pull does not",
          ],
          whyToday:
            "Everything so far worked with no network. Today the repository gets a second copy, and almost every confusing message from here on is about the two copies disagreeing.",
          principle:
            "Push and pull move commits between two full repositories. Neither one is the real one; GitHub is central by agreement, not by design.",
          commonMistake:
            "Using `git pull` reflexively and being surprised by a merge commit you did not ask for. Pull is fetch plus merge — `git fetch` then looking at what arrived is the version where you stay in control.",
          challenge:
            "Create a repository on GitHub, push your local work to it, then clone it into a different folder as if you were a second person. Make a commit in the clone, push, and pull it into the original. You now have the whole loop.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "origin is just a name",
              detail:
                "The default nickname a clone gives the place it came from. Nothing is special about it; you can rename it or have several remotes.",
            },
            {
              title: "fetch versus pull",
              detail:
                "`git fetch` downloads commits and updates remote-tracking branches without touching your work. `git pull` does that and immediately merges. Fetch, look, then merge is the habit worth building.",
            },
            {
              title: "Remote-tracking branches",
              detail:
                "`origin/main` is your last-known state of the remote's main. It only moves when you fetch — which is why it can be stale and why status says 'your branch is behind' after somebody else pushes.",
            },
            {
              title: "Upstream",
              detail:
                "`git push -u origin branch` records which remote branch yours corresponds to, so later pushes and pulls need no arguments.",
            },
            {
              title: "Authentication",
              detail:
                "HTTPS with a personal access token, or SSH with a key pair. GitHub stopped accepting account passwords for Git operations in 2021, which is the cause of most first-push failures.",
            },
          ],
          checks: [
            {
              question: "What is the difference between `git fetch` and `git pull`?",
              answer:
                "Fetch downloads new commits and updates remote-tracking branches but leaves your working branch alone. Pull does a fetch and then merges (or rebases) into your current branch.",
            },
            {
              question: "What does `origin/main` represent?",
              answer:
                "Your local record of where main was on the remote the last time you fetched. It is not live — it can be out of date until you fetch again.",
            },
            {
              question: "Why does `git push -u` matter the first time?",
              answer:
                "It sets the upstream, so afterwards `git push` and `git pull` know which remote branch to talk to without you naming it.",
            },
            {
              question:
                "You run `git pull` and get 'divergent branches'. What has happened and what are your options?",
              answer:
                "Your branch and the remote both have commits the other lacks, so Git cannot fast-forward and will not choose for you. Options: merge, producing a merge commit; rebase your commits on top of theirs for a linear history; or fetch and inspect first. On a shared branch prefer merge; on your own feature branch rebase is usually cleaner.",
              kind: "interview",
              difficulty: "medium",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "read",
              title: "Working with Remotes",
              url: "https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes",
              sourceName: "Pro Git",
              editorNote: "Covers add, fetch, push, inspect and rename. All of today, in one page.",
            },
            {
              type: "doc",
              title: "About remote repositories",
              url: "https://docs.github.com/en/get-started/git-basics/about-remote-repositories",
              sourceName: "GitHub Docs",
              editorNote:
                "Read the HTTPS-versus-SSH section before your first push — it is where most people lose an hour.",
            },
          ],
        },
        // ── 8 ──────────────────────────────────────────────────────────────
        {
          title: "Pull requests as a unit of review",
          summary:
            "A pull request is not a Git feature. It is a place to discuss a branch before it becomes part of the main line.",
          learningObjectives: [
            "Fork, branch, push and open a pull request",
            "Write a description that makes review easy",
            "Respond to review comments with commits rather than argument",
          ],
          whyToday:
            "This is the unit of collaboration in nearly every team and every open source project. It is also the artefact a hiring manager can actually look at.",
          principle:
            "A pull request is a request for someone's attention. Its size and its description decide whether that attention is well spent.",
          commonMistake:
            "Opening a 40-file pull request and asking for review. Nobody reviews 40 files; they skim and approve, which is worse than no review. Small pull requests get real scrutiny.",
          challenge:
            "Find a repository with a documentation typo — one of the projects linked in this roadmap will do — fork it, fix the typo on a branch, and open a pull request with a description saying what and why. Whether it is merged is not the point; opening it correctly is.",
          challengeMinutes: 40,
          estMinutes: 55,
          points: 40,
          difficulty: "core",
          topics: [
            {
              title: "Fork versus branch",
              detail:
                "A fork is your own copy of a repository you cannot push to. Inside a team you branch; on someone else's project you fork, branch in the fork, then open the pull request across.",
            },
            {
              title: "What a good description contains",
              detail:
                "What changed, why, how you tested it, and anything you are unsure about. The last one saves the most time — it tells the reviewer where to look.",
            },
            {
              title: "Review is a conversation",
              detail:
                "Comments are questions until proven otherwise. Answering with a commit is faster than answering with a paragraph, and 'good catch' costs nothing.",
            },
            {
              title: "Draft pull requests",
              detail:
                "Open early as a draft to show direction before finishing. It prevents the worst outcome: a week of work in a direction the team did not want.",
            },
          ],
          checks: [
            {
              question: "Is a pull request part of Git?",
              answer:
                "No. Git has no concept of one. It is a feature of hosting platforms built on top of branches and remotes.",
            },
            {
              question: "When do you fork rather than branch?",
              answer:
                "When you do not have push access to the repository — typically an open source project. With push access, branch in place.",
            },
            {
              question: "Why is a small pull request better than a large one?",
              answer:
                "Because it actually gets read. Review quality falls sharply with size, so a large one usually gets approval without scrutiny, which is the opposite of what review is for.",
            },
            {
              question: "How do you keep a long-running feature branch from becoming unmergeable?",
              answer:
                "Bring main into it regularly rather than at the end, so conflicts arrive a few at a time; keep the branch short-lived by splitting the work into several pull requests; and merge behind a flag if the feature is not ready to be visible.",
              kind: "interview",
              difficulty: "medium",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "About pull requests",
              url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests",
              sourceName: "GitHub Docs",
              editorNote: "The mechanics. Read this before the fork guide below, not after.",
            },
            {
              type: "doc",
              title: "Contributing to a project",
              url: "https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project",
              sourceName: "GitHub Docs",
              editorNote:
                "The fork-and-pull-request walkthrough, step by step. This is the challenge, written out.",
            },
            {
              type: "tool",
              title: "GitHub Skills",
              url: "https://skills.github.com/",
              sourceName: "GitHub Skills",
              editorNote:
                "Free interactive courses run inside real repositories. 'Introduction to GitHub' takes about twenty minutes and checks its own work.",
            },
          ],
        },
        // ── 9 ──────────────────────────────────────────────────────────────
        {
          title: "Reading history: log, diff, blame",
          summary:
            "History is only worth keeping if you can question it. Four commands answer nearly everything.",
          learningObjectives: [
            "Find when a line of code changed and who changed it",
            "Search history by message and by content",
            "Use bisect to find the commit that introduced a behaviour",
          ],
          whyToday:
            "Everything so far was about writing history. This is the day it starts paying you back — and it is the difference between a log that is a formality and one that is a debugging tool.",
          principle:
            "You are not looking for who to blame. You are looking for the commit message that explains why the strange line is there.",
          commonMistake:
            "Using blame to find a culprit. Its real use is finding the commit, then reading that commit's message and diff for the reasoning — which is exactly why day 4's message discipline matters.",
          challenge:
            "Clone any public repository with real history. Pick a line in a file, find the commit that introduced it, and read that commit's full message and diff. Then run `git log -S` for a term that appears in the code and see every commit that added or removed it.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "log with filters",
              detail:
                "`--author`, `--since`, `--grep` for the message, and a path at the end to limit to one file. Combining two of these answers most questions in one command.",
            },
            {
              title: "diff, and what you are comparing",
              detail:
                "`git diff` is working directory against index, `--staged` is index against the last commit, and `A..B` compares two commits. Most confusion about diff is comparing the wrong pair.",
            },
            {
              title: "blame",
              detail:
                "Annotates each line with the commit that last touched it. Follow the hash into `git show` — the annotation is a pointer, not the answer.",
            },
            {
              title: "The pickaxe",
              detail:
                "`git log -S'text'` finds commits where the number of occurrences of that string changed. It is the fastest way to find when something appeared or disappeared.",
            },
            {
              title: "bisect",
              detail:
                "Mark a good commit and a bad one, and Git binary-searches between them, asking you to test each midpoint. Twelve steps across four thousand commits.",
            },
          ],
          checks: [
            {
              question: "What does `git log -S'timeout'` find?",
              answer:
                "Commits where the number of occurrences of the string 'timeout' changed — that is, where it was added or removed, rather than every commit that mentions it.",
            },
            {
              question: "What is `git diff` comparing by default?",
              answer:
                "Your working directory against the staging area — the changes you have not staged yet.",
            },
            {
              question: "Roughly how many steps does bisect need over 1,000 commits?",
              answer:
                "About ten, because it halves the range each time. That is the point of it.",
            },
            {
              question:
                "A bug appeared somewhere in the last two months of commits and you cannot reproduce it locally at will. How do you find it?",
              answer:
                "Write a script that exits non-zero when the bug is present, then `git bisect run` it between a known-good and known-bad commit. Automating the test is what makes bisect work for intermittent or slow-to-check bugs.",
              kind: "interview",
              difficulty: "hard",
            },
          ],
          resources: [
            {
              type: "read",
              title: "Viewing the Commit History",
              url: "https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History",
              sourceName: "Pro Git",
              editorNote:
                "Return to this properly today. The limiting-output section is what you skipped on day 3.",
            },
            {
              type: "doc",
              title: "git-bisect reference",
              url: "https://git-scm.com/docs/git-bisect",
              sourceName: "Git documentation",
              editorNote:
                "Read the `bisect run` section. Automating the check is what turns bisect from a curiosity into a tool.",
            },
          ],
        },
        // ── 10 ─────────────────────────────────────────────────────────────
        {
          title: "Undoing things safely",
          summary:
            "restore, revert, reset, and reflog. Which one to reach for depends entirely on whether the work has been shared.",
          learningObjectives: [
            "Choose between restore, revert and reset for a given situation",
            "Recover a commit you thought you had destroyed",
            "Say why revert is the only safe undo on a shared branch",
          ],
          whyToday:
            "The fear of breaking something is what stops people using Git properly. Once you have recovered a 'lost' commit with reflog, that fear goes, and it does not come back.",
          principle:
            "If it has been pushed, undo it with a new commit. If it has not, you may rewrite it. That single line decides every case.",
          commonMistake:
            "Reaching for `git reset --hard` when frightened. It is the one command that genuinely discards uncommitted work with no undo — the committed part is recoverable through reflog, but anything never committed is gone.",
          challenge:
            "Deliberately break your repository three ways and recover each: discard an uncommitted edit, revert a pushed commit, and 'lose' a commit with `git reset --hard` then bring it back with `git reflog`. Write the three commands on a card. That card is the point of today.",
          challengeMinutes: 35,
          estMinutes: 55,
          points: 40,
          difficulty: "core",
          topics: [
            {
              title: "restore",
              detail:
                "`git restore <file>` throws away uncommitted changes to it; `--staged` unstages without touching the file. This is the everyday undo and the only destructive one among them.",
            },
            {
              title: "revert",
              detail:
                "Creates a new commit that undoes an old one. History grows rather than changes, so it is safe on a branch other people have. This is the correct undo for anything pushed.",
            },
            {
              title: "reset --soft, --mixed, --hard",
              detail:
                "Moves the branch pointer back. Soft keeps everything staged, mixed (the default) keeps the files but unstages, hard discards the files too. Only the last one loses work.",
            },
            {
              title: "reflog",
              detail:
                "A local log of everywhere HEAD has been, kept for about 90 days. Almost anything you think you destroyed is listed here with a hash you can check out.",
            },
          ],
          checks: [
            {
              question: "Which undo is safe on a branch other people have pulled, and why?",
              answer:
                "revert. It adds a new commit rather than changing existing ones, so everybody else's history stays valid and nobody has to force-pull.",
            },
            {
              question: "What is the difference between `reset --mixed` and `reset --hard`?",
              answer:
                "Mixed moves the branch pointer and unstages, but leaves your files as they are. Hard also overwrites the files, discarding uncommitted work permanently.",
            },
            {
              question: "You ran `git reset --hard` and lost three commits. Are they gone?",
              answer:
                "Almost certainly not. `git reflog` lists where HEAD has been; find the hash from before the reset and check it out or reset back to it. Only changes that were never committed are truly lost.",
            },
            {
              question: "Explain the difference between revert and reset, and when you would use each.",
              answer:
                "Reset moves the branch pointer, rewriting what the branch contains — fine on local, unshared work. Revert leaves history intact and adds an inverse commit — the only correct choice once others have the commit, because rewriting shared history forces everyone else to repair their clones.",
              kind: "interview",
              difficulty: "medium",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "read",
              title: "Undoing Things",
              url: "https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things",
              sourceName: "Pro Git",
              editorNote:
                "Amend, unstage and discard. Pair it with the reset chapter linked from the bottom of the page.",
            },
            {
              type: "read",
              title: "Dangit, Git!?!",
              url: "https://dangitgit.com/",
              sourceName: "dangitgit.com",
              author: "Katie Sylor-Miller",
              editorNote:
                "Recipes for the specific messes people actually make, each in a few lines. Bookmark it — this is the page you will reopen for years.",
            },
          ],
        },
        // ── 11 ─────────────────────────────────────────────────────────────
        {
          title: "Rewriting history, and when not to",
          summary:
            "Rebase, squash and amend produce a clean history. Used on shared branches they produce a bad afternoon.",
          learningObjectives: [
            "Rebase a feature branch onto an updated main",
            "Squash a messy branch into commits worth reading",
            "State the golden rule of rebasing and why it exists",
          ],
          whyToday:
            "Every team has a convention here and you will be expected to know which one you are in. The commands are easy; the judgement about when they are safe is the actual skill.",
          principle:
            "Rewriting history is rewriting other people's copies of it. Do it only while the history is still only yours.",
          commonMistake:
            "Force-pushing a rebased shared branch, then telling everyone to 'just re-clone'. Their work is now on commits that no longer exist. `--force-with-lease` refuses when someone else has pushed, and should be the only force you ever type.",
          challenge:
            "Make a branch with four scruffy commits — 'wip', 'fix', 'fix again', 'actually fix'. Interactive-rebase them into one or two commits with real messages. Then rebase the branch onto an updated main and read the graph.",
          challengeMinutes: 40,
          estMinutes: 55,
          points: 40,
          difficulty: "stretch",
          topics: [
            {
              title: "What rebase does",
              detail:
                "Replays your commits on top of another commit, creating new commits with new hashes. The old ones are still in the reflog but are no longer on the branch.",
            },
            {
              title: "Interactive rebase",
              detail:
                "`git rebase -i` opens a list you edit: pick, squash, reword, drop, reorder. It is the tool for turning a working session into a readable set of commits.",
            },
            {
              title: "The golden rule",
              detail:
                "Never rebase commits that exist outside your machine. Anyone who pulled them now has commits yours no longer references, and their next pull invents a mess.",
            },
            {
              title: "Merge or rebase",
              detail:
                "Merge preserves what actually happened; rebase produces a history that is easier to read. Teams choose, and the choice is a convention rather than a correctness question.",
            },
            {
              title: "--force-with-lease",
              detail:
                "Refuses the push if the remote moved since you last fetched. Plain --force does not check, which is how somebody else's commits get deleted.",
            },
          ],
          checks: [
            {
              question: "Why do rebased commits have different hashes?",
              answer:
                "Because a commit's hash covers its parent, and rebasing gives every commit a new parent. Same changes, different commits.",
            },
            {
              question: "State the golden rule of rebasing.",
              answer:
                "Do not rebase commits that other people already have. Rewriting shared history invalidates their clones.",
            },
            {
              question: "What does `--force-with-lease` protect against?",
              answer:
                "Overwriting commits somebody else pushed while you were working. It refuses if the remote branch moved since your last fetch, which plain --force will not check.",
            },
            {
              question: "Your team debates merge versus rebase. What is your position?",
              answer:
                "Rebase local, unshared feature branches to keep them linear and readable, then merge into main so the integration point is recorded. Never rebase anything already shared. The important part is that the team picks one convention and the tooling enforces it — a mixed history is worse than either choice.",
              kind: "interview",
              difficulty: "medium",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "read",
              title: "Rebasing",
              url: "https://git-scm.com/book/en/v2/Git-Branching-Rebasing",
              sourceName: "Pro Git",
              editorNote:
                "Read to the end. The 'perils of rebasing' section is the part that matters and it is last.",
            },
            {
              type: "read",
              title: "Rewriting History",
              url: "https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History",
              sourceName: "Pro Git",
              editorNote: "Interactive rebase, squashing and splitting commits — the challenge, explained.",
            },
            {
              type: "read",
              title: "Merging vs Rebasing",
              url: "https://www.atlassian.com/git/tutorials/merging-vs-rebasing",
              sourceName: "Atlassian",
              editorNote:
                "The clearest side-by-side of the two workflows and their trade-offs. Read it for the argument, not the commands.",
            },
          ],
        },
        // ── 12 ─────────────────────────────────────────────────────────────
        {
          title: ".gitignore, secrets, and the repository you can hand over",
          summary:
            "What must never be committed, what to do when it already has been, and the files that make a repository usable by someone else.",
          learningObjectives: [
            "Write a .gitignore that covers your language and editor",
            "Say why deleting a committed secret is not enough",
            "Set up a repository someone else could clone and run",
          ],
          whyToday:
            "Last day, and the one with real-world consequences. A committed API key is a security incident, not a tidiness problem, and it is the single most common Git mistake with a cost attached.",
          principle:
            "History is permanent by design. That is the feature, and it is exactly why a secret must never enter it.",
          commonMistake:
            "Committing a key, then removing it in the next commit and assuming it is gone. It is in history, in every clone, and in every fork. The only correct response is to rotate the credential — treat it as leaked, because it is.",
          challenge:
            "Give your repository a .gitignore appropriate to what is in it, a README that says what the project is and how to run it, and a LICENSE. Then, in a throwaway repository, commit a fake key and practise the response: rotate first, then clean history. Write the order down.",
          challengeMinutes: 35,
          estMinutes: 55,
          points: 40,
          difficulty: "core",
          topics: [
            {
              title: "How .gitignore works",
              detail:
                "Patterns matched against paths, with later rules overriding earlier ones and `!` negating. It only affects untracked files — a file already tracked keeps being tracked no matter what you add.",
            },
            {
              title: "What never goes in",
              detail:
                "Credentials, .env files, build output, dependency folders, and anything large and regenerable. github/gitignore has a maintained template for nearly every language.",
            },
            {
              title: "Untracking something already committed",
              detail:
                "`git rm --cached <file>` stops tracking it while leaving it on disk. It removes the file going forward and does nothing about the history behind it.",
            },
            {
              title: "A leaked secret is leaked",
              detail:
                "Rotate the credential first. Then, if you must, rewrite history with git-filter-repo — but rotation is the fix and history cleaning is tidying, and doing them in the other order wastes the hour that matters.",
            },
            {
              title: "What makes a repository usable",
              detail:
                "A README saying what it is and how to run it, a LICENSE saying what others may do, and a .gitignore that keeps the diff honest. Three files, and their absence is the first thing a reviewer notices.",
            },
          ],
          checks: [
            {
              question: "Why does adding a file to .gitignore not always ignore it?",
              answer:
                "Because .gitignore only applies to untracked files. Anything already tracked stays tracked until you run `git rm --cached` on it.",
            },
            {
              question: "You committed an API key and pushed. What is the first thing you do?",
              answer:
                "Rotate the key. It is in every clone and fork and must be assumed compromised. Cleaning history is a second, optional step and does nothing about copies already taken.",
            },
            {
              question: "Name the three files that make a repository usable by a stranger.",
              answer:
                "README (what it is and how to run it), LICENSE (what they may do with it), and .gitignore (so the diff shows work rather than build output).",
            },
            {
              question: "How would you stop credentials reaching a repository in the first place?",
              answer:
                "Keep them in environment variables loaded from an ignored .env, commit a .env.example with the keys and no values, add secret scanning and a pre-commit hook to the repository, and enable push protection on the host. Prevention is the only reliable control, because after the fact you can only rotate.",
              kind: "interview",
              difficulty: "medium",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "Ignoring files",
              url: "https://docs.github.com/en/get-started/git-basics/ignoring-files",
              sourceName: "GitHub Docs",
              editorNote: "Pattern syntax and the global ignore file for your editor's droppings.",
            },
            {
              type: "tool",
              title: "github/gitignore templates",
              url: "https://github.com/github/gitignore",
              sourceName: "GitHub",
              editorNote:
                "Maintained templates per language. Take the one for your stack rather than writing your own.",
            },
            {
              type: "doc",
              title: "Removing sensitive data from a repository",
              url: "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository",
              sourceName: "GitHub Docs",
              editorNote:
                "Note the order GitHub itself insists on: rotate the credential first, clean history second. Most guides get this backwards.",
            },
          ],
        },
      ],
    },
  ],
};
