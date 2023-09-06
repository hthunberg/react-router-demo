import { Form, useLoaderData, redirect, useNavigate } from 'react-router-dom'
import { updateContact } from '../contacts'

// Without JavaScript, when a form is submitted, the browser will create FormData
// and set it as the body of the request when it sends it to the server. Using
// React Router will prevent that and send the request to the action instead,
// including all the form data. The data will be revalidated.
// Each field in the form is accessible with formData.get(name).
// We use Object.fromEntries to collect all form entries into an object.
export async function action({ request, params }) {
    const formData = await request.formData()
    const updates = Object.fromEntries(formData)
    await updateContact(params.contactId, updates)

    // Redirect response tells the app to change location.
    // React Router automatically revalidate the data on the page after the action.
    // The sidebar will automatically update when we save the form.
    return redirect(`/contacts/${params.contactId}`)
}

export default function EditContact() {
    const { contact } = useLoaderData()
    const navigate = useNavigate()

    return (
        <Form method="post" id="contact-form">
            <p>
                <span>Name</span>
                <input
                    placeholder="First"
                    aria-label="First name"
                    type="text"
                    name="first"
                    defaultValue={contact.first}
                />
                <input placeholder="Last" aria-label="Last name" type="text" name="last" defaultValue={contact.last} />
            </p>
            <label>
                <span>GitHub</span>
                <input type="text" name="github" placeholder="@github" defaultValue={contact.github} />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="Avatar URL"
                    type="text"
                    name="avatar"
                    defaultValue={contact.avatar}
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea name="notes" defaultValue={contact.notes} rows={6} />
            </label>
            <p>
                <button type="submit">Save</button>
                {/* 
                    When the user clicks "Cancel", they'll be sent back one entry in the browser's history.
                */}
                <button
                    type="button"
                    onClick={() => {
                        navigate(-1)
                    }}
                >
                    Cancel
                </button>
            </p>
        </Form>
    )
}
