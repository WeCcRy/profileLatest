<template>
  <a-layout>
    <a-layout-head style="padding: 16px 10px 0 16px">
      <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="2">
          <a-typography-title :level="2">{{ year }}
            <!--          Pantone年度色！-->
            <SmileTwoTone v-if="year=='2021'" twoToneColor="#F5DF4D" style="margin-left: 15px"/>
            <SmileTwoTone v-if="year=='2022'" twoToneColor="#6667AB" style="margin-left: 15px"/>
            <SmileTwoTone v-if="year=='2023'" twoToneColor="#BB2649" style="margin-left: 15px"/>
          </a-typography-title>
        </a-col>
        <a-col :span="1" style="margin-bottom: 15px">
          <a-dropdown>
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="2021" v-if="year=='2021'?0:1">2021</a-menu-item>
                <a-menu-item key="2022" v-if="year=='2022'?0:1">2022</a-menu-item>
                <a-menu-item key="2023" v-if="year=='2023'?0:1">2023</a-menu-item>
              </a-menu>
            </template>
            <a-button>
              年份选择
              <DownOutlined/>
            </a-button>
          </a-dropdown>
        </a-col>
        <a-col :span="18"></a-col>
        <a-col :span="1">
          <!--        只有在当前年才可以实现添加-->
          <a-button v-if="year==currentYear" type="primary" size="small" @click="showModal('add')">
            <template #icon>
              <plus-outlined/>
            </template>
          </a-button>
        </a-col>
        <a-col :span="2">
          <a-button type="link" @click="showDrawer">我的图书报告</a-button>
        </a-col>
      </a-row>
    </a-layout-head>
    <a-layout-content style="margin: 0 16px">
      <a-table :columns="columns" :data-source="bookList" :pagination="false" rowKey="key">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
<!--            表格name项可超链接至豆瓣详情页-->
            <a :href="'https://book.douban.com/subject/'+record.douban" target="_blank">
<!--              鼠标悬浮在书名可以调出悬浮气泡卡片-->
              <a-popover :title="record.name" placement="bottom">
                <template #content>
<!--                  通过float实现左右对齐-->
                  <img class="bookCover" :src="'https://images.weserv.nl/?url='+record.photoUrl" alt="图片加载中...">
                  <div class="bookDescription">{{ record.description }}</div>
                  <div style="clear:both"></div>
                </template>
                {{ record.name }}
              </a-popover>
            </a>
          </template>
          <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
              v-for="tag in [record.type,...record.tags,record.feature].filter(i=>i)"
              :key="tag"
              :color=color(tag)
          >
            {{ tag }}
          </a-tag>
        </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <div>
              <a style="width: 50%" @click="showModal('edit',record)">修改</a>
              <a-divider type="vertical"/>
              <a style="width: 50%" @click="handleDelete(record)">删除</a>
            </div>
          </template>
        </template>
      </a-table>
    </a-layout-content>
<!--    添加图书的弹窗内容-->
<!--    关闭时销毁组件避免缓存出现奇怪的bug-->
    <a-modal v-model:visible="formVisible" :title="!modalEditable?'图书添加':'图书修改'" @ok="handleOk" style="width: 560px"
             :destroyOnClose="true">
<!--      表单-->
<!--      需要填写的内容用addBookInfo对象保存-->
      <a-form :model="addBookInfo" @finish="onFinish">
        <a-form-item name="ISBN" label="ISBN" has-feedback
                     :rules="[{ required: true,type: 'string', min: 13, max: 13 ,message:'请输入13位ISBN码'}]">
          <a-input v-model:value="addBookInfo.ISBN" :disabled="modalEditable"/>
        </a-form-item>
        <a-form-item name="isFiction" label="小说(是/否)">
          <a-switch v-model:checked="addBookInfo.isFiction"/>
        </a-form-item>
        <a-form-item name="type" label="标签">
          <a-checkbox-group v-model:value="addBookInfo.type">
            <a-checkbox value="推理" name="type">推理</a-checkbox>
            <a-checkbox value="历史" name="type">历史</a-checkbox>
            <a-checkbox value="纪实" name="type">纪实</a-checkbox>
            <a-checkbox value="社会" name="type">社会</a-checkbox>
            <a-checkbox value="科幻" name="type">科幻</a-checkbox>
            <a-checkbox value="哲学" name="type">哲学</a-checkbox>
            <a-checkbox value="传记" name="type">传记</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item name="feature" label="专属标签">
          <a-input v-model:value="addBookInfo.feature"/>
        </a-form-item>
        <a-form-item name="bookRate" label="评分">
          <a-input-number v-model:value="addBookInfo.bookRate" :min="0" :max="5" :precision="2" :step="0.1"/>
          <a-rate :value="bookRateVShow" allow-half disabled style="margin-left: 20px"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 7 }" v-if="!modalEditable">
          <a-button @click="bookClear" style="text-align: center">清空</a-button>
          <a-button type="primary" html-type="submit" style="margin-left: 10px" :disabled="isChecked">查看详细信息</a-button>
        </a-form-item>
      </a-form>
<!--      通过上面用户填写的ISBN发送请求获取书籍的详细信息,保存在bookAddDetail对象中-->
      <a-card style="width: 190px;margin:auto" v-if="isChecked">
        <template #cover>
          <img :src="'https://images.weserv.nl/?url='+bookAddDetail.photoUrl" style="width: 190px;height: 263px"
               alt="加载中..."/>
        </template>
        <a-card-meta :title="bookAddDetail.title">
          <template #description>{{ bookAddDetail.author }}</template>
        </a-card-meta>
      </a-card>
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" @click="handleOk" :disabled="!isChecked">{{ bookAddConfirm }}</a-button>
      </template>
    </a-modal>
    <!--  v-if用于抽屉挂载时渲染图标-->
    <report v-if="drawerVisible" :drawerVisible="drawerVisible" :year="year" @onClose="onClose"></report>
  </a-layout>
</template>
<script>

import {DownOutlined, SmileTwoTone, PlusOutlined, ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {message, Modal} from 'ant-design-vue';
import {defineComponent, ref, watch, reactive, createVNode} from 'vue';
import report from "./report"
import axios from 'axios'

const columns = [
  {
    title: "排名",
    dataIndex: "index",
    key: "index",
    width: '5%',
    customRender: (text) => {
      return parseInt(text.index) + 1
    }
  },
  {
    title: '书名',
    name: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '25%',
  },
  {
    title: '作者',
    dataIndex: 'editor',
    key: 'editor',
    width: '20%',
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
    width: '33%',
  },
  {
    title: '评分',
    key: 'rate',
    dataIndex: 'rate',
    width: '10%',
    //通过数据库中的评分，将评分的数据可视化显示
    customRender: (text) => {
      //取出数字
      const rate = parseFloat(text.value)
      //取出整数部分
      let x = parseInt(rate)
      //根据整数部分直接填充🌕
      let string = ""
      for (let i = 0; i < x; i++) {
        string += "🌕"
      }
      //取出小数部分
      let y = rate % 1
      //小数部分为0.5取🌗，小于0.5大于0取🌘，大于0.5取🌖
      if (y == 0.5) {
        string += "🌗"
      } else if (y < 0.5 && y > 0) {
        string += "🌘"
      } else if (y > 0.5) {
        string += "🌖"
      }
      //用🌑填充至10位字符，5位图案
      if (string.length < 10) {
        for (let i = string.length; i < 10; i += 2) {
          string += "🌑"
        }
      }
      return (string)
    },
    defaultSortOrder: 'descend',
    //降序排序
    sorter: (a, b) => a.rate - b.rate,
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: '7%',
  },
];
export default defineComponent({
  components: {
    report,
    DownOutlined,
    SmileTwoTone,
    PlusOutlined,
  },
  setup() {
    // 当前年份
    const currentYear=new Date().getFullYear()
    // 可编辑年份
    let year = ref(currentYear)
    let bookList = ref([])
    let bookDetail = ref("")
    let photoUrl = ref("")
    //https://jike.xyz/jiekou/isbn.html#%E8%BF%94%E5%9B%9E%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E
    //私人接口APIKEY，如无法获得数据，需手动更改
    const apikey = "13294.206eaa07ed2ea8b374cf076241a2024c.f57bd57f2303f9557c040b0365744e1c"
    const drawerVisible = ref(false)
    const formVisible = ref(false)
    let modalEditable = ref(false)
    let ISBNArray = []
    let isChecked = ref(false)
    let bookRateVShow = ref(0)
    let bookAddConfirm = ref("请先查看书本详细信息")
    let addBookInfo = reactive({
      ISBN: '',
      isFiction: true,
      type: [],
      bookRate: 0,
      feature: "",
    });
    let bookAddDetail = reactive({
      ISBN: '',
      title: '',
      author: '',
      photoUrl: '',
      description: '',
      douban: ''
    })
    //通用清空方法
    const objClear = (obj) => {
      Object.keys(obj).map(key => {
        delete obj[key]
      })
    }
    const showDrawer = () => {
      drawerVisible.value = true;
    };
    const onClose = () => {
      drawerVisible.value = false;
    };
    const handleMenuClick = (e) => {
      year.value = e.key
    }
    //添加书籍的弹窗内容
    const showModal = (status, record) => {
      formVisible.value = true;
      //编辑和添加不同逻辑
      if (status == "edit") {
        modalEditable.value = true
        isChecked.value = true
        addBookInfo.ISBN = record.ISBN
        addBookInfo.isFiction = record.type == "小说"
        addBookInfo.type = record.tags||[]
        addBookInfo.feature = record.feature
        addBookInfo.bookRate = record.rate
        bookAddDetail.photoUrl = record.photoUrl
        bookAddDetail.title = record.name
        bookAddDetail.author = record.editor
      } else {
        modalEditable.value = false
        isChecked.value = false
        bookClear()
      }
    };
    const bookClear = () => {
      isChecked.value = false
      objClear(bookAddDetail)
      objClear(addBookInfo)
      addBookInfo.isFiction = true
      addBookInfo.type=[]
      addBookInfo.bookRate = 0
    }
    const handleCancel = () => {
      formVisible.value = false;
    };
    const handleOk = () => {
      //通过modalEditable来判断是编辑图书还是添加图书,1编辑，0添加
      if (modalEditable.value) {
        axios.post("http://127.0.0.1/editBook", {
          // 以下为不需要修改的内容（也可以提交修改）
          // title:bookAddDetail.title,
          // author:bookAddDetail.author,
          // photoUrl:bookAddDetail.photoUrl,
          // description:bookAddDetail.description,
          // douban:bookAddDetail.douban,
          ISBN: addBookInfo.ISBN,
          bookRate: addBookInfo.bookRate,
          isFiction: addBookInfo.isFiction == 1 ? "小说" : "非小说",
          type: addBookInfo.type,
          feature: addBookInfo.feature,
        })
            .then((res) => {
              if (res.data.status == 0) {
                message.success(res.data.message)
                formVisible.value = false
                getBookList(year)
              }else{
                message.error(res.data.message);
              }
            }).catch(err => {
          console.log(err);
        })
      } else {
        // 通过ISBN来查看是否已经存储过该书籍
        let flag = 0
        ISBNArray.forEach((ele) => {
          if (ele == addBookInfo.ISBN && flag == 0) {
            flag = 1
          }
        })
        if (flag == 1) {
          message.error("该ISBN已存在")
        } else {
          axios.post('http://127.0.0.1/addBook', {
            title: bookAddDetail.title,
            author: bookAddDetail.author,
            photoUrl: bookAddDetail.photoUrl,
            description: bookAddDetail.description,
            douban: bookAddDetail.douban,
            ISBN: addBookInfo.ISBN,
            bookRate: addBookInfo.bookRate,
            isFiction: addBookInfo.isFiction == 1 ? "小说" : "非小说",
            type: addBookInfo.type || [],
            feature: addBookInfo.feature || ""
          })
              .then((res) => {
                if (res.data.status == 0) {
                  message.success(res.data.message)
                  formVisible.value = false
                  getBookList(year)
                }else{
                  message.error(res.data.message);
                }
              }).catch(err => {
            console.log(err);
          })
        }
      }
    };
    const getBookList = year => {
      axios.get(`http://127.0.0.1/booklist?year=${year.value}`)
          .then(res => {
            bookList.value = res.data.data
            ISBNArray = res.data.data.map((ele) => {
              return ele.ISBN
            })
          }).catch(err => {
        console.log(err);
      })
    }
    const onFinish = values => {
      objClear(bookAddDetail)
      getDetailsAdd(values.ISBN).then((data)=>{
        isChecked.value = true
        bookAddDetail.photoUrl = data.photoUrl
        bookAddDetail.author = data.author
        bookAddDetail.title = data.name
        bookAddDetail.description = data.description
        bookAddDetail.douban = data.douban
      }).catch((err)=>{
        message.error(err)
      })
    };
    // 通过api获得书籍的详细信息
    const getDetailsAdd = (ISBN) => {
      return new Promise((resolve,reject)=>{
        axios.get(`https://api.jike.xyz/situ/book/isbn/${ISBN}?apikey=${apikey}`)
            .then(res => {
              const data=res.data.data
              if(data){
                resolve(data)
              }else{
                reject("查询失败，请输入正确的ISBN")
              }
            })
      })
    }
    const handleDelete = (record) => {
      Modal.confirm({
        title: "你确定要删除《" + record.name + "》么？",
        icon: createVNode(ExclamationCircleOutlined),
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          axios.get(`http://127.0.0.1/deleteBook?year=${year.value}&ISBN=${record.ISBN}`)
              .then((res) => {
                if (res.data.status == 0) {
                  message.success(res.data.message)
                  getBookList(year)
                }else{
                  message.error(res.data.message)
                }
              }).catch(err => {
            console.log(err);
          })
        }
      });
    }
    const color = (name) => {
      switch (name) {
        case "小说":
          return 'blue'
        case "推理":
          return 'purple'
        case "历史":
          return 'gold'
        case "纪实":
          return 'orange'
        case "传记":
          return 'cyan'
        case "社会":
          return 'lime'
        case "科幻":
          return 'red'
        case "哲学":
          return 'pink'
        case "非小说":
          return 'green'
        default:
          return 'default'

      }
    }
    // 监控变量year，来实现切换提示
    watch(year, (n, o) => {
      getBookList(year)
      message.success("已为你切换至" + n + "年")
    })
    // 通过监控添加书籍弹窗的ISBN表单项，避免用户修改ISBN后，未点击查询详细的按钮，发送错误的数据给服务器
    watch(() => addBookInfo.ISBN, (n, o) => {
      if (!modalEditable.value) {
        isChecked.value = false
      }
    })
    // 不确定上传的信息不给提交，同时方便获得书籍的详细信息
    watch(isChecked, () => {
      if (isChecked.value == false) {
        bookAddConfirm.value = "请先查看书本详细信息"
      } else {
        bookAddConfirm.value = "提交"
      }
    })
    // 弹窗中的评分可视化
    watch(() => addBookInfo.bookRate, () => {
      let intRate = parseInt(addBookInfo.bookRate)
      if (addBookInfo.bookRate % 1 >= 0.5) {
        bookRateVShow.value = intRate + 0.5
      } else {
        bookRateVShow.value = intRate
      }
    })
    // 获得书籍信息
    getBookList(year)
    return {
      bookList,
      drawerVisible,
      formVisible,
      modalEditable,
      addBookInfo,
      isChecked,
      bookRateVShow,
      bookAddConfirm,
      bookAddDetail,
      bookDetail,
      photoUrl,
      year,
      currentYear,
      columns,
      handleMenuClick,
      bookClear,
      showDrawer,
      onClose,
      showModal,
      handleCancel,
      handleOk,
      getBookList,
      onFinish,
      handleDelete,
      color,
    };
  },
});
</script>
<style>
.drawerText {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.8);
  line-height: 24px;
  display: block;
  margin-bottom: 16px;
}
.bookCover{
  width: 122px;
  height: 176px;
  float: left;
}
.bookDescription{
  float: left;
  width: 250px;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical
}
</style>
