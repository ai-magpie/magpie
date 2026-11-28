/* 在样式表之前执行：确定主题并同步浏览器 UI 颜色，避免深色偏好用户看到闪白。 */
try {
  var saved = localStorage.getItem("magpie-theme");
  if (saved === "dark" || saved === "light") document.documentElement.dataset.theme = saved;
} catch (error) {
  /* 隐私模式或禁用存储：保持跟随系统 */
}
var dark =
  document.documentElement.dataset.theme === "dark" ||
  (!document.documentElement.dataset.theme &&
    window.matchMedia("(prefers-color-scheme: dark)").matches);
var meta = document.querySelector('meta[name="theme-color"]');
if (meta) meta.content = dark ? "#0a0a0c" : "#fbfbfc";
