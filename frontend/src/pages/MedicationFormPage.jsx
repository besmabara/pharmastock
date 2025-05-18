import { useParams } from 'react-router-dom'
import MedicationForm from '../components/medications/MedicationForm'

function MedicationFormPage() {
  const { id } = useParams()
  const medicationId = id ? parseInt(id, 10) : null
  
  return (
    <div>
      <MedicationForm medicationId={medicationId} />
    </div>
  )
}

export default MedicationFormPage