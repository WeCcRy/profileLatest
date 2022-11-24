const db=require("./db")
// 若存在该条ISBN数据,更新新的数据,并将status设为1
const addExistBookSql="UPDATE bookshelf SET year=?,type=?,tags=?,feature=?,rate=?,status='1' where ISBN=?"
// 添加一条新的数据
const addBookSql="INSERT INTO bookshelf (`year`, `name`, `editor`, `type`, `tags`, `feature`, `rate`, `ISBN`, `photoUrl`, `description`, `douban`) VALUES (?,?,?,?,?,?,?,?,?,?,?);"
// 查找是否存在该条ISBN
const searchBookIsExistSql="SELECT * from bookshelf where ISBN=?"
// 添加只能添加到当年中
const year=new Date().getFullYear()
const searchBookIsExist=(ISBN)=>{
    return new Promise((resolve,reject)=>{
        db.query(searchBookIsExistSql,ISBN,(err,results)=>{
            // 长度为1表示存在，为0表示查不到该条信息
            resolve(results.length)
        })
    })
}
const addBook=(obj)=>{
    return new Promise((resolve,reject)=>{
        searchBookIsExist(obj.ISBN).then(isExist=>{
            if(isExist===1){
                db.query(addExistBookSql,[year,obj.isFiction,obj.type.join()||"",obj.feature,obj.bookRate,obj.ISBN],(err,results)=>{
                    if (err) reject(err.message)
                    //数据库中已经存在该条数据，将数据库中的status数据更新为1
                    if (results.affectedRows === 1) resolve("类型0，添加成功")
                })
            }else{
                db.query(addBookSql,[year,obj.title,obj.author,obj.isFiction,obj.type.join(),obj.feature,obj.bookRate,obj.ISBN,obj.photoUrl,obj.description,obj.douban],(err,results)=>{
                    //数据库中不存在该条数据，添加该条数据
                    if (err) reject(err.message)
                    if (results.affectedRows === 1) resolve("类型1，添加成功")
                })
            }
        })
    })
}
exports.addBook=(req,res)=>{
    const result=req.body
    addBook(result).then(data=>{
        res.send({
            status:0,
            message:data,
        })
    }).catch(err=>{
        res.send({
            status:1,
            message:err,
        })
    })
}
