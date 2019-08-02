$(function(){
    let page = 1;
    getData(page);
    $("#next").on("tap",function(){
        ++page;
        if(page < 201){
            getData(page);
        }else{
            page = 1;
            getData(page);
        }
    });
    $('#pre').on("tap",function(){
        --page;
        if(page < 1){
            page = 200;
            getData(page);
        }else{
            getData(page);
        }
    })
});
/**
 * @description desc 根据传入的第几页发送获取第几页的数据到服务器，然后加载数据
 * @param page  int 第几页
 */
function getData(page){
    $.post("txt/main_blog_list.txt",{id:page},function(data,status){
        if(data){
            data = JSON.parse(data);
            let html = ""
            for(let i=0;i<data.length;i++){
                html+=`<li data-role="list-divider" class="ui-li-divider ui-bar-inherit ui-li-has-count ui-first-child">
                ${data[i]['time']}<span class="ui-li-count ui-body-inherit">${data[i]['view']}${data[i]['comment']}</span></li>
                <li>
                    <a href="${data[i]['link']}" class="ui-btn ui-btn-icon-right ui-icon-carat-r">
                        <h2>${data[i]['title']}</h2>
                        <p>${data[i]['summary']}</p>
                        <p class="ui-li-aside">${data[i]['author']}</p>
                    </a>    
                </li>`;
                $('#content').html(html);
            }
            $("#page").text(`第${page}页`);
        }
    });
}