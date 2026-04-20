export default function FilterBar({ searchQuery, setSearchQuery, filterType, setFilterType }) {
  const pills = [
    { id: 'all', label: 'Hammasi' },
    { id: 'quyosh', label: 'Quyosh', icon: '☀️' },
    { id: 'oy', label: 'Oy', icon: '🌙' },
    { id: 'ulanmaydigan', label: 'Ulanmaydigan', icon: '⛓️' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full mb-8 bg-[#141d2e] p-2 rounded-2xl border border-white/5 shadow-xl">
      <div className="relative w-full md:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Harfni qidiring..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111827] border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-[#10b981] transition-all"
        />
      </div>

      <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0 px-2 md:px-0 scrollbar-hide">
        {pills.map((pill) => {
          const isActive = filterType === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setFilterType(pill.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-[#111827] text-white/70 border border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              {pill.icon && <span>{pill.icon}</span>}
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
