
/* =========================================================
   LUMA CLIENT OPERATIONS DASHBOARD
   COMPLETE SCRIPT.JS
   ========================================================= */

"use strict";

/* =========================================================
   STORAGE KEYS
   ========================================================= */

const STORAGE_KEYS = {
  clients: "luma_clients",
  invoices: "luma_invoices",
  expenses: "luma_expenses",
  tasks: "luma_tasks",
  activities: "luma_activities",
  notifications: "luma_notifications",
  theme: "luma_theme",
  loggedIn: "luma_logged_in"
};


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


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
   STORAGE
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
   DATE / CURRENCY HELPERS
   ========================================================= */

function todayISO() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function formatCurrency(value) {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(Number(value) || 0);

}


function formatDate(dateString) {

  if (!dateString) {
    return "—";
  }

  const date =
    new Date(`${dateString}T00:00:00`);

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


function capitalize(value) {

  if (!value) {
    return "";
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}


function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function emptyState(icon, title, message) {

  return `
    <div class="empty-state">

      <i class="fa-solid ${escapeHtml(icon)}"></i>

      <strong>
        ${escapeHtml(title)}
      </strong>

      <span>
        ${escapeHtml(message)}
      </span>

    </div>
  `;
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

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

  }
);


/* =========================================================
   INITIAL DATA
   ========================================================= */

function initializeData() {

  clients = loadData(
    STORAGE_KEYS.clients,
    [...DEFAULT_CLIENTS]
  );

  invoices = loadData(
    STORAGE_KEYS.invoices,
    [...DEFAULT_INVOICES]
  );

  expenses = loadData(
    STORAGE_KEYS.expenses,
    [...DEFAULT_EXPENSES]
  );

  tasks = loadData(
    STORAGE_KEYS.tasks,
    [...DEFAULT_TASKS]
  );

  activities = loadData(
    STORAGE_KEYS.activities,
    [...DEFAULT_ACTIVITIES]
  );

  notifications = loadData(
    STORAGE_KEYS.notifications,
    [...DEFAULT_NOTIFICATIONS]
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

  if (!loginScreen || !app || !loginForm) {
    return;
  }

  const loggedIn =
    localStorage.getItem(
      STORAGE_KEYS.loggedIn
    );

  if (loggedIn === "true") {

    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");

  } else {

    loginScreen.classList.remove("hidden");
    app.classList.add("hidden");

  }


  loginForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      const email =
        $("#loginEmail")?.value.trim();

      const password =
        $("#loginPassword")?.value.trim();

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
        "Welcome back to Luma."
      );

    }
  );


  if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener(
      "click",
      () => {

        const isPassword =
          passwordInput.type === "password";

        passwordInput.type =
          isPassword
            ? "text"
            : "password";

        const icon =
          passwordToggle.querySelector("i");

        if (icon) {

          icon.className =
            isPassword
              ? "fa-solid fa-eye-slash"
              : "fa-solid fa-eye";

        }

      }
    );

  }


  const logoutBtn = $("#logoutBtn");

  if (logoutBtn) {

    logoutBtn.addEventListener(
      "click",
      () => {

        localStorage.removeItem(
          STORAGE_KEYS.loggedIn
        );

        app.classList.add("hidden");
        loginScreen.classList.remove("hidden");

        showToast(
          "You have been signed out."
        );

      }
    );

  }

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

  $$(".nav-item").forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          navigateTo(
            button.dataset.section
          );

        }
      );

    }
  );


  $$("[data-open-section]").forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          navigateTo(
            button.dataset.openSection
          );

        }
      );

    }
  );


  const mobileMenu =
    $("#mobileMenuBtn");

  const sidebar =
    $("#sidebar");

  if (mobileMenu && sidebar) {

    mobileMenu.addEventListener(
      "click",
      () => {

        sidebar.classList.toggle(
          "mobile-open"
        );

      }
    );

  }

}


function navigateTo(section) {

  currentSection = section;

  $$(".nav-item").forEach(
    (button) => {

      button.classList.toggle(
        "active",
        button.dataset.section === section
      );

    }
  );


  $$(".page-section").forEach(
    (page) => {

      page.classList.remove(
        "active-section"
      );

    }
  );


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


  if ($("#pageTitle")) {

    $("#pageTitle").textContent =
      titles[section] || "Dashboard";

  }


  $("#sidebar")?.classList.remove(
    "mobile-open"
  );

}


/* =========================================================
   BUTTON INITIALIZATION
   ========================================================= */

function initializeButtons() {

  $("#quickAddBtn")?.addEventListener(
    "click",
    openQuickAddModal
  );

  $("#addClientBtn")?.addEventListener(
    "click",
    openClientModal
  );

  $("#addInvoiceBtn")?.addEventListener(
    "click",
    openInvoiceModal
  );

  $("#addExpenseBtn")?.addEventListener(
    "click",
    openExpenseModal
  );

  $("#addTaskBtn")?.addEventListener(
    "click",
    openTaskModal
  );

  $("#themeToggle")?.addEventListener(
    "click",
    toggleTheme
  );


  $("#revenuePeriod")?.addEventListener(
    "change",
    renderChart
  );


  $("#upgradeBtn")?.addEventListener(
    "click",
    () => {

      showToast(
        "You're already using the Luma workspace."
      );

    }
  );


  $("#viewAllActivity")?.addEventListener(
    "click",
    () => {

      showToast(
        "Showing your latest workspace activity."
      );

    }
  );


  $("#printReportBtn")?.addEventListener(
    "click",
    () => {

      navigateTo("reports");

      setTimeout(
        () => window.print(),
        250
      );

    }
  );


  $("#modalClose")?.addEventListener(
    "click",
    closeModal
  );


  $("#modalOverlay")?.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        $("#modalOverlay")
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

  $("#clientSearch")?.addEventListener(
    "input",
    renderClients
  );

  $("#invoiceSearch")?.addEventListener(
    "input",
    renderInvoices
  );

}


function initializeFilters() {

  $("#clientStatusFilter")?.addEventListener(
    "change",
    renderClients
  );

  $("#invoiceStatusFilter")?.addEventListener(
    "change",
    renderInvoices
  );

}


/* =========================================================
   MODAL SYSTEM
   ========================================================= */

function openModal(
  title,
  eyebrow,
  body
) {

  const overlay =
    $("#modalOverlay");

  const titleElement =
    $("#modalTitle");

  const eyebrowElement =
    $("#modalEyebrow");

  const bodyElement =
    $("#modalBody");

  if (
    !overlay ||
    !titleElement ||
    !bodyElement
  ) {
    return;
  }

  titleElement.textContent =
    title;

  if (eyebrowElement) {
    eyebrowElement.textContent =
      eyebrow || "CREATE";
  }

  bodyElement.innerHTML =
    body;

  overlay.classList.add("show");

}


function closeModal() {

  const overlay =
    $("#modalOverlay");

  if (!overlay) {
    return;
  }

  overlay.classList.remove(
    "show"
  );

}


/* =========================================================
   ADD CLIENT
   ========================================================= */

function openClientModal() {

  openModal(
    "Add Client",
    "CLIENT MANAGEMENT",
    `
      <form id="clientForm" class="modal-form">

        <div class="input-group">
          <label>Client Name</label>

          <input
            type="text"
            id="clientName"
            placeholder="e.g. Rahul Sharma"
            required
          >
        </div>


        <div class="input-group">
          <label>Company</label>

          <input
            type="text"
            id="clientCompany"
            placeholder="e.g. Nova Digital"
            required
          >
        </div>


        <div class="input-group">
          <label>Email</label>

          <input
            type="email"
            id="clientEmail"
            placeholder="client@example.com"
            required
          >
        </div>


        <div class="input-group">
          <label>Projects</label>

          <input
            type="number"
            id="clientProjects"
            min="0"
            value="1"
            required
          >
        </div>


        <div class="input-group">
          <label>Status</label>

          <select id="clientStatus">

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>
        </div>


        <div class="modal-actions">

          <button
            type="button"
            class="secondary-btn"
            onclick="closeModal()"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="primary-btn"
          >
            <i class="fa-solid fa-plus"></i>
            Add Client
          </button>

        </div>

      </form>
    `
  );


  $("#clientForm")?.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      const client = {

        id: Date.now(),

        name:
          $("#clientName").value.trim(),

        company:
          $("#clientCompany").value.trim(),

        email:
          $("#clientEmail").value.trim(),

        projects:
          Number(
            $("#clientProjects").value
          ) || 0,

        status:
          $("#clientStatus").value

      };


      clients.unshift(client);


      saveData(
        STORAGE_KEYS.clients,
        clients
      );


      addActivity(
        "fa-user-plus",
        `New client ${client.company} was added`
      );


      addNotification(
        "fa-user-plus",
        `New client ${client.company} was added.`
      );


      renderEverything();

      closeModal();

      showToast(
        `${client.company} added successfully.`
      );

    }
  );

}


/* =========================================================
   CREATE INVOICE
   ========================================================= */

function openInvoiceModal() {

  let clientOptions = "";

  if (clients.length) {

    clientOptions =
      clients.map(
        (client) => `
          <option value="${escapeHtml(client.company)}">
            ${escapeHtml(client.company)}
          </option>
        `
      ).join("");

  } else {

    clientOptions = `
      <option value="">
        No clients available
      </option>
    `;

  }


  const nextNumber =
    1000 + invoices.length + 1;


  openModal(
    "Create Invoice",
    "FINANCE",
    `
      <form id="invoiceForm" class="modal-form">

        <div class="input-group">
          <label>Invoice Number</label>

          <input
            type="text"
            id="invoiceNumber"
            value="INV-${nextNumber}"
            required
          >
        </div>


        <div class="input-group">
          <label>Client</label>

          <select
            id="invoiceClient"
            required
          >
            ${clientOptions}
          </select>
        </div>


        <div class="input-group">
          <label>Issue Date</label>

          <input
            type="date"
            id="invoiceIssueDate"
            value="${todayISO()}"
            required
          >
        </div>


        <div class="input-group">
          <label>Due Date</label>

          <input
            type="date"
            id="invoiceDueDate"
            value="${todayISO()}"
            required
          >
        </div>


        <div class="input-group">
          <label>Amount (₹)</label>

          <input
            type="number"
            id="invoiceAmount"
            placeholder="25000"
            min="0"
            required
          >
        </div>


        <div class="input-group">
          <label>Status</label>

          <select id="invoiceStatus">

            <option value="pending">
              Pending
            </option>

            <option value="paid">
              Paid
            </option>

            <option value="overdue">
              Overdue
            </option>

          </select>
        </div>


        <div class="modal-actions">

          <button
            type="button"
            class="secondary-btn"
            onclick="closeModal()"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="primary-btn"
          >
            <i class="fa-solid fa-file-invoice"></i>
            Create Invoice
          </button>

        </div>

      </form>
    `
  );


  $("#invoiceForm")?.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const invoice = {

        id: Date.now(),

        invoice:
          $("#invoiceNumber").value.trim(),

        client:
          $("#invoiceClient").value,

        issueDate:
          $("#invoiceIssueDate").value,

        dueDate:
          $("#invoiceDueDate").value,

        amount:
          Number(
            $("#invoiceAmount").value
          ) || 0,

        status:
          $("#invoiceStatus").value

      };


      invoices.unshift(invoice);


      saveData(
        STORAGE_KEYS.invoices,
        invoices
      );


      addActivity(
        "fa-file-invoice",
        `Invoice ${invoice.invoice} was created`
      );


      addNotification(
        "fa-file-invoice",
        `Invoice ${invoice.invoice} was created.`
      );


      renderEverything();

      closeModal();

      showToast(
        `${invoice.invoice} created successfully.`
      );

    }
  );

}


/* =========================================================
   ADD EXPENSE
   ========================================================= */

function openExpenseModal() {

  openModal(
    "Add Expense",
    "FINANCE",
    `
      <form id="expenseForm" class="modal-form">

        <div class="input-group">
          <label>Description</label>

          <input
            type="text"
            id="expenseDescription"
            placeholder="e.g. Software subscription"
            required
          >
        </div>


        <div class="input-group">
          <label>Category</label>

          <select id="expenseCategory">

            <option value="Software">
              Software
            </option>

            <option value="Marketing">
              Marketing
            </option>

            <option value="Infrastructure">
              Infrastructure
            </option>

            <option value="Utilities">
              Utilities
            </option>

            <option value="Travel">
              Travel
            </option>

            <option value="Office">
              Office
            </option>

            <option value="Other">
              Other
            </option>

          </select>
        </div>


        <div class="input-group">
          <label>Date</label>

          <input
            type="date"
            id="expenseDate"
            value="${todayISO()}"
            required
          >
        </div>


        <div class="input-group">
          <label>Amount (₹)</label>

          <input
            type="number"
            id="expenseAmount"
            placeholder="5000"
            min="0"
            required
          >
        </div>


        <div class="modal-actions">

          <button
            type="button"
            class="secondary-btn"
            onclick="closeModal()"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="primary-btn"
          >
            <i class="fa-solid fa-wallet"></i>
            Add Expense
          </button>

        </div>

      </form>
    `
  );


  $("#expenseForm")?.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const expense = {

        id: Date.now(),

        description:
          $("#expenseDescription")
            .value
            .trim(),

        category:
          $("#expenseCategory").value,

        date:
          $("#expenseDate").value,

        amount:
          Number(
            $("#expenseAmount").value
          ) || 0

      };


      expenses.unshift(expense);


      saveData(
        STORAGE_KEYS.expenses,
        expenses
      );


      addActivity(
        "fa-wallet",
        `${expense.description} expense of ${formatCurrency(expense.amount)} added`
      );


      addNotification(
        "fa-wallet",
        `${expense.description} expense was added.`
      );


      renderEverything();

      closeModal();

      showToast(
        `${expense.description} added successfully.`
      );

    }
  );

}


/* =========================================================
   ADD TASK
   ========================================================= */

function openTaskModal() {

  openModal(
    "Add Task",
    "WORKFLOW",
    `
      <form id="taskForm" class="modal-form">

        <div class="input-group">
          <label>Task Title</label>

          <input
            type="text"
            id="taskTitle"
            placeholder="e.g. Send project proposal"
            required
          >
        </div>


        <div class="input-group">
          <label>Description</label>

          <textarea
            id="taskDescription"
            rows="3"
            placeholder="Task details..."
          ></textarea>
        </div>


        <div class="input-group">
          <label>Due Date</label>

          <input
            type="date"
            id="taskDueDate"
            value="${todayISO()}"
            required
          >
        </div>


        <div class="input-group">
          <label>Priority</label>

          <select id="taskPriority">

            <option value="low">
              Low
            </option>

            <option value="medium" selected>
              Medium
            </option>

            <option value="high">
              High
            </option>

          </select>
        </div>


        <div class="modal-actions">

          <button
            type="button"
            class="secondary-btn"
            onclick="closeModal()"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="primary-btn"
          >
            <i class="fa-solid fa-plus"></i>
            Add Task
          </button>

        </div>

      </form>
    `
  );


  $("#taskForm")?.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const task = {

        id: Date.now(),

        title:
          $("#taskTitle")
            .value
            .trim(),

        description:
          $("#taskDescription")
            .value
            .trim(),

        dueDate:
          $("#taskDueDate").value,

        priority:
          $("#taskPriority").value,

        completed: false

      };


      tasks.unshift(task);


      saveData(
        STORAGE_KEYS.tasks,
        tasks
      );


      addActivity(
        "fa-list-check",
        `Task "${task.title}" was created`
      );


      addNotification(
        "fa-list-check",
        `New task "${task.title}" was created.`
      );


      renderEverything();

      closeModal();

      showToast(
        `${task.title} added successfully.`
      );

    }
  );

}


/* =========================================================
   QUICK ADD
   ========================================================= */

function openQuickAddModal() {

  openModal(
    "Quick Add",
    "QUICK ACTIONS",
    `
      <div class="quick-actions-grid">

        <button
          type="button"
          class="quick-action-btn"
          id="quickClient"
        >
          <i class="fa-solid fa-user-plus"></i>
          <strong>Add Client</strong>
          <span>Create a client</span>
        </button>


        <button
          type="button"
          class="quick-action-btn"
          id="quickInvoice"
        >
          <i class="fa-solid fa-file-invoice"></i>
          <strong>Create Invoice</strong>
          <span>Create an invoice</span>
        </button>


        <button
          type="button"
          class="quick-action-btn"
          id="quickExpense"
        >
          <i class="fa-solid fa-wallet"></i>
          <strong>Add Expense</strong>
          <span>Record spending</span>
        </button>


        <button
          type="button"
          class="quick-action-btn"
          id="quickTask"
        >
          <i class="fa-solid fa-list-check"></i>
          <strong>Add Task</strong>
          <span>Create a task</span>
        </button>

      </div>
    `
  );


  $("#quickClient")?.addEventListener(
    "click",
    () => {
      closeModal();
      setTimeout(openClientModal, 100);
    }
  );


  $("#quickInvoice")?.addEventListener(
    "click",
    () => {
      closeModal();
      setTimeout(openInvoiceModal, 100);
    }
  );


  $("#quickExpense")?.addEventListener(
    "click",
    () => {
      closeModal();
      setTimeout(openExpenseModal, 100);
    }
  );


  $("#quickTask")?.addEventListener(
    "click",
    () => {
      closeModal();
      setTimeout(openTaskModal, 100);
    }
  );

}


/* =========================================================
   CLIENTS RENDER
   ========================================================= */

function renderClients() {

  const table =
    $("#clientsTable");

  if (!table) return;


  const search =
    (
      $("#clientSearch")?.value || ""
    ).toLowerCase();


  const filter =
    $("#clientStatusFilter")?.value ||
    "all";


  const filtered =
    clients.filter(
      (client) => {

        const matchesSearch =
          client.name
            .toLowerCase()
            .includes(search) ||

          client.company
            .toLowerCase()
            .includes(search) ||

          client.email
            .toLowerCase()
            .includes(search);


        const matchesFilter =
          filter === "all" ||
          client.status === filter;


        return (
          matchesSearch &&
          matchesFilter
        );

      }
    );


  if (!filtered.length) {

    table.innerHTML = `
      <tr>
        <td colspan="6">
          No clients found.
        </td>
      </tr>
    `;

    return;
  }


  table.innerHTML =
    filtered.map(
      (client) => `

        <tr>

          <td>
            <strong>
              ${escapeHtml(client.name)}
            </strong>
          </td>

          <td>
            ${escapeHtml(client.company)}
          </td>

          <td>
            ${escapeHtml(client.email)}
          </td>

          <td>
            ${client.projects}
          </td>

          <td>
            <span class="status-badge ${client.status}">
              ${capitalize(client.status)}
            </span>
          </td>

          <td>

            <button
              class="icon-btn"
              title="Delete client"
              onclick="deleteClient(${client.id})"
            >
              <i class="fa-solid fa-trash"></i>
            </button>

          </td>

        </tr>

      `
    ).join("");

}


/* =========================================================
   INVOICES RENDER
   ========================================================= */

function renderInvoices() {

  const table =
    $("#invoicesTable");

  if (!table) return;


  const search =
    (
      $("#invoiceSearch")?.value || ""
    ).toLowerCase();


  const filter =
    $("#invoiceStatusFilter")?.value ||
    "all";


  const filtered =
    invoices.filter(
      (invoice) => {

        const matchesSearch =
          invoice.invoice
            .toLowerCase()
            .includes(search) ||

          invoice.client
            .toLowerCase()
            .includes(search);


        const matchesFilter =
          filter === "all" ||
          invoice.status === filter;


        return (
          matchesSearch &&
          matchesFilter
        );

      }
    );


  if (!filtered.length) {

    table.innerHTML = `
      <tr>
        <td colspan="7">
          No invoices found.
        </td>
      </tr>
    `;

  } else {

    table.innerHTML =
      filtered.map(
        (invoice) => `

          <tr>

            <td>
              <strong>
                ${escapeHtml(invoice.invoice)}
              </strong>
            </td>

            <td>
              ${escapeHtml(invoice.client)}
            </td>

            <td>
              ${formatDate(invoice.issueDate)}
            </td>

            <td>
              ${formatDate(invoice.dueDate)}
            </td>

            <td>
              ${formatCurrency(invoice.amount)}
            </td>

            <td>
              <span class="status-badge ${invoice.status}">
                ${capitalize(invoice.status)}
              </span>
            </td>

            <td>

              <button
                class="icon-btn"
                title="Delete invoice"
                onclick="deleteInvoice(${invoice.id})"
              >
                <i class="fa-solid fa-trash"></i>
              </button>

            </td>

          </tr>

        `
      ).join("");

  }


  const total =
    invoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.amount),
      0
    );


  const paid =
    invoices
      .filter(
        invoice =>
          invoice.status === "paid"
      )
      .reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );


  const pending =
    invoices
      .filter(
        invoice =>
          invoice.status === "pending"
      )
      .reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );


  const overdue =
    invoices
      .filter(
        invoice =>
          invoice.status === "overdue"
      )
      .reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );


  if ($("#invoiceTotal"))
    $("#invoiceTotal").textContent =
      formatCurrency(total);

  if ($("#invoicePaid"))
    $("#invoicePaid").textContent =
      formatCurrency(paid);

  if ($("#invoicePending"))
    $("#invoicePending").textContent =
      formatCurrency(pending);

  if ($("#invoiceOverdue"))
    $("#invoiceOverdue").textContent =
      formatCurrency(overdue);

}


/* =========================================================
   EXPENSES RENDER
   ========================================================= */

function renderExpenses() {

  const table =
    $("#expensesTable");

  if (!table) return;


  if (!expenses.length) {

    table.innerHTML = `
      <tr>
        <td colspan="5">
          No expenses found.
        </td>
      </tr>
    `;

    return;
  }


  table.innerHTML =
    expenses.map(
      (expense) => `

        <tr>

          <td>
            <strong>
              ${escapeHtml(expense.description)}
            </strong>
          </td>

          <td>
            ${escapeHtml(expense.category)}
          </td>

          <td>
            ${formatDate(expense.date)}
          </td>

          <td>
            ${formatCurrency(expense.amount)}
          </td>

          <td>

            <button
              class="icon-btn"
              title="Delete expense"
              onclick="deleteExpense(${expense.id})"
            >
              <i class="fa-solid fa-trash"></i>
            </button>

          </td>

        </tr>

      `
    ).join("");


  const monthlyExpenses =
    expenses
      .filter(
        (expense) => {

          const date =
            new Date(
              `${expense.date}T00:00:00`
            );

          const now =
            new Date();

          return (
            date.getMonth() ===
              now.getMonth() &&
            date.getFullYear() ===
              now.getFullYear()
          );

        }
      )
      .reduce(
        (sum, expense) =>
          sum + Number(expense.amount),
        0
      );


  const categories = {};


  expenses.forEach(
    (expense) => {

      categories[expense.category] =
        (
          categories[expense.category] || 0
        ) +
        Number(expense.amount);

    }
  );


  let topCategory = "—";
  let topAmount = 0;


  Object.entries(categories).forEach(
    ([category, amount]) => {

      if (amount > topAmount) {

        topCategory = category;
        topAmount = amount;

      }

    }
  );


  if ($("#monthlyExpenses"))
    $("#monthlyExpenses").textContent =
      formatCurrency(monthlyExpenses);


  if ($("#topExpenseCategory"))
    $("#topExpenseCategory").textContent =
      topCategory;


  if ($("#topExpenseCategoryAmount"))
    $("#topExpenseCategoryAmount")
      .textContent =
      formatCurrency(topAmount);

}


/* =========================================================
   TASKS RENDER
   ========================================================= */

function renderTasks() {

  const container =
    $("#tasksContainer");

  if (!container) return;


  const completed =
    tasks.filter(
      task => task.completed
    ).length;


  const pending =
    tasks.length -
    completed;


  const high =
    tasks.filter(
      task =>
        task.priority === "high" &&
        !task.completed
    ).length;


  if ($("#taskTotal"))
    $("#taskTotal").textContent =
      tasks.length;

  if ($("#taskCompleted"))
    $("#taskCompleted").textContent =
      completed;

  if ($("#taskPending"))
    $("#taskPending").textContent =
      pending;

  if ($("#taskHigh"))
    $("#taskHigh").textContent =
      high;


  if (!tasks.length) {

    container.innerHTML =
      emptyState(
        "fa-list-check",
        "No tasks yet",
        "Create your first task."
      );

    return;
  }


  container.innerHTML =
    tasks.map(
      (task) => `

        <div class="task-card">

          <div>

            <strong>
              ${escapeHtml(task.title)}
            </strong>

            <p>
              ${escapeHtml(
                task.description || ""
              )}
            </p>

            <small>
              Due ${formatDate(task.dueDate)}
            </small>

          </div>


          <div>

            <span class="status-badge ${task.priority}">
              ${capitalize(task.priority)}
            </span>

            <button
              class="icon-btn"
              title="Complete task"
              onclick="toggleTask(${task.id})"
            >
              <i class="fa-solid ${
                task.completed
                  ? "fa-rotate-left"
                  : "fa-check"
              }"></i>
            </button>

            <button
              class="icon-btn"
              title="Delete task"
              onclick="deleteTask(${task.id})"
            >
              <i class="fa-solid fa-trash"></i>
            </button>

          </div>

        </div>

      `
    ).join("");

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {

  const revenue =
    invoices
      .filter(
        invoice =>
          invoice.status === "paid"
      )
      .reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );


  const pending =
    invoices
      .filter(
        invoice =>
          invoice.status === "pending"
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


  if ($("#totalRevenue"))
    $("#totalRevenue").textContent =
      formatCurrency(revenue);


  if ($("#pendingPayments"))
    $("#pendingPayments").textContent =
      formatCurrency(pending);


  if ($("#totalExpenses"))
    $("#totalExpenses").textContent =
      formatCurrency(expensesTotal);


  if ($("#activeClients"))
    $("#activeClients").textContent =
      activeClients;


  if ($("#pendingCount"))
    $("#pendingCount").textContent =
      pendingCount;


  if ($("#expenseCount"))
    $("#expenseCount").textContent =
      expenses.length;


  if ($("#clientChange"))
    $("#clientChange").textContent =
      clients.length;


  renderChart();
  renderActivities();
  renderDashboardTasks();
  renderPaymentSummary();

}


/* =========================================================
   REVENUE CHART
   ========================================================= */

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

      year:
        date.getFullYear(),

      month:
        date.getMonth(),

      label:
        date.toLocaleString(
          "en-US",
          {
            month: "short"
          }
        )

    });

  }


  return months;
}


function getMonthlyRevenue(
  year,
  month
) {

  return invoices
    .filter(
      invoice => {

        if (
          invoice.status !== "paid"
        ) {
          return false;
        }


        const date =
          new Date(
            `${invoice.issueDate}T00:00:00`
          );


        return (
          date.getFullYear() === year &&
          date.getMonth() === month
        );

      }
    )
    .reduce(
      (sum, invoice) =>
        sum + Number(invoice.amount),
      0
    );

}


function renderChart() {

  const bars =
    $("#chartBars");

  const labels =
    $("#chartLabels");

  if (!bars || !labels) {
    return;
  }


  const period =
    Number(
      $("#revenuePeriod")?.value || 6
    );


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


      bar.className =
        "chart-bar";


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


/* =========================================================
   ACTIVITIES
   ========================================================= */

function addActivity(
  icon,
  title
) {

  activities.unshift({

    icon,

    title,

    time: "Just now"

  });


  activities =
    activities.slice(0, 30);


  saveData(
    STORAGE_KEYS.activities,
    activities
  );

}


function renderActivities() {

  const container =
    $("#activityList");

  if (!container) return;


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
    .forEach(
      (activity) => {

        const item =
          document.createElement("div");


        item.className =
          "activity-item";


        item.innerHTML = `

          <div class="activity-icon">

            <i class="fa-solid ${
              escapeHtml(activity.icon)
            }"></i>

          </div>


          <div class="activity-content">

            <strong>
              ${escapeHtml(activity.title)}
            </strong>

            <span>
              ${escapeHtml(activity.time)}
            </span>

          </div>

        `;


        container.appendChild(item);

      }
    );

}


/* =========================================================
   DASHBOARD TASKS
   ========================================================= */

function renderDashboardTasks() {

  const container =
    $("#dashboardTasks");

  if (!container) return;


  const upcoming =
    tasks
      .filter(
        task =>
          !task.completed
      )
      .slice(0, 4);


  if (!upcoming.length) {

    container.innerHTML =
      emptyState(
        "fa-check",
        "All clear",
        "No pending tasks."
      );

    return;
  }


  container.innerHTML =
    upcoming.map(
      (task) => `

        <div class="mini-task">

          <div>

            <strong>
              ${escapeHtml(task.title)}
            </strong>

            <span>
              Due ${formatDate(task.dueDate)}
            </span>

          </div>

          <span class="status-badge ${task.priority}">
            ${capitalize(task.priority)}
          </span>

        </div>

      `
    ).join("");

}


/* =========================================================
   PAYMENT SUMMARY
   ========================================================= */

function renderPaymentSummary() {

  const paid =
    invoices
      .filter(
        invoice =>
          invoice.status === "paid"
      )
      .reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );


  const pending =
    invoices
      .filter(
        invoice =>
          invoice.status === "pending"
      )
      .reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );


  const overdue =
    invoices
      .filter(
        invoice =>
          invoice.status === "overdue"
      )
      .reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );


  const total =
    paid +
    pending +
    overdue;


  if ($("#paidAmount"))
    $("#paidAmount").textContent =
      formatCurrency(paid);


  if ($("#pendingAmountSmall"))
    $("#pendingAmountSmall").textContent =
      formatCurrency(pending);


  if ($("#overdueAmount"))
    $("#overdueAmount").textContent =
      formatCurrency(overdue);


  if (total > 0) {

    if ($("#paidProgress"))
      $("#paidProgress").style.width =
        `${(paid / total) * 100}%`;


    if ($("#pendingProgress"))
      $("#pendingProgress").style.width =
        `${(pending / total) * 100}%`;


    if ($("#overdueProgress"))
      $("#overdueProgress").style.width =
        `${(overdue / total) * 100}%`;

  } else {

    if ($("#paidProgress"))
      $("#paidProgress").style.width = "0%";

    if ($("#pendingProgress"))
      $("#pendingProgress").style.width = "0%";

    if ($("#overdueProgress"))
      $("#overdueProgress").style.width = "0%";

  }

}


/* =========================================================
   REPORTS
   ========================================================= */

function renderReports() {

  const revenue =
    invoices
      .filter(
        invoice =>
          invoice.status === "paid"
      )
      .reduce(
        (sum, invoice) =>
          sum + Number(invoice.amount),
        0
      );


  const invoiceValue =
    invoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.amount),
      0
    );


  const expenseValue =
    expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );


  const net =
    revenue -
    expenseValue;


  if ($("#reportRevenue"))
    $("#reportRevenue").textContent =
      formatCurrency(revenue);


  if ($("#reportInvoice"))
    $("#reportInvoice").textContent =
      formatCurrency(invoiceValue);


  if ($("#reportExpenses"))
    $("#reportExpenses").textContent =
      formatCurrency(expenseValue);


  if ($("#reportNet"))
    $("#reportNet").textContent =
      formatCurrency(net);


  const snapshot =
    $("#snapshotList");

  if (!snapshot) return;


  snapshot.innerHTML = `

    <div class="snapshot-row">
      <span>Total Clients</span>
      <strong>${clients.length}</strong>
    </div>

    <div class="snapshot-row">
      <span>Active Clients</span>
      <strong>
        ${
          clients.filter(
            client =>
              client.status === "active"
          ).length
        }
      </strong>
    </div>

    <div class="snapshot-row">
      <span>Total Invoices</span>
      <strong>${invoices.length}</strong>
    </div>

    <div class="snapshot-row">
      <span>Total Expenses</span>
      <strong>${expenses.length}</strong>
    </div>

    <div class="snapshot-row">
      <span>Total Tasks</span>
      <strong>${tasks.length}</strong>
    </div>

  `;

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function addNotification(
  icon,
  title
) {

  notifications.unshift({

    icon,

    title,

    time: "Just now"

  });


  notifications =
    notifications.slice(0, 20);


  saveData(
    STORAGE_KEYS.notifications,
    notifications
  );


  renderNotifications();

}


function initializeNotifications() {

  $("#notificationBtn")?.addEventListener(
    "click",
    () => {

      $("#notificationPanel")
        ?.classList.toggle("show");

    }
  );


  $("#closeNotifications")
    ?.addEventListener(
      "click",
      () => {

        $("#notificationPanel")
          ?.classList.remove("show");

      }
    );


  renderNotifications();

}


function renderNotifications() {

  const container =
    $("#notificationItems");

  if (!container) return;


  if (!notifications.length) {

    container.innerHTML =
      `<p>No notifications.</p>`;

    return;
  }


  container.innerHTML =
    notifications
      .slice(0, 10)
      .map(
        (notification) => `

          <div class="notification-item">

            <div class="notification-icon">

              <i class="fa-solid ${
                escapeHtml(
                  notification.icon ||
                  "fa-bell"
                )
              }"></i>

            </div>

            <div>

              <strong>
                ${escapeHtml(
                  notification.title
                )}
              </strong>

              <span>
                ${escapeHtml(
                  notification.time || ""
                )}
              </span>

            </div>

          </div>

        `
      ).join("");

}


/* =========================================================
   SETTINGS
   ========================================================= */

function initializeSettings() {

  const darkModeSwitch =
    $("#darkModeSwitch");


  if (darkModeSwitch) {

    darkModeSwitch.checked =
      !document.body.classList.contains(
        "light-mode"
      );


    darkModeSwitch.addEventListener(
      "change",
      () => {

        if (
          darkModeSwitch.checked
        ) {

          document.body.classList.remove(
            "light-mode"
          );

          localStorage.setItem(
            STORAGE_KEYS.theme,
            "dark"
          );

        } else {

          document.body.classList.add(
            "light-mode"
          );

          localStorage.setItem(
            STORAGE_KEYS.theme,
            "light"
          );

        }

        updateThemeIcon();

      }
    );

  }


  $("#clearDataBtn")
    ?.addEventListener(
      "click",
      resetAllData
    );


  $("#notificationSwitch")
    ?.addEventListener(
      "change",
      (event) => {

        if (!event.target.checked) {

          notifications = [];

        } else {

          notifications =
            [...DEFAULT_NOTIFICATIONS];

        }


        saveData(
          STORAGE_KEYS.notifications,
          notifications
        );


        renderNotifications();


        showToast(
          event.target.checked
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

  } else {

    document.body.classList.remove(
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
    light
      ? "light"
      : "dark"
  );


  updateThemeIcon();


  const darkModeSwitch =
    $("#darkModeSwitch");

  if (darkModeSwitch) {

    darkModeSwitch.checked =
      !light;

  }

}


function updateThemeIcon() {

  const icon =
    $("#themeToggle i");

  if (!icon) return;


  const light =
    document.body.classList.contains(
      "light-mode"
    );


  icon.className =
    light
      ? "fa-solid fa-sun"
      : "fa-solid fa-moon";

}


/* =========================================================
   DELETE CLIENT
   ========================================================= */

function deleteClient(id) {

  const client =
    clients.find(
      item => item.id === id
    );


  if (!client) return;


  if (
    !confirm(
      `Delete ${client.company}?`
    )
  ) {
    return;
  }


  clients =
    clients.filter(
      item => item.id !== id
    );


  saveData(
    STORAGE_KEYS.clients,
    clients
  );


  addActivity(
    "fa-trash",
    `${client.company} was removed`
  );


  renderEverything();


  showToast(
    "Client deleted."
  );

}


/* =========================================================
   DELETE INVOICE
   ========================================================= */

function deleteInvoice(id) {

  const invoice =
    invoices.find(
      item => item.id === id
    );


  if (!invoice) return;


  if (
    !confirm(
      `Delete ${invoice.invoice}?`
    )
  ) {
    return;
  }


  invoices =
    invoices.filter(
      item => item.id !== id
    );


  saveData(
    STORAGE_KEYS.invoices,
    invoices
  );


  addActivity(
    "fa-trash",
    `${invoice.invoice} was deleted`
  );


  renderEverything();


  showToast(
    "Invoice deleted."
  );

}


/* =========================================================
   DELETE EXPENSE
   ========================================================= */

function deleteExpense(id) {

  const expense =
    expenses.find(
      item => item.id === id
    );


  if (!expense) return;


  if (
    !confirm(
      `Delete ${expense.description}?`
    )
  ) {
    return;
  }


  expenses =
    expenses.filter(
      item => item.id !== id
    );


  saveData(
    STORAGE_KEYS.expenses,
    expenses
  );


  addActivity(
    "fa-trash",
    `${expense.description} expense was deleted`
  );


  renderEverything();


  showToast(
    "Expense deleted."
  );

}


/* =========================================================
   TASK ACTIONS
   ========================================================= */

function toggleTask(id) {

  const task =
    tasks.find(
      item => item.id === id
    );


  if (!task) return;


  task.completed =
    !task.completed;


  saveData(
    STORAGE_KEYS.tasks,
    tasks
  );


  addActivity(
    task.completed
      ? "fa-check"
      : "fa-rotate-left",

    task.completed
      ? `Task "${task.title}" completed`
      : `Task "${task.title}" reopened`
  );


  renderEverything();


  showToast(
    task.completed
      ? "Task completed."
      : "Task reopened."
  );

}


function deleteTask(id) {

  const task =
    tasks.find(
      item => item.id === id
    );


  if (!task) return;


  if (
    !confirm(
      `Delete "${task.title}"?`
    )
  ) {
    return;
  }


  tasks =
    tasks.filter(
      item => item.id !== id
    );


  saveData(
    STORAGE_KEYS.tasks,
    tasks
  );


  addActivity(
    "fa-trash",
    `Task "${task.title}" was deleted`
  );


  renderEverything();


  showToast(
    "Task deleted."
  );

}


/* =========================================================
   RESET ALL DATA
   ========================================================= */

function resetAllData() {

  const confirmed =
    confirm(
      "Reset all dashboard data to the original demo data?"
    );


  if (!confirmed) {
    return;
  }


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
   TOAST
   ========================================================= */

function showToast(
  message,
  type = "success"
) {

  const container =
    $("#toastContainer");

  if (!container) {
    return;
  }


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
        ${
          type === "error"
            ? "Something went wrong"
            : "Success"
        }
      </strong>

      <span>
        ${escapeHtml(message)}
      </span>

    </div>

  `;


  container.appendChild(toast);


  setTimeout(
    () => {

      toast.style.opacity =
        "0";

      toast.style.transform =
        "translateX(30px)";


      setTimeout(
        () => toast.remove(),
        300
      );

    },
    3000
  );

}


/* =========================================================
   QUICK ACTION STYLES
   ========================================================= */

const quickActionStyle =
  document.createElement("style");


quickActionStyle.textContent = `

  .quick-actions-grid {

    display: grid;

    grid-template-columns:
      repeat(2, 1fr);

    gap: 12px;

  }


  .quick-action-btn {

    min-height: 115px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    gap: 8px;

    padding: 18px;

    color: var(--text-soft);

    background: #0b0b12;

    border: 1px solid var(--border);

    border-radius: 13px;

    cursor: pointer;

    transition:
      transform 0.25s ease,
      border-color 0.25s ease,
      background 0.25s ease;

  }


  .quick-action-btn i {

    color: var(--primary-light);

    font-size: 22px;

  }


  .quick-action-btn strong {

    font-size: 13px;

  }


  .quick-action-btn span {

    font-size: 11px;

    opacity: 0.7;

  }


  .quick-action-btn:hover {

    transform: translateY(-2px);

    border-color:
      rgba(139, 92, 246, 0.5);

    background:
      rgba(139, 92, 246, 0.08);

  }


  .modal-form {

    display: flex;

    flex-direction: column;

    gap: 15px;

  }


  .modal-form textarea {

    width: 100%;

    resize: vertical;

  }


  .modal-actions {

    display: flex;

    justify-content: flex-end;

    gap: 10px;

    margin-top: 8px;

  }


  .mini-task {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 12px;

    padding: 12px 0;

    border-bottom:
      1px solid var(--border);

  }


  .mini-task:last-child {

    border-bottom: none;

  }


  .mini-task > div {

    display: flex;

    flex-direction: column;

    gap: 4px;

  }


  .mini-task span {

    font-size: 11px;

    opacity: 0.7;

  }


  .notification-item {

    display: flex;

    gap: 12px;

    padding: 12px 0;

    border-bottom:
      1px solid var(--border);

  }


  .notification-item > div:last-child {

    display: flex;

    flex-direction: column;

    gap: 4px;

  }


  .notification-item span {

    font-size: 11px;

    opacity: 0.65;

  }


  @media (max-width: 600px) {

    .quick-actions-grid {

      grid-template-columns: 1fr;

    }

    .modal-actions {

      flex-direction: column;

    }

    .modal-actions button {

      width: 100%;

    }

  }

`;


document.head.appendChild(
  quickActionStyle
);


/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
  "%c✦ Luma Client Operations Dashboard",
  "font-size:18px;font-weight:bold;color:#a78bfa;"
);

console.log(
  "%cComplete interactive JavaScript loaded.",
  "font-size:12px;color:#888;"
);
