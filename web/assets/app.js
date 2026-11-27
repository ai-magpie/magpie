(() => {
  const input = document.querySelector("#q");
  const count = document.querySelector("#count");
  const empty = document.querySelector("#empty");
  const clear = document.querySelector("#clear");
  const backTop = document.querySelector("#backTop");
  const navLinks = [...document.querySelectorAll(".section-nav a")];
  const sections = [...document.querySelectorAll(".section")];
  if (!input || !count || !empty) return;

  const items = [...document.querySelectorAll(".entries li")];
  const searchText = items.map((item) => (item.dataset.search ?? "").toLowerCase());
  const total = items.length;

  const normalize = (value) => value.toLowerCase().replace(/\s+/g, " ").trim();

  /**
   * 在元素的文本节点中高亮全部命中（不止第一处）。
   * 只操作 textContent / 文本节点，不引入任何 HTML，天然免疫注入。
   */
  function highlight(el, query) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const text = node.nodeValue;
      const parent = node.parentNode;
      // 还原上一轮高亮
      for (const mark of [...(parent?.querySelectorAll("mark[data-hl]") ?? [])]) {
        mark.replaceWith(...mark.childNodes);
      }
      parent?.normalize();

      const lower = text.toLowerCase();
      let at = query ? lower.indexOf(query) : -1;
      if (at < 0) continue;

      // 一次性插入全部命中区间
      const anchor = document.createComment("");
      parent.insertBefore(anchor, node);
      const segments = [];
      let cursor = 0;
      while (at >= 0) {
        segments.push([cursor, at]);
        cursor = at + query.length;
        at = lower.indexOf(query, cursor);
      }
      segments.push([cursor, text.length]);

      for (const [from, to] of segments) {
        if (to > from) parent.insertBefore(document.createTextNode(text.slice(from, to)), anchor);
        if (to < text.length) {
          const mark = document.createElement("mark");
          mark.dataset.hl = "";
          const hitTo = segments.length && to === text.length ? text.length : to + query.length;
          mark.textContent = text.slice(to, Math.min(to + query.length, text.length));
          if (mark.textContent) parent.insertBefore(mark, anchor);
        }
      }
      parent?.removeChild(anchor);
      node.nodeValue = "";
    }
  }

  function apply() {
    const query = normalize(input.value);
    let visible = 0;

    items.forEach((item, index) => {
      const match = query === "" || searchText[index].includes(query);
      item.hidden = !match;
      if (match) {
        visible += 1;
        highlight(item, query);
      }
    });

    for (const section of sections) {
      const list = section.querySelector(".entries");
      const shown = list ? [...list.children].some((item) => !item.hidden) : false;
      section.hidden = query !== "" && !shown;
    }

    empty.hidden = !(query !== "" && visible === 0);
    count.textContent = query === "" ? `共 ${total} 个条目` : `找到 ${visible} 个条目`;
    if (clear) clear.hidden = query === "";
  }

  input.addEventListener("input", apply);

  if (clear) {
    clear.addEventListener("click", () => {
      input.value = "";
      apply();
      input.focus();
    });
  }

  // 回到顶部：滚过一屏后出现
  if (backTop) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const toggle = () => {
      const show = scrollY > innerHeight;
      backTop.classList.toggle("show", show);
      backTop.setAttribute("aria-hidden", show ? "false" : "true");
      backTop.tabIndex = show ? 0 : -1;
    };
    addEventListener("scroll", toggle, { passive: true });
    toggle();
    backTop.addEventListener("click", () => {
      scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
    });
  }

  // 导航溢出渐隐：仅在真正溢出且未滚到对应端时加类
  const nav = document.querySelector(".section-nav");
  if (nav) {
    const updateFade = () => {
      const overflow = nav.scrollWidth > nav.clientWidth + 1;
      nav.classList.toggle(
        "faded-right",
        overflow && nav.scrollLeft < nav.scrollWidth - nav.clientWidth - 1
      );
      nav.classList.toggle("faded-left", overflow && nav.scrollLeft > 1);
    };
    nav.addEventListener("scroll", updateFade, { passive: true });
    addEventListener("resize", updateFade);
    updateFade();
  }

  // Scrollspy：当前章节的导航胶囊高亮；页底兜底激活最后一个
  if (navLinks.length > 0 && sections.length > 0) {
    const byId = new Map(
      navLinks.map((link) => [decodeURIComponent(new URL(link.href).hash.slice(1)), link])
    );
    const setActive = (id) => {
      for (const link of navLinks) link.classList.remove("active");
      const link = byId.get(id);
      if (link) link.classList.add("active");
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    for (const section of sections) observer.observe(section);
    addEventListener(
      "scroll",
      () => {
        if (innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
          setActive(sections[sections.length - 1].id);
        }
      },
      { passive: true }
    );
  }

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const editing =
      target instanceof HTMLElement &&
      (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

    if (event.key === "/" && !editing) {
      event.preventDefault();
      input.focus();
      input.select();
    } else if (event.key === "Escape" && document.activeElement === input) {
      input.value = "";
      apply();
      input.blur();
    }
  });
})();
