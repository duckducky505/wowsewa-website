// config/navConfig.js
import {
  MdSpaceDashboard, MdCalendarMonth, MdHistory, MdSettings,
  MdAssignmentInd, MdPeopleAlt, MdBuild, MdAccountBalanceWallet,
  MdReceiptLong, MdSupportAgent,
} from "react-icons/md";

// Every route the app can show in the sidebar, tagged with which roles can
// see it and which labeled section it falls under for that role.
const ALL_NAV_ITEMS = [
  // ---- Customer ----
  { key: "dashboard-customer", label: "Dashboard", path: "/customer/dashboard", icon: MdSpaceDashboard, roles: ["customer"], group: "Workspace" },
  { key: "book", label: "Book a service", path: "customer/booking", icon: MdCalendarMonth, roles: ["customer"], group: "Workspace" },
  { key: "history", label: "Booking history", path: "/customer/history", icon: MdHistory, roles: ["customer"], group: "Workspace" },
  { key: "settings", label: "Settings", path: "/settings", icon: MdSettings, roles: ["customer"], group: "Account" },

  // ---- Receptionist ----
  { key: "queue", label: "Booking queue", path: "/receptionist/queue", icon: MdAssignmentInd, roles: ["receptionist"], group: "Operations" },
  { key: "technicians", label: "Technicians", path: "/receptionist/technicians", icon: MdBuild, roles: ["receptionist"], group: "Operations" },

  // ---- Admin ----
  { key: "dashboard-admin", label: "Dashboard", path: "/admin/dashboard", icon: MdSpaceDashboard, roles: ["admin"], group: "Overview" },
  { key: "jobs", label: "Jobs & pricing", path: "/admin/jobs", icon: MdBuild, roles: ["admin"], group: "Operations" },
  { key: "jobs-category", label: "Jobs Category", path: "/admin/Category", icon: MdBuild, roles: ["admin"], group: "Operations" },
  { key: "staff", label: "Staffs", path: "/admin/staff", icon: MdPeopleAlt, roles: ["admin"], group: "Operations" },
  { key: "cashflow", label: "Cash Flow", path: "/admin/cashflow", icon: MdAccountBalanceWallet, roles: ["admin"], group: "Finance" },
  { key: "holding", label: "Holding Sheet", path: "/admin/holding-sheet", icon: MdReceiptLong, roles: ["admin"], group: "Finance" },
  { key: "receivable", label: "Receivable Payable", path: "/admin/receivable-payable", icon: MdReceiptLong, roles: ["admin"], group: "Finance" },

  // ---- Shared ----
  { key: "support", label: "Support", path: "/support", icon: MdSupportAgent, roles: ["customer", "receptionist", "admin"], group: "Account" },
];

// Controls the order sections render in, per role. Anything not listed
// falls back to appearing after the named groups, in first-seen order.
const GROUP_ORDER = ["Overview", "Workspace", "Operations", "Finance", "Account"];

/** Flat list — kept for anything that just needs "all items for this role." */
export function getNavItemsForRole(role) {
  return ALL_NAV_ITEMS.filter((item) => item.roles.includes(role));
}

/** Grouped list — [{ group: "Operations", items: [...] }, ...] in display order. */
export function getGroupedNavForRole(role) {
  const items = getNavItemsForRole(role);
  const groups = new Map();

  items.forEach((item) => {
    const key = item.group || "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });

  const ordered = [...groups.keys()].sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a);
    const bi = GROUP_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return ordered.map((group) => ({ group, items: groups.get(group) }));
}

export const ROLE_LABELS = {
  customer: "Customer",
  receptionist: "Front desk",
  admin: "Admin",
};

export default ALL_NAV_ITEMS;