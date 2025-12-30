export const triggerHapticFeedback = (type = 'medium') => {
  if (navigator.vibrate) {
    const pattern = {
      light: [20],
      medium: [50],
      heavy: [100],
      success: [20, 80, 20],
      error: [100, 50, 100],
    };
    navigator.vibrate(pattern[type] || pattern.medium);
  }
};
