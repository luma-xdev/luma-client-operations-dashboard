/* =========================================================
   LUMA CLIENT OPERATIONS DASHBOARD
   SCRIPT.JS
   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEYS = {
  clients: "luma_clients",
  invoices: "luma_invoices",
  expenses: "luma_expenses",
  tasks: "luma_tasks",
  activities: "luma_activities",
  theme: "luma_theme",
  loggedIn: "luma_logged_in",
  notifications: "luma_notifications"
};


/* =========================================================
   DEFAULT DATA
   ========================================================= */

const DEFAULT_CLIENTS = [
  {
    id: 1,
    name: "Aarav Mehta",
    company: "Nova Digital",
    email: "aarav@novadigital.com",
    projects: 4,
    status: "active"
  },
  {
    id: 2,
    name: "Maya Shah",
    company: "Pixel House",
    email: "maya@pixelhouse.com",
    projects: 2,
    status: "active"
  },
  {
    id: 3,
    name: "Rohan Patel",
    company: "Vertex Labs",
    email: "rohan@vertexlabs.com",
    projects: 5,
    status: "active"
  },
  {
    id: 4,
    name: "Sara Khan",
    company: "Bloom Studio",
    email: "sara@bloomstudio.com",
    projects: 1,
    status: "inactive"
  },
  {
    id: 5,
    name: "Kabir Joshi",
    company: "Orbit Media",
    email: "kabir@orbitmedia.com",
    projects: 3,
    status: "active"
  }
];


const DEFAULT_INVOICES = [
  {
    id: 1,
    invoice: "INV-1001",
    client: "Nova Digital",
    issueDate: "2026-09-01",
    dueDate: "2026-09-15",
    amount: 28000,
    status: "paid"
  },
  {
    id: 2,
    invoice: "INV-1002",
    client: "Pixel House",
    issueDate: "2026-09-04",
    dueDate: "2026-09-20",
    amount: 18500,
    status: "pending"
  },
  {
    id: 3,
    invoice: "INV-1003",
    client: "Vertex Labs",
    issueDate: "2026-08-22",
    dueDate: "2026-09-05",
    amount: 32000,
    status: "overdue"
  },
  {
    id: 4,
    invoice: "INV-1004",
    client: "Bloom Studio",
    issueDate: "2026-09-07",
    dueDate: "2026-09-25",
    amount: 12000,
    status: "pending"
  },
  {
    id: 5,
    invoice: "INV-1005",
    client: "Orbit Media",
    issueDate: "2026-08-15",
    dueDate: "2026-08-30",
    amount: 24500,
    status: "paid"
  }
];


const DEFAULT_EXPENSES = [
  {
    id: 1,
    description: "Adobe Creative Cloud",
    category: "Software",
    date: "2026-09-03",
    amount: 3500
  },
  {
    id: 2,
    description: "Domain & Hosting",
    category: "Infrastructure",
    date: "2026-09-05",
    amount: 2200
  },
  {
    id: 3,
    description: "Marketing Campaign",
    category: "Marketing",
    date: "2026-09-08",
    amount: 5800
  },
  {
    id: 4,
    description: "Internet & Utilities",
    category: "Utilities",
    date: "2026-09-10",
    amount: 1800
  },
  {
    id: 5,
    description: "Design Resources",
    category: "Software",
    date: "2026-09-12",
    amount: 2900
  }
];


const DEFAULT_TASKS = [
  {
    id: 1,
    title: "Send final website proposal",
    description: "Prepare and send the final proposal to Nova Digital.",
    dueDate: "2026-09-20",
    priority: "high",
    completed: false
  },
  {
    id: 2,
    title: "Update client onboarding",
    description: "Improve the onboarding workflow for new clients.",
    dueDate: "2026-09-22",
    priority: "medium",
    completed: false
  },
  {
    id: 3,
    title: "Review monthly expenses",
    description: "Check September expenses and categorize transactions.",
    dueDate: "2026-09-24",
    priority: "low",
    completed: false
  },
  {
    id: 4,
    title: "Prepare project report",
    description: "Create the monthly performance report.",
    dueDate: "2026-09-18",
    priority: "high",
    completed: true
  }
];


const DEFAULT_ACTIVITIES = [
  {
    icon: "fa-file-invoice",
    title: "Invoice INV-1005 was marked as paid",
    time: "Today · 10:24 AM"
  },
  {
    icon: "fa-user-plus",
    title: "New client Orbit Media was added",
    time: "Yesterday · 4:12 PM"
  },
  {
    icon: "fa-wallet",
    title: "Marketing expense of ₹5,800 added",
    time: "Yesterday · 1:45 PM"
  },
  {
    icon: "fa-check",
    title: "Project report task completed",
    time: "2 days ago · 6:20 PM"
  }
];


const DEFAULT_NOTIFICATIONS = [
  {
    icon: "fa-clock",
    title: "2 invoices require your attention.",
    time: "Just now"
  },
  {
    icon: "fa-list-check",
    title: "You have upcoming tasks this week.",
    time: "Today"
  },
  {
    icon: "fa-chart-line",
    title: "Your workspace report is ready.",
    time: "Today"
  }
];


/* =========================================================
   STATE
   ========================================================= */

let clients = [];
let invoices = [];
let expenses = [];
let tasks = [];
let activities = [];
let notifications = [];

let currentSection = "dashboard";


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}


function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error("Storage error:", error);
    return fallback;
  }
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeData();
  initializeTheme();
  initializeLogin();
  initializeNavigation();
  initializeButtons();
  initializeSearch();
  initializeFilters();
  initializeNotifications();
  initializeSettings();

  renderEverything();

});


/* =========================================================
   INITIAL DATA
   ========================================================= */

function initializeData() {

  clients = loadData(
    STORAGE_KEYS.clients,
    DEFAULT_CLIENTS
  );

  invoices = loadData(
    STORAGE_KEYS.invoices,
    DEFAULT_INVOICES
  );

  expenses = loadData(
    STORAGE_KEYS.expenses,
    DEFAULT_EXPENSES
  );

  tasks = loadData(
    STORAGE_KEYS.tasks,
    DEFAULT_TASKS
  );

  activities = loadData(
    STORAGE_KEYS.activities,
    DEFAULT_ACTIVITIES
  );

  notifications = loadData(
    STORAGE_KEYS.notifications,
    DEFAULT_NOTIFICATIONS
  );

  saveData(STORAGE_KEYS.clients, clients);
  saveData(STORAGE_KEYS.invoices, invoices);
  saveData(STORAGE_KEYS.expenses, expenses);
  saveData(STORAGE_KEYS.tasks, tasks);
  saveData(STORAGE_KEYS.activities, activities);
  saveData(STORAGE_KEYS.notifications, notifications);
}


/* =========================================================
   LOGIN
   ========================================================= */

function initializeLogin() {

  const loginScreen = $("#loginScreen");
  const app = $("#app");

  const loginForm = $("#loginForm");
  const passwordToggle = $("#passwordToggle");
  const passwordInput = $("#loginPassword");

  const loggedIn = localStorage.getItem(
    STORAGE_KEYS.loggedIn
  );

  if (loggedIn === "true") {
    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    loginScreen.classList.remove("hidden");
    app.classList.add("hidden");
  }


  loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = $("#loginEmail").value.trim();
    const password = $("#loginPassword").value.trim();

    if (!email || !password) {
      showToast(
        "Please enter email and password.",
        "error"
      );

      return;
    }

    localStorage.setItem(
      STORAGE_KEYS.loggedIn,
      "true"
    );

    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");

    showToast(
      "Welcome back to Luma Operations."
    );

    renderEverything();
  });


  passwordToggle.addEventListener("click", () => {

    const isPassword =
      passwordInput.type === "password";

    passwordInput.type =
      isPassword ? "text" : "password";

    passwordToggle.innerHTML = isPassword
      ? '<i class="fa-solid fa-eye-slash"></i>'
      : '<i class="fa-solid fa-eye"></i>';

  });


  $("#logoutBtn").addEventListener("click", () => {

    localStorage.removeItem(
      STORAGE_KEYS.loggedIn
    );

    $("#loginScreen").classList.remove("hidden");
    $("#app").classList.add("hidden");

    $("#loginPassword").value = "";

    showToast("You have been signed out.");
  });

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

  $$(".nav-item").forEach((button) => {

    button.addEventListener("click", () => {

      const section =
        button.dataset.section;

      navigateTo(section);

    });

  });


  $$("[data-open-section]").forEach((button) => {

    button.addEventListener("click", () => {

      navigateTo(
        button.dataset.openSection
      );

    });

  });


  $("#mobileMenuBtn").addEventListener(
    "click",
    () => {

      $("#sidebar").classList.toggle(
        "mobile-open"
      );

    }
  );

}


function navigateTo(section) {

  currentSection = section;

  $$(".nav-item").forEach((button) => {

    button.classList.toggle(
      "active",
      button.dataset.section === section
    );

  });


  $$(".page-section").forEach((page) => {

    page.classList.remove(
      "active-section"
    );

  });


  const target =
    $(`#${section}Section`);

  if (target) {
    target.classList.add(
      "active-section"
    );
  }


  const titles = {
    dashboard: "Dashboard",
    clients: "Clients",
    invoices: "Invoices",
    expenses: "Expenses",
    tasks: "Tasks",
    reports: "Reports",
    settings: "Settings"
  };

  $("#pageTitle").textContent =
    titles[section] || "Dashboard";


  $("#sidebar").classList.remove(
    "mobile-open"
  );


  if (section === "reports") {
    renderReports();
  }

}


/* =========================================================
   BUTTONS
   ========================================================= */

function initializeButtons() {

  $("#quickAddBtn").addEventListener(
    "click",
    openQuickAddModal
  );

  $("#addClientBtn").addEventListener(
    "click",
    openClientModal
  );

  $("#addInvoiceBtn").addEventListener(
    "click",
    openInvoiceModal
  );

  $("#addExpenseBtn").addEventListener(
    "click",
    openExpenseModal
  );

  $("#addTaskBtn").addEventListener(
    "click",
    openTaskModal
  );


  $("#themeToggle").addEventListener(
    "click",
    toggleTheme
  );


  $("#revenuePeriod").addEventListener(
    "change",
    renderChart
  );


  $("#upgradeBtn").addEventListener(
    "click",
    () => {

      showToast(
        "You're already using the Luma workspace demo."
      );

    }
  );


  $("#viewAllActivity").addEventListener(
    "click",
    () => {

      showToast(
        "Showing the latest workspace activity."
      );

    }
  );


  $("#printReportBtn").addEventListener(
    "click",
    () => {

      navigateTo("reports");

      setTimeout(() => {
        window.print();
      }, 200);

    }
  );


  $("#modalClose").addEventListener(
    "click",
    closeModal
  );


  $("#modalOverlay").addEventListener(
    "click",
    (event) => {

      if (
        event.target === $("#modalOverlay")
      ) {
        closeModal();
      }

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {
        closeModal();
      }

    }
  );

}


/* =========================================================
   SEARCH
   ========================================================= */

function initializeSearch() {

  $("#clientSearch").addEventListener(
    "input",
    renderClients
  );

  $("#invoiceSearch").addEventListener(
    "input",
    renderInvoices
  );

}


/* =========================================================
   FILTERS
   ========================================================= */

function initializeFilters() {

  $("#clientStatusFilter").addEventListener(
    "change",
    renderClients
  );

  $("#invoiceStatusFilter").addEventListener(
    "change",
    renderInvoices
  );

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function initializeNotifications() {

  $("#notificationBtn").addEventListener(
    "click",
    () => {

      $("#notificationPanel").classList.toggle(
        "show"
      );

    }
  );


  $("#closeNotifications").addEventListener(
    "click",
    () => {

      $("#notificationPanel").classList.remove(
        "show"
      );

    }
  );


  renderNotifications();

}


/* =========================================================
   SETTINGS
   ========================================================= */

function initializeSettings() {

  $("#darkModeSwitch").checked =
    document.body.classList.contains(
      "light-mode"
    );


  $("#darkModeSwitch").addEventListener(
    "change",
    () => {

      toggleTheme();

      $("#darkModeSwitch").checked =
        document.body.classList.contains(
          "light-mode"
        );

    }
  );


  $("#clearDataBtn").addEventListener(
    "click",
    resetAllData
  );


  $("#notificationSwitch").addEventListener(
    "change",
    (event) => {

      const enabled =
        event.target.checked;

      localStorage.setItem(
        STORAGE_KEYS.notifications,
        JSON.stringify(
          enabled
            ? DEFAULT_NOTIFICATIONS
            : []
        )
      );

      notifications = enabled
        ? [...DEFAULT_NOTIFICATIONS]
        : [];

      renderNotifications();

      showToast(
        enabled
          ? "Notifications enabled."
          : "Notifications disabled."
      );

    }
  );

}


/* =========================================================
   THEME
   ========================================================= */

function initializeTheme() {

  const theme =
    localStorage.getItem(
      STORAGE_KEYS.theme
    );

  if (theme === "light") {

    document.body.classList.add(
      "light-mode"
    );

  }

  updateThemeIcon();

}


function toggleTheme() {

  document.body.classList.toggle(
    "light-mode"
  );

  const light =
    document.body.classList.contains(
      "light-mode"
    );

  localStorage.setItem(
    STORAGE_KEYS.theme,
    light ? "light" : "dark"
  );

  updateThemeIcon();

}


function updateThemeIcon() {

  const icon =
    $("#themeToggle i");

  if (
    document.body.classList.contains(
      "light-mode"
    )
  ) {

    icon.className =
      "fa-solid fa-sun";

  } else {

    icon.className =
      "fa-solid fa-moon";

  }

}


/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function renderEverything() {

  renderDashboard();
  renderClients();
  renderInvoices();
  renderExpenses();
  renderTasks();
  renderReports();
  renderNotifications();

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {

  const revenue =
    invoices
      .filter(
        invoice => invoice.status === "paid"
      )
      .reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );


  const pending =
    invoices
      .filter(
        invoice => invoice.status === "pending"
      )
      .reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );


  const expensesTotal =
    expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );


  const activeClients =
    clients.filter(
      client =>
        client.status === "active"
    ).length;


  const pendingCount =
    invoices.filter(
      invoice =>
        invoice.status === "pending"
    ).length;


  $("#totalRevenue").textContent =
    formatCurrency(revenue);

  $("#pendingPayments").textContent =
    formatCurrency(pending);

  $("#totalExpenses").textContent =
    formatCurrency(expensesTotal);

  $("#activeClients").textContent =
    activeClients;

  $("#pendingCount").textContent =
    pendingCount;

  $("#expenseCount").textContent =
    expenses.length;

  $("#clientChange").textContent =
    clients.length;


  renderChart();
  renderActivities();
  renderDashboardTasks();
  renderPaymentSummary();

}


/* =========================================================
   CHART
   ========================================================= */

function renderChart() {

  const period =
    Number($("#revenuePeriod").value);

  const months =
    getLastMonths(period);

  const values =
    months.map(
      month =>
        getMonthlyRevenue(
          month.year,
          month.month
        )
    );


  const maxValue =
    Math.max(
      ...values,
      50000
    );


  const bars =
    $("#chartBars");

  const labels =
    $("#chartLabels");

  bars.innerHTML = "";
  labels.innerHTML = "";


  months.forEach(
    (month, index) => {

      const value =
        values[index];

      const percentage =
        Math.max(
          4,
          (value / maxValue) * 100
        );


      const bar =
        document.createElement("div");

      bar.className = "chart-bar";

      bar.style.height =
        `${percentage}%`;

      bar.dataset.value =
        formatCurrency(value);


      bars.appendChild(bar);


      const label =
        document.createElement("span");

      label.textContent =
        month.label;

      labels.appendChild(label);

    }
  );

}


function getMonthlyRevenue(year, month) {

  return invoices
    .filter(invoice => {

      if (invoice.status !== "paid") {
        return false;
      }

      const date =
        new Date(invoice.issueDate);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month
      );

    })
    .reduce(
      (sum, invoice) =>
        sum + Number(invoice.amount),
      0
    );

}


function getLastMonths(count) {

  const months = [];

  const current =
    new Date();

  for (
    let i = count - 1;
    i >= 0;
    i--
  ) {

    const date =
      new Date(
        current.getFullYear(),
        current.getMonth() - i,
        1
      );

    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: date.toLocaleString(
        "en-US",
        {
          month: "short"
        }
      )
    });

  }

  return months;
}


/* =========================================================
   ACTIVITIES
   ========================================================= */

function renderActivities() {

  const container =
    $("#activityList");

  container.innerHTML = "";


  if (!activities.length) {

    container.innerHTML =
      emptyState(
        "fa-clock",
        "No activity yet",
        "Workspace activity will appear here."
      );

    return;
  }


  activities
    .slice(0, 6)
    .forEach(activity => {

      const item =
        document.createElement("div");

      item.className =
        "activity-item";

      item.innerHTML = `
        <div class="activity-icon">
          <i class="fa-solid ${escapeHtml(activity.icon)}"></i>
        </div>

        <div class="activity-content">
          <strong>${escapeHtml(activity.title)}</strong>
          <span>${escapeHtml(activity.time)}</span>
        </div>
   `;

    container.appendChild(item);

  });

}


/* =========================================================
   RESET DATA
   ========================================================= */

function resetAllData() {

  const confirmed =
    confirm(
      "Reset all dashboard data to the original demo data?"
    );


  if (!confirmed) return;


  clients =
    [...DEFAULT_CLIENTS];

  invoices =
    [...DEFAULT_INVOICES];

  expenses =
    [...DEFAULT_EXPENSES];

  tasks =
    [...DEFAULT_TASKS];

  activities =
    [...DEFAULT_ACTIVITIES];

  notifications =
    [...DEFAULT_NOTIFICATIONS];


  saveData(
    STORAGE_KEYS.clients,
    clients
  );

  saveData(
    STORAGE_KEYS.invoices,
    invoices
  );

  saveData(
    STORAGE_KEYS.expenses,
    expenses
  );

  saveData(
    STORAGE_KEYS.tasks,
    tasks
  );

  saveData(
    STORAGE_KEYS.activities,
    activities
  );

  saveData(
    STORAGE_KEYS.notifications,
    notifications
  );


  renderEverything();

  showToast(
    "Dashboard data has been reset."
  );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
  message,
  type = "success"
) {

  const container =
    $("#toastContainer");


  const toast =
    document.createElement("div");

  toast.className =
    `toast ${
      type === "error"
        ? "error"
        : ""
    }`;


  toast.innerHTML = `

    <i class="fa-solid ${
      type === "error"
        ? "fa-circle-exclamation"
        : "fa-circle-check"
    }"></i>

    <div class="toast-content">

      <strong>
        ${type === "error"
          ? "Something went wrong"
          : "Success"}
      </strong>

      <span>
        ${escapeHtml(message)}
      </span>

    </div>

  `;


  container.appendChild(toast);


  setTimeout(
    () => {

      toast.style.opacity = "0";
      toast.style.transform =
        "translateX(30px)";

      setTimeout(
        () => toast.remove(),
        250
      );

    },
    3000
  );

}


/* =========================================================
   HELPERS
   ========================================================= */

function formatCurrency(value) {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(
    Number(value) || 0
  );

}


function formatDate(dateString) {

  if (!dateString) {
    return "—";
  }


  const date =
    new Date(
      `${dateString}T00:00:00`
    );


  if (Number.isNaN(date.getTime())) {
    return dateString;
  }


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


function todayISO() {

  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");


  return `${year}-${month}-${day}`;

}


function getInitials(name) {

  return name
    .split(" ")
    .slice(0, 2)
    .map(
      word =>
        word.charAt(0)
    )
    .join("")
    .toUpperCase();

}


function capitalize(value) {

  if (!value) return "";

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );

}


function emptyState(
  icon,
  title,
  message
) {

  return `

    <div class="empty-state">

      <i class="fa-solid ${icon}"></i>

      <strong>
        ${escapeHtml(title)}
      </strong>

      <span>
        ${escapeHtml(message)}
      </span>

    </div>

  `;

}


function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   QUICK ACTION EXTRA STYLES
   ========================================================= */

const quickActionStyle =
  document.createElement("style");

quickActionStyle.textContent = `

  .quick-actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .quick-action-btn {
    min-height: 115px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 12px;

    color: var(--text-soft);
    background: #0b0b12;

    border: 1px solid var(--border);
    border-radius: 13px;

    font-size: 10px;
    font-weight: 700;

    transition: 0.25s ease;
  }

  .quick-action-btn i {
    color: var(--primary-light);
    font-size: 22px;
  }

  .quick-action-btn:hover {
    color: white;
    border-color: rgba(139, 92, 246, 0.4);
    background: rgba(139, 92, 246, 0.08);
    transform: translateY(-2px);
  }

  @media (max-width: 500px) {

    .quick-actions-grid {
      grid-template-columns: 1fr;
    }

  }

`;

document.head.appendChild(
  quickActionStyle
);


/* =========================================================
   CONSOLE BRANDING
   ========================================================= */

console.log(
  "%c✦ Luma Client Operations Dashboard",
  "font-size:18px;font-weight:bold;color:#a78bfa;"
);

console.log(
  "%cBuilt with HTML, CSS & JavaScript.",
  "font-size:12px;color:#888;"
);
