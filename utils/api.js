export const withLoading = async (apiCall, loadingContext, loadingText = 'Loading...') => {
  try {
    loadingContext.showLoading(loadingText);
    const result = await apiCall();
    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  } finally {
    loadingContext.hideLoading();
  }
};
