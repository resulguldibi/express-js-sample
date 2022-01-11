const express = require('express')
const cors = require('cors')
const app = express()

app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded())


//$ curl -s -XGET http://localhost:8081/customers?name=resul
app.get('/customers', (req, res) => res.send(req.query.name))

//$ curl -s -XPOST -H 'Content-Type: application/json' -d '{"name":"resul"}' http://localhost:8081/customers
//$ curl -s -XPOST -H 'Content-Type: application/x-www-form-urlencoded' -d 'name=resul&age=32' http://localhost:8081/customers
app.post('/customers', (req, res) => res.send(req.body.name + ' ' + req.body.age))

//curl -sv -XGET http://localhost:8081/404/v1
app.get('/404/v1', (req, res) => res.status(404).end())

//curl -sv -XGET http://localhost:8081/404/v2
app.get('/404/v2', (req, res) => res.status(404).send('File not found'))

//curl -sv -XGET http://localhost:8081/200/v1
app.get('/200/v1', (req, res) => res.sendStatus(200))

//$ curl -sv -XGET http://localhost:8081/json
app.get('/json', (req, res) => res.json({ username: "rguldibi" }))


app.get('/cookie', (req, res) => res.cookie('username', 'rguldibi'))

//curl -sv -XGET http://localhost:8081/headers/v2
app.get('/headers/v1', (req, res) => res.send(req.headers))

//curl -sv -XGET -H 'my-header: resul' http://localhost:8081/headers/v2
app.get('/headers/v2', (req, res) => res.send(req.header('my-header')))

app.get('/headers/v3', (req, res) => res.set('Content-Type', 'text/html'))

app.get('/headers/v4', (req, res) => res.type('.html'))
app.get('/headers/v5', (req, res) => res.type('html'))
app.get('/headers/v6', (req, res) => res.type('json'))
app.get('/headers/v7', (req, res) => res.type('.json'))


app.get('/redirect/v1', (req, res) => res.redirect('/redirect/v2'))

app.get('/redirect/v2', (req, res) => res.send('redirected from'))

//curl -s -XGET http://localhost:8081/uppercase/resul
app.get('/customers/:name', (req, res) => res.send(req.params.name.toUpperCase()))

//$ curl -s -XGET http://localhost:8081/customers/resul/products/1
app.get('/customers/:name/products/:id', (req, res) => res.send(req.params.name.toUpperCase() + ' ' + req.params.id.toUpperCase()))

//cors sample
app.get('/with-cors', cors(), (req, res, next) => { res.json({ msg: 'WHOAH with CORS it works!' }) })

//OPTIONS + POST
//SENDS Access-Control-Request-Headers: content-type  and Access-Control-Request-Method: POST in request header
//RECEIVES Access-Control-Allow-Headers: content-type Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE Access-Control-Allow-Origin: *
//fetch('http://localhost:8081/with-cors',{ method: 'POST', headers:{'Content-Type':'application/json'}, body : JSON.stringify({name:"resul"}) }).then(response=>response.json()).then(data=>{console.log(data);}).catch(error=>{console.log(error);});
//ONLY POST
//fetch('http://localhost:8081/with-cors',{ method: 'POST', headers:{'Content-Type':'text/plain'}, body : 'name=resul' }).then(response=>response.json()).then(data=>{console.log(data);}).catch(error=>{console.log(error);});
//ONLY POST
//fetch('http://localhost:8081/with-cors',{ method: 'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body : 'name=resul&age=32' }).then(response=>response.json()).then(data=>{console.log(data);}).catch(error=>{console.log(error);});
app.post('/with-cors', cors(), (req, res, next) => { res.json({ msg: 'WHOAH with CORS it works!' }) })

//cors with options

const corsOptions = {
    origin: 'http://localhost'
};

app.get('/with-cors2', cors(corsOptions), (req, res, next) => { res.json({ msg: 'WHOAH with CORS it works!' }) })


//allow OPTIONS on just one resource
app.options('/the/resource/you/request', cors())
//allow OPTIONS on all resources
app.options('*', cors())

app.get('/about', (req, res) => { res.render('about') })


app.get('/about/v2', (req, res) => { res.render('about-v2', { name: 'resul güldibi' }) })

app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine())
app.get('/about/v3', (req, res) => { res.render('about-v3', { name: 'resul güldibi' }) })

const myMiddleware = (req, res, next) => { res.locals.name = 'resul'; next(); }

app.get('/middleware', myMiddleware, (req, res) => res.send('Hello ' + res.locals.name))

//to block access to files whose file name starts with dot character
app.use(express.static(__dirname+ '/public',{ dotfiles: 'allow' }))

app.get('/download', (req, res) => res.download('./public/svelte-handbook.pdf', 'user-facing-filename.pdf', (err) => {

    if (err) {
        console.log('file send error');
    }
    else {
        console.log('file sended successfully');
    }
}))

const session = require('express-session')

app.use(session({
    secret: '343ji43j4n3jn4jk3n'
}))

const sesionMiddleware = (req, res, next) => { req.session.name = 'resul'; next(); }


app.get('/session', sesionMiddleware, (req, res) => {
    // req.session    
    res.send(req.session);
}
)

app.get('/request-with-session', (req, res) => {
    // req.session    
    res.send(req.session.name);
}
)

//fails
//fetch('http://localhost:8081/form',{ method: 'POST', headers:{'Content-Type':'application/json'}, body : JSON.stringify({age:"32a",name:"resul",email:"b@b.com"}) }).then(response=>response.json()).then(data=>{console.log(data);}).catch(error=>{console.log(error);});
//fetch('http://localhost:8081/form',{ method: 'POST', headers:{'Content-Type':'application/json'}, body : JSON.stringify({age:"32",name:"re",email:"b@b.com"}) }).then(response=>response.json()).then(data=>{console.log(data);}).catch(error=>{console.log(error);});
//fetch('http://localhost:8081/form',{ method: 'POST', headers:{'Content-Type':'application/json'}, body : JSON.stringify({age:"32",name:"resul",email:"b"}) }).then(response=>response.json()).then(data=>{console.log(data);}).catch(error=>{console.log(error);});
//success
//fetch('http://localhost:8081/form',{ method: 'POST', headers:{'Content-Type':'application/json'}, body : JSON.stringify({age:32,name:"resul",email:"b@b.com"}) }).then(response=>response.json()).then(data=>{console.log(data);}).catch(error=>{console.log(error);});
const { check, validationResult } = require('express-validator/check')

const sanitizeValue = value => {
    //sanitize...
    return value + '!!';
}

app.post('/form', [
    check('name').isLength({ min: 3 }).trim().escape().withMessage('name field must be at least 3 charachters'),
    check('email').isEmail().normalizeEmail(),
    check('age').isNumeric().trim().escape(),
    check('title').custom(title => {
        if (title == 'junior') {
            //throw new Error('are you kidding me ?')
            return Promise.reject('are you kidding me ?')
        }

        return Promise.resolve('cool');
    }).trim().escape().customSanitizer(value => {
        return sanitizeValue(value)
    }),
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    res.json(req.body)
})
const https = require('https')

app.get('/secure', (req, res) => {
    res.send('Hello HTTPS! ')
})

const fs = require('fs')
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
    }, app).listen(8081, () => {
    console.log('Listening...')
    })

//uncomment for http 
//app.listen(8081, () => console.log('Server ready'))