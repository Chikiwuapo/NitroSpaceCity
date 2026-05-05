const tabs = [
  { id: "todas", label: "Todas" },
  { id: "ventas", label: "Ventas" },
  { id: "compras", label: "Compras" },
  { id: "usuarios", label: "Usuarios" },
];

export const NotificationFilters = ({ filtro, setFiltro }) => {
  return (
    <div className="flex gap-4 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setFiltro(tab.id)}
          className={`px-3 py-2 text-sm font-medium transition ${
            filtro === tab.id
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};