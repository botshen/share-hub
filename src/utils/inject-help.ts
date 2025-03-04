export function injectScriptToPage() {
  try {
    const script = document.createElement('script')
    script.setAttribute('type', 'module')
    script.src = browser.runtime.getURL('/injected.js')
    script.onload = function () {
      console.log('🔍 script injected')
      script.remove()
    }
    document.documentElement.appendChild(script)
  }
  catch (err) {
    console.error('err', err)
  }
}



export function tryParseJson<T>(data: string, defaultValue: T) {
  try {
    return JSON.parse(data) as T
  }
  catch (e) {
    return defaultValue
  }
}


export function sendMessageToContentScript<T>(message: T, eventName: string) {
  const event = new CustomEvent(eventName, { detail: message })
  window.dispatchEvent(event)
}
