// Global utility for opening add tool modal from any page
export const openAddToolModal = () => {
  // Navigate to dashboard with add tool parameter
  window.location.href = '/dashboard?addTool=true';
};

// Global utility for checking if add tool should be opened
export const checkAddToolParam = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('addTool') === 'true';
  }
  return false;
};

// Global utility for clearing add tool parameter
export const clearAddToolParam = () => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.searchParams.delete('addTool');
    window.history.replaceState({}, '', url.pathname + url.search);
  }
};
