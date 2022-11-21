const express=require("express")
const router=require("./router")
const cors=require("cors")
const app=express()
// 跨域
app.use(cors())
// 解析JSON
app.use(express.json())
app.use('/',router)
app.listen(80, () => {
    console.log('express server running at http://127.0.0.1')
})


