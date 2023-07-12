import { Component, createSignal } from 'solid-js'
import { supabase } from './supabaseClient'
import { currentSession } from './userSessionStore'

export const SignOut: Component = () => {
    const [loading, setLoading] = createSignal(false)

    const handleSignOut = async (e: SubmitEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.log(error)
            }
            currentSession.set(null)
            localStorage.clear()
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            setLoading(false)
            location.href = "/"
        }
    }

    return (
        <div>
            <form onSubmit={handleSignOut}>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Sign Out</button>
            </form>
        </div>
    )
}