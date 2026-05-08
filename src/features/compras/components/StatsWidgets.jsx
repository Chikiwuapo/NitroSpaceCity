const StatsWidgets = ({ widgets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {widgets.map((widget, index) => {
        const Icon = widget.icon
        return (
          <div key={index} className="bg-white rounded-[32px] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`${widget.color} p-4 rounded-2xl`}>
                <Icon className={`w-6 h-6 ${widget.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{widget.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-800">{widget.value}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsWidgets