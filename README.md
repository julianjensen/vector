Your Headline
===

A much faster and versatile array class.

Remove This Section After Reading
---------------------------------

By using this module creator and following the steps below, you can be reasonably assured that you will conform to our requirements and quality standards. Make sure
you update this *README* file and remove this section. By using copious amount of *JSDoc* tags you can ensure good code documentation. This module supports
the automatic generation of an API document by typing `npm run mddocs` which will create a document `API.md` which you can link to or concatenate to this *README.md* file.

It has also set up a unit test enviroment. Just type `npm test` to execute your unit tests which will be in the `test/` directory. It uses **mocha** and **chai** for testing.
It has also incorporated **chai-as-promised** for promise testing. If you don't need this, it can be safely removed.

Ihas correct `.gitignore`, `.editorconfig`, `.jshintrc`, and `.jscsrc` files already in the correrct locations. It also has `.npmrc` set up correctly to access our local repository first for
npm module access.

The use of the CHANGELOG file is optional. If you want to use the automatic commit system described below, leave it, otherwise you can safely delete it.

In **WebStorm** make sure you enable both `jshint` and `jscs` under **settings -> Languages & Frameworks -> Javascript -> Code Quality Tools** and enable
*jshint* and *jscs* (You may have to have them installed globally, not sure). Also, set them to read config files and do an automatic search
for those files.

You should also download and enable libraries for **WebStorm**'s *CodeInsight* for any modules you use, including the ones installed by this module
generator. Go to **Settings -> Languages & Frameworks -> Javascript -> Libraries** and download **bluebird**, **chai**, **chai-as-promised**, **mocha**,
**commander**, **moment**, **lodash**, and **fs-extra**. In general, this is good practice, whenever you *require* another module to check if a library
exists and downloading it, if it does.

The *package.json* file has been set up with a script that runs a commit (type `npm run commit`) using this command-line `git commit -aF .tmp`. This takes advantage
of the automatic commit messages system. Read all about it here: [Automated Commit Messages and Scrum](https://confluence.exploreplanet3.com/display/TECH/Automated+Commit+Messages+and+Scrum)
If you don't want to use this feature, you can still commit the normal way `git commit -am "TECH-nnnn Blah blah code blah stuff!!!111oneone"` or through whatever graphical or editor tool you use.

Here's how to finalize the **git** VCS for this project.

1. Create your repository on **bitbucket.corp.pvt** (Your project directory is already init'd and staged for commit)
2. Type `git commit -am "TECH-nnnn Initial commit"` where `nnnn` is your ticket number
3. Type `git remote add origin http://julian@bitbucket.corp.pvt/scm/DIR-NAME/vector.git` edited to reflect actual path
4. Add the repository URL to your `package.json` file, a space has been prepared for you
5. Finally type `git push -u origin master`
6. You're ready to go BUT don't forget to switch to the development branch (create this in **bitbucket**)
7. Please see the *README.md* in your project directory for additional setup steps, including **WebStorm** configuration

Usage
---

```js
    function example( stuff )
    {
        // ... Example code
    }
```

API
===

```js
    var details = go_here( now );
```
