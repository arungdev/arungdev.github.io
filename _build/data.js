// Site content. Adding a product means adding an entry to PRODUCTS and
// dropping its screenshots into scratchpad/web — nothing else changes.

const SITE = 'https://arungdev.github.io';
const GH_USER = 'https://github.com/arungdev';

const OWNER = {
  name: 'Arun G',
  handle: 'arungdev',
  kicker: 'Free · Self-hosted · Windows',
  blurb: 'I build self-hosted Windows desktop software — applications that install and run entirely on your own machine, with no account to create and no data leaving it.',
};

const PRODUCTS = [
  {
    slug: 'bankstatementanalytics',
    name: 'Bank Statement Analytics',
    tagline: 'Your bank statements, turned into something you can actually read.',
    summary:
      'Parses HDFC, HDFC Credit Card and IOB statement exports — .txt, .csv and .pdf — into a categorized transaction store, then serves trends, budgets, bills, investments and monthly reports on top of it.',
    status: 'shipped',
    version: '1.0.0',
    platform: 'Windows 10/11 · 64-bit',
    repo: `${GH_USER}/BankStatementAnalytics`,
    releases: `${GH_USER}/BankStatementAnalytics/releases/latest`,
    // Direct link to the installer asset, so the download buttons hand over the
    // .exe instead of dropping the reader on a GitHub release page to hunt for
    // it. The asset filename carries the version, so bump this with `version`.
    installer: `${GH_USER}/BankStatementAnalytics/releases/download/v1.0.0/Bank.Statement.Analytics-Setup-1.0.0.exe`,
    cover: '01-overview',
    accent: '#4F46E5',

    // The three-step story most product sites lead with, told once.
    howItWorks: [
      ['export', 'Export a statement',
       'Download the statement your bank already offers — .txt, .csv or .pdf. No credentials are ever asked for.'],
      ['import', 'Drop it in',
       'Pick the account, drop the file. Duplicates are skipped, so overlapping ranges are safe. Or point it at a folder and forget about it.'],
      ['read', 'See where the money went',
       'Transactions are categorized by merchant on the way in. Trends, budgets, bills and monthly reports follow from there.'],
    ],

    // Concrete, checkable claims rather than "we take privacy seriously".
    trust: [
      ['lock', 'No account to create',
       'You choose a username on first run and it is stored on your machine. There is no sign-up and no server holding it.'],
      ['plug', 'No bank connection',
       'It never asks for net banking credentials and never talks to your bank. It reads files you already have.'],
      ['home', 'Nothing is uploaded',
       'The database and your statements sit in a folder beside the program. Unplug the network and it behaves identically.'],
      ['code', 'Readable source',
       'The code is public. If you would rather not trust a downloaded binary, build it yourself.'],
    ],

    highlights: [
      ['Reads the files your bank already gives you',
       'No screen-scraping, no bank credentials, no third-party aggregator. Export a statement from net banking and drop it in.'],
      ['Everything stays on your machine',
       'The app, the database and the statements all live on your own PC. Nothing is uploaded anywhere.'],
      ['Understands credit cards properly',
       'Billing cycles, minimum due, payment dates and utilisation — modelled separately from savings accounts, because they behave differently.'],
      ['Knows a transfer is not spending',
       'Money moved between your own accounts is detected and excluded from income and spend, so the totals mean something.'],
    ],

    downloads: [
      {
        kind: 'primary',
        label: 'Download for Windows',
        sub: 'Installer · v1.0.0 · 64-bit',
        note: 'Installs to Program Files and registers a background service, so the app is running whenever your PC is. Opens at localhost:5080 from the desktop shortcut. Needs administrator rights to install.',
      },
      {
        kind: 'secondary',
        label: 'Portable build',
        sub: 'ZIP · no installer',
        note: 'Unzip and run the executable directly. Nothing is written outside the folder you extract it to. No service is registered, so the app runs only while the window is open.',
      },
    ],

    requirements: [
      ['Operating system', 'Windows 10 or 11, 64-bit'],
      ['Disk space', 'About 400 MB installed'],
      ['Database', 'None to install — PostgreSQL 18 is bundled and runs embedded'],
      ['Runtime', 'None — the .NET runtime is built into the executable'],
    ],

    // The tour, grouped the way the product groups itself.
    sections: [
      {
        id: 'dashboard', eyebrow: 'Dashboard', title: 'See the whole picture',
        blurb: 'Every figure on these pages is derived from parsed statement rows — nothing is entered by hand.',
        plates: [
          ['01-overview', 'Overview',
           'Income, spend and net flow for the selected account, a six-month cash-flow curve, top merchants by value and a paged activity feed.'],
          ['02-trends', 'Trends',
           'Income against spend over time, switchable between daily, weekly and monthly buckets. Each bar drills through to the transactions behind it.'],
          ['03-insights', 'Spending insights',
           'Spend grouped by category, merchant or tag — bar chart, share donut and a full ranked breakdown that totals to the same number.'],
          ['10-reports', 'Monthly report',
           'A closeable month: opening and closing balance, spend by category, top merchants and deposits — exportable to PDF.'],
        ],
      },
      {
        id: 'activity', eyebrow: 'Activity', title: 'Down to the individual row',
        blurb: 'The ledger, and the entities the app infers from it.',
        plates: [
          ['04-transactions', 'Transactions',
           'The full ledger with date-range, search and category filters, inline recategorization and per-transaction overrides.'],
          ['05-merchants', 'Merchants',
           'Counterparties resolved from raw UPI and narration strings, each with a default category, linked identifiers and lifetime spend. Bulk-editable.'],
          ['06-transfers', 'Transfers',
           'Self-transfers detected by matching a debit in one account to an equal credit in another within a few days — marking a pair removes it from income and spend, so moving your own money never counts as either.'],
        ],
      },
      {
        id: 'planning', eyebrow: 'Planning', title: 'Forward-looking, not just historical',
        blurb: 'Commitments the app tracks against what the statements actually show.',
        plates: [
          ['08-budgets', 'Budgets',
           'Recurring monthly limits per category, measured against real spend in any chosen month. Over-budget states are colour-coded and stated in rupees, not just percentages.'],
          ['07-bills', 'Bills & reminders',
           'Recurring bills with due-soon severity, monthly totals and paid-this-cycle tracking, plus opt-in desktop reminders.'],
          ['09-investments', 'Investments',
           'Recurring and fixed deposits picked out of the statement narration — contributions paid so far, next expected instalment, and matured returns.'],
        ],
      },
      {
        id: 'card', eyebrow: 'Credit card', title: 'Cards get their own model',
        blurb: 'A credit card statement is not a bank statement — billing cycles, a minimum due and a limit have no equivalent in a savings account, so these surfaces exist only for card accounts.',
        plates: [
          ['13-credit-card', 'Card overview',
           'Total and minimum due, payment due date, statement period, reward balance, credit utilisation against the limit, and spend per billing cycle.'],
          ['14-cc-report', 'Card report',
           'The same monthly report shape, re-anchored to the billing cycle rather than the calendar month.'],
        ],
      },
      {
        id: 'import', eyebrow: 'Import & setup', title: 'Getting data in',
        blurb: 'Three banks, four file formats. Parsers are registered per bank and extension, with content-sniffing as a fallback when the pairing is unfamiliar.',
        plates: [
          ['11-upload', 'Upload a statement',
           'Drag-and-drop import for HDFC, HDFC Credit Card and IOB in .txt, .csv and .pdf. Re-uploading is safe — rows are deduplicated on bank reference — and any import can be reverted whole.'],
          ['12-settings', 'Settings',
           'Linked accounts with live balances, category management, reminder and privacy preferences, appearance and profile.'],
          ['00b-onboarding', 'First-run guide',
           'A short guide on first login, reopenable any time from the header.'],
          ['00-login', 'Sign in',
           'Cookie-based auth with lockout after repeated failures. First run creates the admin account.'],
        ],
      },
      {
        id: 'dark', eyebrow: 'Dark mode', title: 'Both themes, equally',
        blurb: 'Themes are token-level — chart colours are read from the same CSS custom properties as the rest of the UI, so plots recolour with the page instead of staying stuck in a light-mode palette.',
        plates: [
          ['15-dark-overview', 'Overview · dark', ''],
          ['16-dark-insights', 'Insights · dark', ''],
          ['17-dark-trends', 'Trends · dark', ''],
        ],
      },
    ],

    stack: ['ASP.NET Core · net10.0', 'React 19 + Vite', 'PostgreSQL', 'NHibernate', 'Chart.js / Recharts', 'PDFsharp'],
  },
];

module.exports = { SITE, GH_USER, OWNER, PRODUCTS };
