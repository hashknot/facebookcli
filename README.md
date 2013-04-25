#FacebookCLI
===

## Description:
Provides you a command line interface to Facebook. For now you can get your
notifications, online friends and unread messages.

## Privacy:
Access to this app on your terminal is password restricted.

##Requirements:
Node.js : Refer [Node.js official site](http://nodejs.org/) for installation
instructions.

##Installation:
You won't be using anyone else's Facebook app. You will be creating one for
yourself for your account's security and privacy.

Steps to setup your Facebook App:  
1. Clone this repo  
`git clone http://github.com/crusador/facebookcli`
2. Log into your Facebook account and visit [Facebook Developer Dashboard](https://developers.facebook.com/apps).
3. Create a new app with any App Name and App Namespace. You dont need free hosting from Heroku.  
4. In `App Domains` field, enter `localhost`  
5. Preferrably leave Sandbox Mode Enabled.  
6. Select Check Mark beside the text `Website with Facebook Login` and for `Site URL` enter `http://localhost:8080`.  
_If you prefer to use another Port, make sure you enter the same in_ `manifest.json` _file._
7. Note your __App ID__ and your __App Secret__ and then Click on Save Changes.  
8. Open `manifest.json` and enter your __App ID__ and your __App Secret__.
9. Run the `facebook` file from the cloned repo with `-a` option. It shall look something like  
$`./facebook -a`  
and follow the onscreen instructions.  
10. `facebook -h` to see the baisc commandline options help.

##Copyright and Licence
Released under MIT License.  
Copyright : 2013 [Jitesh Kamble] (http://www.facebook.com/crusador)
