import React, { useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:8000';

export default function ExpenseEntry({
  expenseForm,
  setExpenseForm,
  EXPENSE_HEADS,
  loading,
  onSubmit,
  setActiveTab,
  formatBanglaNumber
}) {

  // Auto Voucher ID Generation on date change
  useEffect(() => {
    const generateVoucherId = async () => {
      if (!expenseForm.date) return;
      const dateParts = expenseForm.date.split('-');
      if (dateParts.length < 2) return;
      const yy = dateParts[0].slice(-2);
      const mm = dateParts[1];
      const prefix = `EXP-${yy}${mm}`;

      try {
        const res = await fetch(`${API_BASE_URL}/api/finance/transactions?limit=100&type=expense`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const matchingIds = data.data
            .map(tx => tx.voucherNo)
            .filter(id => id && id.startsWith(prefix));

          if (matchingIds.length > 0) {
            const counters = matchingIds.map(id => {
              const suffix = id.substring(prefix.length);
              const num = parseInt(suffix, 10);
              return isNaN(num) ? 0 : num;
            });
            const maxCounter = Math.max(...counters);
            const nextCounter = maxCounter + 1;
            setExpenseForm(prev => ({
              ...prev,
              voucherNo: `${prefix}${String(nextCounter).padStart(4, '0')}`
            }));
            return;
          }
        }
        setExpenseForm(prev => ({ ...prev, voucherNo: `${prefix}0001` }));
      } catch (err) {
        console.error("Error generating dynamic Voucher ID:", err);
        setExpenseForm(prev => ({ ...prev, voucherNo: `${prefix}0001` }));
      }
    };

    generateVoucherId();
  }, [expenseForm.date, setExpenseForm]);

  // Handlers for Items list
  const handleAddRow = () => {
    setExpenseForm({
      ...expenseForm,
      items: [...expenseForm.items, { head: EXPENSE_HEADS[0], amount: '', institutionName: '', shopName: '', shopVoucher: '' }]
    });
  };

  const handleRemoveRow = (index) => {
    const newItems = [...expenseForm.items];
    newItems.splice(index, 1);
    setExpenseForm({ ...expenseForm, items: newItems });
  };

  const handleRowChange = (index, field, value) => {
    const newItems = [...expenseForm.items];
    newItems[index][field] = value;
    setExpenseForm({ ...expenseForm, items: newItems });
  };

  const currentExpenseTotal = expenseForm.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const currentExpenseBalance = (parseFloat(expenseForm.advanceAmount) || 0) - currentExpenseTotal;

  return (
    <div className="max-w-4xl mx-auto bg-white border-2 border-emerald-900/10 rounded-2xl shadow-xs overflow-hidden print:hidden">
      {/* Header Banner */}
      <div className="bg-emerald-900 text-white p-4 sm:p-6 text-center space-y-1">
        <h2 className="text-lg sm:text-xl font-black tracking-wide">আস-সালাম আইডিয়াল মাদরাসা (এইম)</h2>
        <p className="text-xs text-emerald-100 font-medium">হবিগঞ্জ সদর, হবিগঞ্জ</p>
        <div className="inline-block bg-white text-emerald-950 font-black text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mt-2 sm:mt-3 shadow-xs">
          খরচ ভাউচার ফর্ম (Voucher Entry)
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-4 sm:p-6 md:p-8 space-y-6">
        {/* Voucher Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">ভাউচার নম্বর (Voucher ID)</label>
            <input
              type="text"
              placeholder="স্বয়ংক্রিয় তৈরি হবে"
              value={expenseForm.voucherNo}
              onChange={(e) => setExpenseForm({ ...expenseForm, voucherNo: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">খরচকারির নাম (Spender Name)</label>
            <input
              type="text"
              placeholder="খরচকারির নাম লিখুন"
              value={expenseForm.receiverName}
              onChange={(e) => setExpenseForm({ ...expenseForm, receiverName: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">তারিখ</label>
            <input
              type="date"
              value={expenseForm.date}
              onChange={(e) => {
                const selectedDate = e.target.value;
                const parts = selectedDate.split('-');
                setExpenseForm({
                  ...expenseForm,
                  date: selectedDate,
                  month: parts.length >= 2 ? `${parts[0]}-${parts[1]}` : expenseForm.month
                });
              }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">গৃহীত অগ্রীম টাকা (ঐচ্ছিক)</label>
            <input
              type="number"
              placeholder="যেমন: ৫০০০"
              value={expenseForm.advanceAmount}
              onChange={(e) => setExpenseForm({ ...expenseForm, advanceAmount: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">চেক নং (ঐচ্ছিক)</label>
            <input
              type="text"
              placeholder="চেক নং (ব্যাংক হলে)"
              value={expenseForm.chequeNo}
              onChange={(e) => setExpenseForm({ ...expenseForm, chequeNo: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        {/* Voucher Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 gap-2">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">ব্যয়ের হিসাব/খাতসমূহ</h3>
            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-1 text-[11px] font-black text-emerald-800 hover:text-emerald-950 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> খরচ খাত যোগ করুন
            </button>
          </div>

          {expenseForm.items.map((item, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/30 relative">
              {expenseForm.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRow(idx)}
                  className="absolute top-2 right-2 p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-505 block mb-1">ব্যয়ের খাত</label>
                  <select
                    value={item.head}
                    onChange={(e) => handleRowChange(idx, 'head', e.target.value)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-emerald-700 bg-white"
                  >
                    {EXPENSE_HEADS.map(head => (
                      <option key={head} value={head}>{head}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-505 block mb-1">সরবরাহকারী প্রতিষ্ঠান</label>
                  <input
                    type="text"
                    placeholder="সরবরাহকারী প্রতিষ্ঠান"
                    value={item.institutionName || ''}
                    onChange={(e) => handleRowChange(idx, 'institutionName', e.target.value)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-emerald-700 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-505 block mb-1">মেমো নং</label>
                  <input
                    type="text"
                    placeholder="মেমো নং"
                    value={item.shopVoucher || ''}
                    onChange={(e) => handleRowChange(idx, 'shopVoucher', e.target.value)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-emerald-700 bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-505 block mb-1">টাকার পরিমাণ (৳)</label>
                  <input
                    type="number"
                    placeholder="টাকা (৳)"
                    min="0"
                    value={item.amount}
                    onChange={(e) => handleRowChange(idx, 'amount', e.target.value)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-emerald-700 text-right bg-white"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Deficit / Reimbursement Section */}
        {currentExpenseBalance < 0 && expenseForm.reimbursement?.status !== 'paid' && (
          <div className="border-t border-dashed border-slate-200 pt-4 space-y-3 bg-rose-50/30 p-4 rounded-xl">
            <h4 className="text-xs font-black text-rose-900 flex items-center gap-1">
              <span>⚠️</span> ঘাটতি বা ঋণ পরিশোধের বিবরণী (Reimbursement Details)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">পরিশোধের মাধ্যম</label>
                <select
                  value={expenseForm.reimbursement?.method || 'Cash'}
                  onChange={(e) => setExpenseForm({
                    ...expenseForm,
                    reimbursement: {
                      ...(expenseForm.reimbursement || {}),
                      method: e.target.value
                    }
                  })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 bg-white"
                >
                  <option value="Cash">নগদ</option>
                  <option value="Bank">ব্যাংক</option>
                  <option value="bKash">বিকাশ</option>
                  <option value="Nagad">নগদ মোবাইল ব্যাংকিং</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">পরিশোধের তারিখ</label>
                <input
                  type="date"
                  value={expenseForm.reimbursement?.date || ''}
                  onChange={(e) => setExpenseForm({
                    ...expenseForm,
                    reimbursement: {
                      ...(expenseForm.reimbursement || {}),
                      date: e.target.value
                    }
                  })}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">পরিশোধের অবস্থা / Status</label>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="checkbox"
                    id="reimbursementStatusCheckbox"
                    checked={expenseForm.reimbursement?.status === 'paid'}
                    onChange={(e) => setExpenseForm({
                      ...expenseForm,
                      reimbursement: {
                        ...(expenseForm.reimbursement || {}),
                        status: e.target.checked ? 'paid' : 'unpaid'
                      }
                    })}
                    className="w-4 h-4 text-emerald-800 focus:ring-emerald-700 border-slate-300 rounded"
                  />
                  <label htmlFor="reimbursementStatusCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                    পরিশোধিত (Paid)
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculations Banner */}
        <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl">
          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">মন্তব্য/খরচের অতিরিক্ত বিবরণ</label>
            <textarea
              placeholder="ভাউচার বা খরচ সংক্রান্ত অতিরিক্ত নোট"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 h-16 resize-none"
            />
          </div>

          <div className="flex flex-col justify-end text-left md:text-right text-xs font-bold space-y-1">
            <div className="flex justify-between border-b border-slate-200/60 pb-1 gap-2">
              <span className="text-slate-500">মোট খরচ:</span>
              <span className="text-rose-950 font-black">৳ {formatBanglaNumber(currentExpenseTotal.toLocaleString('bn-BD'))}</span>
            </div>
            {expenseForm.advanceAmount && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">উদ্বৃত্ত/ঋণ:</span>
                <span className={`font-black ${currentExpenseBalance >= 0 ? 'text-emerald-800' : (expenseForm.reimbursement?.status === 'paid' ? 'text-emerald-600' : 'text-rose-850')}`}>
                  {currentExpenseBalance >= 0 ? 'উদ্বৃত্ত: ' : 'ঘাটতি/ঋণ: '} 
                  ৳ {formatBanglaNumber(Math.abs(currentExpenseBalance).toLocaleString('bn-BD'))}
                  {currentExpenseBalance < 0 && expenseForm.reimbursement?.status === 'paid' && ' (paid)'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-100 transition-colors order-2 sm:order-1"
          >
            বাতিল করুন
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-rose-800 hover:bg-rose-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors order-1 sm:order-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ভাউচার সেভ করুন'}
          </button>
        </div>
      </form>
    </div>
  );
}
