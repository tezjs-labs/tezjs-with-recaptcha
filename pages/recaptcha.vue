<script>
import headerComponent from "/@/components/header.vue"; 
import footerComponent from "/@/components/footer.vue";
import axios from 'axios'
import { load } from 'recaptcha-v3'

export default {
  components: {
    headerComponent: headerComponent,
    footerComponent: footerComponent
  },
  head: {
    title: "tezjs-with-recaptcha", //page's title
  },

 async created(){
    this.recaptcha() // call for first itme token generate
  },
 
  data() {
    return {
      email: "",
      password: "",
      recaptchaToken:"",
      message:"",
      errorMessage:""
    }
  },
  methods: {
    // recaptcha generate token 
    async recaptcha() {
      const recaptcha = await load("Your site's secret key")
      this.recaptchaToken= await recaptcha.execute('signup')
      console.log( this.recaptchaToken)
    },
  // for post request
    async signUp() {
      var apiUrl = "http://localhost:5000/signup"
      var data = { 
        email:this.email,
        password:this.password,
        recaptchaToken:this.recaptchaToken 
       }
       await axios.post(apiUrl,data)
      .then(response => {
        console.log(response);
      if(response.data){
        this.email=""
        this.password=""
        this.recaptcha()
        if(response.status==201){
           this.message=response.data.message
        }
        if(this.errorMessage){
          this.errorMessage = ""
        }
      }
      })
    .catch(error => {
      if(this.message){
        this.message = ""
      }
      this.errorMessage = "There was an error! "+error.message;
      console.error("There was an error!", error);
    });
    }
  }
};
</script>

<!-- Template start from here -->
<template>
  <headerComponent></headerComponent>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl tracking-tight font-bold text-gray-900">Sign up to your account</h2>

      </div>
      <form class="mt-8 space-y-6">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" v-model="email" name="email" type="email" autocomplete="email" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password">
          </div>
         
        </div>
         <div>
              <p v-if="message!=''" class="text-green-900 mt-5 text-xl">{{message}}</p>
              <p v-if="errorMessage!=''" class="text-red-900 mt-5 text-xl">{{errorMessage}}</p>
          </div>

        <div>
          <button @click="signUp()" type="button"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd" />
              </svg>
            </span>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  </div>
  <footer-component></footer-component>
</template>