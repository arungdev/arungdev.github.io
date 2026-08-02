// Long-form page content. Every statement here is taken from the shipped
// behaviour (installer config, API download guides, onboarding guide, watch
// folder service) rather than written as marketing copy.

const DOCS = {
  slug: 'docs',
  eyebrow: 'Documentation',
  title: 'Install it, feed it statements, read the results',
  lede: 'Everything needed to get Bank Statement Analytics running and importing. Written against v1.0.0.',
  sections: [
    {
      id: 'install', heading: 'Install',
      blocks: [
        { p: 'Download the installer from the releases page and run it. It installs machine-wide under Program Files, so Windows will ask for administrator rights.' },
        { steps: [
          'Run the downloaded setup file.',
          'Windows SmartScreen may warn that the publisher is unrecognised — the build is not code-signed. Choose "More info", then "Run anyway".',
          'Accept the install location, or change it.',
          'Setup registers a background service and finishes.',
        ] },
        { p: 'A desktop shortcut is created. It opens your browser at the address the service listens on rather than launching an executable, because the app is a local web application.' },
        { callout: ['Where it runs', 'http://localhost:5080 — the shortcut, the Start menu entry and any bookmark all point here.'] },
        { h3: 'Portable instead' },
        { p: 'The portable build is the same application without the installer. Unzip it and run the executable directly. Nothing is written outside the folder you extracted it to, no service is registered, and the app runs only while the window is open.' },
      ],
    },
    {
      id: 'first-run', heading: 'First run',
      blocks: [
        { p: 'The first time you open the app it asks you to create an administrator account. That username and password are stored locally — there is no sign-up, no email verification and no remote account.' },
        { p: 'A short guide opens automatically on first login. You can reopen it any time from the ? button in the page header.' },
        { callout: ['Forgot the password?', 'There is no reset email — nothing leaves the machine. Additional users can be created under Settings → Profile while you are signed in, so add a second admin if you want a way back in.'] },
      ],
    },
    {
      id: 'accounts', heading: 'Add an account',
      blocks: [
        { p: 'Everything starts with an account — one for each bank account or credit card you want to track. Use the "+ Add" button in the account filter, or Settings → Accounts.' },
        { p: 'Supported banks are HDFC, HDFC Credit Card and IOB. Credit cards additionally take a credit limit and a statement day, which drive the utilisation meter and the billing-cycle view.' },
      ],
    },
    {
      id: 'export', heading: 'Export a statement from your bank',
      blocks: [
        { p: 'The app reads the files your bank already provides. It never asks for your net banking credentials and never connects to your bank.' },
        { h3: 'HDFC Bank — .txt or .pdf' },
        { steps: [
          'Log in to HDFC NetBanking.',
          'Go to Accounts → Enquire → Statement of Account (or "Download Historical Transactions").',
          'Pick the account and the date range you want.',
          'Choose the "Delimited (.txt)" file type and download.',
          'Or upload the monthly e-statement PDF emailed by the bank — enter its PDF password if it is protected.',
        ] },
        { h3: 'HDFC Credit Card — .csv or .pdf' },
        { steps: [
          'Log in to HDFC NetBanking.',
          'Go to Cards → Credit Cards → View / Download Statement.',
          'Select the card and billing period.',
          'Download the statement in CSV format.',
          'Or upload the monthly e-statement PDF emailed by the bank — enter its PDF password if it is protected.',
        ] },
        { h3: 'Indian Overseas Bank — .txt or .pdf' },
        { steps: [
          'Log in to IOB NetBanking.',
          'Go to Account Statement / Statement of Account.',
          'Select the account and the period you want.',
          'Download / export the statement as a text (.txt) file.',
          'Or upload the e-statement PDF — enter its PDF password if it is protected.',
        ] },
      ],
    },
    {
      id: 'upload', heading: 'Upload it',
      blocks: [
        { p: 'Open the Upload page, pick the account, and drop the file in. The page shows which formats the selected bank accepts, and links to the same export steps listed above.' },
        { list: [
          'Password-protected PDFs work — you are prompted for the password.',
          'Duplicates are skipped automatically, so re-uploading an overlapping date range is safe.',
          'Every import is listed in Upload History with the number of transactions it added.',
          'Revert removes that import completely — its transactions and the stored file.',
        ] },
      ],
    },
    {
      id: 'auto-import', heading: 'Import without lifting a finger',
      blocks: [
        { p: 'Under Settings → Accounts, each account can watch a folder. Point it at wherever your browser saves statements and new files are imported on their own.' },
        { list: [
          'The folder is swept about once a minute, so a file dropped while the machine was off is still picked up on the next start.',
          'Files already imported, recognised as duplicates or failed are remembered and not retried, unless you edit the file or restart the service.',
          'A statement password can be saved per account so protected PDFs import unattended.',
          '"Import now" runs a sweep immediately instead of waiting for the interval.',
          'Anything that fails is reported in the notification bell in the header.',
        ] },
      ],
    },
    {
      id: 'categorize', heading: 'Review and categorize',
      blocks: [
        { p: 'Imported transactions are categorized automatically by merchant. The counterparty is resolved out of the raw UPI string or narration, and each merchant carries a default category.' },
        { list: [
          'Transactions — filter by date, re-categorize, add tags and notes.',
          'Merchants — rename, merge duplicates, bulk-categorize, set default categories.',
          'A category set on a single transaction always wins over the merchant default.',
        ] },
        { h3: 'Transfers' },
        { p: 'When a debit in one of your accounts matches an equal credit in another within a few days, the app proposes it as a transfer. Confirming the pair removes both sides from income and spending — you moved your own money, you did not earn or spend it. This is what keeps the totals meaningful once you hold more than one account.' },
      ],
    },
    {
      id: 'planning', heading: 'Budgets, bills and deposits',
      blocks: [
        { list: [
          'Budgets — a monthly limit per category. Set once, applied to every month, measured against real spend in whichever month you select.',
          'Bills — recurring bills with due dates and reminders, including credit-card bills. Opt in to desktop notifications under Settings → Reminders.',
          'Investments — recurring and fixed deposits picked out of the statement narration, with contributions paid so far and maturity dates.',
        ] },
      ],
    },
    {
      id: 'reports', heading: 'Reports',
      blocks: [
        { p: 'Reports closes off a month or a year: opening and closing balance, spend by category, top merchants, and deposits. Download PDF exports the same report as a document.' },
        { p: 'For a credit card the report is anchored to the billing cycle rather than the calendar month, because that is the period the card actually settles on.' },
      ],
    },
    {
      id: 'privacy', heading: 'Privacy controls',
      blocks: [
        { list: [
          'The eye button in the header masks every amount on screen, and counterparty names too if you want — useful when sharing a screen.',
          'Appearance offers light, dark or follow-your-device, plus a text size setting.',
          'Additional users can be created, each with their own login.',
        ] },
      ],
    },
    {
      id: 'data', heading: 'Where your data lives',
      blocks: [
        { p: 'Everything the app stores sits in a Data folder next to the installed executable — the PostgreSQL database it runs embedded, your uploaded statement files, and the encryption keys for the login cookie. Nothing is written to a cloud service and nothing is transmitted anywhere.' },
        { h3: 'Backing up' },
        { steps: [
          'Stop the Bank Statement Analytics service, so the database is not mid-write.',
          'Copy the Data folder somewhere safe.',
          'Start the service again.',
        ] },
        { callout: ['Restoring', 'Reverse it — stop the service, put the Data folder back, start the service. Restore onto the same or a newer version; older versions will not understand a newer schema.'] },
      ],
    },
    {
      id: 'service', heading: 'The Windows service',
      blocks: [
        { p: 'The installer registers the app as a service so it is running whenever the PC is, without anyone signing in. It runs under the LocalService account rather than as an administrator — the embedded PostgreSQL refuses to run elevated, so this is deliberate.' },
        { p: 'Manage it like any other service: open services.msc and look for Bank Statement Analytics, or use sc stop / sc start from an administrator prompt.' },
      ],
    },
    {
      id: 'uninstall', heading: 'Uninstall',
      blocks: [
        { p: 'Uninstall from Settings → Apps → Installed apps, as usual. The uninstaller stops and removes the service first.' },
        { callout: ['Your data', 'Check whether the Data folder survived the uninstall before you reinstall or delete the install directory — it holds your entire transaction history.'] },
      ],
    },
  ],
};

const CHANGELOG = {
  slug: 'changelog',
  eyebrow: 'Releases',
  title: 'What shipped, and when',
  lede: 'Every release of Bank Statement Analytics. Downloads live on the GitHub releases page.',
  releases: [
    {
      version: '1.0.0',
      status: 'Current',
      title: 'First release',
      summary: 'The initial public build: statement import for three banks, categorization, and the full set of dashboard, planning and reporting screens.',
      groups: [
        ['Importing', [
          'Statement parsing for HDFC, HDFC Credit Card and IOB across .txt, .csv and .pdf.',
          'Password-protected PDFs, with the password optionally saved per account for unattended imports.',
          'Duplicate detection on the bank\'s own reference, so re-uploading an overlapping range is safe.',
          'Watch folders — each account can import new statements from a folder automatically.',
          'Every import is revertible as a unit, transactions and stored file together.',
        ]],
        ['Understanding the data', [
          'Counterparties resolved from raw UPI strings and narration, with default categories per merchant and per-transaction overrides.',
          'Self-transfer detection: a debit matched to an equal credit in another account, excluded from income and spend once confirmed.',
          'Recurring and fixed deposits detected from statement narration.',
        ]],
        ['Screens', [
          'Overview, Trends and Spending Insights, each drilling from a summary tile into the transactions behind it.',
          'Transactions, Merchants and Transfers for working row by row.',
          'Budgets, Bills and Investments for what is coming.',
          'Monthly and yearly reports with opening and closing balance, exportable to PDF.',
          'Credit cards modelled separately — billing cycles, minimum due, payment date and utilisation.',
        ]],
        ['The application itself', [
          'Single installer: bundled PostgreSQL 18 and .NET runtime, nothing else to install.',
          'Runs as a Windows service on localhost:5080, started with the machine.',
          'Light, dark and follow-the-system themes, plus a text size setting.',
          'Privacy toggle that masks amounts, and names, on screen.',
          'Local login with lockout after repeated failures, and support for more than one user.',
        ]],
      ],
    },
  ],
};

const ABOUT = {
  slug: 'about',
  eyebrow: 'About',
  title: 'Why this exists',
  lede: 'Personal finance software that treats your statements as yours.',
  blocks: [
    { p: 'Most personal finance apps want your bank login. They connect through an aggregator, hold a copy of your transaction history on their servers, and put the thing you actually wanted — a clear view of your own money — behind an account and a subscription.' },
    { p: 'Bank Statement Analytics starts from the opposite end. Your bank already gives you a statement file. That file is enough. Hand it to a program running on your own machine and you get the analysis without handing your credentials or your financial history to anyone.' },
    { h3: 'How these are built' },
    { p: 'Every product here follows the same shape. One installer that carries everything it needs — runtime, database, web server — so there is nothing to configure before it works. No account, no licence check, no server that can be switched off. Local data, in a folder you can copy.' },
    { p: 'The interface is a web application, but it is served by the program on your own machine, not from the internet. That is why the shortcut opens a browser at localhost.' },
    { h3: 'Open source' },
    { p: 'The source is public. If you would rather read the code than trust a downloaded executable, or you want to add support for a bank of your own, everything is on GitHub.' },
    { h3: 'Getting in touch' },
    { p: 'Bug reports, format problems and feature requests are best raised as GitHub issues, where they stay attached to the code and other people can find them.' },
    { callout: ['Reporting a statement problem', 'Describe the layout that failed rather than attaching the file. A real statement carries your account number, balances and counterparty names — never post one to a public issue tracker.'] },
  ],
};

module.exports = { DOCS, CHANGELOG, ABOUT };
