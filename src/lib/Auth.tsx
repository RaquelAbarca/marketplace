import { Component, createSignal } from 'solid-js'
import { supabase } from './supabaseClient'
import { currentSession } from './userSessionStore'
import { getLangFromUrl, useTranslations } from '../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const Auth: Component = (props) => {
  // @ts-ignore
  const { mode = "sign_in" } = props;
  const [loading, setLoading] = createSignal(false)
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [confirmPassword, setConfirmPassword] = createSignal('')
  const [passwordMatch, setPasswordMatch] = createSignal(false)
  const match = () => password() === confirmPassword()
  const [authMode, setAuthMode] = createSignal<"sign_in"|"sign_up">(mode)

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email: email(), password: password() })
      if (error) throw error
      currentSession.set(data.session)
      // const test = useStore(currentSession)
      // console.log("Current Session: " + test()?.user.aud)
      location.href=`/${lang}`
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: SubmitEvent) => {
    e.preventDefault()

    if (password() === confirmPassword()) {
      setPasswordMatch(true)
      try {
        setLoading(true)
        const { error } = await supabase.auth.signUp({ email: email(), password: password() })
        if (error) throw error
        alert(t('messages.checkConfirmEmail'))
        location.href=`/${lang}`
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        setLoading(false)
      }
    } else {
      setPasswordMatch(false);
      alert(t('messages.passwordMatch'));
    }
  }

    

  return (
    <div class='bg-background1 border-border max-w-md max-h-max p-5 m-0 m-auto rounded-md dark:bg-background1-DM border-border-DM'>
      {/* If the auth mode is sign in then return the sign in form */}
      {authMode() === "sign_in" ? (
        <div class="row flex-center flex">
        <div class="col-6 form-widget" aria-live="polite">
          <form class="form-widget" onSubmit={handleLogin}>
            <div class="mb-4">
              <label for="email">{t('formLabels.email')}</label>
              <input
                id="email"
                class="inputField"
                type="email"
                placeholder={t('formLabels.email')}
                value={email()}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div class='mb-4'>
              <label for="password">{t('formLabels.password')}</label>
              <input
                id="password"
                class="inputField"
                type="password"
                placeholder={t('formLabels.password')}
                value={password()}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <div class='bg-btn1 mb-4'>
              <button type="submit" class="button block" aria-live="polite">
                {loading() ? <span>{t('buttons.loading')}</span> : <span>{t('buttons.login')}</span>}
              </button>
            </div>
            <div>
              <p class="text-sm text-text1"> {t('messages.noAccount')}<a class="text-link2 hover:underline dark:text-gray-200" href={`/${lang}/signup`}>{t('buttons.signUp')}</a></p>
            </div>
          </form>
        </div>
      </div>
      ) : (
        //Else if the auth mode is sign up then return the sign up form
        authMode() === "sign_up" ? (
          <div class="row flex-center flex">
      <div class="col-6 form-widget" aria-live="polite">
        <h1 class="header">Create an account</h1>
        <div>
          <p class="text-text2 dark:text-text2-DM">{t('messages.alreadyAccount')} <a class="text-link2 hover:underline dark:text-link2-DM" href={`/${lang}/login`}>{t('buttons.signIn')}</a></p>
        </div>
        <form class="form-widget" onSubmit={handleSignUp}>
          <div class='mb-3'>
            <label for="email" class="text-text1 dark:text-text1-DM">{t('formLabels.email')}</label>
            <input
              id="email"
              class="inputField ml-2 rounded-md pl-2 bg-background1 dark:bg-background2-DM"
              type="email"
              placeholder={t('formLabels.email')}
              required
              value={email()}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          <div class='mb-3'>
            <label for="password" class="text-text1 dark:text-text1-DM">{t('formLabels.password')}</label>
            <input
              id="password"
              class="inputField ml-2 rounded-md pl-2 bg-background1 dark:bg-background2-DM"
              type="password"
              placeholder={t('formLabels.password')}
              required
              value={password()}
              oninput={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          <div>
          {password().length>5 ? '' : <p class="text-sm text-gray-600"> {t('messages.passwordLength')}</p>}
          </div>
          <div>
            <label for="confirm password" class="text-text1 dark:text-text1-DM">{t('formLabels.confirmPassword')}</label>
            <input
              id="confirm password"
              class="inputField ml-2 rounded-md pl-2 bg-background1 dark:bg-background2-DM"
              type="password"
              placeholder={t('formLabels.confirmPassword')}
              required
              value={confirmPassword()}
              oninput={(e) => setConfirmPassword(e.currentTarget.value)}
            />
          </div>
          <div>
          {match() ? '' : <span>{t('messages.passwordMatch')}</span>}
          </div>
          <div>
            <button type="submit" class="mt-3 bg-btn1 hover:bg-btn1hov text-white font-bold py-2 px-4 rounded dark:bg-btn1-DM" aria-live="polite" disabled={!match()}>
              {loading() ? <span>{t('buttons.loading')}</span> : <span>{t('pageTitles.signUp')}</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
        ): (
          // Else return an error if it is neither auth mode
          "Error")
          )}
    
  </div>
  )
}