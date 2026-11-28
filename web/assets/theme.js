/* 在样式表之前执行：把记忆里的主题写到 <html>，避免深色偏好用户看到闪白。 */
try {
  var saved = localStorage.getItem("magpie-theme");
  if (saved === "dark" || saved === "light") document.documentElement.dataset.theme = saved;
} catch (error) {
  /* 隐私模式或禁用存储：保持跟随系统 */
}
