import { useAtom } from 'jotai'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { medicationsAtom } from '../../store/medicationsStore'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function StockChart() {
  const [medications] = useAtom(medicationsAtom)
  
  // Get top 5 medications by quantity
  const topMedications = [...medications]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
  
  const chartData = {
    labels: topMedications.map(med => med.name),
    datasets: [
      {
        label: 'Quantité en stock',
        data: topMedications.map(med => med.quantity),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Seuil minimum',
        data: topMedications.map(med => med.threshold),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 5 des médicaments en stock',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }
  
  return (
    <div className="card">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

export default StockChart