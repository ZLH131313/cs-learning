/* ============ 课程包加载器 ============
   用法(HTML 内两行):
     <script src="js/loader.js?v=版本号"></script>
     <script>window.loadPack('java')</script>
   loader 会把 ?v= 透传给 pack.js → 数据文件 → app.js,
   因此每次更新内容只需 bump HTML 里 loader.js 的 v= 一处。 */
(function () {
  var m = (document.currentScript && document.currentScript.src.match(/[?&]v=([^&#]+)/)) || [];
  window.__PACK_VER = m[1] ? ('?v=' + m[1]) : '';
  window.loadPack = function (id) {
    document.write('<script src="js/packs/' + id + '/pack.js' + window.__PACK_VER + '"><\/script>');
  };
})();
