import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
    //The useRouteError provides the error that was thrown in router. When the user
    // navigates to routes that don't exist you'll get an error response as
    // defined below.

    const error = useRouteError()
    console.error(error)

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}
