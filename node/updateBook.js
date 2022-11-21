const db =require('./db')

const updateBookSql="UPDATE bookshelf SET type=?,tags=?,feature=?,rate=? where ISBN=?&&status=1"
const updateBook=(obj)=>{
    return new Promise((resolve,reject)=>{
        // 将前端的标签数组转成字符串存储
        db.query(updateBookSql,[obj.isFiction,obj.type.join(),obj.feature,obj.bookRate,obj.ISBN],(err, results) => {
            if (err) reject(err)
            resolve()
        })
    })
}

exports.updateBook = (req, res) => {
    const result=req.body
    updateBook(result).then(data=>{
        res.send({
            status:0,
            message:"修改成功",
        })
    }).catch(err=>{
        res.send({
            status:1,
            message:"修改失败",
            err
        })
    })
}
