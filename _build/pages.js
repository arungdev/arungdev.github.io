// Long-form page content. Every statement here is taken from the shipped
// behaviour (installer config, API download guides, onboarding guide, watch
// folder service) rather than written as marketing copy.

const DOCS = {
  slug: 'docs',
  eyebrow: 'Documentation',
  title: 'Install it, feed it statements, read the results',
  lede: 'Everything needed to get Bank Statement Analytics running and importing. Written against v2.0.0.',
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
          'Duplicates are skipped automatically, so re-uploading an overlapping range is safe.',
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
          'Changing a merchant\'s category recategorizes all its transactions at once.',
          'Individual transactions can have their category overridden if one purchase was unusual.',
          'Split transactions let you divide a single payment across multiple categories.',
        ] },
      ],
    },
    {
      id: 'trends', heading: 'Trends and Insights',
      blocks: [
        { p: 'Trends shows monthly income versus spend over time, category breakdowns and savings rates. Insights flags recurring subscriptions, unusual spikes and merchant concentration.' },
      ],
    },
    {
      id: 'budgets', heading: 'Budgets and Bills',
      blocks: [
        { p: 'Set monthly category budgets with visual progress bars. Track upcoming bill reminders and recurring payments so nothing is missed.' },
      ],
    },
    {
      id: 'investments', heading: 'Investments',
      blocks: [
        { p: 'Detected recurring and fixed deposits appear automatically, with maturity dates and projected interest alongside manual asset entries.' },
      ],
    },
    {
      id: 'reports', heading: 'Reports',
      blocks: [
        { p: 'Monthly and annual statements summarize opening and closing balance, net savings and top expense drivers, printable or exportable as a PDF.' },
      ],
    },
    {
      id: 'data', heading: 'Your data and backups',
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
      version: '2.0.0',
      status: 'Current',
      title: 'Global Search, Forex Tracking, Financial Planning & Heatmaps',
      summary: 'Major release introducing keyboard-driven global search, multi-currency transaction tracking, annual financial trajectory, spending intensity heatmap, financial planning runway and emergency fund tools, and automated database migrations.',
      groups: [
        ['Discovery & Search', [
          'Global search overlay triggered with / shortcut to search across transactions, merchants, accounts, notes, and categories instantly.',
          'Interactive column header dropdowns on Transactions and Merchants pages for multi-column sorting and filtering.',
          'Refined table selection states and high-contrast checkboxes in light and dark themes.',
        ]],
        ['Advanced Analytics & Planning', [
          'Forex & international transaction detection with multi-currency badges and fee estimates.',
          'Annual financial summary tracking net worth trajectory, annual cash flow, and YoY category shifts.',
          'Daily spending heatmap displaying spending concentration and peak expenditure dates.',
          'Financial planning tools: burn rate calculator, runway projections, emergency fund targets, and retirement forecasts.',
        ]],
        ['Credit Cards & Reliability', [
          'Accurate shared credit limit calculations and negative balance prevention across card accounts.',
          'Preserved unsaved draft edits in the Settings credit card modal.',
          'Fixed billing-month cycle boundaries and drill-down date ranges in Trends.',
          'Instant branded splash animation on application start.',
          'Automated versioned schema evolution via the new database migration engine.',
        ]],
      ],
    },
    {
      version: '1.0.0',
      status: 'Previous',
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
