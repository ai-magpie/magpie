(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const root = document.documentElement;
  const hdr = $("#hdr");
  const input = $("#q");
  const searchBox = $(".search");
  const clear = $("#clear");
  const running = $("#running");
  const status = $("#status");
  const srStatus = $("#sr-status");
  const empty = $("#empty");
  const emptyQ = $("#empty-q");
  const emptyClear = $("#empty-clear");
  const toggle = $("#theme");
  const backTop = $("#back-top");
  const railNav = $(".rail nav");
  const wrap = $(".wrap");

  const rows = $$(".row");
  const secs = $$(".sec");
  const railLinks = $$(".rail a");
  if (!input || !status || !empty) return;

  /* ------------------------------------------------------------------ 主题 */
  const KEY = "magpie-theme";
  const store = {
    get() {
      try {
        return localStorage.getItem(KEY);
      } catch {
        return null;
      }
    },
    set(value) {
      try {
        localStorage.setItem(KEY, value);
      } catch {
        /* 隐私模式下只在本次会话生效 */
      }
    }
  };

  const mql = matchMedia("(prefers-color-scheme: dark)");
  const SUN =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="8" r="3.2"/><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M2.8 2.8l1.1 1.1M12.1 12.1l1.1 1.1M13.2 2.8l-1.1 1.1M3.9 12.1l-1.1 1.1" stroke-linecap="round"/></svg>';
  const MOON =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : mql.matches);
  const syncTheme = () => {
    const dark = isDark();
    toggle.innerHTML = dark ? MOON : SUN;
    root.style.colorScheme = root.dataset.theme || "";
    toggle.setAttribute("aria-label", dark ? "切换到浅色主题" : "切换到深色主题");
    toggle.setAttribute("aria-pressed", String(dark));
  };
  syncTheme();
  toggle.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    syncTheme();
    store.set(root.dataset.theme);
  });
  mql.addEventListener("change", () => {
    if (!root.dataset.theme) syncTheme();
  });

  /* ------------------------------------------------------------------ 搜索 */
  const rowState = rows.map((row) => {
    const sec = row.closest(".sec");
    return {
      li: row.parentElement,
      secId: sec ? sec.dataset.sec : "",
      search: row.dataset.search || "",
      parts: [".rn", ".rd", ".ru"]
        .map((sel) => {
          const el = row.querySelector(sel);
          return el ? { el, text: el.textContent, marked: false } : null;
        })
        .filter(Boolean),
      hit: true,
      marked: false
    };
  });

  const counts = Object.create(null);
  const railBadge = new Map(railLinks.map((link) => [link, link.querySelector("[data-count]")]));
  for (const badge of railBadge.values()) {
    if (badge) badge.dataset.all = badge.textContent;
  }
  const secCount = new Map(
    secs.map((sec) => [sec.dataset.sec, sec.querySelector(".sec-c b[data-total]")])
  );

  const statusCount = document.createElement("b");
  const statusRest = document.createTextNode("");
  status.replaceChildren("匹配 ", statusCount, statusRest);
  let announceTimer = 0;

  /** 在原文上做大小写不敏感匹配：索引天然对齐，<mark> 保留原文大小写。 */
  const escRe = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const markIn = (el, re) => {
    const text = el.textContent;
    re.lastIndex = 0;
    let match;
    let at = 0;
    let frag = null;
    while ((match = re.exec(text)) !== null) {
      if (match[0] === "") {
        re.lastIndex += 1;
        continue;
      }
      frag ||= document.createDocumentFragment();
      if (match.index > at) frag.append(text.slice(at, match.index));
      const mark = document.createElement("mark");
      mark.textContent = match[0];
      frag.append(mark);
      at = match.index + match[0].length;
    }
    if (!frag) return false;
    frag.append(text.slice(at));
    el.replaceChildren(frag);
    return true;
  };

  let lastQuery = null;
  let frame = 0;

  const runApply = () => {
    frame = 0;
    const query = input.value.trim().toLowerCase();
    if (query === lastQuery) return;
    lastQuery = query;
    const re = query ? new RegExp(escRe(query), "giu") : null;

    for (const key of Object.keys(counts)) delete counts[key];
    let shownRows = 0;

    for (const state of rowState) {
      const hit = query === "" || state.search.includes(query);
      if (hit !== state.hit) {
        state.li.hidden = !hit;
        state.hit = hit;
      }
      if (hit) {
        counts[state.secId] = (counts[state.secId] || 0) + 1;
        shownRows += 1;
      }
      if (state.marked) {
        for (const part of state.parts) {
          if (part.marked) {
            part.el.textContent = part.text;
            part.marked = false;
          }
        }
        state.marked = false;
      }
      if (hit && re) {
        for (const part of state.parts) {
          if (markIn(part.el, re)) {
            part.marked = true;
            state.marked = true;
          }
        }
      }
    }

    let shownSections = 0;
    for (const sec of secs) {
      const count = counts[sec.dataset.sec] || 0;
      if (sec.hidden !== (count === 0)) sec.hidden = count === 0;
      if (count > 0) shownSections += 1;
      const node = secCount.get(sec.dataset.sec);
      if (node) {
        const next = query ? String(count) : node.dataset.total;
        if (node.textContent !== next) node.textContent = next;
      }
    }

    for (const link of railLinks) {
      const count = counts[link.dataset.sec] || 0;
      link.classList.toggle("is-empty", count === 0);
      const badge = railBadge.get(link);
      if (badge) badge.textContent = query ? String(count) : badge.dataset.all;
      const label = link.querySelector(".t");
      if (label) {
        link.setAttribute(
          "aria-label",
          `${label.textContent}，${query ? `${count} 个匹配` : `${link.dataset.total} 个条目`}`
        );
      }
    }

    status.hidden = query === "";
    if (query) {
      statusCount.textContent = String(shownRows);
      statusRest.textContent =
        " 个条目 · " + shownSections + " 个章节" + (shownRows ? "" : "，按 Esc 清空搜索");
    }
    empty.hidden = shownRows !== 0;
    status.classList.toggle("is-empty", shownRows === 0);
    wrap.classList.toggle("is-empty", shownSections === 0);
    if (shownRows === 0 && emptyQ && emptyQ.textContent !== input.value.trim()) {
      emptyQ.textContent = input.value.trim();
    }
    searchBox?.classList.toggle("has-value", input.value !== "");
    if (clear) clear.hidden = input.value === "";

    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => {
      if (!srStatus) return;
      srStatus.textContent = query
        ? `匹配 ${shownRows} 个条目，${shownSections} 个章节${shownRows ? "" : "，按 Esc 清空搜索"}`
        : `显示全部 ${rowState.length} 个条目`;
    }, 320);

    syncRailMask();
    spy();
  };

  const scheduleApply = () => {
    if (!frame) frame = requestAnimationFrame(runApply);
  };

  const resetInput = () => {
    input.value = "";
    lastQuery = null;
    scheduleApply();
    input.focus();
  };

  let composing = false;
  input.addEventListener("compositionstart", () => {
    composing = true;
  });
  input.addEventListener("compositionend", () => {
    composing = false;
    scheduleApply();
  });
  input.addEventListener("input", (event) => {
    if (composing || event.isComposing) return;
    scheduleApply();
  });

  if (clear) clear.addEventListener("click", resetInput);
  if (emptyClear) emptyClear.addEventListener("click", resetInput);

  /* --------------------------------------------------------------- 键盘 */
  const isEditable = (el) =>
    Boolean(el) && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName));

  addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    if (event.key === "/" && !isEditable(event.target)) {
      event.preventDefault();
      input.focus();
      return;
    }
    if (event.key === "Escape" && document.activeElement === input) {
      event.preventDefault();
      if (input.value !== "") {
        input.value = "";
        lastQuery = null;
        scheduleApply();
      } else {
        input.blur();
      }
    }
  });

  /* ----------------------------------------------------------- 滚动高亮 */
  let line = 96;
  let current = "";
  let lastTitle = null;
  let lastOn = null;

  const scrollActiveIntoView = (force) => {
    if (!railNav || railNav.scrollWidth <= railNav.clientWidth + 4) return;
    const link = railLinks.find((item) => item.classList.contains("is-active"));
    if (!link) return;
    const navRect = railNav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const max = railNav.scrollWidth - railNav.clientWidth;
    const next = Math.min(max, Math.max(0, linkRect.left - navRect.left + railNav.scrollLeft - 40));
    if (force || Math.abs(next - railNav.scrollLeft) > 1) railNav.scrollLeft = next;
  };

  function spy() {
    line = (hdr.offsetHeight || 56) + 40;

    let hit = null;
    for (const sec of secs) {
      if (sec.hidden) continue;
      if (sec.getBoundingClientRect().top <= line) hit = sec;
    }
    if (!hit) hit = secs.find((sec) => !sec.hidden) || null;

    const doc = document.documentElement;
    const scrollable = doc.scrollHeight > innerHeight + 8;
    if (scrollable && Math.ceil(innerHeight + scrollY) >= doc.scrollHeight - 2) {
      const visible = secs.filter((sec) => !sec.hidden);
      if (visible.length) hit = visible[visible.length - 1];
    }

    const id = hit ? hit.dataset.sec : "";
    if (id !== current) {
      current = id;
      for (const link of railLinks) {
        const on = link.dataset.sec === id;
        link.classList.toggle("is-active", on);
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      }
      scrollActiveIntoView(false);
    }

    const on = scrollY > 240;
    const title = on ? (hit ? ($("h2", hit)?.textContent ?? "") : "") : "";
    if (title !== lastTitle) {
      running.textContent = title;
      lastTitle = title;
    }
    if (on !== lastOn) {
      running.classList.toggle("is-on", on);
      hdr.classList.toggle("is-running", on);
      lastOn = on;
    }
  }

  const syncRailMask = () => {
    if (!railNav) return;
    railNav.classList.toggle("is-scrollable", railNav.scrollWidth > railNav.clientWidth + 4);
  };

  let ticking = false;
  const onFrame = () => {
    ticking = false;
    hdr.classList.toggle("is-scrolled", scrollY > 8);
    spy();
    if (backTop) {
      const show = scrollY > innerHeight;
      if (backTop.classList.contains("show") !== show) {
        backTop.classList.toggle("show", show);
        backTop.setAttribute("aria-hidden", show ? "false" : "true");
        backTop.tabIndex = show ? 0 : -1;
      }
    }
  };
  const requestFrame = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onFrame);
    }
  };

  addEventListener("scroll", requestFrame, { passive: true });
  addEventListener("resize", () => {
    syncRailMask();
    scrollActiveIntoView(true);
    requestFrame();
  });

  if (backTop) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    backTop.addEventListener("click", () => {
      scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
    });
  }

  searchBox?.classList.toggle("has-value", input.value !== "");
  onFrame();
  syncRailMask();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      syncRailMask();
      spy();
    });
  }
})();
