import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import ErrorPage from './error-page'
import './index.css'
import Contact, { loader as contactLoader, action as contactAction } from './routes/contact'
import { action as destroyAction } from './routes/destroy'
import EditContact, { action as editAction } from './routes/edit'
import Root, { action as rootAction, loader as rootLoader } from './routes/root'
import Index from './routes/index'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<Root />}
            // React Router has data conventions to get data into your route components
            loader={rootLoader}
            // React Router uses client side routing for posting forms and invokes route action.
            action={rootAction}
            errorElement={<ErrorPage />}
        >
            {/*
                Children are rendered inside root route's outlet
            */}
            <Route
                // A pathless route to handle errors, it participate in the UI layout without requiring new path
                // segments in the URL. When any errors are thrown in the child routes, the pathless route
                // catch the error and render it, preserving the root route's UI.
                errorElement={<ErrorPage />}
            >
                {/*
                    Children to the pathless route
                */}
                <Route
                    // Think of index routes as the default child route to fill the start page.
                    // The { index:true } instead of { path: "" }, tells the router to match and
                    // render index route when the user is at the parent route's (that is /) exact path.
                    index
                    element={<Index />}
                />
                <Route path="contacts/:contactId" element={<Contact />} loader={contactLoader} action={contactAction} />
                <Route
                    path="contacts/:contactId/edit"
                    element={<EditContact />}
                    loader={contactLoader}
                    // The form will post to the editAction and the data will be revalidated.
                    action={editAction}
                />
                <Route
                    path="contacts/:contactId/destroy"
                    action={destroyAction}
                    // Since we declared errorElement this route and the route is a child of the root route,
                    // error will render here instead of in the root. Errors propagate up to the nearest errorElement.
                    errorElement={<ErrorPage />}
                />
            </Route>
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
