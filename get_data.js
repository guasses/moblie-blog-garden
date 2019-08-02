//引入第三方模块
const superagent = require('superagent');
const cheerio = require('cheerio');

/**
 * @description desc 获取页面数据并写入到文件
 * @param i desc 页数
 * @return array 返回博客数组列表
 */
function getData(i,callback){
    superagent.post("https://www.cnblogs.com/mvc/AggSite/PostList.aspx")
        .send({CategoryId: 808,     //发送数据到服务器
            CategoryType: "SiteHome",
            ItemListActionName: "PostList",
            PageIndex: i,           //根据i获取相应的页面数据
            ParentCategoryId: 0,
            TotalPostCount: 4000})
        .end((error,response)=>{    //页面访问失败返回error，response为服务器返回的数据
            if(error){
                console.log(`访问第${i}页失败！`+error);
                return false;
            }else{
                console.log(`开始解析第${i}页数据`);
                //解析DOM
                let blogList = [];        //新建空列表，用来放一个页面的博客
                let $ = cheerio.load(response.text);
                //获取所有class="post_item_body"的元素，然后遍历每一个元素
                $('.post_item>.post_item_body').each((index,element)=>{
                    //用键值对存放数据
                    let blog = {
                        //trim()方法用于删除字符串的头尾空格
                        link:$(element).find('.titlelnk').attr('href').trim(),
                        title:$(element).find('.titlelnk').text().trim(),
                        summary:$(element).find('.post_item_summary').text().trim(),
                        author:$(element).find('.lightblue').text(),
                        time:$(element).find('.post_item_foot').clone().children().remove().end().text().trim(),
                        comment:$(element).find('.article_comment>.gray').text().trim(),
                        view:$(element).find('.article_view>.gray').text().trim()
                    }
                    //添加到数组尾部
                    blogList.push(blog);
                });
                callback(blogList);//回调函数
            }
        });
}
module.exports = getData;
//写入数据库
/*for(let i=1;i<=200;i++){
    superagent.post("https://www.cnblogs.com/mvc/AggSite/PostList.aspx")
        .send({CategoryId: 808,     //发送数据到服务器
            CategoryType: "SiteHome",
            ItemListActionName: "PostList",
            PageIndex: i,           //根据i获取相应的页面数据
            ParentCategoryId: 0,
            TotalPostCount: 4000})
        .end((error,response)=>{    //页面访问失败返回error，response为服务器返回的数据
            if(error){
                console.log(`访问第${i}页失败！`+error);
            }else{
                //调用函数，并以键值对的形式
                let blogList = getBlogList(response);
                blogList.forEach((value,index)=>{
                    basemodel.findOneById('main_blog_list',{"link":value['link']},function(result){
                        if(result){
                            console.log(`${value.link}数据已存在!!!`);
                        }else{
                            basemodel.insert("main_blog_list",value,function(id){
                                if(id){
                                    console.log(`插入数据库数据ID=${id}成功！`);
                                }
                            });
                        }
                    });
                })
            }
        });
}*/