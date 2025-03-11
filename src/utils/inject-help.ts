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
    injectScriptToPage1()

  }
  catch (err) {
    console.error('err', err)
  }
}
function injectScriptToPage1() {
  const input = document.createElement('share-hub')
  input.setAttribute('id', 'share-hub')
  input.setAttribute('style', 'display:none')
  document.documentElement.appendChild(input)
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
