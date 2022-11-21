<template>
  <a-drawer width="1200px" placement="right" :closable="false" visible="drawerVisible" @close="drawClose">
<!--    <p class="drawerText">{{year}},你一共读了x本书</p>-->
    <a-row>
      <a-col :span="12">
        <div id="tagsChart" style="width: 100%;height: 480px"></div>
      </a-col>
      <a-col :span="12">
        <div id="authorChart" style="width: 100%;height: 480px"></div>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <div id="trendChart" style="width: 100%;height: 350px"></div>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
import * as echarts from "echarts";
import {onUnmounted} from "vue";
import axios from "axios";
export default {
  name: "report",
  props:{
    drawerVisible:Boolean,
    year:String
  },
  emits:["onClose"],
  setup(prop,context){
    let echart=echarts
    let chartsData=[]
    onUnmounted(() => {
      echart.dispose;
    })
    const initTagsChart=()=>{
        let chart = echart.init(document.getElementById('tagsChart'));
        // 把配置和数据放这里
        chart.setOption({
          title: {
            text: prop.year+'作家分布',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '作家来自',
              type: 'pie',
              radius: '50%',
              data:chartsData[1],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
        window.onresize = function() {
          //自适应大小
          chart.resize();
        };
    }
    const initAuthorChart=()=>{
      let chart = echart.init(document.getElementById('authorChart'));
      // 把配置和数据放这里
      chart.setOption({
        title: {
          text: prop.year+'书籍类型分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '书籍类型',
            type: 'pie',
            radius: '50%',
            data: chartsData[2],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
      window.onresize = function() {
        //自适应大小
        chart.resize();
      };
    }
    const initTrendChart=()=>{
      let chart = echart.init(document.getElementById('trendChart'));
      // 把配置和数据放这里
      chart.setOption({
        title: {
          text: '阅读数目',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['2021', '2022', '2023'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '数目',
            type: 'bar',
            barWidth: '50%',
            data: chartsData[0]
          }
        ]
      });
      window.onresize = function() {
        //自适应大小
        chart.resize();
      };
    }
    const getCharts=()=>{
      axios.get(`http://127.0.0.1/getCharts?year=${prop.year}`)
          .then(res=>{
            chartsData=res.data.data
            // 获得数据后初始化图标
            initTagsChart()
            initAuthorChart()
            initTrendChart()
          }).catch(err=>{
        console.log(err);
      })
    }
    getCharts()
    const drawClose=()=>{
      context.emit("onClose")
    }
    return{
      drawClose,
    }
  }
}
</script>

<style scoped>

</style>
