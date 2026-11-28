(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const root = document.documentElement;
  const hdr = $("#hdr");
  const input = $("#q");
  const searchBox = $(".search");
  const clear = $("#clear");
  const running = $("#running");
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
  if (!input || !empty) return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

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
  const themeMeta = $("#theme-color");
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : mql.matches);
  const syncTheme = () => {
    const dark = isDark();
    toggle.dataset.dark = String(dark);
    root.style.colorScheme = root.dataset.theme || "";
    toggle.setAttribute("aria-pressed", String(dark));
    if (themeMeta) themeMeta.content = dark ? "#0a0a0c" : "#fbfbfc";
  };
  /* 换肤那一帧整体禁过渡，避免背景瞬变、描边还在补间 */
  const applyTheme = () => {
    root.classList.add("theme-swap");
    syncTheme();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove("theme-swap"));
    });
  };
  syncTheme();
  toggle.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    applyTheme();
    store.set(root.dataset.theme);
  });
  mql.addEventListener("change", () => {
    if (!root.dataset.theme) applyTheme();
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

  let announceTimer = 0;
  /* 过滤结果并进顶栏标题位，不另起一行，列表不会因它出现而位移 */
  let searchInfo = "";

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

    searchInfo = query ? `匹配 ${shownRows} 个条目 · ${shownSections} 个章节` : "";

    empty.hidden = shownRows !== 0;
    wrap.classList.toggle("is-empty", shownSections === 0);
    if (shownRows === 0 && emptyQ && emptyQ.textContent !== input.value.trim()) {
      emptyQ.textContent = input.value.trim();
    }

    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => {
      if (!srStatus) return;
      srStatus.textContent = query
        ? `匹配 ${shownRows} 个条目，${shownSections} 个章节${shownRows ? "" : "，按 Esc 清空搜索"}`
        : `显示全部 ${rowState.length} 个条目`;
    }, 320);

    /* 批量写 DOM 之后不要在同一个 rAF 里读几何：下一帧再算 */
    requestAnimationFrame(() => {
      measure();
      spy();
    });
  };

  const scheduleApply = () => {
    if (!frame) frame = requestAnimationFrame(runApply);
  };

  const syncInputUI = () => {
    if (clear) clear.hidden = input.value === "";
    searchBox?.classList.toggle("has-value", input.value !== "");
  };

  const resetInput = (refocus = true) => {
    input.value = "";
    lastQuery = null;
    syncInputUI();
    scheduleApply();
    if (refocus) input.focus({ preventScroll: true });
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
    /* 与过滤结果无关的即时 UI，不能被 runApply 的去重挡住（例如只输入空格） */
    syncInputUI();
    if (composing || event.isComposing) return;
    scheduleApply();
  });

  if (clear) clear.addEventListener("click", () => resetInput(true));
  if (emptyClear) emptyClear.addEventListener("click", () => resetInput(false));

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
        resetInput(false);
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
  const secTitle = new Map(secs.map((sec) => [sec, sec.querySelector("h2")]));

  const syncRailMask = () => {
    if (!railNav) return;
    const max = railNav.scrollWidth - railNav.clientWidth;
    railNav.classList.toggle("is-left", railNav.scrollLeft > 2);
    /* 到右端就撤掉右渐隐，避免「假的可滚动」提示 */
    railNav.classList.toggle("is-scrollable", max > 4 && railNav.scrollLeft < max - 2);
  };

  const measure = () => {
    line = (hdr.offsetHeight || 56) + 40;
    syncRailMask();
  };

  /* 用户刚动过横向导航时不要抢滚动 */
  let railHold = 0;
  const holdRail = () => {
    railHold = performance.now() + 1200;
  };
  for (const type of ["wheel", "pointerdown", "touchstart"]) {
    railNav?.addEventListener(type, holdRail, { passive: true });
  }
  railNav?.addEventListener("scroll", syncRailMask, { passive: true });

  const scrollActiveIntoView = (force) => {
    if (!railNav || railNav.scrollWidth <= railNav.clientWidth + 4) return;
    if (!force && performance.now() < railHold) return;
    const link = railLinks.find((item) => item.classList.contains("is-active"));
    if (!link) return;
    const navRect = railNav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const pad = 24;
    /* 已经完整可见就不动它 */
    if (!force && linkRect.left >= navRect.left + pad && linkRect.right <= navRect.right - pad) {
      return;
    }
    const max = railNav.scrollWidth - railNav.clientWidth;
    const next = Math.min(max, Math.max(0, linkRect.left - navRect.left + railNav.scrollLeft - 40));
    if (!force && Math.abs(next - railNav.scrollLeft) <= 1) return;
    railNav.scrollTo({ left: next, behavior: reduceMotion.matches ? "instant" : "smooth" });
  };

  function spy() {
    let hit = null;
    let real = false;
    for (const sec of secs) {
      if (sec.hidden) continue;
      if (sec.getBoundingClientRect().top <= line) {
        hit = sec;
        real = true;
      }
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
        if (on) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
      scrollActiveIntoView(false);
    }

    /* 搜索时顶栏显示命中数；否则只在章节真的顶到顶栏下沿时报名字 */
    const title = searchInfo || (real && hit ? (secTitle.get(hit)?.textContent ?? "") : "");
    if (title !== lastTitle) {
      running.textContent = title;
      lastTitle = title;
    }
    const on = title !== "";
    if (on !== lastOn) {
      running.classList.toggle("is-on", on);
      hdr.classList.toggle("is-running", on);
      lastOn = on;
    }
  }

  let ticking = false;
  const onFrame = () => {
    ticking = false;
    hdr.classList.toggle("is-scrolled", scrollY > 8);
    spy();
    if (backTop) {
      const shown = backTop.classList.contains("show");
      /* 迟滞：入场 1.05 屏、退场 0.95 屏，阈值附近不会来回闪 */
      const show = scrollY > innerHeight * (shown ? 0.95 : 1.05);
      if (shown !== show) backTop.classList.toggle("show", show);
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
    measure();
    scrollActiveIntoView(true);
    requestFrame();
  });

  if (backTop) {
    backTop.addEventListener("click", () => {
      scrollTo({ top: 0, behavior: reduceMotion.matches ? "instant" : "smooth" });
    });
  }

  syncInputUI();
  measure();
  onFrame();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      measure();
      spy();
    });
  }
})();
