const express=require("express")
const getBookList=require("./getBookList")
const deleteBook=require("./deleteBook")
const updateBook=require("./updateBook")
const addBook=require("./addBook")
const getCharts=require("./getCharts")

const router=express.Router()
//查看
router.get('/bookList', getBookList.getBookList)
//删除
router.get('/deleteBook',deleteBook.deleteBook)
//更改
router.post('/editBook',updateBook.updateBook)
//增加
router.post('/addBook',addBook.addBook)
//图表
router.get('/getCharts',getCharts.getCharts)

module.exports=router
