# Tezjs with recaptcha
- Create tezjs fresh project.
- Install **vue-recaptcha-v3**
```
  npm install vue-recaptcha-v3
```
- Create **plugins** directory under the root directory and add **index.ts** file 
```
 plugins/index.ts
```
- Import **VueReCaptcha** in **index.ts**
```
 import { VueReCaptcha } from 'vue-recaptcha-v3'
```
- Add the below code in **index.ts**
```
  export default function(vue:any) {
    vue.config.globalProperties.$recaptcha = VueReCaptcha
    vue.use(vue.config.globalProperties, '$recaptcha',{
        siteKey: 'Your google recaptcha siteKey' 
    });
}
```
 **Update your google recaptcha site key.**
- Now import load  in your component 
 ```
  import { load } from 'recaptcha-v3'
 ```
- call **load()** function with **google recaptcha site key**
```
   async recaptcha() {
      const recaptcha = await load('Your google recaptcha siteKey')
      this.recaptchaToken= await recaptcha.execute('signup')
    },
```
above code will generate a token using site key
### **call backend api to submit form**
- Call sign up function on the button click
```
async signUp() {
    var apiUrl = "http://localhost:5000/signup"
    var data = {
        email: this.email,
        password: this.password,
        recaptchaToken: this.recaptchaToken
    }
    await axios.post(apiUrl, data)
        .then(response => {
            if (response.data) {
                this.email = ""
                this.password = ""
                this.recaptcha()
                if (response.status == 201) {
                    this.message = response.data.message
                }
                if (this.errorMessage) {
                    this.errorMessage = ""
                }
            }
        })
        .catch(error => {
            if (this.message) {
                this.message = ""
            }
            this.errorMessage = "There was an error! " + error.message;
        });
 }
```
- Now we have to verify token with backend api 
### **How to Verify Token?**
  - To verify generated token make one backend node api.
  ```
    /server/index.js
  ```
  - Add the below function to verify generated token.
  ```
     app.post("/signup", async function(req, res) {
    if (!req.body.recaptchaToken) {
        return res.status(400).json({
            message: "recaptchaToken is required"
        });
    }
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "email and password are required"
        });
    }
    const verifyCaptchaOptions = {
        uri: "https://www.google.com/recaptcha/api/siteverify",
        json: true,
        form: {
            secret: "Your google recaptcha secret key",
            response: req.body.recaptchaToken
        }
    };
    request.post(verifyCaptchaOptions, function(err, response, body) {
        if (err) {
            return res.status(500).json({
                message: "oops, something went wrong on our side"
            });
        }
        if (!body.success) {
            return res.status(500).json({
                message: body["error-codes"].join(".")
            });
        }
        return res.status(201).json({
            message: "Congratulations! We think you are human."
        });
    });
  });
  ``` 
 - It will verify your token and send a response accordingly.