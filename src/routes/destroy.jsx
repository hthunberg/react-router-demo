import { redirect } from 'react-router-dom'
import { deleteContact } from '../contacts'

// Deletes a contact and redirects to /.
export async function action({ params }) {
    // throw new Error('simulate an error occurred!!')
    await deleteContact(params.contactId)
    return redirect('/')
}
