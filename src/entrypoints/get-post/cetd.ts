export class CETDExtractor {
  // 显式声明类属性
  private linkTags: Set<string>;
  private domParser: DOMParser;

  constructor() {
    this.linkTags = new Set(['a', 'button', 'input']);
    this.domParser = new DOMParser();
  }

  // 添加参数类型和返回类型
  extract(html: string): DocumentFragment {
    const doc = this.parseHTML(html);
    this.cleanHiddenElements(doc);
    this.computeDensity(doc.body);
    const threshold = this.calculateThreshold(doc.body);
    return this.extractContent(doc.body, threshold);
  }

  // 递归函数参数类型标注
  private computeDensity(node: HTMLElement): void {
    if (this.isNoiseNode(node)) return;

    // 类型保护
    const childNodes = Array.from(node.childNodes) as (HTMLElement | Text)[];

    // 显式类型声明
    let charCount: number = 0;
    let tagCount: number = 0;
    let linkChar: number = 0;
    let linkTag: number = 0;

    childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim() || '';
        charCount += text.length;

        if (this.isLinkNode(child.parentNode as HTMLElement)) {
          linkChar += text.length;
        }
      } else if (child instanceof HTMLElement) {
        tagCount++;
        if (this.linkTags.has(child.tagName.toLowerCase())) {
          linkTag++;
        }
        this.computeDensity(child);
      }
    });

    // 类型断言
    const statsNode = node as CETDStatsNode;
    statsNode._stats = {
      charCount,
      tagCount: tagCount || 1,
      linkChar,
      linkTag: linkTag || 1,
      density: charCount / (tagCount || 1),
      compositeDensity: this.calcCompositeDensity(charCount, tagCount, linkChar, linkTag)
    };
  }

  // 自定义类型声明
  private calcCompositeDensity(C: number, T: number, LC: number, LT: number): number {
    const logBase = Math.log(C / (C - LC) * LC + (LC / C) * C + Math.E);
    return (C / T) * Math.log((C / LC) * (T / LT)) / logBase;
  }

  // DOM操作类型标注
  private extractContent(node: HTMLElement, threshold: number): DocumentFragment {
    const fragment = document.createDocumentFragment();

    // 添加空值检查
    const stats = (node as CETDStatsNode)._stats;
    if (!stats || typeof stats.compositeDensity !== 'number') {
      return fragment;
    }

    if (stats.compositeDensity < threshold) {
      return fragment;
    }

    const clone = node.cloneNode(false) as HTMLElement;
    Array.from(node.childNodes).forEach(child => {
      if (child instanceof HTMLElement) {
        const extracted = this.extractContent(child, threshold);
        if (extracted.childNodes.length > 0) {
          clone.appendChild(extracted);
        }
      } else {
        // 保留文本节点
        clone.appendChild(child.cloneNode(true));
      }
    });

    if (clone.childNodes.length > 0 || stats.charCount > 0) {
      fragment.appendChild(clone);
    }

    return fragment;
  }

  // 辅助方法类型声明
  private parseHTML(html: string): Document {
    return this.domParser.parseFromString(html, "text/html");
  }

  private cleanHiddenElements(doc: Document): void {
    // 实现清理逻辑
  }

  private isLinkNode(node: HTMLElement): boolean {
    return this.linkTags.has(node.tagName.toLowerCase());
  }

  private calculateThreshold(body: HTMLElement): number {
    // 添加空值检查
    const stats = (body as CETDStatsNode)._stats;
    if (!stats || typeof stats.compositeDensity !== 'number') {
      return 0; // 或者其他默认值
    }
    return stats.compositeDensity * 0.9;
  }

  // 添加 isNoiseNode 方法
  private isNoiseNode(node: HTMLElement): boolean {
    const noiseTagNames = ['script', 'style', 'noscript', 'iframe', 'br', 'hr'];
    return noiseTagNames.includes(node.tagName.toLowerCase());
  }
}

// 扩展类型声明
interface CETDStatsNode extends HTMLElement {
  _stats: {
    charCount: number
    tagCount: number
    linkChar: number
    linkTag: number
    density: number
    compositeDensity: number
  }
}