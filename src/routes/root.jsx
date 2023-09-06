import { useEffect } from 'react'
import { Form, NavLink, Outlet, redirect, useLoaderData, useNavigation, useSubmit } from 'react-router-dom'
import { createContact, getContacts } from '../contacts'

export default function Root() {
    // React Router automatically revalidate data on the page after router action (Form) finishes.
    // The hook useLoaderData is triggered and holds the UI in sync with any data changes!
    const { contacts, q } = useLoaderData()

    // React Router is managing all of the state behind the scenes, accessible and useful when you need to
    // build dynamic web apps. One example is the useNavigation that gives us the current navigation state.
    // It can be one of "idle", "submitting" or "loading".
    const navigation = useNavigation()

    // We would like the filtering in the form to happen on key strokes, and not just on explicit form submits.
    // The submit function will serialize and submit the form passed to it.
    const submit = useSubmit()

    // The navigation.location shows up when the app is navigating to a new URL and loading the data for it.
    // It then goes away when there is no pending navigation anymore.
    const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q')

    // To keep the form field up to date even though a user clicks browser back. We can use useEffect to
    // manipulate the form's state in the DOM directly.
    useEffect(() => {
        document.getElementById('q').value = q
    }, [q])

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    {/*
                    The search form does not use POST, but the default GET instead. Parameters are set in
                    the URLSearchParams in the GET request (?q=Kalle) 

                    Because this is a GET, React Router does not call the action. Submitting a GET form 
                    is the same as clicking a link, only the URL changes. That's why the code we added 
                    for filtering is in the loader function and not the action.

                    onChange: The `currentTarget` is the DOM node the event is attached to, and the 
                    `currentTarget.form` is the input's parent form node.
                    */}
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? 'loading' : ''}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                // Each key stroke no longer creates new entries, so the user can click back out of the search
                                // without having to click it X times
                                // We only want to replace search results, not the page before we started searching, so we do
                                // a quick check if this is the first search or not and then decide to replace.
                                const isFirstSearch = q == null
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                })
                            }}
                        />
                        <div id="search-spinner" aria-hidden hidden={!searching} />
                        <div className="sr-only" aria-live="polite"></div>
                    </Form>
                    {/* 
                        React Router uses client side routing and invokes route action.
                    */}
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    {/* 
                                        Client side routing allows our app to update the URL without doing a request to the server. 
                                        Instead, the app can render the UI immediately. This can be achieved using Link or NavLink.

                                        When the user is at the URL in the NavLink, then isActive will be true. 
                                        When it's about to be active (the data is still loading) then isPending will be true. 
                                        This allows us to indicate where the user is, as well as provide immediate feedback on 
                                        links that have been clicked but we're still waiting for data to load.
                                    */}

                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive ? 'active' : isPending ? 'pending' : ''
                                        }
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{' '}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>

            {/* 
            A "loading" class and a CSS that adds a nice fade after a short delay. Could be a spinner, loading bar or a fade as in this case.
            */}
            <div id="detail" className={navigation.state === 'loading' ? 'loading' : ''}>
                {/* 
                We need to tell the root route where we want it to render its child routes.
                This is achieved by <Outlet> 
                */}
                <Outlet />
            </div>
        </>
    )
}

// React Router has data conventions to get data into your route components
export async function loader({ request }) {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    const contacts = await getContacts(q)

    // Return q to make sure the value of the form field value is kept and
    // not empty when browser is refreshed.

    return { contacts, q }
}

// React Router uses client side routing for posting forms and invokes route action.
export async function action() {
    const contact = await createContact()
    // Action to create new contact should redirect to the edit page.
    return redirect(`/contacts/${contact.id}/edit`)
}
