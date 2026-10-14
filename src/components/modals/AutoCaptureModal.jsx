import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { Camera, Download, Play, CheckCircle2, Loader2, X, Image as ImageIcon, Eye, Settings2, Maximize } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AutoCaptureModal({ isOpen, onClose }) {
  const { setActiveTab, activeTab } = useApp();
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [capturedScreenshots, setCapturedScreenshots] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [renderDelay, setRenderDelay] = useState(1500); // 1.5s delay chuẩn
  const [captureMode, setCaptureMode] = useState('full'); // 'full' (Toàn bộ trang gồm Header + Sidebar) hoặc 'content' (Chỉ nội dung)

  const screens = [
    {
      id: 'workspace',
      name: '1. Bàn làm việc (Workspace)',
      desc: 'Tổng quan công việc cần xử lý, KPI và danh sách yêu cầu',
      filename: '01_workspace_home.png'
    },
    {
      id: 'wizard',
      name: '2. Tạo yêu cầu mua (Item Request Wizard)',
      desc: 'Form tạo đề xuất mua sắm linh kiện, phụ tùng vật tư',
      filename: '02_item_request_wizard.png'
    },
    {
      id: 'pic_review',
      name: '3. Duyệt kỹ thuật (PIC Review Hub)',
      desc: 'Bàn làm việc của PIC duyệt mã, báo giá và định mức',
      filename: '03_pic_review_hub.png'
    },
    {
      id: 'appraisal',
      name: '4. Thẩm định ngân sách (Monthly Appraisal)',
      desc: 'Báo cáo thẩm định tháng, ngân sách và ký duyệt điều hành',
      filename: '04_monthly_appraisal.png'
    },
    {
      id: 'po_lifecycle',
      name: '5. Theo dõi đơn hàng (PO Lifecycle)',
      desc: 'Bảng Kanban theo dõi tiến độ đơn hàng từ phát hành đến giao hàng',
      filename: '05_po_lifecycle.png'
    },
    {
      id: 'warehouse',
      name: '6. Quản lý kho & Xuất hàng (Warehouse & WO)',
      desc: 'Kiểm định chất lượng QC, nhập kho và xuất theo lệnh WO',
      filename: '06_warehouse_hub.png'
    },
    {
      id: 'dashboard',
      name: '7. Báo cáo quản trị (Leader Dashboard)',
      desc: 'Biểu đồ phân tích tài chính, rủi ro dừng chuyền & KPI chuỗi cung ứng',
      filename: '07_leader_dashboard.png'
    }
  ];

  // Hàm chờ trang và các biểu đồ/hình ảnh render hoàn thiện
  const waitForPageReady = async (delayMs) => {
    // 1. Chờ delay cơ bản
    await new Promise((r) => setTimeout(r, delayMs));

    // 2. Chờ font sẵn sàng
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {
        // ignore
      }
    }

    // 3. Chờ thêm 2 animation frame để đảm bảo React và Recharts đã hoàn tất paint
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  };

  const captureSingleScreen = async (screen) => {
    setActiveTab(screen.id);

    // Chờ màn hình render ổn định
    await waitForPageReady(renderDelay);

    // Xác định phần tử cần chụp: 'full' = toàn bộ app (App-root), 'content' = phần main
    const targetEl =
      captureMode === 'full'
        ? document.getElementById('app-root') || document.body
        : document.querySelector('main') || document.body;

    const mainEl = document.querySelector('main');
    if (mainEl && mainEl.scrollTop) mainEl.scrollTop = 0;

    const canvas = await html2canvas(targetEl, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#F8FAFC',
      windowWidth: 1680,
      windowHeight: 1050,
      ignoreElements: (element) => {
        return (
          element.classList.contains('auto-capture-overlay') ||
          element.getAttribute('data-capture-ignore') === 'true'
        );
      }
    });

    const dataUrl = canvas.toDataURL('image/png');
    return {
      id: screen.id,
      name: screen.name,
      filename: screen.filename,
      dataUrl,
      timestamp: new Date().toLocaleTimeString()
    };
  };

  const handleCaptureSingle = async (screen) => {
    setIsCapturing(true);
    try {
      const result = await captureSingleScreen(screen);
      setCapturedScreenshots((prev) => {
        const filtered = prev.filter((s) => s.id !== screen.id);
        return [...filtered, result];
      });
    } catch (err) {
      console.error('Capture error:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleCaptureAll = async () => {
    setIsCapturing(true);
    setCapturedScreenshots([]);
    const results = [];

    const originalTab = activeTab;

    for (let i = 0; i < screens.length; i++) {
      setCurrentStepIndex(i);
      try {
        const item = await captureSingleScreen(screens[i]);
        results.push(item);
        setCapturedScreenshots([...results]);
      } catch (err) {
        console.error(`Error capturing ${screens[i].name}:`, err);
      }
    }

    setActiveTab(originalTab);
    setIsCapturing(false);
    setCurrentStepIndex(-1);
  };

  const handleDownloadSingle = (screenshot) => {
    const link = document.createElement('a');
    link.href = screenshot.dataUrl;
    link.download = screenshot.filename;
    link.click();
  };

  const handleDownloadAllZip = async () => {
    if (capturedScreenshots.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder('sp_flow_documentation_images');

    capturedScreenshots.forEach((item) => {
      const base64Data = item.dataUrl.replace(/^data:image\/png;base64,/, '');
      folder.file(item.filename, base64Data, { base64: true });
    });

    folder.file(
      'README.txt',
      `TÀI LIỆU HÌNH ẢNH HỆ THỐNG SP-FLOW\nChế độ chụp: ${captureMode === 'full' ? 'Full trang web (Gồm Sidebar + Header + Nội dung)' : 'Chỉ nội dung'}\nThời gian xuất: ${new Date().toLocaleString('vi-VN')}\n\nDanh sách hình ảnh chụp theo chức năng:\n` +
        capturedScreenshots.map((s, idx) => `${idx + 1}. ${s.name} -> File: ${s.filename}`).join('\n')
    );

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SP_FLOW_Full_Screenshots_${new Date().toISOString().slice(0, 10)}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 
        Khi đang chụp tuần tự (isCapturing), modal thu nhỏ gọn ở góc dưới
        để không che khuất màn hình chụp Full
      */}
      <div
        className={`fixed z-50 transition-all duration-300 auto-capture-overlay ${
          isCapturing
            ? 'bottom-6 right-6 w-96 rounded-2xl shadow-2xl bg-white border-2 border-indigo-500 overflow-hidden animate-bounce-short'
            : 'inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in'
        }`}
      >
        <div
          className={`bg-white flex flex-col ${
            isCapturing
              ? 'w-full p-4 space-y-3'
              : 'rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-hidden'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between ${
              isCapturing
                ? 'border-b border-slate-100 pb-2'
                : 'px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 ${
                  isCapturing ? 'w-8 h-8' : 'w-10 h-10'
                }`}
              >
                <Camera className={`${isCapturing ? 'w-4 h-4' : 'w-5 h-5'}`} />
              </div>
              <div>
                <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
                  Tự Động Chụp Full Trang Web
                  {!isCapturing && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Maximize className="w-3 h-3" />
                      Full Screen
                    </span>
                  )}
                </h2>
                {!isCapturing && (
                  <p className="text-xs text-slate-500">
                    Chụp toàn bộ giao diện hoàn chỉnh (Thanh menu Sidebar, Header và Nội dung chi tiết)
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isCapturing}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Khi đang chụp: Hiển thị thanh tiến trình nhỏ gọn */}
          {isCapturing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-900 flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  Đang chụp Full trang ({currentStepIndex + 1}/{screens.length}):
                </span>
                <span className="font-mono text-slate-500 font-bold">
                  {Math.round(((currentStepIndex + 1) / screens.length) * 100)}%
                </span>
              </div>

              <div className="p-2.5 bg-indigo-50/80 border border-indigo-100 rounded-lg text-xs font-semibold text-indigo-800 truncate">
                {screens[currentStepIndex]?.name}
              </div>

              <p className="text-[11px] text-slate-500 leading-tight italic">
                * Tự động điều hướng và chụp lại toàn bộ màn hình hệ thống chuẩn nét cao...
              </p>
            </div>
          ) : (
            /* Khi không chụp: Hiển thị giao diện điều khiển */
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Action & Options Bar */}
                <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="text-xs text-indigo-900 space-y-1.5">
                    <div>
                      <span className="font-semibold">Tiến độ:</span> {capturedScreenshots.length} /{' '}
                      {screens.length} chức năng đã chụp xong.
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-slate-700">
                      {/* Chọn chế độ chụp */}
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-600">Phạm vi chụp:</span>
                        <select
                          value={captureMode}
                          onChange={(e) => setCaptureMode(e.target.value)}
                          className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="full">Full trang (Sidebar + Header + Nội dung)</option>
                          <option value="content">Chỉ nội dung màn hình</option>
                        </select>
                      </div>

                      {/* Chọn delay */}
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-600">Chờ tải trang:</span>
                        <select
                          value={renderDelay}
                          onChange={(e) => setRenderDelay(Number(e.target.value))}
                          className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value={1000}>1.0s</option>
                          <option value={1500}>1.5s (Khuyên dùng)</option>
                          <option value={2000}>2.0s</option>
                          <option value={3000}>3.0s</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <button
                      onClick={handleCaptureAll}
                      disabled={isCapturing}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Chụp tất cả (1-Click)
                    </button>

                    {capturedScreenshots.length > 0 && (
                      <button
                        onClick={handleDownloadAllZip}
                        disabled={isCapturing}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Tải file ZIP ({capturedScreenshots.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* List of Screens to Capture */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Danh sách các chức năng cần chụp
                  </h3>

                  <div className="grid grid-cols-1 gap-2.5">
                    {screens.map((screen, idx) => {
                      const captured = capturedScreenshots.find((s) => s.id === screen.id);

                      return (
                        <div
                          key={screen.id}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                            captured
                              ? 'border-emerald-200 bg-emerald-50/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="flex-shrink-0">
                              {captured ? (
                                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 font-semibold text-xs flex items-center justify-center">
                                  {idx + 1}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {screen.name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {screen.filename}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {screen.desc}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            {captured && (
                              <>
                                <button
                                  onClick={() => setPreviewImage(captured.dataUrl)}
                                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 transition-colors"
                                  title="Xem trước ảnh"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDownloadSingle(captured)}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs flex items-center gap-1 transition-colors font-medium"
                                  title="Tải ảnh này về"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleCaptureSingle(screen)}
                              disabled={isCapturing}
                              className="px-2.5 py-1 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                            >
                              {captured ? 'Chụp lại' : 'Chụp'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  Chế độ Full trang: Bao gồm trọn vẹn Sidebar, Header và Nội dung theo kích thước tỷ lệ chuẩn
                </span>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-6 animate-fade-in">
          <div className="relative max-w-6xl max-h-[92vh] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col">
            <div className="p-3 bg-slate-800 text-white flex justify-between items-center text-xs">
              <span className="font-semibold">Xem trước ảnh chụp Full trang web</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 overflow-auto flex-1 flex items-center justify-center bg-slate-950">
              <img
                src={previewImage}
                alt="Capture Preview"
                className="max-h-[82vh] w-auto object-contain rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
