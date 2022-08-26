import { VueReCaptcha } from 'vue-recaptcha-v3'

export default function(vue:any){
    vue.config.globalProperties.$recaptcha = VueReCaptcha
    vue.use(vue.config.globalProperties, '$recaptcha',{
        siteKey: 'Your Site key'
    });
}
