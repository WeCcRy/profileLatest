const db=require("./db")
// 避免直接删除数据库中的数据，通过设置status表明是否删除，0为deleted，1为active
const deleteBookSql="UPDATE bookshelf SET status = '0' WHERE ISBN=?"

const deleteBook=(ISBN)=>{
    return new Promise((resolve,reject)=>{
        db.query(deleteBookSql,ISBN,(err, results) => {
            if (err) reject(err)
            resolve()
        })
    })
}

exports.deleteBook = (req, res) => {
    const ISBN=req.query.ISBN
    deleteBook(ISBN).then(()=>{
        res.send({
            status:0,
            message:"删除成功",
        })
    }).catch(err=>{
        res.send({
            status:1,
            message:"删除失败",
            err
        })
    })
}
