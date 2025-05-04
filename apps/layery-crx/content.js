function showTooltip(message) {
  const tip = document.createElement('div');
  tip.innerText = message;
  Object.assign(tip.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '8px',
    zIndex: 99999,
    fontSize: '14px'
  });
  document.body.appendChild(tip);
  setTimeout(() => tip.remove(), 3000);
}

function blockInteractions() {
  document.querySelectorAll('input[type="file"]').forEach(input => {
    input.disabled = true;
    input.style.display = 'none';
  });

  const handleBlock = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { clipboardData } = e;
    if (!clipboardData) return;
    const items = clipboardData.items;
    if (!items) return;
    let text = '';
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'string') {
        item.getAsString((str) => {
          text += str;
        });
      }
    }
    console.log('disable paste', text);
    showTooltip('已禁用粘贴功能');
  };

  document.addEventListener('paste', (e) => {
    handleBlock(e);
  }, true);

  const blockPaste = (el) => {
    el.addEventListener('paste', (e) => {
      handleBlock(e);
    });
  };

  document.querySelectorAll('[contenteditable], textarea, input[type="text"]').forEach(blockPaste);

  setInterval(() => {
    document.querySelectorAll('input[type="file"]:not([data-disabled])').forEach(input => {
      input.disabled = true;
      input.setAttribute('data-disabled', 'true');
      input.style.display = 'none';
    });
  }, 1000);
}

chrome.storage.sync.get('blockEnabled', ({ blockEnabled }) => {
  if (blockEnabled !== false) {
    blockInteractions();
  }
});