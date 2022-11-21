const db=require("./db")

const getTotalBooks2021Sql="SELECT * from bookshelf where year=2021&&status=1"
const getTotalBooks2022Sql="SELECT * from bookshelf where year=2022&&status=1"
const getTotalBooks2023Sql="SELECT * from bookshelf where year=2023&&status=1"
const getTotalAuthorNationSql="select editor from bookshelf where year=?&&status=1"
const getTotalTagsSql="select tags from bookshelf where year=?&&status=1"
const getTotalBooks2021=()=>{
    return new Promise((resolve,reject)=>{
        db.query(getTotalBooks2021Sql,(err,results)=>{
            resolve(results.length)
        })
    })
}

const getTotalBooks2022=()=>{
    return new Promise((resolve,reject)=>{
        db.query(getTotalBooks2022Sql,(err,results)=>{
            resolve(results.length)
        })
    })
}

const getTotalBooks2023=()=>{
    return new Promise((resolve,reject)=>{
        db.query(getTotalBooks2023Sql,(err,results)=>{
            resolve(results.length)
        })
    })
}

const getTotalAuthorNation=(year)=>{
    return new Promise((resolve,reject)=>{
        db.query(getTotalAuthorNationSql,[year],(err,results)=>{
            //取出每个作家的国籍
            const formatResult=results.map(key=>{
                let index=key.editor.indexOf("]")
                return key.editor.substr(1,index-1)||""
            })
            //统计每个国家的出现次数
            const authorResult=formatResult.filter(i=>i).reduce((acc, cur) => {
                if (!acc[cur]) {
                    acc[cur] = 0
                }
                acc[cur]++
                return acc
            }, {})
            //将数据库中存储的国家简称转换成全称
            const authorFormatResult=JSON.parse(JSON.stringify(authorResult)
                .replace(/中/g,"中国")
                .replace(/美/g,"美国")
                .replace(/日/g,"日本")
                .replace(/德/g,"德国")
                .replace(/葡/g,"葡萄牙")
                .replace(/韩/g,"韩国")
                .replace(/英/g,"英国")
                .replace(/波/g,"波兰")
                .replace(/意/g,"意大利")
                .replace(/俄/g,"俄罗斯")
                .replace(/法/g,"法国")
                .replace(/西/g,"西班牙")
                .replace(/哥/g,"哥伦比亚")
                .replace(/加/g,"加拿大")
            )
            //适配前端所需格式
            let finalResult=[]
            for(let key in authorFormatResult){
                let temp={}
                temp.value=authorFormatResult[key]
                temp.name=key
                finalResult.push(temp)
            }
            //降序排序，适配前端
            finalResult.sort((x,y)=>{
                return y.value-x.value
            })
            resolve(finalResult)
        })
    })
}

const getTotalTags=(year)=>{
    return new Promise((resolve,reject)=>{
        db.query(getTotalTagsSql,[year],(err,results)=>{
            //初步格式化，将tags字符串转换成数组
            const formatResultFirst=results.map(key=>{
                return key.tags.split(",").filter(i=>i)
            })
            //第二次格式化，将二维数组拆分成一维数组
            const formatResultSec=formatResultFirst.reduce((acc,cur)=>{
                return [...acc,...cur]
            },[])
            //对各个tags出现次数进行统计
            const tagsFormatResult=formatResultSec.reduce((acc, cur) => {
                if (!acc[cur]) {
                    acc[cur] = 0
                }
                acc[cur]++
                return acc
            }, {})
            let finalResult=[]
            //适配前端所需对象格式
            for(let key in tagsFormatResult){
                let temp={}
                temp.value=tagsFormatResult[key]
                temp.name=key
                finalResult.push(temp)
            }
            //降序排序，方便前端展示
            finalResult.sort((x,y)=>{
                return y.value-x.value
            })
            resolve(finalResult)
        })
    })
}
const getAllCharts=(year)=>{
    // 待所有Promise完成后，再向前端传数据
    return Promise.all([getTotalBooks2021(),getTotalBooks2022(),getTotalBooks2023(),getTotalAuthorNation(year),getTotalTags(year)])
}

exports.getCharts=(req,res)=>{
    const year=req.query.year
    getAllCharts(year).then((results)=>{
        // 方便前端根据年份的突出显示
        let trendChartDetails=results.slice(0,3)
        if(year=="2021"){
            trendChartDetails[0]={
                value: trendChartDetails[0],
                itemStyle: {
                    color: '#ee6666'
                }
            }
        }else if(year=="2022"){
            trendChartDetails[1]={
                value: trendChartDetails[1],
                itemStyle: {
                    color: '#ee6666'
                }
            }
        }else if(year=="2023"){
            trendChartDetails[2]={
                value: trendChartDetails[2],
                itemStyle: {
                    color: '#ee6666'
                }
            }
        }
        const data=[trendChartDetails,results[3],results[4]]
        res.send({
            status:0,
            message:"数据获取成功",
            data
        })
    })
}
