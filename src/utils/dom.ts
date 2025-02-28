export function findImmersiveElements(doc: Document) {
  const elements = doc.querySelectorAll('*[data-immersive-translate-translation-element-mark]');
  elements.forEach(element => {
    const markAttr = element.getAttribute('data-immersive-translate-translation-element-mark');
    if (markAttr !== null) {
      (element as HTMLElement).classList.add('immersive');
    }
  });
}

