import React, { useEffect } from 'react';
import { TrendingUp, Plus, Trash2, Loader2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:8000';

export default function IncomeEntry({
  incomeForm,
  setIncomeForm,
  INCOME_HEADS,
  loading,
  onSubmit,
  setActiveTab,
  formatBanglaNumber
}) {

  // Auto Receipt ID Generation on date change
  useEffect(() => {
    const generateReceiptId = async () => {
      if (!incomeForm.date) return;
      const dateParts = incomeForm.date.split('-');
      if (dateParts.length < 2) return;
      const yy = dateParts[0].slice(-2);
      const mm = dateParts[1];
      const prefix = `INC-${yy}${mm}`;

      try {
        const res = await fetch(`${API_BASE_URL}/api/finance/transactions?limit=100&type=income`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const matchingIds = data.data
            .map(tx => tx.receiptNo)
            .filter(id => id && id.startsWith(prefix));

          if (matchingIds.length > 0) {
            const counters = matchingIds.map(id => {
              const suffix = id.substring(prefix.length);
              const num = parseInt(suffix, 10);
              return isNaN(num) ? 0 : num;
            });
            const maxCounter = Math.max(...counters);
            const nextCounter = maxCounter + 1;
            setIncomeForm(prev => ({
              ...prev,
              receiptNo: `${prefix}${String(nextCounter).padStart(4, '0')}`
            }));
            return;
          }
        }
        setIncomeForm(prev => ({ ...prev, receiptNo: `${prefix}0001` }));
      } catch (err) {
        console.error("Error generating dynamic Receipt ID:", err);
        setIncomeForm(prev => ({ ...prev, receiptNo: `${prefix}0001` }));
      }
    };

    generateReceiptId();
  }, [incomeForm.date, setIncomeForm]);

  // Handlers for Items list
  const handleAddRow = () => {
    setIncomeForm({
      ...incomeForm,
      items: [...incomeForm.items, { head: INCOME_HEADS[0], amount: '' }]
    });
  };

  const handleRemoveRow = (index) => {
    const newItems = [...incomeForm.items];
    newItems.splice(index, 1);
    setIncomeForm({ ...incomeForm, items: newItems });
  };

  const handleRowChange = (index, field, value) => {
    const newItems = [...incomeForm.items];
    newItems[index][field] = value;
    setIncomeForm({ ...incomeForm, items: newItems });
  };

  const currentIncomeTotal = incomeForm.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-emerald-900/10 shadow-xs p-4 sm:p-6 md:p-8 print:hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-850 rounded-xl shrink-0">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-emerald-955">আয় এন্ট্রি করুন (রসিদ ফরম)</h2>
          <p className="text-xs text-slate-400 font-medium">মাদরাসার আয়ের খাত অনুযায়ী সরাসরি কালেকশন এন্ট্রি</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Metadata Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">রসিদ নম্বর (Receipt ID)</label>
            <input
              type="text"
              placeholder="স্বয়ংক্রিয় তৈরি হবে"
              value={incomeForm.receiptNo}
              onChange={(e) => setIncomeForm({ ...incomeForm, receiptNo: e.target.value })}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">পেমেন্ট মেথড</label>
            <select
              value={incomeForm.paymentMethod}
              onChange={(e) => setIncomeForm({ ...incomeForm, paymentMethod: e.target.value })}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
            >
              <option value="Cash">Cash (নগদ)</option>
              <option value="Bank">Bank Account (ব্যাংক হিসাব)</option>
              <option value="Cheque">Cheque (চেক)</option>
              <option value="bKash">bKash (বিকাশ)</option>
              <option value="Nagad">Nagad (নগদ মোবাইল ব্যাংকিং)</option>
              <option value="Rocket">Rocket (রকেট)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">দাতার নাম (Donor Name)</label>
            <input
              type="text"
              placeholder="দাতার নাম লিখুন"
              value={incomeForm.donorName}
              onChange={(e) => setIncomeForm({ ...incomeForm, donorName: e.target.value })}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">শিক্ষার্থীর নাম বা আইডি (Student Name / ID)</label>
            <input
              type="text"
              placeholder="শিক্ষার্থীর নাম বা আইডি লিখুন"
              value={incomeForm.studentId}
              onChange={(e) => setIncomeForm({ ...incomeForm, studentId: e.target.value })}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 block mb-1">তারিখ</label>
            <input
              type="date"
              value={incomeForm.date}
              onChange={(e) => {
                const selectedDate = e.target.value;
                const parts = selectedDate.split('-');
                setIncomeForm({
                  ...incomeForm,
                  date: selectedDate,
                  month: parts.length >= 2 ? `${parts[0]}-${parts[1]}` : incomeForm.month
                });
              }}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
              required
            />
          </div>
        </div>

        {/* Income Sector Fields */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 gap-2">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">আয়ের খাতসমূহ ও টাকার পরিমাণ</h3>
            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-1 text-[11px] font-black text-emerald-800 hover:text-emerald-950 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> খাত যোগ করুন
            </button>
          </div>

          {incomeForm.items.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <div className="flex-1">
                <select
                  value={item.head}
                  onChange={(e) => handleRowChange(idx, 'head', e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700"
                >
                  {INCOME_HEADS.map(head => (
                    <option key={head} value={head}>{head}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-36 md:w-48">
                <input
                  type="number"
                  placeholder="টাকা (৳)"
                  min="0"
                  value={item.amount}
                  onChange={(e) => handleRowChange(idx, 'amount', e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 text-right"
                  required
                />

                {incomeForm.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 sm:hidden"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {incomeForm.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRow(idx)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 hidden sm:block"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Calculations and Description */}
        <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl">
          <div className="flex-1">
            <label className="text-xs font-bold text-slate-600 block mb-1">মন্তব্য/বিবরণ (ঐচ্ছিক)</label>
            <textarea
              placeholder="লেনদেন সংক্রান্ত অতিরিক্ত তথ্য"
              value={incomeForm.description}
              onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-700 h-16 resize-none"
            />
          </div>

          <div className="text-left md:text-right whitespace-nowrap min-w-[150px]">
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">সর্বমোট জমা (৳)</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
              ৳ {formatBanglaNumber(currentIncomeTotal.toLocaleString('bn-BD'))}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors order-2 sm:order-1"
          >
            বাতিল করুন
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors order-1 sm:order-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'সংরক্ষণ করুন'}
          </button>
        </div>
      </form>
    </div>
  );
}
