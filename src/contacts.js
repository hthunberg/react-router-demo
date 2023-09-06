import localforage from 'localforage'
import { matchSorter } from 'match-sorter'
import sortBy from 'sort-by'

/*
localForage is a wrapper library that makes it easier to the access browser databases and improves the offline experience of the web app.  
Several browser databases exist:

* localStorage
* IndexedDB
* Web SQL

localForage uses localStorage in browsers with no IndexedDB or WebSQL support.
*/

export async function getContacts(query) {
    await fakeNetwork(`getContacts:${query}`)
    let contacts = await localforage.getItem('contacts')

    // This code runs once contacts has been loaded
    // from the offline store.

    if (!contacts) contacts = []
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ['first', 'last'] })
    }
    return contacts.sort(sortBy('last', 'createdAt'))
}

export async function createContact() {
    await fakeNetwork()
    let id = Math.random().toString(36).substring(2, 9)
    let contact = { id, createdAt: Date.now() }
    let contacts = await getContacts()

    // This code runs once contacts has been loaded
    // from the offline store.

    contacts.unshift(contact)
    await set(contacts)
    return contact
}

export async function getContact(id) {
    await fakeNetwork(`contact:${id}`)
    let contacts = await localforage.getItem('contacts')

    // This code runs once contacts has been loaded
    // from the offline store.

    let contact = contacts.find((contact) => contact.id === id)
    return contact ?? null
}

export async function updateContact(id, updates) {
    await fakeNetwork()
    let contacts = await localforage.getItem('contacts')

    // This code runs once contacts has been loaded
    // from the offline store.

    let contact = contacts.find((contact) => contact.id === id)
    if (!contact) throw new Error('No contact found for', id)
    Object.assign(contact, updates)
    await set(contacts)
    return contact
}

export async function deleteContact(id) {
    let contacts = await localforage.getItem('contacts')

    // This code runs once contacts has been loaded
    // from the offline store.

    let index = contacts.findIndex((contact) => contact.id === id)
    if (index > -1) {
        contacts.splice(index, 1)
        await set(contacts)
        return true
    }
    return false
}

function set(contacts) {
    return localforage.setItem('contacts', contacts)
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {}

// Fakes a network latency that is normal when having a request to a backend service to provide some result.
async function fakeNetwork(key) {
    if (!key) {
        fakeCache = {}
    }

    if (fakeCache[key]) {
        return
    }

    fakeCache[key] = true
    return new Promise((res) => {
        // Schedules execution of a one-time `callback` after `delay` milliseconds.
        setTimeout(res, Math.random() * 800)
    })
}
