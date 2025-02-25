<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { defineComponent, ref, onMounted  } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (chartRef.value) {
    const myChart = echarts.init(chartRef.value)
    
    // 配置图表选项
    const option = {
      title: {
        text: '各平台消息数目'
      },
      tooltip: {},
      legend: {
        data:['消息数目']
      },
      xAxis: {
        data: ["平台1", "平台2", "平台3", "平台4", "平台5"]
      },
      yAxis: {},
      series: [{
        name: '消息数目',
        type: 'bar',
        data: [5, 20, 36, 10, 10]
      }]
    }
    
    // 使用配置项显示图表。
    myChart.setOption(option)
  }
})
const message = useMessage()

function handleClose() {
    message.info('Card Close')
}
const value = ref(null)
const options = [
    {
        label: 'Everybody\'s Got Something to Hide Except Me and My Monkey',
        value: 'song0',
        disabled: true
    },
    {
        label: 'Drive My Car',
        value: 'song1'
    },
    {
        label: 'Norwegian Wood',
        value: 'song2'
    },
    {
        label: 'You Won\'t See',
        value: 'song3',
        disabled: true
    },
    {
        label: 'Nowhere Man',
        value: 'song4'
    },
    {
        label: 'Think For Yourself',
        value: 'song5'
    },
    {
        label: 'The Word',
        value: 'song6'
    },
    {
        label: 'Michelle',
        value: 'song7',
        disabled: true
    },
    {
        label: 'What goes on',
        value: 'song8'
    },
    {
        label: 'Girl',
        value: 'song9'
    },
    {
        label: 'I\'m looking through you',
        value: 'song10'
    },
    {
        label: 'In My Life',
        value: 'song11'
    },
    {
        label: 'Wait',
        value: 'song12'
    }
]

</script>
<template>
    <div class="column container grey" style="height:calc(100vh - 96px)">
        <div class="cards row side">
            <div class="row ">
                <div class="close mt20"><svg xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512">
                        <path
                            d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256S119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                            fill="currentColor"></path>
                    </svg></div>
                <div class="txt">
                    <div class="title">过年好</div>
                    <div class="content">新春快乐！🎆🧨</div>
                </div>
            </div>
            <div class="close pointer">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512">
                    <path
                        d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                        fill="currentColor"></path>
                </svg>
            </div>
        </div>
        <div class="row">
            <div class="column flex2 mt20">
                <div class="row side">
                    <div class="cards fatcards purple ">
                        <div class="close2"><svg xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
                                <g fill="none">
                                    <path
                                        d="M16.992 16a3 3 0 0 1 3 3l-.002 1.497c.206 3.673-2.623 5.505-7.87 5.505c-5.229 0-8.12-1.808-8.12-5.453V19a3 3 0 0 1 3-3h9.992zm8 0a3 3 0 0 1 3 3v1.053c.18 3.295-2.32 4.947-6.889 4.947c-.62 0-1.203-.03-1.748-.09a4.887 4.887 0 0 0 1.29-1.915l.458.005c3.569 0 4.995-.943 4.89-2.892V19a1 1 0 0 0-1-1h-4.127a3.999 3.999 0 0 0-1.23-2h5.357zm-8 2H7a1 1 0 0 0-1 1v1.55c0 2.291 1.856 3.452 6.12 3.452c4.248 0 6-1.135 5.872-3.45V19a1 1 0 0 0-1-1zM12 4a5 5 0 1 1 0 10.002A5 5 0 0 1 12 4zm10 2a4 4 0 1 1 0 8a4 4 0 0 1 0-8zM12 6a3 3 0 1 0 0 6.002A3 3 0 0 0 12 6zm10 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4z"
                                        fill="currentColor"></path>
                                </g>
                            </svg></div>
                        <div style="font-size:36px;font-family:'微软雅黑';">0</div>
                        <div style="font-size:16px;">消息总数</div>
                    </div>
                    <div class="cards fatcards blue">
                        <div class="close2"><svg xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
                                <g fill="none">
                                    <path
                                        d="M16.992 16a3 3 0 0 1 3 3l-.002 1.497c.206 3.673-2.623 5.505-7.87 5.505c-5.229 0-8.12-1.808-8.12-5.453V19a3 3 0 0 1 3-3h9.992zm8 0a3 3 0 0 1 3 3v1.053c.18 3.295-2.32 4.947-6.889 4.947c-.62 0-1.203-.03-1.748-.09a4.887 4.887 0 0 0 1.29-1.915l.458.005c3.569 0 4.995-.943 4.89-2.892V19a1 1 0 0 0-1-1h-4.127a3.999 3.999 0 0 0-1.23-2h5.357zm-8 2H7a1 1 0 0 0-1 1v1.55c0 2.291 1.856 3.452 6.12 3.452c4.248 0 6-1.135 5.872-3.45V19a1 1 0 0 0-1-1zM12 4a5 5 0 1 1 0 10.002A5 5 0 0 1 12 4zm10 2a4 4 0 1 1 0 8a4 4 0 0 1 0-8zM12 6a3 3 0 1 0 0 6.002A3 3 0 0 0 12 6zm10 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4z"
                                        fill="currentColor"></path>
                                </g>
                            </svg></div>
                        <div style="font-size:36px;font-family:'微软雅黑';">6</div>
                        <div style="font-size:16px;">消息平台数</div>
                    </div>
                </div>
                <div class="cards chart">
                    <div class="row side">
                        <div>总消息趋势</div>
                        <div class="selectcontainer"> <n-space vertical>
                                <n-select v-model:value="value" :placeholder="'请选择平台'" :options="options" />
                            </n-space></div>
                    </div>
                    <div class="chartinner" ref="chartRef"></div>
                </div>
            </div>
            <div class="column flex1">
                <div class="cards blue side" style="height:42px;">
                    <div class="row ">
                        <div class="close mt20">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 1024 1024">
                                <path
                                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                                    fill="currentColor"></path>
                                <path
                                    d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"
                                    fill="currentColor"></path>
                            </svg>
                        </div>
                        <div class="txt">
                            <div class="title" style="font-size:18px;">0小时0分11秒</div>
                            <div class="content" style="font-size:13px;">运行时间</div>
                        </div>
                    </div>

                </div>
                <div class="cards  side" style="height:42px;background-color: #fff;color:#000000">
                    <div class="row ">
                        <div class="close mt20">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 32 32">
                                <path d="M11 11v10h10V11zm8 8h-6v-6h6z" fill="currentColor"></path>
                                <path
                                    d="M30 13v-2h-4V8a2 2 0 0 0-2-2h-3V2h-2v4h-6V2h-2v4H8a2 2 0 0 0-2 2v3H2v2h4v6H2v2h4v3a2 2 0 0 0 2 2h3v4h2v-4h6v4h2v-4h3a2 2 0 0 0 2-2v-3h4v-2h-4v-6zm-6 11H8V8h16z"
                                    fill="currentColor"></path>
                            </svg>
                        </div>
                        <div class="txt">
                            <div class="title" style="font-size:18px;">100MB / 5TB</div>
                            <div class="content" style="font-size:13px;color:grey">占用内存</div>
                        </div>
                    </div>

                </div>
                <div class="cards info">
              <span style="font-size: 16px;font-weight: bold;">
                    各平台消息数目</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.chartinner{

    height: 350px;
}
.chart{
    height:400px !important;
    background-color: #fff !important; 
    color:grey !important
}
.info{
    height: 413px !important;
    background-color: #fff !important; 
    color:#000000 !important
}
.selectcontainer {
    width: 200px;
}

.close2 {
    width: 32px;
}

* {
    font-family: '微软雅黑';
}

.grey {
    background-color: #EEF2F6 !important;
}

.purple {
    background-color: #5E35B1 !important;
}

.blue {
    background-color: #1E88E5 !important;
}

.flex1 {
    flex: 1;
}

.flex2 {
    flex: 2;
}

.flex3 {
    flex: 3;
}

.flex4 {
    flex: 4;
}

.pointer {
    cursor: pointer;
}

.txt {
    position: relative;
    top: -5px;
}

.side {
    justify-content: space-between;
    
}

.mt20 {
    margin-right: 20px;
}

.close {
    width: 24px;

}

.title {
    font-size: 22px;
    font-family: '微软雅黑';
}

.content {
    font-size: 16px;
    font-family: '微软雅黑';
}

.cards {
    background-color: #00C853;
    height: 52px;
    padding: 16px;
    border-radius: 5px;
    color: #fff;
    margin-bottom: 16px;
}

.fatcards {
    padding: 24px;
    width: calc(50% - 60px);
    height: 130px;

}

.green {
    background-color: #00C853;
    color: #fff;
    border-radius: 5px;
    ;
}

.container {
    padding: 16px;
}

.column {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    flex-direction: row;
}
</style>