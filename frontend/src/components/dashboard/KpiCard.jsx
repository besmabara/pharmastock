function KpiCard({ title, value, icon, color }) {
  return (
    <div className="card flex items-center">
      <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

export default KpiCard