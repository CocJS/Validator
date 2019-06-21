





# COC.JS Nuxt-iView
<p align="center">
<img width="200" height="200" src="https://avatars2.githubusercontent.com/u/44804821?s=400&u=c2252c15889114f4fa1128f60b3156e9f1f2131e&v=4">
</p>


## What is COC.JS Nuxt-iView

VUE.JS assistant based on COC core engine and designed to work with (Nuxt, iView) environment

- Coc is providing the developer many helpers for data structures, validation, events, and filters.
- You will also have extra 20 components designed to work with iView UI.
- Coc Forms components are designed to build a complex forms with
minimal code and more features

## Install with npm 

```
npm install coc-nuxt-iview
```

## Get Started

After installing from npm, create `coc.js` file in `/plugins` directory.
in `coc.js` add the following
```
import coc from 'coc-nuxt-iview'
import moment from 'moment'
import lodash from 'lodash'
import Vue from 'vue'
import pkg from '~/package'

export default ({ env }, inject) => {
  // Init coc
  coc.Init({ Vue, lodash, moment })
  // Config app data
  COC.Config.Meta({
    name: pkg.name,
    version: pkg.version,
    repository: pkg.repository,
    mode: env.mode
  })
  inject('coc', coc)
}
```
Afer adding cocjs file in your plugins, add the file in your plugins in ``nuxt.config.js``
Then you can add the default COC theme by adding
`coc-nuxt-iview/dist/index.css` in your `nuxt.config.js` under the `css` attribute.
You can also use **[COC-Theme-Builder](https://github.com/CocJS/COC-Theme-Builder.git)** just clone the repo and start customizing your own COC theme.


### UI Design Concepts
The plugin is using iView as a UI framework, so mainly we are implementing Ant-Design concept, but also we are using some parts from other packages such as Materialize so you can have better Grid System, Color Palates, and Shadows, you will also find a Color Palates and Button Classes from Bulma.
**External resources**
- [MaterializeCss - Grid System](https://materializecss.com/grid.html)
- [MaterializeCss - Colors](https://materializecss.com/color.html)
- [MaterializeCss - Shadow](https://materializecss.com/shadow.html)
- [AnimateCss](https://daneden.github.io/animate.css/)
- [Bulma - Buttons](https://bulma.io/documentation/elements/button/)

**Resources By COC**
- Typography Styles
- Borders Styling and Colors
- Bounds and House Keepers

### COC Custom Components 
**Based on iView**.
- Forms -  Input
- Forms -  Select
- Forms -  Radio/Checkbox
- Forms -  Datepicker
- Forms -  Button

**COC Pure**
- Coc-Axios
- Coc-ShowKeys
- Coc-Collapse
- Coc-Form Item
- Coc-Form
- Coc-Watch My Window
- Coc-Pure Input
- Coc-Option
- Coc-Select
- Coc-Input
- Coc-Input Field
- Coc-Layout Master Splited
- Coc-Main Master
- Coc-Master Footer
- Coc-Master Nav
- Coc-Docker
- 


### Check our full template
[COCJS Ready Template for Nuxt-iView-COC](https://cocjs.github.io/Nuxt-iView-Template/)

## CSMA (**Coc Standard model API**)
Coc Components are using a powerful standard for modeling the components
every `v-model` will give you an object that includes three main sections 

- val
- control
- meta

Every CSMA has a `control` section where you can access all the CSMA controllers from.
Accessing this controllers locally is being done by a very simple calls using CSMA API, for example here's how to use update controller  
`myModel.control.update('myVal')`.  
`myModel.control.reset()`  
`myModel.control.copy()`  
`myModel.control.clear()`  
`myModel.control.select()`  
`myModel.control.focus()`  
`myModel.control.blur()`  
`myModel.control.meta('isFired')`  

You can also add a callback, eg :  
`myModel.control.reset().then(myCallback)` 
or 
`myModel.control.update('foo').then(myCallback)`

For calling CSMA controllers remotely we're using VUE custom events.

The API structure is very simple, but also you need to be explicit about your scopes and the controllers you need, you need to tell `COC` what scope do you need to respond, the controller you need to access, and the arguments that you need to pass it 'credentials'.  
Here's the general rule for using CSMA events for this component.

    $nuxt.$emit('COCFormController', {  
    scope : ['myScope'] ,  
    controller : 'foo' ,  
    credentials : 'bar'  
    })

The previous API is the general case for any CSMA, its recommended to be explicit about your remote calls anyway. for example :


    $nuxt.$emit('COCFormController',{
    type : 'input' ,
    scope : ['myScope'] ,  
    controller : 'foo' ,  
    credentials : 'bar'  
    })


If you didn't mention a specific type, all the components will react to this event, which is not recommended, as it will be more load and also you may call an undefined controllers for some components, in this case `COC` will handle it for you.  
**Passing Callbacks**
in remote events is the same as local usage, all you need to do is to add the callback attribute to your call, and you're all set!


    $nuxt.$emit('COCFormController' ,{  
    type : 'input' ,  
    scope : ['myScope'] ,  
    controller : 'foo' ,  
    credentials : 'bar' ,  
    callback : myCallback 
    })

OR

    $nuxt.$emit('COCFormController', {  
    type : 'input' ,  
    scope : ['myScope'] ,  
    controller : 'foo' ,  
    credentials : 'bar' ,  
    callback(){ //some code }
    })

Note : COC is validating the events arguments for you, so incase you have orderd a controller that does not exist COC will inform you using console warnings.

Here's a real example that you can try right now, in the next lines we'll be calling update controller to change the value of the upper COC EL INPUT, just copy it and paste it in your console to check it out!

    $nuxt.$emit('COCFormController', { type : 'input' ,  
    scope : ['form'] ,  
    controller : 'update' ,  
    credentials : 'foo' ,  
    callback(){ alert('Hello World') }  
    })`

**Ask For Meta API** is a kind of conversations between components, or even between the root and a child component, if you need to get some meta of a specific component remotly, you can ask it, and it will reply with required meta if exists, otherwise `COC` will handle it for you and also warn you about it in your console.  
**Setup**  
Asking for meta is a regular controller, all you need to do is to select `meta` controller and pass your meant attribute as a `credentials` for example  






    $nuxt.$emit('COCFormController' ,  {
    type : 'input' , 
    scope : ['form'] , 
    controller : 'meta' , 
    credentials : 'fired' 
    })

After this, the component will emit an event back, so you need to recieve the response and handle it to get your info.  
For Example  

    $nuxt.$on('COCFormMeta' ,(payloads)=>{  
      console.log(payloads)  
    })


So here's how to recieve it, now but this code in your console, and then ask for meta using the previous code in your console, and check the result.  
, simply the field name will be under `meta` attribute, and the value will be under `credentials`.  
the payloads will also carry the meant scope as you can handle when to react on those components using them.

## Validator
Coc Validator is a validation class that was made to validate user input with a ready made validators that will cover most of common cases, you can also add a custom rules and custom error delivery messages.
### Example

```
const vm = $nuxt

  // New instance from Validator class
  const instance = new vm.$coc.Validator('2012-01-01')

  // Custom Validator functions

 // if it returns bool it will fallback to the validator error message
  const funOne = val => val === '2012-01-01'
  
  // if a function returns a string this will be the error message
  const funTwo = val => typeof val === 'string' || 'must be a string'

  // Custom Validators Group
  const PreConditionsArgs = [funOne, funTwo]

  // Rule validator as an option
  const PreConditions = { args: PreConditionsArgs }

  // Invalid Validator
  // Coc Validator must warn you about this in your console if in dev mode
  const InvalidOne = { foo: 'bar' }

  // Date Vlidations

  // Is Date data type or valid date string
  const IsDateString = { active: true }

  // Min date
  const MinDate = { args: vm.$moment('2011-01-01') }

  // Max Length
  const MaxLength = { args: 5 }

  // Promise Validation
  const GetPromise = async () => {
    return new Promise((resolve, reject) => {
      vm.$axios
        .get('https://jsonplaceholder.typicode.com/posts')
        .then(res => {
          if (!res.data[0]) {
            resolve(true)
          } else {
            reject(false)
          }
        })
        .catch(() => {
          reject(false)
        })
    })
  }

  // Promise as an option
  const ResolvedPromise = {
    active: true,
    args: GetPromise
  }

  // Options Creation
  const options = {
    PreConditions,
    InvalidOne,
    IsDateString,
    MinDate,
    ResolvedPromise,
    MaxLength
  }
 // Set Custom Error Messages
 
  // |*args*| will be replaced by the args you passed
  instance.SetErrorMessage('MaxLength', 'you cant exceed |*args*|')
 
  // Passing args from object
  instance.SetErrorMessage('LengthBetween', 'from |*args.min*|')
  
  // Passing validators
  instance.SetOptions(options)

  // Validate
  instance.Run().then(data => {
    console.log('Success', data)
  }).catch(err => {
    console.log('Failed with ', err)
  })
```

## Components

Code Sample
```
<coc-input
  placeholder = "Please enter.."
  :size = "large"
  :rules = "{
     HasValue: { message: 'this field cant be empty.' },
     MaxLength: { args: 6 }
  }"/>
```