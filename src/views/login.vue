<template>
    <div class="login-wrap">
        <div class="login-content-wrap">
            <div class="platform-logo"></div>
            <div class="figure-images"></div>
            <div class="form-container-wrap">
                <div class="login-form-wrap">
                    <h3>MP商家管理平台</h3>
                    <div class="user-login-tips">
                        用户登录
                        <p>User login</p>
                    </div>
                    <a-form :form="form" @submit="handleSubmit">
                        <a-form-item :label-col="{ span:2 }" :wrapper-col="{ span: 22 }">
             <span slot="label" style="color:rgba(93,93,93,1) !important;">

           <i class="label-solt-img"></i>
      </span>
                            <a-select placeholder="请选择" @change="handleSelectChange"
                                      v-decorator="['type',{ initialValue:'admin'}]">
                                <a-select-option value="admin">管理员</a-select-option>
                                <a-select-option value="company">企业</a-select-option>
                                <a-select-option value="platform">平台</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item :label-col="{ span:2}" :wrapper-col="{ span: 22}">
              <span slot="label" style="color:rgba(93,93,93,1) !important;">

         <i class="label-solt-img user"></i>

      </span>
                            <a-input placeholder="账户名" v-decorator="['username',]" autocomplete="off"/>
                        </a-form-item>
                        <a-form-item :label-col="{ span:2 }" :wrapper-col="{ span: 22}">
              <span slot="label" style="color:rgba(93,93,93,1) !important;">
          <i class="label-solt-img key"></i>

      </span>
                            <a-input placeholder="密码" v-decorator="['password',]" type='password' autocomplete="off"/>
                        </a-form-item>
                        <a-form-item style="text-align: center;">
                            <a-button type="primary" html-type="submit" class="go-loginIn">登 录</a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div>

    </div>

</template>
<script>
    import '../assets/login.css'
    import {getStore, setStore} from '@/utils/storage'
    import axios from 'axios'
    import { message } from 'ant-design-vue'
    export default {
        data() {
            return {
                form: this.$form.createForm(this)
            }
        },
        methods: {
            handleSelectChange(value) {
                // eslint-disable-next-line
                // console.log(value)
            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, form) => {
                    if (!err) {
                        // eslint-disable-next-line
                        // console.log("Received values of form: ", form)
                        let data = new FormData();
                        data.append('username', form.username);
                        data.append('password', form.password);
                        let that=this;
                        let userInfo={};
                        userInfo['username']=form.username;
                        userInfo['password']=form.password;
                        axios.post('/platform/login', data)
                            .then(res => {
                                console.log(res);
                                console.log(that.form)
                                console.log(setStore);
                                setStore('userInfo',userInfo);
                                this.$router.push({path: '/manageCenter', replace: true});


                            }).catch(function (error) {
                            console.log("error init." + error);
                            message.error('登录失败，用户名或密码错误')
                        })


                        }
                })
            }
        }
    }
</script>
<style scoped>
    .content {
        width: 800px;
        text-align: center;
        margin: 0 auto;
        margin-bottom: 20px;
        overflow: hidden;
    }

    .login-form-wrap .ant-btn-primary {
        line-height: 0.5rem !important;
        height: 0.5rem !important;
        font-size: 0.18rem;
        font-family: MicrosoftYaHei;
        font-weight: 400;
    }

    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        font-size: 0.18rem;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(93, 93, 93, 1);
        letter-spacing: 1px;
    }

    input:-moz-placeholder, textarea::-webkit-input-placeholder { /* Mozilla Firefox 4 to 18 */
        font-size: 0.18rem;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(93, 93, 93, 1);
        letter-spacing: 1px;
    }

    input::-moz-placeholder, textarea::-webkit-input-placeholder { /* Mozilla Firefox 19+ */
        font-size: 0.18rem;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(93, 93, 93, 1);
        letter-spacing: 1px;

    }

    input:-ms-input-placeholder, textarea::-webkit-input-placeholder { /* Internet Explorer 10-11 */
        font-size: 0.18rem;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(93, 93, 93, 1);
        letter-spacing: 1px;
    }
</style>
