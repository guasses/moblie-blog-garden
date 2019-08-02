$(function(){                     //当文档加载完成时调用，jquery方法
    let page = 1;
    getData(page);
    $("#next").on("tap",function(){//下一页按钮点击事件
        ++page;
        if(page < 201){            
            getData(page);         //ajax获取数据
        }else{              
            page = 1;              //如果页数大于200页就跳转到第一页
            getData(page);         //因为博客园翻页就200页，再多就获取不到了
        }
    });
    $('#pre').on("tap",function(){//上一页按钮点击事件
        --page;
        if(page < 1){               //页数不能小于1页
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
    //请求特定的文件并发送请求的页数
    $.post("txt/main_blog_list.txt",{id:page},function(data,status){
        if(data){
            data = JSON.parse(data);  //服务器返回的数据为字符串，我们把它转换为JSON数组
            let html = ""             //每次请求后都清空html字符串
            for(let i=0;i<data.length;i++){//因为是一个JSON数组，需要遍历它
                html+=`<li data-role="list-divider" class="ui-li-divider ui-bar-inherit ui-li-has-count ui-first-child">
                ${data[i]['time']}<span class="ui-li-count ui-body-inherit">${data[i]['view']}${data[i]['comment']}</span></li>
                <li>
                    <a href="${data[i]['link']}" class="ui-btn ui-btn-icon-right ui-icon-carat-r">
                        <h2>${data[i]['title']}</h2>
                        <p>${data[i]['summary']}</p>
                        <p class="ui-li-aside">${data[i]['author']}</p>
                    </a>    
                </li>`;                  //这里使用模板字符串，不懂的可以百度一下
                $('#content').html(html);//添加html到DOM
            }
            $("#page").text(`第${page}页`);//修改页脚页数
        }
    });
}