/**
 * Linux & the command line — fifteen days, three weeks.
 *
 * The other missing prerequisite. DevOps, backend, data engineering and
 * security all assume a terminal on day one, and none of them teach it.
 * Five days a week at 45–55 minutes.
 *
 * The spine is deliberately hands-on. OverTheWire's Bandit is thirty-four
 * levels that check their own answers — you cannot advance without solving
 * the level, so the practice verifies itself at no build cost to us. The
 * Missing Semester (MIT 6.NULL) supplies the reasoning; man7 supplies the
 * reference; explainshell supplies the thing beginners actually need, which
 * is a way to read a command somebody else wrote.
 *
 * ONE SOURCE DELIBERATELY ABSENT: Linux Journey is a genuinely good free
 * course and it returns 403 to our link checker, which means we cannot
 * verify it resolves and rule 2 says we therefore cannot publish it. Bandit
 * and TLCL cover the same ground and can be checked. Revisit if they ever
 * allow it.
 *
 * TLCL (The Linux Command Line, William Shotts) is free under CC BY-NC-ND
 * and is the book to read alongside this. We link it; we host none of it.
 */
export default {
  slug: "linux-command-line",
  title: "Linux & the command line",
  summary:
    "Fifteen days from your first terminal to writing a script you would put in a cron job — the prerequisite DevOps, backend and data engineering all assume and none of them teach.",
  subjectTags: ["linux", "bash", "shell", "command-line", "scripting", "devops"],
  category: "foundations",
  difficulty: "beginner",
  estimatedWeeks: 3,
  reviewCadence: "annual",
  licenseNote:
    "The Linux Command Line (Shotts) is linked throughout and is CC BY-NC-ND 3.0. We link to it; we host none of it.",
  requires: [
    {
      slug: "git-and-github",
      note: "Not required, but the two are usually learned together and Git assumes a terminal.",
    },
  ],

  modules: [
    {
      title: "Moving around",
      weekRange: "Week 1",
      objective: "Navigate, inspect and manipulate files without a mouse.",
      deliverable: "Bandit levels 0–10 completed, and a written cheat sheet of the commands used.",
      estHours: 4,
      nodes: [
        {
          title: "The shell, and why it is a language",
          summary:
            "A prompt is not a worse file manager. It is a programming language where the verbs are programs.",
          learningObjectives: [
            "Open a terminal and identify the shell you are running",
            "Say what happens between pressing Enter and seeing output",
            "Read a command as a program plus arguments",
          ],
          whyToday:
            "Almost everyone's first hour at a terminal is spent memorising commands, which is why it does not stick. The shell is a language with a small grammar, and the grammar is what makes the commands compose.",
          principle:
            "A command is a program name and a list of arguments. Everything else — pipes, redirects, globs — is the shell rearranging that before the program ever runs.",
          commonMistake:
            "Learning commands as spells. `ls -la` memorised as one thing hides that -l and -a are separate flags you can combine with any others, and that the flags are documented in one place.",
          challenge:
            "Open a terminal, run `echo $SHELL`, and use only `cd`, `ls` and `pwd` to navigate to three places on your machine you can normally reach by clicking. Then run `ls -l` in each and write down what each column means.",
          challengeMinutes: 25,
          estMinutes: 45,
          points: 25,
          difficulty: "intro",
          topics: [
            {
              title: "What the shell does with what you type",
              detail:
                "Splits it into words, expands anything special — variables, globs, quotes — finds the program named by the first word, and runs it with the rest as arguments. Four steps, and every surprise comes from one of them.",
            },
            {
              title: "The prompt",
              detail:
                "Usually user, host and current directory, ending in $ for a normal user or # for root. The # is worth noticing before you type anything.",
            },
            {
              title: "Arguments and flags",
              detail:
                "Short flags take one dash and combine (`-la` is `-l -a`); long flags take two and do not. A flag's meaning belongs to the program, not to the shell.",
            },
            {
              title: "bash, zsh, and which you have",
              detail:
                "Bash is the default nearly everywhere on servers; macOS ships zsh. They differ at the edges and agree on everything in this roadmap.",
            },
          ],
          checks: [
            {
              question: "What are the four things the shell does with a line you type?",
              answer:
                "Splits it into words, expands variables and globs and handles quoting, locates the program named first, and runs it with the remaining words as arguments.",
            },
            {
              question: "Is `-la` one flag or two?",
              answer:
                "Two — short flags combine, so it means `-l -a`. Long flags with two dashes cannot be combined this way.",
            },
            {
              question: "What does a `#` at the end of the prompt usually mean?",
              answer:
                "You are root. Every command runs with full privileges and nothing will ask you to confirm.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "The Missing Semester — the shell",
              url: "https://missing.csail.mit.edu/2020/course-shell/",
              sourceName: "MIT Missing Semester",
              editorNote:
                "MIT's course on the things a CS degree assumes you picked up. Start at the top; the exercises at the bottom are worth doing.",
            },
            {
              type: "read",
              title: "Learning the shell",
              url: "https://linuxcommand.org/lc3_learning_the_shell.php",
              sourceName: "LinuxCommand.org",
              author: "William Shotts",
              editorNote:
                "The gentler companion to the above. Read lesson 1 today; the series runs alongside this whole week.",
            },
          ],
        },
        {
          title: "The filesystem is a tree",
          summary:
            "One root, everything hanging off it. Absolute and relative paths, and what the standard directories are for.",
          learningObjectives: [
            "Move by absolute and relative path without guessing",
            "Say what /etc, /var, /usr, /home and /tmp hold",
            "Find where a program actually lives",
          ],
          whyToday:
            "There are no drive letters. One tree, and knowing which branch holds what turns a server from a maze into a map.",
          principle:
            "Every path is either from the root or from where you are standing. Confusion about a path is almost always confusion about which.",
          commonMistake:
            "Writing paths that only work from one directory. A script with `cd data` in it breaks the moment somebody runs it from elsewhere — the fix is an absolute path or one derived from the script's own location.",
          challenge:
            "Without using `cd`, list the contents of three directories using absolute paths. Then from your home directory, reach `/var/log` using only relative paths and `..`. Finally run `which ls` and `ls -l` on the result.",
          challengeMinutes: 25,
          estMinutes: 45,
          points: 25,
          difficulty: "core",
          topics: [
            {
              title: "One tree from /",
              detail:
                "No drive letters. Additional disks are mounted into the tree at a directory, so a USB stick is a path rather than a separate namespace.",
            },
            {
              title: "Absolute and relative",
              detail:
                "A path starting with / is from the root; anything else is from the current directory. `.` is here, `..` is the parent, `~` is your home.",
            },
            {
              title: "What lives where",
              detail:
                "/etc configuration, /var things that change like logs, /usr installed software, /home users, /tmp scratch cleared on reboot, /opt third-party packages. `man hier` documents all of it.",
            },
            {
              title: "Hidden files",
              detail:
                "A leading dot hides a file from `ls`. Not a security feature — it keeps configuration out of the way. `ls -a` shows them, and most of your home directory turns out to be them.",
            },
            {
              title: "which and type",
              detail:
                "`which ls` shows which file runs; `type ls` also tells you if it is a shell builtin or an alias, which is why the two sometimes disagree.",
            },
          ],
          checks: [
            {
              question: "Where do logs live, and why there?",
              answer:
                "/var/log. /var holds variable data — things that change while the system runs — as distinct from /etc, which holds configuration.",
            },
            {
              question: "What is the difference between `which` and `type`?",
              answer:
                "`which` searches PATH for an executable file. `type` also reports builtins, functions and aliases, so it explains cases where a name is not a file at all.",
            },
            {
              question: "Why does a leading dot hide a file?",
              answer:
                "Convention — `ls` skips entries beginning with a dot unless asked. It keeps configuration out of the way and provides no security whatsoever.",
            },
            {
              question: "A script works when you run it and fails from cron. What do you check?",
              answer:
                "The environment. Cron runs with a minimal PATH and no shell profile, so relative paths break and commands are not found. Use absolute paths, set PATH explicitly in the script, and do not rely on any variable your interactive shell happens to define.",
              kind: "interview",
              difficulty: "medium",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "doc",
              title: "hier(7) — filesystem hierarchy",
              url: "https://man7.org/linux/man-pages/man7/hier.7.html",
              sourceName: "man7.org",
              editorNote:
                "The actual specification of what each top-level directory is for. Skim it; you are learning the shape, not memorising.",
            },
            {
              type: "read",
              title: "The Linux Command Line (free)",
              url: "https://linuxcommand.org/tlcl.php",
              sourceName: "LinuxCommand.org",
              author: "William Shotts",
              editorNote:
                "The whole book, free as a PDF under CC BY-NC-ND. Chapters 2–4 are today and tomorrow. Download it once and keep it.",
            },
          ],
        },
        {
          title: "Creating, copying, moving, deleting",
          summary:
            "mkdir, cp, mv, rm, touch — and the four flags that stop rm being a career event.",
          learningObjectives: [
            "Copy and move files and directories, including recursively",
            "Delete safely and say why there is no undo",
            "Use globs to act on many files at once",
          ],
          whyToday:
            "These five commands are most of what you will ever type. One of them has no undo and no confirmation, which is worth a day of respect.",
          principle:
            "There is no recycle bin. `rm` removes the name; the data is gone as far as you are concerned, immediately and silently.",
          commonMistake:
            "`rm -rf` with a variable or a glob that is not what you think. A space in `rm -rf /some/path /` or an empty `$DIR` in `rm -rf $DIR/*` has ended real systems. Run `ls` with the same arguments first — every time.",
          challenge:
            "In a scratch directory, create a nested structure, copy it recursively, move it, and delete it. Before every `rm`, run `ls` with identical arguments and confirm the list is what you meant. Do that ten times until it is a reflex.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "cp and mv",
              detail:
                "`cp -r` for directories, `-i` to prompt before overwriting, `-a` to preserve permissions and timestamps. `mv` is both move and rename — there is no separate rename command.",
            },
            {
              title: "rm and its absence of mercy",
              detail:
                "No confirmation by default, no recycle bin, and `-r` recurses while `-f` suppresses every complaint. The combination is the most destructive thing you can type.",
            },
            {
              title: "The ls-first habit",
              detail:
                "Run the same glob through `ls` before `rm`. It costs two seconds and it is the only reliable protection the shell offers.",
            },
            {
              title: "Globs",
              detail:
                "`*` any characters, `?` one, `[abc]` one of those, `{a,b}` alternatives. The SHELL expands these before the program runs — which is why `rm *` and `rm '*'` do completely different things.",
            },
            {
              title: "Filenames with spaces",
              detail:
                "Quote them or the shell splits them into separate arguments. `rm My Documents` tries to delete two things, neither of which exists — or worse, one of which does.",
            },
          ],
          checks: [
            {
              question: "Who expands `*`, the shell or the program?",
              answer:
                "The shell, before the program runs. The program receives the resulting list of filenames and never sees the asterisk.",
            },
            {
              question: "Why is `rm -rf $DIR/*` dangerous when DIR is unset?",
              answer:
                "An unset variable expands to nothing, so the command becomes `rm -rf /*`. Quoting does not save you; checking the variable is set does.",
            },
            {
              question: "What single habit most reduces the risk of rm?",
              answer:
                "Running `ls` with exactly the same arguments first and reading the list. It costs two seconds and catches the mistake before it is irreversible.",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "The Missing Semester — shell tools and scripting",
              url: "https://missing.csail.mit.edu/2020/shell-tools/",
              sourceName: "MIT Missing Semester",
              editorNote:
                "Read the first half today — arguments, globbing and quoting. The scripting half is week 3.",
            },
            {
              type: "tool",
              title: "explainshell",
              url: "https://explainshell.com/",
              sourceName: "explainshell.com",
              editorNote:
                "Paste any command and it annotates every flag from the man pages. The single most useful site for a beginner reading somebody else's command.",
            },
          ],
        },
        {
          title: "Reading files without opening them",
          summary: "cat, less, head, tail, wc — and why you never open a 2 GB log in an editor.",
          learningObjectives: [
            "Page through a large file and search inside it",
            "Follow a log as it is written",
            "Count lines, words and bytes",
          ],
          whyToday:
            "On a server there is no double-click, and the files are often too large to load. These five commands are how you actually read anything.",
          principle:
            "Look at the shape before the content. How many lines, what the first few look like, what the last few look like — then decide what to read.",
          commonMistake:
            "`cat` on a huge file, which floods the terminal and can take minutes. `less` pages it, searches it and exits instantly. `cat` is for short files and for piping.",
          challenge:
            "Find the largest log file you can reach. Get its line count, read the first and last twenty lines, search inside it with `less`, and then follow it live with `tail -f` while something writes to it.",
          challengeMinutes: 25,
          estMinutes: 45,
          points: 25,
          difficulty: "core",
          topics: [
            {
              title: "less",
              detail:
                "Pages a file of any size without loading it all. `/` searches, `n` next match, `G` end, `g` start, `q` quit. Also what `man` uses, so the keys transfer.",
            },
            {
              title: "head and tail",
              detail:
                "First or last n lines. `tail -f` follows a file as it grows, which is how you watch a log during a deploy.",
            },
            {
              title: "wc",
              detail:
                "`-l` lines, `-w` words, `-c` bytes. Piping into `wc -l` is the universal 'how many' and you will use it constantly.",
            },
            {
              title: "cat, and what it is for",
              detail:
                "Concatenate. Dumping one short file is a side effect people mistake for its purpose. For anything long, use less.",
            },
            {
              title: "file",
              detail:
                "Reports what a file actually is, by content rather than extension. Run it before opening anything unfamiliar.",
            },
          ],
          checks: [
            {
              question: "Why use less rather than cat on a large file?",
              answer:
                "less pages without loading the whole file, and lets you search and jump. cat writes the entire file to the terminal, which is slow and leaves you at the end with no way back.",
            },
            {
              question: "What does `tail -f` do?",
              answer:
                "Prints the end of a file and then keeps printing as more is written. It is how you watch a log in real time.",
            },
            {
              question: "How do you count the lines in a file?",
              answer:
                "`wc -l file`, or pipe anything into `wc -l` to count the lines it produced.",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "less(1)",
              url: "https://man7.org/linux/man-pages/man1/less.1.html",
              sourceName: "man7.org",
              editorNote:
                "Long. Read the COMMANDS section only — a dozen keys is the whole of what you need.",
            },
            {
              type: "tool",
              title: "tldr pages",
              url: "https://tldr.sh/",
              sourceName: "tldr.sh",
              editorNote:
                "Man pages are reference; tldr is the five examples you actually wanted. Install it and use it alongside man, not instead.",
            },
          ],
        },
        {
          title: "Bandit 0–10: practice that checks itself",
          summary:
            "OverTheWire's wargame. Each level's password is hidden somewhere only the previous lesson lets you reach.",
          learningObjectives: [
            "Connect to a remote machine over SSH",
            "Apply this week's commands against problems with no instructions",
            "Read a man page to solve something rather than to study",
          ],
          whyToday:
            "Everything so far was demonstrated. Bandit gives you problems with a right answer and no walkthrough — you cannot reach level 5 without genuinely having solved level 4.",
          principle:
            "You do not know a command until you have used it to find something you needed. Recognition is not recall.",
          commonMistake:
            "Looking up a walkthrough at the first stuck moment. The stuck moment is the lesson — the level names tell you which command to read about, and the man page has the answer.",
          challenge:
            "Complete Bandit levels 0 to 10. Keep a file of the passwords and, next to each, the command that got it. That file is your real cheat sheet for this week.",
          challengeMinutes: 60,
          estMinutes: 55,
          points: 40,
          difficulty: "core",
          topics: [
            {
              title: "SSH, minimally",
              detail:
                "`ssh user@host -p port` opens a shell on another machine. Bandit's is the first remote machine most people ever use, and it is a safe one.",
            },
            {
              title: "Files that fight back",
              detail:
                "Names with spaces, names beginning with a dash, names that are not text. Each level exists to teach one quoting or flag trick you will meet again.",
            },
            {
              title: "Reading a man page to solve something",
              detail:
                "Open `man find`, search with `/`, find the flag, use it. This is the actual skill — the man page is a tool, not a chapter.",
            },
            {
              title: "When to look something up",
              detail:
                "Stuck fifteen minutes with no new idea, read the man page again. Stuck thirty with the man page open, search the flag name — not the level number.",
            },
          ],
          checks: [
            {
              question: "How do you list a file whose name begins with a dash?",
              answer:
                "Separate options from filenames with `--`, or prefix the path: `cat ./-filename`. Otherwise the shell hands it to the program as a flag.",
            },
            {
              question: "What does `ssh user@host -p 2220` do?",
              answer:
                "Opens a shell session on host as user, connecting to port 2220 rather than the default 22.",
            },
            {
              question: "What should you do before searching for a Bandit solution?",
              answer:
                "Read the man page for the command the level names. The levels are built so the answer is in it.",
            },
          ],
          resources: [
            {
              type: "tool",
              title: "OverTheWire — Bandit",
              url: "https://overthewire.org/wargames/bandit/",
              sourceName: "OverTheWire",
              editorNote:
                "Free, no signup, and it verifies its own answers — you cannot fake progress. Levels 0–10 today; the rest recur in weeks 2 and 3.",
            },
            {
              type: "doc",
              title: "ssh(1)",
              url: "https://man7.org/linux/man-pages/man1/ssh.1.html",
              sourceName: "man7.org",
              editorNote: "You need -p and the user@host form. The rest is week 3.",
            },
          ],
        },
      ],
    },

    {
      title: "Composing tools",
      weekRange: "Week 2",
      objective: "Chain small programs into answers, and search text properly.",
      deliverable: "A one-line pipeline that answers a real question about a real log file.",
      estHours: 4,
      nodes: [
        {
          title: "Streams, pipes and redirection",
          summary:
            "stdin, stdout, stderr. The one idea that makes every command on the system compose with every other.",
          learningObjectives: [
            "Redirect output to a file and append to it",
            "Pipe one command's output into another's input",
            "Redirect errors separately from output",
          ],
          whyToday:
            "This is the day the command line stops being a list of commands and becomes a toolkit. Every powerful one-liner you have ever seen is this idea, repeated.",
          principle:
            "Every program reads a stream and writes two. Connecting them is the entire design of the system.",
          commonMistake:
            "Losing error messages by redirecting only stdout. `cmd > log.txt` sends output to the file and errors to the screen; `cmd > log.txt 2>&1` captures both, and in a cron job the difference is whether you find out it failed.",
          challenge:
            "Build a pipeline that answers a real question about a log file — the ten most frequent values in a column, say. Then run it again capturing both output and errors to a file, and confirm the errors are in there.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "The three streams",
              detail:
                "stdin (0) in, stdout (1) out, stderr (2) errors. They are separate so you can capture results without capturing complaints, and vice versa.",
            },
            {
              title: "Redirection",
              detail:
                "`>` overwrite, `>>` append, `<` read from a file. `>` truncates instantly on running the command — before it produces anything — which is why `sort file > file` empties the file.",
            },
            {
              title: "Pipes",
              detail:
                "`|` connects one program's stdout to the next's stdin. They run concurrently, so a pipeline starts producing before the first stage finishes.",
            },
            {
              title: "Combining streams",
              detail:
                "`2>&1` sends stderr where stdout is currently going — so order matters: `> f 2>&1` works, `2>&1 > f` does not.",
            },
            {
              title: "/dev/null",
              detail:
                "A sink that discards. `2>/dev/null` hides errors — occasionally right, usually a way to stop seeing a problem you still have.",
            },
          ],
          checks: [
            {
              question: "Why does `sort file > file` empty the file?",
              answer:
                "The shell truncates the target before running sort, so sort reads an empty file. Write to a different file, or use a tool with an in-place option.",
            },
            {
              question: "What is the difference between `> f 2>&1` and `2>&1 > f`?",
              answer:
                "The first sends both streams to the file. The second points stderr at wherever stdout goes at that moment — the terminal — and only then redirects stdout, so errors still print.",
            },
            {
              question: "Why are stdout and stderr separate?",
              answer:
                "So a pipeline can pass results on while errors still reach a human. Merging them by default would mean error text contaminating every downstream program's input.",
            },
            {
              question: "Explain what a pipe does at the operating-system level.",
              answer:
                "It creates a kernel buffer with two ends, connects the first process's stdout to the write end and the second's stdin to the read end, and runs both concurrently. The second starts consuming as soon as data appears, and blocks when the buffer is empty.",
              kind: "interview",
              difficulty: "hard",
            },
          ],
          resources: [
            {
              type: "read",
              title: "The Missing Semester — data wrangling",
              url: "https://missing.csail.mit.edu/2020/data-wrangling/",
              sourceName: "MIT Missing Semester",
              editorNote:
                "Pipes used for real work rather than in toy examples. The log-analysis walkthrough is today's challenge, done by somebody else first.",
            },
            {
              type: "read",
              title: "Bash Guide — redirection",
              url: "https://mywiki.wooledge.org/BashGuide",
              sourceName: "Greg's Wiki",
              editorNote:
                "The most technically careful free Bash writing there is. Read the input and output section; the whole guide is worth it eventually.",
            },
          ],
        },
        {
          title: "grep, and searching text properly",
          summary:
            "Find lines matching a pattern. The most used command on any server after ls and cd.",
          learningObjectives: [
            "Search files and directories recursively",
            "Invert, count and show context around matches",
            "Say when to quote a pattern and why",
          ],
          whyToday:
            "Every real question about a log or a codebase starts with grep. Learning six of its flags properly is worth more than learning six new commands.",
          principle:
            "grep answers 'which lines' — no more. Everything else you want is another program, downstream of the pipe.",
          commonMistake:
            "Leaving the pattern unquoted. `grep *.log file` has the shell expand the asterisk into filenames before grep runs, so grep searches for something you never typed. Always quote the pattern.",
          challenge:
            "On a real log, use grep to count errors, show three lines of context around each, exclude a noisy pattern, and list only the filenames containing a match. Four flags, one file, four different questions.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "The flags worth memorising",
              detail:
                "`-i` ignore case, `-v` invert, `-n` line numbers, `-r` recurse, `-c` count, `-l` filenames only, `-C 3` context. That list covers almost everything you will ever need.",
            },
            {
              title: "Quote the pattern",
              detail:
                "The shell expands `*`, `?` and `$` before grep sees them. Single quotes stop it, and the habit prevents an entire class of baffling results.",
            },
            {
              title: "Fixed strings",
              detail:
                "`grep -F` treats the pattern literally. When searching for something containing dots or brackets — an IP address, a version — this is what you want.",
            },
            {
              title: "Recursive search",
              detail:
                "`grep -rn 'thing' .` searches a tree with line numbers. This is how you find where something is defined in a codebase you do not know.",
            },
            {
              title: "grep in a pipeline",
              detail:
                "With no filename it reads stdin, so it filters any other command's output. `ps aux | grep nginx` is the canonical example.",
            },
          ],
          checks: [
            {
              question: "Why quote a grep pattern?",
              answer:
                "Because the shell expands glob characters and variables before grep runs, so an unquoted pattern may become a list of filenames or an empty string.",
            },
            {
              question: "What does `-v` do?",
              answer:
                "Inverts the match — prints lines that do NOT match. Essential for filtering out known noise.",
            },
            {
              question: "When would you use `grep -F`?",
              answer:
                "When the pattern contains regex characters you want taken literally — dots in an IP address, brackets, plus signs.",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "grep(1)",
              url: "https://man7.org/linux/man-pages/man1/grep.1.html",
              sourceName: "man7.org",
              editorNote:
                "Read the OPTIONS section for the seven flags above, then stop. The rest is reference.",
            },
            {
              type: "tool",
              title: "OverTheWire — Bandit levels 11–20",
              url: "https://overthewire.org/wargames/bandit/",
              sourceName: "OverTheWire",
              editorNote:
                "Continue where week 1 stopped. Several of these levels are grep and pipeline problems.",
            },
          ],
        },
        {
          title: "Regular expressions, the useful half",
          summary:
            "Anchors, classes, quantifiers and groups. Twenty minutes of syntax that pays back for a career.",
          learningObjectives: [
            "Write a pattern with anchors and character classes",
            "Use quantifiers without matching more than you meant",
            "Say why greedy matching surprises people",
          ],
          whyToday:
            "Regex appears in grep, sed, editors, log tools, and every programming language you will use. Learning it once here means never learning it again.",
          principle:
            "A regex describes a shape, not a meaning. Test it against something that should NOT match before trusting it.",
          commonMistake:
            "Greedy quantifiers. `<.*>` on `<a><b>` matches the whole string, not the first tag, because `*` takes as much as it can. `<[^>]*>` says what you meant.",
          challenge:
            "Write patterns matching: a line that is only digits, an email-shaped string, a date in DD/MM/YYYY, and a log line whose status code starts with 5. Test each against three strings that should match and three that should not.",
          challengeMinutes: 35,
          estMinutes: 55,
          points: 40,
          difficulty: "stretch",
          topics: [
            {
              title: "Anchors",
              detail:
                "`^` start of line, `$` end. Without them a pattern matches anywhere, which is the commonest reason a regex matches too much.",
            },
            {
              title: "Character classes",
              detail:
                "`[abc]` one of, `[^abc]` not one of, `[a-z]` a range, `.` any character. A negated class is usually the fix for a greedy match.",
            },
            {
              title: "Quantifiers",
              detail:
                "`*` zero or more, `+` one or more, `?` zero or one, `{2,4}` a range. All greedy by default.",
            },
            {
              title: "Groups and alternation",
              detail:
                "`(ab)+` repeats a group; `cat|dog` matches either. Groups also capture, which is how sed and editors do replacements.",
            },
            {
              title: "Basic versus extended",
              detail:
                "Plain grep needs backslashes before `+`, `?`, `(` and `|`. `grep -E` does not. Use -E and stop thinking about it.",
            },
          ],
          checks: [
            {
              question: "Why does `<.*>` match too much?",
              answer:
                "`*` is greedy — it takes as many characters as possible while still allowing a match, so it runs to the last `>` on the line. Use `<[^>]*>` instead.",
            },
            {
              question: "What do `^` and `$` do?",
              answer:
                "Anchor the match to the start and end of a line. Without them the pattern can match anywhere within the line.",
            },
            {
              question: "What does `grep -E` change?",
              answer:
                "Extended syntax — `+`, `?`, `(`, `)` and `|` work without backslashes. Same matching power, far fewer escapes.",
            },
            {
              question: "How would you check a regex is correct before running it on production data?",
              answer:
                "Test it against cases that should match and, more importantly, cases that should not — the failure mode is almost always matching too much. Run it read-only first with grep before using it in a sed replacement, and keep the negative test cases with the script.",
              kind: "interview",
              difficulty: "medium",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "regex(7)",
              url: "https://man7.org/linux/man-pages/man7/regex.7.html",
              sourceName: "man7.org",
              editorNote:
                "The formal definition. Dense, and worth one careful read — everything else about regex is a dialect of this.",
            },
            {
              type: "read",
              title: "Bash Pitfalls",
              url: "https://mywiki.wooledge.org/BashPitfalls",
              sourceName: "Greg's Wiki",
              editorNote:
                "Not regex, but read it this week. Every entry is a mistake you would otherwise make once.",
            },
          ],
        },
        {
          title: "sort, uniq, cut, awk: shaping text",
          summary:
            "The four programs that turn a log into a table and a table into an answer.",
          learningObjectives: [
            "Extract fields from a delimited line",
            "Count occurrences with sort and uniq",
            "Use awk for the ninety percent case without learning awk",
          ],
          whyToday:
            "This completes the toolkit. With grep, these four and a pipe, you can answer almost any question about a text file without writing a program.",
          principle:
            "`sort | uniq -c | sort -rn` is the most useful pipeline in computing. It answers 'what is most common' about anything.",
          commonMistake:
            "`uniq` without sorting first. It only collapses ADJACENT duplicates, so on unsorted input it silently reports almost nothing — and the output looks plausible.",
          challenge:
            "From a log file, produce the ten most frequent values of one field, as a count and a value, sorted descending. One pipeline, no temporary files. Then change which field with a single edit.",
          challengeMinutes: 35,
          estMinutes: 55,
          points: 40,
          difficulty: "stretch",
          topics: [
            {
              title: "cut",
              detail:
                "`cut -d' ' -f3` takes the third space-delimited field. Simple and brittle — it cannot handle repeated delimiters, which is when you reach for awk.",
            },
            {
              title: "sort",
              detail:
                "`-n` numeric, `-r` reverse, `-k2` by the second field, `-u` unique. Default is lexicographic, which is why 10 sorts before 9 without -n.",
            },
            {
              title: "uniq",
              detail:
                "Collapses adjacent duplicates only. `-c` counts, `-d` shows only duplicated lines. Always sort first.",
            },
            {
              title: "awk, the ten percent worth knowing",
              detail:
                "`awk '{print $3}'` prints the third field, splitting on any whitespace. `awk '$5 > 100'` filters. That is most of what anyone uses awk for.",
            },
            {
              title: "The canonical pipeline",
              detail:
                "`... | sort | uniq -c | sort -rn | head` — group, count, rank, truncate. Learn it as one unit; you will type it weekly.",
            },
          ],
          checks: [
            {
              question: "Why must you sort before uniq?",
              answer:
                "uniq only collapses adjacent identical lines. On unsorted input most duplicates are not adjacent, so it reports far fewer than exist — with no error.",
            },
            {
              question: "Why does sort put 10 before 9?",
              answer:
                "It sorts lexicographically by default, and '1' precedes '9'. `-n` sorts numerically.",
            },
            {
              question: "When is awk better than cut?",
              answer:
                "When fields are separated by runs of whitespace, when you need a condition, or when you want to compute something. cut cannot do any of those.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "The Missing Semester — data wrangling",
              url: "https://missing.csail.mit.edu/2020/data-wrangling/",
              sourceName: "MIT Missing Semester",
              editorNote:
                "Return to it now that you have grep and regex. The sed and awk sections make sense on a second pass.",
            },
            {
              type: "read",
              title: "Sed — an introduction and tutorial",
              url: "https://www.grymoire.com/Unix/Sed.html",
              sourceName: "The Grymoire",
              author: "Bruce Barnett",
              editorNote:
                "Long and old and still the best free sed writing there is. Read the substitution section; leave the rest until you need it.",
            },
          ],
        },
        {
          title: "Permissions, users and sudo",
          summary:
            "Who can read, write and execute what. The model is small, and it explains most 'permission denied'.",
          learningObjectives: [
            "Read the ten characters at the start of `ls -l`",
            "Change permissions with both symbolic and numeric modes",
            "Say what sudo does and why 777 is not a fix",
          ],
          whyToday:
            "Permission denied is the most common error on a shared machine, and the model behind it takes half an hour to learn properly instead of guessing at chmod numbers forever.",
          principle:
            "Permissions are three sets of three: owner, group, everyone else. Every chmod is a statement about which of those nine bits you mean.",
          commonMistake:
            "`chmod 777` to make an error go away. It grants write to every user on the machine, it is the wrong fix for a problem that was almost certainly ownership, and on a web server it is a genuine vulnerability.",
          challenge:
            "Create a file and, using only chmod, produce five specific permission states — including one where you can execute but not read it. Predict each `ls -l` string before running it, and check.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "Reading ls -l",
              detail:
                "Ten characters: type, then rwx for owner, group and other. `-rw-r--r--` is a file the owner can read and write and everyone else can only read.",
            },
            {
              title: "Numeric mode",
              detail:
                "r=4, w=2, x=1, added per set. 755 is rwxr-xr-x, 644 is rw-r--r--. Those two cover most of what you will set.",
            },
            {
              title: "Symbolic mode",
              detail:
                "`chmod u+x`, `chmod go-w`. Clearer than numbers for a change, because it says what you are adding rather than restating everything.",
            },
            {
              title: "x on a directory is different",
              detail:
                "On a file it means executable; on a directory it means you may enter it. A directory with r but not x lists but does not open, which is a confusing and common state.",
            },
            {
              title: "sudo",
              detail:
                "Runs one command as another user, usually root, with the action logged. Preferable to logging in as root because the log records who did what.",
            },
          ],
          checks: [
            {
              question: "What is 644 in symbolic terms?",
              answer:
                "rw-r--r-- — owner reads and writes, group and others read only.",
            },
            {
              question: "What does the execute bit mean on a directory?",
              answer:
                "Permission to enter it and access things inside. Without it you can list the names (with r) but cannot open anything.",
            },
            {
              question: "Why is chmod 777 the wrong fix?",
              answer:
                "It grants write access to every user on the system. The real problem is nearly always ownership or a missing execute bit, and 777 on a web-served directory is a security hole.",
            },
            {
              question: "A deploy fails with permission denied writing to /var/www. How do you diagnose it?",
              answer:
                "Check which user the process runs as, then `ls -ld` the directory to see its owner, group and mode, and check every parent directory for the execute bit. Fix by ownership or group membership — chown or adding the service user to the right group — not by widening the mode.",
              kind: "interview",
              difficulty: "medium",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "doc",
              title: "chmod(1)",
              url: "https://man7.org/linux/man-pages/man1/chmod.1.html",
              sourceName: "man7.org",
              editorNote:
                "Read the symbolic-mode grammar. The numeric mode is easy; the symbolic one is what you will actually type.",
            },
            {
              type: "read",
              title: "The Linux Command Line — permissions",
              url: "https://linuxcommand.org/tlcl.php",
              sourceName: "LinuxCommand.org",
              author: "William Shotts",
              editorNote: "Chapter 9 of the free PDF. The clearest treatment of the model.",
            },
          ],
        },
      ],
    },

    {
      title: "Making it repeatable",
      weekRange: "Week 3",
      objective: "Turn what you type into scripts that run without you.",
      deliverable: "A working script with argument handling and error checking, scheduled to run.",
      estHours: 4,
      nodes: [
        {
          title: "Processes, jobs and what is using the machine",
          summary: "ps, top, kill, and running things in the background.",
          learningObjectives: [
            "Find what is running and what it is consuming",
            "Stop a process properly, and forcibly when it will not stop",
            "Run something in the background and bring it back",
          ],
          whyToday:
            "The first question on a slow or unresponsive machine is what is running. These commands answer it, and the signal model explains why some things refuse to die.",
          principle:
            "Ask a process to stop before you make it. SIGTERM lets it close files and finish writing; SIGKILL does not, and that is how data gets corrupted.",
          commonMistake:
            "`kill -9` as the first move. It is SIGKILL, which the process cannot catch, so it cannot flush buffers, close files or release locks. Try plain `kill` and wait a few seconds first.",
          challenge:
            "Start a long-running command, suspend it with Ctrl+Z, background it with `bg`, find it with `ps` and `jobs`, foreground it with `fg`, and finally stop it with a plain `kill`. Then start another and watch it in `top`.",
          challengeMinutes: 30,
          estMinutes: 50,
          points: 30,
          difficulty: "core",
          topics: [
            {
              title: "ps and top",
              detail:
                "`ps aux` is a snapshot of everything; `top` (or htop) updates live and sorts by CPU or memory. Snapshot for scripting, live for diagnosing.",
            },
            {
              title: "PIDs and signals",
              detail:
                "Every process has a number. `kill PID` sends SIGTERM — a polite request. `kill -9` sends SIGKILL, which the kernel executes with no chance for cleanup.",
            },
            {
              title: "Foreground, background and jobs",
              detail:
                "Ctrl+Z suspends, `bg` resumes in the background, `fg` brings it back, `jobs` lists them. Ctrl+C sends SIGINT, which is a request to stop, not a guarantee.",
            },
            {
              title: "nohup and the closed terminal",
              detail:
                "Closing a terminal usually kills what it started. `nohup cmd &` detaches it — the reason a long job survives your ssh session dropping.",
            },
            {
              title: "Finding the culprit",
              detail:
                "`ps aux --sort=-%mem | head` for memory, `-%cpu` for processor, `df -h` for disk. Three commands answer most 'the server is slow' questions.",
            },
          ],
          checks: [
            {
              question: "What is the difference between `kill` and `kill -9`?",
              answer:
                "Plain kill sends SIGTERM, which the process can catch and handle — closing files, finishing writes. -9 sends SIGKILL, which cannot be caught, so no cleanup happens.",
            },
            {
              question: "What does Ctrl+Z do?",
              answer:
                "Suspends the foreground process and returns you to the prompt. It is still there — `jobs` lists it, `fg` resumes it.",
            },
            {
              question: "Why would you use nohup?",
              answer:
                "So a long-running command survives the terminal closing or the SSH session dropping.",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "ps(1)",
              url: "https://man7.org/linux/man-pages/man1/ps.1.html",
              sourceName: "man7.org",
              editorNote:
                "Notoriously dense because ps accepts three different option syntaxes. You need `aux` and `--sort`; ignore the rest.",
            },
            {
              type: "tool",
              title: "OverTheWire — Bandit levels 21–26",
              url: "https://overthewire.org/wargames/bandit/",
              sourceName: "OverTheWire",
              editorNote:
                "These levels involve cron and background processes, which is exactly this week. Do them alongside day 14.",
            },
          ],
        },
        {
          title: "Your first shell script",
          summary:
            "A file of commands, a shebang, and an execute bit. Then variables, conditions and loops.",
          learningObjectives: [
            "Write and run an executable script",
            "Use variables, a conditional and a loop",
            "Take arguments from the command line",
          ],
          whyToday:
            "Anything you have typed twice should be a script. This is where the last two weeks stop being interactive and start being automation.",
          principle:
            "A script is the commands you already type, in a file, with a name. Start by pasting what worked — do not start by designing.",
          commonMistake:
            "Unquoted variables. `if [ $name = \"x\" ]` breaks when name is empty or contains a space, because the shell removes it before the test runs and the syntax collapses. Quote every expansion: `\"$name\"`.",
          challenge:
            "Write a script that takes a directory as an argument, refuses to run without one, loops over the files in it, and prints each name with its line count. Run it on three directories including one that does not exist.",
          challengeMinutes: 40,
          estMinutes: 55,
          points: 40,
          difficulty: "core",
          topics: [
            {
              title: "Shebang and the execute bit",
              detail:
                "`#!/usr/bin/env bash` on line one, then `chmod +x`. Without the execute bit you get permission denied; without the shebang the shell guesses.",
            },
            {
              title: "Variables and quoting",
              detail:
                "`name=value` with no spaces around the `=`, read back as `\"$name\"`. The quotes are not optional — unquoted expansion is the single largest source of shell bugs.",
            },
            {
              title: "Arguments",
              detail:
                "`$1`, `$2` positionally, `$#` how many, `\"$@\"` all of them safely. `\"$@\"` with the quotes preserves arguments containing spaces; `$*` does not.",
            },
            {
              title: "Conditionals",
              detail:
                "`if [ -f \"$file\" ]; then ... fi`. `-f` exists as a file, `-d` a directory, `-z` empty string. In bash, `[[ ]]` is safer than `[ ]` and should be preferred.",
            },
            {
              title: "Loops",
              detail:
                "`for f in *.txt; do ... done`. Loop over the glob directly rather than over the output of `ls` — filenames with spaces break the second.",
            },
          ],
          checks: [
            {
              question: "Why quote every variable expansion?",
              answer:
                "Unquoted, the shell splits the value on whitespace and expands globs in it. An empty variable disappears entirely, which usually turns a valid command into a syntax error or something worse.",
            },
            {
              question: "What does the shebang do?",
              answer:
                "Tells the kernel which interpreter to run the file with. `#!/usr/bin/env bash` finds bash on PATH rather than assuming a location.",
            },
            {
              question: "Why loop over a glob rather than over `ls` output?",
              answer:
                "Because the shell splits ls's output on whitespace, so filenames containing spaces become several loop iterations. A glob produces the filenames directly.",
            },
          ],
          resources: [
            {
              type: "read",
              title: "Writing shell scripts",
              url: "https://linuxcommand.org/lc3_writing_shell_scripts.php",
              sourceName: "LinuxCommand.org",
              author: "William Shotts",
              editorNote:
                "A proper course rather than a cheat sheet. Lessons 1–6 are today and tomorrow.",
            },
            {
              type: "tool",
              title: "ShellCheck",
              url: "https://www.shellcheck.net/",
              sourceName: "ShellCheck",
              editorNote:
                "Paste any script and it finds the quoting bugs. Run everything you write through it — it will teach you more than any tutorial.",
            },
          ],
        },
        {
          title: "Scripts that fail properly",
          summary:
            "Exit codes, set -euo pipefail, and messages that say what went wrong.",
          learningObjectives: [
            "Read and set exit codes",
            "Make a script stop at the first failure",
            "Write errors to stderr with a useful message",
          ],
          whyToday:
            "A script that fails silently and carries on is worse than no script. Three lines at the top turn a fragile one into a safe one.",
          principle:
            "By default a shell script ignores failure and keeps going. That default is wrong for almost everything you will write.",
          commonMistake:
            "Assuming a command worked. Without `set -e`, a failed `cd` is followed by the rest of the script running in the wrong directory — and the next line might be an `rm`.",
          challenge:
            "Take yesterday's script and harden it: `set -euo pipefail`, an argument check that exits non-zero with a usage message on stderr, and a trap that cleans up its temporary file. Then make it fail on purpose and confirm it stops where you expect.",
          challengeMinutes: 35,
          estMinutes: 55,
          points: 40,
          difficulty: "stretch",
          topics: [
            {
              title: "Exit codes",
              detail:
                "0 is success, anything else is failure. `$?` holds the last one. Your script's own exit code is what cron, CI and any caller will act on.",
            },
            {
              title: "set -e, -u, -o pipefail",
              detail:
                "-e stop on error, -u error on an undefined variable, -o pipefail make a pipeline fail if any stage does. Together they are the standard first line of any serious script.",
            },
            {
              title: "Errors go to stderr",
              detail:
                "`echo \"message\" >&2`. An error on stdout ends up in whatever file the output was redirected to, where nobody sees it.",
            },
            {
              title: "trap for cleanup",
              detail:
                "`trap 'rm -f \"$tmp\"' EXIT` removes a temporary file however the script ends — success, failure or interruption.",
            },
            {
              title: "Where set -e does not save you",
              detail:
                "It does not fire inside conditions, in a command followed by ||, or in most subshell cases. Knowing its limits is part of relying on it.",
            },
          ],
          checks: [
            {
              question: "What does `set -u` catch?",
              answer:
                "Use of an undefined variable, which otherwise expands to an empty string silently — the cause of `rm -rf $DIR/*` becoming `rm -rf /*`.",
            },
            {
              question: "Why does a pipeline need `pipefail`?",
              answer:
                "Because a pipeline's exit code is normally the last command's. Without pipefail, a failure in an earlier stage is invisible if the last stage succeeds.",
            },
            {
              question: "Where should an error message go, and why?",
              answer:
                "stderr, with `>&2`. On stdout it contaminates the script's real output and disappears into any redirect.",
            },
            {
              question: "What do you put at the top of every shell script you write?",
              answer:
                "A shebang, then `set -euo pipefail`, and usually an IFS setting. Then argument validation that exits non-zero with a usage message on stderr. The default shell behaviour — carry on after failure, treat unset variables as empty — is wrong for anything automated.",
              kind: "interview",
              difficulty: "medium",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "read",
              title: "Bash Pitfalls",
              url: "https://mywiki.wooledge.org/BashPitfalls",
              sourceName: "Greg's Wiki",
              editorNote:
                "Read it properly today. Every numbered entry is a specific bug with an explanation — the highest-density shell writing there is.",
            },
            {
              type: "doc",
              title: "bash(1)",
              url: "https://man7.org/linux/man-pages/man1/bash.1.html",
              sourceName: "man7.org",
              editorNote:
                "Search it for `set` and read the option list. Enormous, and you only ever need one section at a time.",
            },
          ],
        },
        {
          title: "cron, and things that run without you",
          summary:
            "Schedule a script. Then discover the four ways cron differs from your terminal.",
          learningObjectives: [
            "Read and write a crontab entry",
            "Explain why a script that works interactively fails under cron",
            "Capture output so a silent failure is visible",
          ],
          whyToday:
            "This is where automation becomes real, and it is where the environment problem from week 1 collects its debt. Nearly every 'works for me' cron bug is the same bug.",
          principle:
            "Cron runs your script in a stranger's environment: no profile, a minimal PATH, a different working directory, and nobody watching the output.",
          commonMistake:
            "Assuming your PATH exists. Cron's is tiny, so a command that works in your terminal is not found — and because nobody reads cron's mail, the job silently does nothing for months.",
          challenge:
            "Schedule a script to run every minute, writing a timestamp and its full environment to a file. Compare that environment with your interactive one. Then fix the script so it works under both, and change the schedule to something sane.",
          challengeMinutes: 35,
          estMinutes: 50,
          points: 40,
          difficulty: "stretch",
          topics: [
            {
              title: "The five fields",
              detail:
                "Minute, hour, day of month, month, day of week. `*/5 * * * *` is every five minutes. Write the schedule as a comment above the line in English — everyone misreads these.",
            },
            {
              title: "The environment is not yours",
              detail:
                "No .bashrc, no .profile, a PATH of about two directories, and HOME may differ. Set PATH explicitly at the top of the crontab or use absolute paths throughout.",
            },
            {
              title: "The working directory",
              detail:
                "Usually the user's home, not where the script lives. Any relative path in the script is relative to somewhere you did not choose.",
            },
            {
              title: "Output disappears",
              detail:
                "Cron mails output to the local user, which on most systems nobody reads. Redirect explicitly: `>> /var/log/mine.log 2>&1`, or the job is unmonitored.",
            },
            {
              title: "Overlapping runs",
              detail:
                "Cron starts a job on schedule whether or not the last one finished. A slow job scheduled every minute eventually runs forty copies. Use a lock file — `flock` is built for this.",
            },
          ],
          checks: [
            {
              question: "Why does a working script fail under cron?",
              answer:
                "Different environment: minimal PATH, no shell profile, a different working directory, and often a different HOME. The script relied on something your interactive shell provided.",
            },
            {
              question: "Where does cron output go by default?",
              answer:
                "Emailed to the local user, which on most systems nobody ever reads. Redirect it to a log file explicitly.",
            },
            {
              question: "What happens if a cron job takes longer than its interval?",
              answer:
                "Cron starts the next one anyway, so copies overlap and accumulate. Guard with a lock file, for instance with flock.",
            },
          ],
          resources: [
            {
              type: "doc",
              title: "crontab(5)",
              url: "https://man7.org/linux/man-pages/man5/crontab.5.html",
              sourceName: "man7.org",
              editorNote:
                "The file format, including the special strings like @daily and the environment variables cron does set.",
            },
            {
              type: "tool",
              title: "explainshell",
              url: "https://explainshell.com/",
              sourceName: "explainshell.com",
              editorNote:
                "Useful again today for reading the redirection in somebody else's crontab line.",
            },
          ],
        },
        {
          title: "SSH, keys, and working on a machine that is not yours",
          summary:
            "Key pairs instead of passwords, copying files across, and keeping a session alive.",
          learningObjectives: [
            "Generate a key pair and install the public half on a server",
            "Copy files in both directions with scp or rsync",
            "Keep a long job running after your connection drops",
          ],
          whyToday:
            "Last day, and the one that ties the roadmap to real work. Everything you have learned runs on machines you reach this way.",
          principle:
            "The private key never leaves your machine. Anything that asks you to upload it is either mistaken or hostile.",
          commonMistake:
            "Copying the private key to the server. Only the public half goes there — into `~/.ssh/authorized_keys`. The private one stays with you, and if it ever leaves, it is compromised.",
          challenge:
            "Generate a key pair, install the public key on any server you control — a free tier VM, a Raspberry Pi, or a container — and log in without a password. Then rsync a directory both ways and start a long job that survives you disconnecting.",
          challengeMinutes: 40,
          estMinutes: 55,
          points: 40,
          difficulty: "stretch",
          topics: [
            {
              title: "Key pairs",
              detail:
                "`ssh-keygen -t ed25519`. The public half goes in the server's authorized_keys; the private half stays on your machine, ideally with a passphrase.",
            },
            {
              title: "The config file",
              detail:
                "`~/.ssh/config` gives a host a nickname with its user, port and key. `ssh prod` instead of a long line, and it is where team documentation of hosts actually lives.",
            },
            {
              title: "scp and rsync",
              detail:
                "scp copies; rsync copies only what differs and can resume. For anything more than one file, rsync — and `-n` to dry-run first.",
            },
            {
              title: "tmux",
              detail:
                "A session that persists on the server. Detach, disconnect, reconnect later and it is still running. The reliable answer to a dropped connection during a long job.",
            },
            {
              title: "Permissions on .ssh",
              detail:
                "SSH refuses to use keys that others can read — 700 on the directory, 600 on the private key. A silent failure to authenticate is very often this.",
            },
          ],
          checks: [
            {
              question: "Which half of the key pair goes on the server?",
              answer:
                "The public half, appended to `~/.ssh/authorized_keys`. The private key never leaves your machine.",
            },
            {
              question: "When is rsync better than scp?",
              answer:
                "For directories, repeated transfers, or anything large — it copies only differences and can resume after an interruption.",
            },
            {
              question: "Key authentication fails with no obvious error. What do you check?",
              answer:
                "Permissions: 700 on ~/.ssh and 600 on the private key. SSH silently refuses keys that are readable by others.",
            },
            {
              question: "How would you set up secure access to a new server for a small team?",
              answer:
                "Key-based authentication only, with password authentication and direct root login disabled in sshd_config. Each person's own key in their own account, sudo for privilege with logging, a non-default port only if it buys something, and a firewall limiting the source range. Never a shared account or a shared key — the audit trail is the point.",
              kind: "interview",
              difficulty: "hard",
              askedInInterviews: true,
            },
          ],
          resources: [
            {
              type: "doc",
              title: "Generating a new SSH key",
              url: "https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent",
              sourceName: "GitHub Docs",
              editorNote:
                "The clearest per-platform walkthrough, and it is the same procedure for any server — not just GitHub.",
            },
            {
              type: "doc",
              title: "ssh(1)",
              url: "https://man7.org/linux/man-pages/man1/ssh.1.html",
              sourceName: "man7.org",
              editorNote: "Read the section on the config file. It is the part that saves the most typing.",
            },
            {
              type: "read",
              title: "The Missing Semester — command-line environment",
              url: "https://missing.csail.mit.edu/2020/command-line/",
              sourceName: "MIT Missing Semester",
              editorNote:
                "Covers SSH, tmux and job control together, which is exactly the last two days. Finish the roadmap here.",
            },
          ],
        },
      ],
    },
  ],
};
