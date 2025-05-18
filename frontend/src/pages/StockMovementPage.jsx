import StockMovementTable from '../components/stock/StockMovementTable'
import StockMovementForm from '../components/stock/StockMovementForm'

function StockMovementPage() {
  return (
    <div className="space-y-6">
      <StockMovementForm />
      <StockMovementTable />
    </div>
  )
}

export default StockMovementPage