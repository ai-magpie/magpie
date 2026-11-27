(() => {
  const input = document.querySelector('#q');
  const count = document.querySelector('#count');
  const empty = document.querySelector('#empty');
  if (!input || !count || !empty) return;

  const items = [...document.querySelectorAll('.entries li')];
  const sections = [...document.querySelectorAll('.section')];
  const searchText = items.map((item) => (item.dataset.search ?? '').toLowerCase());
  const total = items.length;

  const normalize = (value) => value.toLowerCase().replace(/\s+/g, ' ').trim();

  function apply() {
    const query = normalize(input.value);
    let visible = 0;

    items.forEach((item, index) => {
      const match = query === '' || searchText[index].includes(query);
      item.hidden = !match;
      if (match) visible += 1;
    });

    for (const section of sections) {
      const list = section.querySelector('.entries');
      const shown = list ? [...list.children].some((item) => !item.hidden) : false;
      section.hidden = query !== '' && !shown;
    }

    empty.hidden = !(query !== '' && visible === 0);
    count.textContent = query === '' ? `共 ${total} 个条目` : `找到 ${visible} 个条目`;
  }

  input.addEventListener('input', apply);

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const editing =
      target instanceof HTMLElement &&
      (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

    if (event.key === '/' && !editing) {
      event.preventDefault();
      input.focus();
      input.select();
    } else if (event.key === 'Escape' && document.activeElement === input) {
      input.value = '';
      apply();
      input.blur();
    }
  });
})();
