var imgList=[
],dq=0,znum=0,pe=100;
$(function(){
  if (sessionStorage.getItem("data")==null) {
    sessionStorage.setItem('data',imgList);
    sessionStorage.setItem('num','0');
  }
  imgList=sessionStorage.getItem("data").split(',');
  sessionStorage.num=GetQueryString('pe')?GetQueryString('pe'):'1';;
  showImgList();
  PageMenu();
  document.querySelector('#sortable').sortablejs();


});
$("#show").click(function(){
  imgList=$("#data-url").val().split('\n');
  sessionStorage.setItem('data',imgList);
  sessionStorage.setItem('num','1');
  window.location="?pe=1";
});
function showImgList() {
  goShowImgList(sessionStorage.num);
  loadimg();
}
function goShowImgList(i) {
  if (((i-1)*pe)>=imgList.length) {
    return false;
  }
  for (var j=0; j < pe; j++) {
    if (j+((i-1)*pe)>=imgList.length) {
      return false;
    }
    showImg(removeAllSpace(imgList[j+((i-1)*pe)]));
  }
  //sessionStorage.setItem('num',j+i);

}
function PageMenu() {
  var z=Math.ceil(imgList.length/pe),//计算总页数
      d=Number(sessionStorage.num);
  $("#PageMenu").append('<li class="disabled"><a href="#" aria-label="Previous"><span aria-hidden="true">'+imgList.length+'条数据</span></a></li>');
  $("#PageMenu").append('<li class="disabled"><a href="#" aria-label="Previous"><span aria-hidden="true">共有'+z+'页</span></a></li>');
  $("#PageMenu").append('<li><a href="?pe=0" aria-label="Previous"><span aria-hidden="true">首页</span></a></li>');
  $("#PageMenu").append('<li class="'+((d-1<=z && (d-1)>0)?'':'disabled')+'"><a href="'+((d-1<=z && (d-1)>0)?('?pe='+(d-1)):('#'))+'" aria-label="Previous"><span aria-hidden="true">上一页</span></a></li>');
  for (var i = 3; i > 0; i--) {
    if ((d-i)>0) {
      $("#PageMenu").append('<li><a href="?pe='+(d-i)+'">'+(d-i)+'</a></li>');

    }
  }
  $("#PageMenu").append('<li class="active"><a href="?pe='+d+'">'+d+'</a></li>');
  for (var i = 1; i <= 3; i++) {
    if (d+i<=z) {
      $("#PageMenu").append('<li><a href="?pe='+(d+i)+'">'+(d+i)+'</a></li>');
    }
  }
  $("#PageMenu").append('<li class="'+((d+1<=z)?'':'disabled')+'"><a href="'+((d+1<=z)?('?pe='+(d+1)):('#'))+'" aria-label="Next"><span aria-hidden="true">下一页</span></a></li>');
  $("#PageMenu").append('<li><a href="'+z+'" aria-label="Next"><span aria-hidden="true">尾页</span></a></li>');
}
function showImg(url){
  if (url=="") {
    return false;
  }
  $("#sortable").append('<div data-sjsel="all" style="opacity: 1;"><div class="card"><img class="card__picture lazy-load" src="/static/img/LoadIng.png" data-original="'+url+'" alt=""></div></div>');
  document.querySelector('#sortable').sortablejs().orderelements();
}
function loadimg() {
  $("img.lazy-load").lazyload({
　　　　effect : "fadeIn", //渐现，show(直接显示),fadeIn(淡入),slideDown(下拉)
　　　　threshold : 180, //预加载，在图片距离屏幕180px时提前载入
　　　　event: 'scroll',  // 事件触发时才加载，click(点击),mouseover(鼠标划过),sporty(运动的),默认为scroll（滑动）
　　　　container: $("#sortable"), // 指定对某容器中的图片实现效果
　　　　failure_limit:20 //加载2张可见区域外的图片,lazyload默认在找到第一张不在可见区域里的图片时则不再继续加载,但当HTML容器混乱的时候可能出现可见区域内图片并没加载出来的情况
  });
  $("img.lazy-load").on('load',function(){
    document.querySelector('#sortable').sortablejs().orderelements();
  });
  $("img.lazy-load").click(function(){
    imgShow("#outerdiv", "#innerdiv", "#bigimg", $(this));
  });

}
function removeAllSpace(str='') {
  return ''+str.replace(/\s+/g, "");
}
function imgShow(outerdiv, innerdiv, bigimg, _this) {
 var src = _this.attr("src");
 $(bigimg).attr("src", src);
 $("<img/>").attr("src", src).on('load',function() {
     var windowW = $(window).width();
     var windowH = $(window).height();
     var realWidth = this.width;
     var realHeight = this.height;
     var imgWidth, imgHeight;
     var scale = 0.8;
     if (realHeight > windowH * scale) {
         imgHeight = windowH * scale;
         imgWidth = imgHeight / realHeight * realWidth;
         if (imgWidth > windowW * scale) {
             imgWidth = windowW * scale
         }
     } else {
         if (realWidth > windowW * scale) {
             imgWidth = windowW * scale;
             imgHeight = imgWidth / realWidth * realHeight
         } else {
             imgWidth = realWidth;
             imgHeight = realHeight
         }
     }
     $(bigimg).css("width", imgWidth);
     var w = (windowW - imgWidth) / 2;
     var h = (windowH - imgHeight) / 2;
     $(innerdiv).css({
         "top": h,
         "left": w
     });
     $(outerdiv).fadeIn("fast")
 });
 $(outerdiv).click(function() {
     $(this).fadeOut("fast")
 })
};

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
