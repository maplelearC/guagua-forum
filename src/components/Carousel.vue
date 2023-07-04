<template>
    <el-carousel :interval="4000">
        <el-carousel-item v-for="item in imagebox" :key="item.id">
            <img :src="item.idView" class="image">
        </el-carousel-item>
    </el-carousel>
</template>
  
<script>
export default {
    name: 'pmd',
    data() {
        return {
            imagebox: [{ id: 0, idView: require('../assets/band1.jpg') },
            { id: 1, idView: require('../assets/band2.jpg') },
            { id: 2, idView: require('../assets/band3.png') },
            { id: 3, idView: require('../assets/band4.png') },
                // imagebox是assets下一个放图片的文件夹
            ]
        }
    }
}
</script>
  
<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 20px 1px 1px 1px;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
    margin: 5px 1px 1px 1px;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
    margin: 5px 1px 1px 1px;
}

.image {
    /*设置图片宽度和浏览器宽度一致*/
    width: 100%;
    height: inherit;
}
</style>		
  