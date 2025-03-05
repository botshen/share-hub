import { EntityURL } from "@/entrypoints/types";
  function xssFilter(str: string) {
    return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
/**
 * Replace t.co URLs in a string with real HTML links.
 *
 * @example
 * ```jsx
 * // Input:
 * strEntitiesToHtml('Verification: https://t.co/hHSWmpjfbA NASA Hubble Space Telescope', [
 *   {
 *     "display_url": "nasa.gov/socialmedia",
 *     "expanded_url": "http://nasa.gov/socialmedia",
 *     "url": "https://t.co/hHSWmpjfbA",
 *     "indices": [140, 163]
 *   }
 * ]);
 *
 * // Output:
 * <p>Verification: <a href="http://nasa.gov/socialmedia">nasa.gov/socialmedia</a> NASA Hubble Space Telescope</p>
 * ```
 */
export function strEntitiesToHTML(str: string, urls?: EntityURL[]) {
    let temp = str;
  
    if (!urls?.length) {
      return temp;
    }
  
    for (const { url, display_url, expanded_url } of urls) {
      temp = temp.replaceAll(
        url,
        `<a class="link" target="_blank" href="${xssFilter(expanded_url ?? url)}">${xssFilter(
          display_url ?? url,
        )}</a>`,
      );
    }
  
    return temp;
  }