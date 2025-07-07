'use client';

let loadingEl = null;
let loadingTimeout = null;

const ensureLoadingElement = () => {
  if (typeof window === 'undefined') return null;
  
  if (!loadingEl) {
    loadingEl = document.getElementById('global-loading');
    
    if (!loadingEl) {
      loadingEl = document.createElement('div');
      loadingEl.id = 'global-loading';
      loadingEl.className = 'hidden';
      loadingEl.innerHTML = `
        <div class="loading-content">
          <div class="mosaic-loading">
            <div class="mosaic-block"></div>
            <div class="mosaic-block"></div>
            <div class="mosaic-block"></div>
            <div class="mosaic-block"></div>
          </div>
          <div class="loading-text mt-4 text-white"></div>
        </div>
      `;
      document.body.appendChild(loadingEl);
    }
  }
  
  return loadingEl;
};

const showLoading = (text = '') => {
  const el = ensureLoadingElement();
  if (!el) return;
  
  // Clear any existing timeout
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  
  // Update loading text if provided
  if (text) {
    const textEl = el.querySelector('.loading-text');
    if (textEl) textEl.textContent = text;
  }
  
  // Show loading
  el.classList.remove('hidden');
  
  // Safety timeout to ensure loading is hidden
  loadingTimeout = setTimeout(() => {
    hideLoading();
  }, 10000); // 10 seconds timeout
};

const hideLoading = () => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  
  const el = document.getElementById('global-loading');
  if (el) {
    el.classList.add('hidden');
  }
};

// Initialize and hide loading immediately when this module loads
if (typeof window !== 'undefined') {
  ensureLoadingElement();
  window.addEventListener('load', hideLoading);
  window.addEventListener('DOMContentLoaded', hideLoading);
  
  // Also hide loading when the page is fully loaded
  if (document.readyState === 'complete') {
    hideLoading();
  } else {
    window.addEventListener('load', hideLoading);
  }
}

export { showLoading, hideLoading };
