<template>
    <div class="wrap">
        <!-- 图片管理 -->
        <a-layout v-if=" !imgListShow">
            <a-layout-header class="head">
                <div class="btn-groups">
                    <div class="buttons blue" @click="addPicture"><span class="icon-wrap">
                    <i class=" icon iconfont icon-tupian"></i></span>添加图片
                    </div>
                    <div class="buttons green" @click="addGroup"><span class="icon-wrap">
                    <i class=" icon iconfont icon-jia"></i></span>添加分组
                    </div>
                </div>

            </a-layout-header>
            <a-layout-content>
                <div class="add-picture-wrap" v-if="addPictureShow">
                    <a-form :form="addPictureform.form">
                        <a-form-item :label="'选择分组'" :label-col="{ span:2  }" :wrapper-col="{ span: 12 }">
                            <a-select style="width: 120px" :options="groupOptions"
                                      v-decorator="addPictureform.group"></a-select>
                        </a-form-item>
                        <a-form-item :label="''" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }"
                                     style="padding-left: 0.35rem;">
                            <a-upload v-decorator="addPictureform.imgsList"
                                      :action='action'
                                      listType="picture-card"
                                      :fileList="fileList"
                                      @preview="handlePreview"
                                      @change="handleChangePic"
                            >
                                <div v-if="fileList.length < 6">
                                    <a-icon type="plus"/>
                                    <div class="ant-upload-text">Upload</div>
                                </div>
                            </a-upload>
                            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                                <img alt="example" style="width: 100%" :src="previewImage">
                            </a-modal>
                        </a-form-item>
                        <a-form-item>
                            <span class="buttons blue small" @click="uploadImg">确认上传</span>
                            <span class="buttons yellow" @click="cancelUpload">取消</span>
                        </a-form-item>
                    </a-form>


                </div>
                <div class="img-list-wrap">
                    <div class=" card" v-for="(item,index) in imgGroupArray " :key="index"
                         @mouseenter='item.editTriigerShow =true' @mouseleave='item.editTriigerShow= false'>
                        <img :src="qiniu+'/'+item.img" alt="">
                        <span class="group-name">{{item.name}}</span>
                        <div class="edit-group-wrap">
                            <div class="edit-trigger" v-if="item.editTriigerShow" @mouseenter='item.editWrapShow =true'
                                 @mouseleave='item.editWrapShow= false'><i class="icon iconfont icon-tubiaozhizuo-"></i>
                                <div class="eidt-menu" v-if="item.editWrapShow">
                                    <ul>
                                        <li @click="reviewGroup(item)"><span class="icon iconfont icon-liulan"></span>预览
                                        </li>
                                        <li @click="editGroup(item)"><span
                                                class="icon iconfont icon-bianji-copy"></span>编辑分组
                                        </li>
                                        <li @click="deleteGroup(item)"><span class="icon iconfont icon-shanchu"></span>删除分组
                                        </li>
                                    </ul>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <a-pagination @change="pageChange" :current="qureyParmas.current" :total="total"
                              :pageSize="qureyParmas.size"/>
            </a-layout-content>
        </a-layout>
        <a-layout v-else style="padding: 0.3rem;background: #f5f3f8;">
            <!--图片分组详情-->
            <div class="group-img-wrap">
                <div class="batch-option-wrap">
                    <span class="buttons blue " @click="backreview">返回</span>
                    <div class="batch-content">
                        <span class="buttons green  " v-if="!batchManerge" @click="batchManergeGo">批量管理</span>
                        <span class="buttons green" v-if="batchManerge" @click="cancelbatchManerge">取消批量管理</span>
                        <span class="buttons blue" v-if="batchManerge" @click="bathDelete">批量删除</span>
                    </div>
                </div>
                <div class="group-img-content">
                    <div class="img-figure" v-for="(item,index) in groupImgArray " :key="index">
                        <img :src="qiniu+'/'+item.url" alt="">
                        <div class="bacth-mask" v-if="batchManerge">
                            <span class="bacth-option-span" @click="checkItemChange(item)"> <i
                                    class="icon iconfont icon-dui1" v-if="item.check"></i></span>

                        </div>
                    </div>
                </div>

            </div>
        </a-layout>

        <!--模态框-->
        <a-modal :title="title" v-model="addGroupShow" @ok="addGroupSure" @cancel="cancelGroup" okText="保存"
                 cancelText="关闭" class="group-modal">
            <div class="add-group-wrap-model">
                <a-form :form="addGroupForm.form">
                    <a-form-item label="分组名称">
                        <a-input placeholder="输入分组名称" style="width: 5rem;" v-decorator="addGroupForm.name"/>
                    </a-form-item>
                    <!--<a-form-item label="排序位置">-->
                    <!--<a-input-number placeholder="输入排序位置，不输入则默认放置与队尾" style="width: 5rem;"-->
                    <!--v-decorator="addGroupForm.groupIndex"/>-->
                    <!--</a-form-item>-->
                </a-form>
            </div>
        </a-modal>


    </div>
</template>

<script>
    import fetch from '@/common/fetch'
    import {message} from 'ant-design-vue'

    export default {
        name: "pictureList",
        data() {
            return {
                addPictureform: {
                    form: this.$form.createForm(this),
                    group: [
                        `group`,
                        {
                            rules: [{
                                required: false,
                                message: '请选择商品模式',
                            }],


                        }
                    ],
                    imgsList: [
                        `imgsList`,
                        {
                            rules: [{
                                required: false,
                                message: '请上传商品图片',
                            }],

                        }
                    ]
                },
                groupOptions: [
                    {value: '组1', title: '组1'},
                    {value: '组2', title: '组2'},
                    {value: '分组1', title: '分组1'},
                    {value: '分组2', title: '分组2'}
                ],
                action: '/maintenance/qiniu',
                fileList: [],
                previewVisible: false,
                previewImage: '',
                addPictureShow: false,
                addGroupShow: false,
                addGroupForm: {
                    form: this.$form.createForm(this),
                    name: [
                        `name`,
                        {
                            rules: [{
                                required: false,
                            }],

                        }
                    ],
                    groupIndex: [
                        `groupIndex`,
                        {
                            rules: [{
                                required: false,

                            }],

                        }
                    ]
                },
                imgGroupArray: [],
                qureyParmas: {
                    size: 8,
                    current: 1,
                },
                groupId: '',
                groupImgArray: [],
                qiniu: this.$store.state.qiNiuLink,
                imgListShow: false,
                batchManerge: false,
                total: 0,
                title:'新增分组'
            }

        },
        mounted() {
            this.getImagesRecode()
        },
        methods: {
            handleOk() {
                this.previewVisible = false
            },
            handleCancel() {
                this.previewVisible = false
            },
            handlePreview(file) {
                console.log('handle preview file')
                console.log(file)
                this.previewImage = file.url || file.thumbUrl
                this.previewVisible = true
            },
            handleChangePic({fileList, file}) {
                console.log(fileList);
                this.fileList = fileList;
            },
            removePic(file) {
                console.log(file.response.obj[0].key)
                if (file.name !== undefined) {
                    fetch.delete(this.action + '/' + file.name, '')
                        .then(res => console.log(res))
                } else {
                    fetch.delete(this.action + '/' + file.response.obj[0].key)
                        .then(res => console.log(res))
                }

                console.log(file)
            },
            addPicture() {
                this.addPictureShow = true
            },
            addGroup() {
                this.addGroupShow = true;
                this.title='新增分组'
                this.addGroupForm.form.resetFields()
            },
            uploadImg() {
                let parmas = {};
                var imgArray = this.fileList;
                let imgKeyString = '';
                let imgParmasArray = []
                let groupid = this.addPictureform.form.getFieldValue('group');
                for (let i = 0; i < imgArray.length; i++) {
                    let imgParmas = {};
                    imgParmas["groupId"] = groupid;
                    imgParmas["url"] = imgArray[i].response.obj[0].key;
                    imgParmasArray.push(imgParmas)

                }
                parmas['imgList'] = imgParmasArray;
                console.log(imgParmasArray)
                fetch.post('/shop/img/batchAddImg/' + groupid, imgParmasArray).then(res => {
                    console.log(res)
                })

            },
            cancelUpload() {
                this.fileList = [];
                this.addPictureShow = false;
            },
            addGroupSure() {
                let parmas = this.addGroupForm.form.getFieldsValue();
                if (this.groupId == '') {
                    fetch.post('/shop/img-group/save', parmas).then(res => {
                        message.info('成功添加分组');
                        this.fetchAgan();
                        this.addGroupShow = false;
                        this.resetForm()
                    })
                } else {
                    fetch.post('/shop/img-group/updateById?id=' + this.groupId + '&name=' + parmas.name).then(res => {
                        message.info('修改分组成功');
                        this.fetchAgan();
                        this.addGroupShow = false;
                        this.resetForm()
                    })
                }
            },
            cancelGroup() {
                this.addGroupShow = false
            },
            /**
             * 获取图片分组记录
             */
            getImagesRecode() {
                let parmas = this.qureyParmas;
                let page = parmas.current - 1;
                fetch.get('/shop/img-group/page?size=' + parmas.size + '&current=' + page).then(res => {
                    console.log(res);
                    let recodes = res.obj.records;
                    this.total = parseInt(res.obj.total)
                    let optionArray = [];
                    let imgGroupArray = []
                    recodes.forEach((item) => {
                        // 构建下拉option
                        let optionItem = {};
                        optionItem.value = item.id;
                        optionItem.title = item.name;
                        optionArray.push(optionItem);
                        //    构建分组参数
                        let groupItem = {};
                        groupItem['name'] = item.name;
                        groupItem['editTriigerShow'] = false;
                        groupItem['editWrapShow'] = false;
                        groupItem['id'] = item.id;
                        imgGroupArray.push(groupItem);
                        groupItem['img'] = item.img.url
                    })
                    this.groupOptions = optionArray;
                    this.imgGroupArray = imgGroupArray;
                })
            },
            /**
             * 预览分组
             * **/
            reviewGroup(item) {
                console.log(item.id);
                let parmas = {};
                parmas['groupId'] = item.id;
                fetch.post('/shop/img/list', parmas).then(res => {
                    console.log(res);
                    let recodes = res.obj;
                    recodes.forEach((item) => {
                        item['check'] = false
                    })
                    this.groupImgArray = recodes;
                    this.groupId = item.id;
                    this.imgListShow = true
                })

            },
            /**
             * 编辑分组
             */
            editGroup(item) {
                this.title='编辑分组'
                this.groupId = item.id;
                this.addGroupShow = true;
                console.log(item)
                fetch.get('/shop/img-group/getById/' + item.id).then(res => {
                    console.log(res);
                    let json = res.obj;
                    this.addGroupForm.form.setFieldsValue({
                        ['name']: json.name,
                    })
                })
            },
            deleteGroup(item) {
                debugger
                fetch.delete('/shop/img-group/' + item.id).then(res => {
                    message.info('修改分组成功');
                    this.fetchAgan();
                })
            },
            fetchAgan() {
                this.getImagesRecode()
            },

            resetForm() {
                this.groupId = '';
                this.addGroupForm.form.resetFields();
            },
            /**
             * checkboxChange
             */
            checkItemChange(item) {
                item.check = !item.check;
            },
            /**
             * 批量删除
             */
            bathDelete() {
                let deleteArrayString = '';
                this.groupImgArray.forEach((item) => {
                    if (item.check) {
                        // let deleteItem={};
                        // deleteItem['url']=item.url;
                        // deleteItem['groupId']=this.groupId;
                        // deleteArray.push(deleteItem)
                        deleteArrayString += item.id + ','
                    }
                });
                if (deleteArrayString.length > 0) {
                    fetch.delete('/shop/img/batchDelImg/' + this.groupId + '/' + deleteArrayString.slice(0, deleteArrayString.length - 1), {}).then(res => {
                        message.info('批量删除成功');
                    })
                }
            },
            batchManergeGo() {
                this.batchManerge = true;
            },
            cancelbatchManerge() {
                this.batchManerge = false;
                this.groupImgArray.forEach((item) => {
                    item.check = false
                })
            },
            backreview() {
                this.imgListShow = false;
                this.batchManerge = false;
            },
            /**
             * 分页
             */
            pageChange(current) {
                this.qureyParmas.page = current;
                this.getImagesRecode();
            },

        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        height: 100%;
    }
    .img-list-wrap{
        height:6rem;
    }
    .ant-layout-header {
        background: transparent;
        padding: 0 0.37rem;
    }

    .head.ant-layout-header {
        height: 1.2rem;
        background: #f5f3f8;
    }

    .buttons {
        display: inline-block;
        padding: 0 0.26rem;
        height: 0.56rem;
        border: 1px solid #e9e9e9;
        line-height: 0.56rem;
        text-align: center;
        color: #fff;
        border-radius: 0.04rem;
        margin: 0 0.1rem;
        cursor: pointer;
        float: left;
        -webkit-border-radius: 0.05rem;
        -moz-border-radius: 0.05rem;
        border-radius: 0.05rem;

    }

    .head .buttons .iconfont {
        color: #fff;
        margin-right: 0.05rem;
    }

    .buttons.green {
        background: #008A93;
    }

    .head .buttons .icon-wrap {
        padding: 0 0 0 0.1rem;
        float: left;
        display: inline-block;
    }

    .head .buttons.blue {
        background: #409EFF;
    }

    .icon.iconfont.icon-jia {
        font-size: 0.18rem;
    }

    .add-picture-wrap {
        display: block;
        margin-top: 20px;
        padding: 5px 20px;
        background: rgba(255, 255, 255, 1);
        border-radius: 8px;

    }

    .ant-layout-content {
        /*padding: 0 50px;*/
        background: #f5f3f8;
    }

    .buttons.yellow {
        background: rgba(248, 199, 28, 1);
        padding: 0 0.45rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.17rem;
    }

    .ant-form-item {
        margin-bottom: 5px;
    }

    .img-list-wrap {
        padding: 0.3rem;

    }

    .img-list-wrap .card {
        width: 2.54rem;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 8px 9px 0px rgba(138, 97, 250, 0.1);
        border-radius: 8px;
        display: inline-block;
        overflow: hidden;
        position: relative;
    }

    .img-list-wrap .card img {
        width: 100%;
        height: 2.54rem;
    }

    .add-group-wrap {
        width: 5rem;
        height: 1rem;
        margin: 0 auto;

    }

    .edit-group-wrap {
        position: absolute;
        top: 0.2rem;
        right: 0.2rem;
    }

    .edit-group-wrap .edit-trigger {
        display: inline-block;
        width: 0.25rem;
        height: 0.25rem;
        line-height: 0.23rem;
        text-align: center;
        background: #fff;
        border-radius: 3px;
        cursor: pointer;
        border: 1px solid #D6D6D6;
        box-shadow: 0 0 2px rgba(0, 0, 0, .15);
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

    }

    .edit-group-wrap .edit-trigger .iconfont {
        font-size: 0.18rem;
        position: relative;
        left: -0.01rem;
    }

    .eidt-menu {
        position: absolute;
        top: 0.28rem;
        right: 0.08rem;
        padding: 0.02rem 0.02rem;
        box-shadow: 0 0 2px rgba(0, 0, 0, .15);
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        background: #fff;
        -webkit-border-radius: 0.04rem;
        -moz-border-radius: 0.04rem;
        border-radius: 0.04rem;
    }

    .eidt-menu li {
        width: 1.2rem;
        height: 0.38rem;
        line-height: 0.38rem;
        text-align: left;
        font-size: 0.14rem;
        padding: 0 0.1rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .eidt-menu li:hover {
        background: #eee;
    }

    .eidt-menu li .icon {
        margin-right: 0.1rem;
    }

    .eidt-menu li .edit-icon {
        width: 0.2rem;
        height: 0.38rem;
        display: inline-block;
        background: url("../../assets/images/edit.png") center no-repeat;
        background-size: 100% 100%;
        margin-right: 2px;
        float: left;
    }

    .eidt-menu li .edit-icon.delete-icon {
        background-size: 100% 100%;
        background: url("../../assets/images/delete.png") center no-repeat;
    }

    .eidt-menu li .edit-icon.review-icon {
        background-size: 100% 100%;
        background: url("../../assets/images/eye.png") center no-repeat;
        width: 0.25rem;
    }

    li {
        list-style-type: none;
    }

    ul {
        margin-bottom: 0;
    }

    .img-list-wrap > div {
        display: inline-block;
        margin: 2px 5px;
    }

    .ant-card-body {
        background: #fff;
    }

    .group-name {
        background: #fff;
        height: 0.6rem;
        line-height: 0.6rem;
        text-indent: 0.15rem;
        display: block;
        color: #4F639A;
        font-size: 0.18rem;
    }

    .group-img-content .img-figure {
        width: 2.54rem;
        height: 2.54rem;
        border-radius: 0.08rem;
        position: relative;
        display: inline-block;
        margin: 0 0.2rem;
        margin-bottom: 0.2rem;
        box-shadow: 0px 0.08rem 0.09rem 0px rgba(138, 97, 250, 0.1);
    }

    .img-figure img {
        width: 100%;
        height: 100%;

    }

    .img-figure .ant-checkbox-wrapper {
        position: absolute;
        top: 0.2rem;
        right: 0.2rem;
    }

    .btn-groups {
        height: 0.4rem;
        margin: auto 0;
        position: absolute;
        top: 0;
        bottom: 0;
        font-size: 0.17rem ;

    }

    .buttons.blue {
        background: rgba(64, 158, 255, 1);
        border-radius: 0.05rem;
        font-size: 0.17rem;
    }

    .buttons.small {
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.17rem;
    }

    .batch-option-wrap {
        width: 100%;
        height: 0.68rem;
        line-height: 0.68rem;
        margin-bottom: 0.2rem;
    }

    .batch-option-wrap .batch-content {
        float: right;
    }

    .batch-option-wrap .buttons {
        width: 1.75rem;
        text-align: center;
        padding: 0;
        text-align: center;
    }

    .bacth-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        bottom: 0;
        right: 0;
        top: 0;
        background: rgba(0, 0, 0, 1);
        opacity: 0.3;
        -webkit-border-radius: 0.08rem;
        -moz-border-radius: 0.08rem;
        border-radius: 0.08rem;
    }

    .bacth-mask .bacth-option-span {
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        line-height: 0.25rem;
        position: absolute;
        top: 0.2rem;
        right: 0.2rem;
        border: 1px solid #fff;
        border-radius: 50%;
        text-align: center;
        color: #fff;
        font-size: 0.18rem;
    }
    input::-webkit-input-placeholder ,textarea::-webkit-input-placeholder{ /* WebKit, Blink, Edge */
        color: #A6A6A6;
        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input:-moz-placeholder,textarea::-webkit-input-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input::-moz-placeholder,textarea::-webkit-input-placeholder { /* Mozilla Firefox 19+ */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input:-ms-input-placeholder,textarea::-webkit-input-placeholder { /* Internet Explorer 10-11 */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }
</style>