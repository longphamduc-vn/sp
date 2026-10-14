import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_ITEMS,
  INITIAL_TASKS,
  INITIAL_WORK_ORDERS,
  APPRAISAL_DATA
} from '../data/mockData';
import {
  getTranslation,
  translateCategory as i18nCategory,
  translateReason as i18nReason,
  translateStatus as i18nStatus
} from '../i18n';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Internationalization (i18n)
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('sp_lang') || 'vi';
    } catch {
      return 'vi';
    }
  });

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('sp_lang', newLang);
    } catch {
      // ignore
    }
  };

  const t = (path, params) => getTranslation(language, path, params);
  const translateCategory = (cat) => i18nCategory(cat, language);
  const translateReason = (reason) => i18nReason(reason, language);
  const translateStatus = (status) => i18nStatus(status, language);

  // Navigation & Role
  const [activeTab, setActiveTab] = useState('workspace');
  const [activeRole, setActiveRole] = useState('Requestor');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data Collections
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [appraisal, setAppraisal] = useState(APPRAISAL_DATA);

  // Notification System
  const notifications = useMemo(() => {
    if (language === 'vi') {
      return [
        {
          id: "NOTIF-1",
          title: "Cần giải trình kỹ thuật cho duyệt PIC",
          desc: "Vật tư SP-9021 yêu cầu làm rõ số lượng & cơ sở định mức.",
          time: "12 phút trước",
          read: false,
          tabTarget: "workspace"
        },
        {
          id: "NOTIF-2",
          title: "Thông báo biến động giá: +20%",
          desc: "Đơn giá PO-8802 điều chỉnh từ $150 lên $180 bởi Mitsubishi.",
          time: "45 phút trước",
          read: false,
          tabTarget: "po_lifecycle"
        },
        {
          id: "NOTIF-3",
          title: "Hàng về cổng Dock 2: PLC S7-1200",
          desc: "CPU Siemens đã giao tới Dock 2. Cần kiểm tra QC nhập kho.",
          time: "2 giờ trước",
          read: false,
          tabTarget: "warehouse"
        },
        {
          id: "NOTIF-4",
          title: "Báo cáo thẩm định tháng MTD đã sẵn sàng",
          desc: "Báo cáo ngân sách Tháng 10 đã chuẩn bị xong để Lãnh đạo ký duyệt.",
          time: "3 giờ trước",
          read: true,
          tabTarget: "appraisal"
        }
      ];
    }
    return [
      {
        id: "NOTIF-1",
        title: "PIC Logic Clarification Needed",
        desc: "Item SP-9021 requires quantity & calculation justification.",
        time: "12m ago",
        read: false,
        tabTarget: "workspace"
      },
      {
        id: "NOTIF-2",
        title: "Price Increase Notice: +20%",
        desc: "PO-8802 unit price updated from $150 to $180 by Mitsubishi.",
        time: "45m ago",
        read: false,
        tabTarget: "po_lifecycle"
      },
      {
        id: "NOTIF-3",
        title: "Gate 2 Arrived: S7-1200 PLC",
        desc: "Siemens CPU arrived at Dock 2. QC verification required.",
        time: "2h ago",
        read: false,
        tabTarget: "warehouse"
      },
      {
        id: "NOTIF-4",
        title: "Appraisal Batch MTD Prepared",
        desc: "October budget report is ready for Leader sign-off.",
        time: "3h ago",
        read: true,
        tabTarget: "appraisal"
      }
    ];
  }, [language]);

  // Toasts System
  const [toasts, setToasts] = useState([]);
  const addToast = (title, description = '', type = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modals & Drawer States
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [taskTargetItem, setTaskTargetItem] = useState(null);

  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [selectedPoDetail, setSelectedPoDetail] = useState(null);

  // Actions
  const addItemRequest = (newItem) => {
    const createdItem = {
      ...newItem,
      id: newItem.id || `SP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      requestDate: new Date().toISOString().split('T')[0],
      requestor: activeRole === 'Requestor' ? "Tran Minh Tuan (You)" : `${activeRole} Operator`,
      status: "In Review",
      stage: "pic_review",
      deliveredQty: 0,
      remainingQty: Number(newItem.requestedQty) || 1,
      targetSystemApproved: false
    };

    setItems((prev) => [createdItem, ...prev]);
    addToast(
      "Spare Part Request Submitted",
      `Request for ${createdItem.name} (${createdItem.id}) routed to PIC Review Hub.`,
      "success"
    );
  };

  const advancePoStage = (itemId, targetStage) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const statusMap = {
            po_request: "PO Request",
            po_standby: "PO Standby",
            po_remained: "PO Remained",
            po_receiving: "PO Receiving"
          };
          return {
            ...item,
            stage: targetStage,
            status: statusMap[targetStage] || item.status
          };
        }
        return item;
      })
    );
    const item = items.find((i) => i.id === itemId);
    const stageNames = {
      po_request: "PO Request",
      po_standby: "PO Standby",
      po_remained: "PO Remained",
      po_receiving: "PO Receiving"
    };
    addToast(
      "PO Lifecycle Stage Updated",
      `${item?.poNumber || itemId} moved to stage [${stageNames[targetStage]}].`,
      "info"
    );
  };

  const syncMasterCodes = () => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.codeStatus.includes("Stop PO")) {
          return { ...item, codeStatus: "Active (Synced Master)" };
        }
        return item;
      })
    );
    addToast(
      "Master Code Synchronization Completed",
      "Synced 5 codes from Master Code database. All active flags refreshed.",
      "success"
    );
  };

  const requestActiveCode = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, codeStatus: "Active Requested ⏳" } : item
      )
    );
    addToast(
      "Master Code Activation Sent",
      `Dispatched formal activation ticket to Enterprise Master Code Board for ${itemId}.`,
      "success"
    );
  };

  const sendReviseEmail = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, priceStatus: "Revise Email Sent ✉️" } : item
      )
    );
    addToast(
      "Revise Email Dispatched",
      `Quotation revision notification sent to Procurement Purchaser for ${itemId}.`,
      "info"
    );
  };

  const createPICClarificationTask = (item, comment) => {
    const newTask = {
      id: `TASK-${Date.now().toString().slice(-4)}`,
      title: `PIC Feedback for ${item.id}: Additional Justification Needed`,
      description: comment || "Please clarify usage frequency and calculation logic for this request.",
      targetId: item.id,
      type: "clarification",
      severity: "warning",
      sender: `PIC Specialist (${activeRole})`,
      createdAt: "Just now",
      read: false,
      actionRequired: "Reply to PIC Reviewer"
    };
    setTasks((prev) => [newTask, ...prev]);
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, clarificationRequested: true, clarificationNote: comment } : i
      )
    );
    setIsCreateTaskModalOpen(false);
    addToast("Task Created for Requestor", `Task dispatched to requestor inbox for item ${item.id}.`, "success");
  };

  const replyToTask = (taskId, replyMessage) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    // Find task
    const currentTask = tasks.find((t) => t.id === taskId);
    if (currentTask && currentTask.targetId) {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === currentTask.targetId) {
            return {
              ...item,
              clarificationRequested: false,
              logic: `${item.logic} \n[Updated Justification]: ${replyMessage}`,
              status: "PIC Review (Updated)"
            };
          }
          return item;
        })
      );
    }
    setIsTaskDrawerOpen(false);
    setSelectedTask(null);
    addToast(
      "Clarification Reply Sent",
      "Your reply has been submitted. PIC Reviewer has been notified.",
      "success"
    );
  };

  const passQcAndStockIn = (itemId) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            qcPassed: true,
            status: "Stocked In (Inventory)",
            availableStock: (item.availableStock || 0) + (item.requestedQty || 1)
          };
        }
        return item;
      })
    );
    // Also resolve task if any
    setTasks((prev) => prev.filter((t) => t.targetId !== itemId));
    addToast("QC Passed & Stocked In", `Item ${itemId} has passed QC inspection and is placed in Inventory.`, "success");
  };

  const issueWorkOrderStock = (woData) => {
    const isMismatch = Number(woData.issuedQty) < Number(woData.requestedQty);
    const newWo = {
      woCode: woData.woCode || `WO-2026-${Math.floor(8820 + Math.random() * 100)}`,
      targetItemCode: woData.targetItemCode,
      itemName: woData.itemName,
      line: woData.line || "Line 02 - SMT",
      requestedQty: Number(woData.requestedQty),
      issuedQty: Number(woData.issuedQty),
      issueReason: woData.issueReason || "Maintenance Replacement",
      issueDate: new Date().toLocaleString(),
      issuedBy: activeRole === 'Warehouse Keeper' ? "Nguyen Van Khoa (Warehouse)" : `${activeRole} Operator`,
      issueCost: `$${(Number(woData.issuedQty) * 45).toFixed(2)}`,
      status: isMismatch ? "Partial Issued" : "Fully Issued",
      mismatchWarning: isMismatch
        ? `⚠️ Issue Quantity Mismatch: Missing ${Number(woData.requestedQty) - Number(woData.issuedQty)} pcs compared to original request (Likely issued by another team).`
        : null
    };

    setWorkOrders((prev) => [newWo, ...prev]);

    // Deduct stock from item if found
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === woData.targetItemCode) {
          const remainingStock = Math.max(0, (item.availableStock || 0) - Number(woData.issuedQty));
          return {
            ...item,
            availableStock: remainingStock,
            interlockStatus: remainingStock > 0 ? `⚠️ ${remainingStock} pcs Stock Found` : "OK"
          };
        }
        return item;
      })
    );

    if (isMismatch) {
      addToast(
        "Issue Mismatch Detected",
        `Issued ${newWo.issuedQty} of ${newWo.requestedQty} pcs. Discrepancy logged.`,
        "warning"
      );
    } else {
      addToast(
        "Stock Issued Successfully",
        `Work Order ${newWo.woCode} fulfilled for ${newWo.issuedQty} pcs.`,
        "success"
      );
    }
  };

  const submitManagementSignOff = (result, minutesFileName) => {
    setAppraisal((prev) => ({
      ...prev,
      reviewStatus: result === 'Approve' ? 'Management Approved ✅' : 'Management Rejected ❌',
      signOffResult: result,
      meetingMinutesFile: minutesFileName || "Signed_Appraisal_Minutes_OCT2026.pdf"
    }));
    setIsManagementModalOpen(false);
    addToast(
      "Management Result Recorded",
      `October Monthly Appraisal marked as: [${result}]. Minutes attached.`,
      result === 'Approve' ? 'success' : 'danger'
    );
  };

  const exportExcelReport = () => {
    // Generate clean CSV content
    const headers = [
      "Item ID",
      "Item Name",
      "Category",
      "Line / Process",
      "Requested Qty",
      "Unit Price ($)",
      "Total Cost ($)",
      "Status",
      "Code Status",
      "Price Status",
      "Interlock Status",
      "Requestor",
      "Need-By Date"
    ];

    const rows = items.map((i) => [
      `"${i.id}"`,
      `"${i.name}"`,
      `"${i.category}"`,
      `"${i.line}"`,
      i.requestedQty,
      i.unitPrice,
      (i.requestedQty * i.unitPrice).toFixed(2),
      `"${i.status}"`,
      `"${i.codeStatus}"`,
      `"${i.priceStatus}"`,
      `"${i.interlockStatus}"`,
      `"${i.requestor}"`,
      `"${i.needByDate}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Enterprise_Spare_Parts_Appraisal_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(
      "Spreadsheet Export Complete",
      "Enterprise Spare Parts Monthly Appraisal report has been downloaded (CSV).",
      "success"
    );
  };

  // Filtered Items based on Global Search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.id.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        (item.poNumber && item.poNumber.toLowerCase().includes(q)) ||
        (item.requestor && item.requestor.toLowerCase().includes(q)) ||
        (item.line && item.line.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateCategory,
        translateReason,
        translateStatus,
        activeTab,
        setActiveTab,
        activeRole,
        setActiveRole,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        searchQuery,
        setSearchQuery,
        items,
        filteredItems,
        tasks,
        workOrders,
        appraisal,
        notifications,
        unreadNotificationsCount,
        toasts,
        addToast,
        removeToast,
        // Drawer & Modals
        isTaskDrawerOpen,
        setIsTaskDrawerOpen,
        selectedTask,
        setSelectedTask,
        isCreateTaskModalOpen,
        setIsCreateTaskModalOpen,
        taskTargetItem,
        setTaskTargetItem,
        isManagementModalOpen,
        setIsManagementModalOpen,
        selectedPoDetail,
        setSelectedPoDetail,
        // Methods
        addItemRequest,
        advancePoStage,
        syncMasterCodes,
        requestActiveCode,
        sendReviseEmail,
        createPICClarificationTask,
        replyToTask,
        passQcAndStockIn,
        issueWorkOrderStock,
        submitManagementSignOff,
        exportExcelReport
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
