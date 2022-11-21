const db =require('./db')

const getBookListByYearSql="SELECT * from bookshelf where year=?&&status=1"
const getBookListByYear=(year)=>{
    return new Promise((resolve,reject)=>{
        db.query(getBookListByYearSql,year,(err, results) => {
            if (err) reject(err)
            resolve(results)
        })
    })
}

exports.getBookList = (req, res) => {
    const year=req.query.year
    // 数据库中的tags为存储格式为字符串，改为数组传往前端
    getBookListByYear(year).then(data=>{
        data.forEach(item=>{
            item.tags=item.tags.split(',').filter(i=>i)
        })
        res.send({
            status:0,
            message:"获取成功",
            data
        })
    }).catch(err=>{
        res.send({
            status:1,
            message:"获取失败",
            err
        })
    })
}
