import { Form, useFetcher, useLoaderData } from 'react-router-dom'
import { getContact, updateContact } from '../contacts'

export async function loader({ params }) {
    // URL params, contacts/:contactId, where :contactId is dynamic content and
    // available at params.contactId
    const contact = await getContact(params.contactId)

    // We do not render null contacts, just throw an error and React Router will catch
    // it, and the error path is rendered.
    if (!contact) {
        throw new Response('', {
            status: 404,
            statusText: 'Not Found',
        })
    }
    return { contact }
}

export async function action({ request, params }) {
    // Pull the form data off the request and send it to the data model.
    let formData = await request.formData()
    return updateContact(params.contactId, {
        favorite: formData.get('favorite') === 'true',
    })
}

// In case an action redirects to "/", React Router calls all of the loaders for the data on the page to
// get the latest values (this is "revalidation"). useLoaderData returns new values and causes
// the components to update!

export default function Contact() {
    const { contact } = useLoaderData()

    return (
        <div id="contact">
            <div>
                <img key={contact.avatar} src={contact.avatar || null} alt="" />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{' '}
                    <Favorite contact={contact} />
                </h1>
                {contact.github && (
                    <p>
                        <a target="_blank" href={`https://github.com/${contact.github}`} rel="noreferrer">
                            {contact.github}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    {/*
                        A POST is emulated by the client side routing and the <Form action="destroy"> matches the 
                        route at "contacts/:contactId/destroy". The action "action: destroyAction" is invoked and
                        contact is deleted.
                    */}
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (!window.confirm('Please confirm you want to delete this record.')) {
                                event.preventDefault()
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

function Favorite({ contact }) {
    // For use cases where we want to change the data on a page without e.g creating or deleting a
    // contact, we can use useFetcher. We simply want to change data on the current page.
    // In this case the ★ button.
    // Since we have connected the route with an action in router, fetcher.Form will POST to the action `action`.
    const fetcher = useFetcher()

    let favorite = contact.favorite

    // Strategy Optimistic UI, form data in fetcher.FormData is available to the application even before
    // the form is submitted. We can immediately update the state of `favorite` and when the actual data
    // is fetched UI is rendered with the actual data.
    if (fetcher.formData) {
        favorite = fetcher.formData.get('favorite') === 'true'
    }

    return (
        // Key difference between Form and fetcher.Form, it's not a navigation, the URL doesn't change.
        // The history stack is unaffected using fetcher.Form.
        <fetcher.Form method="post">
            <button
                name="favorite"
                value={favorite ? 'false' : 'true'}
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                {favorite ? '★' : '☆'}
            </button>
        </fetcher.Form>
    )
}
