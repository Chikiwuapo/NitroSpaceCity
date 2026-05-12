const tabs = [
  { id: "todas", label: "Todas" },
  { id: "success", label: "Éxitos" },
  { id: "warning", label: "Alertas" },
  { id: "error", label: "Errores" },
];

export const NotificationFilters = ({ filtro, setFiltro }) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100 flex flex-col gap-1">
      <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Filtros Rápidos
      </p>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setFiltro(tab.id)}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 text-left flex items-center justify-between group ${
            filtro === tab.id
              ? "bg-[#0a332a] text-white shadow-lg shadow-emerald-900/10"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          {tab.label}
          {filtro === tab.id && (
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
};
