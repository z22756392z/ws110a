import {Application, Router} from "https://deno.land/x/oak/mod.ts";
import * as renderer from "./renderer.js";
//This inserts renderer into the current scope, 
//containing all the exports from the module in the file located in ./renderer.js

const app = new Application();
const router = new Router();

let nowDate = DateToPath(DateToArr(Date().toString()));

const posts = [{title: "Hello World",body: "Hello",Date: `${nowDate}`}];

function DateToArr(date){
    let d = date.split(" ");
    let t = d[4].split(":");
    if(d[1] == 'Jan') d[1] = "01";
    else if(d[1] == 'Feb') d[1] = "02";
    else if(d[1] == 'Mar') d[1] = "03";
    else if(d[1] == 'Apr') d[1] = "04";
    else if(d[1] == 'May') d[1] = "05";
    else if(d[1] == 'Jun') d[1] = "06";
    else if(d[1] == 'Jul') d[1] = "07";
    else if(d[1] == 'Aug') d[1] = "08";
    else if(d[1] == 'Sep') d[1] = "09";
    else if(d[1] == 'Oct') d[1] = "10";
    else if(d[1] == 'Nov') d[1] = "11";
    else if(d[1] == 'Dec') d[1] = "12";
    return [d[3],d[1],d[2],t[0],t[1]];
}

function DateToPath(date){
    return date[0] + "s" + date[1] + "s" + date[2] +"s" + date[3] +"s" + date[4] ;
}

router
    .get(`/`,homePage)
    .get(`/:D`,changeDays)
    .post(`/date`, changeYearsAMonths)
    .get(`/schedule/new`,add)
    .get(`/schedule/:id`,post)
    .post(`/post`,create);
    

async function homePage (ctx) {
    nowDate = DateToPath(DateToArr(Date().toString()));
    ctx.response.body = await renderer.schedule(DateToArr(Date().toString()),posts);
}

const click = () =>{
    console.log("123");
}

async function changeDays (ctx) {
    nowDate = ctx.params.D;
    ctx.response.body = await renderer.dayUpdate(nowDate,posts);
}

async function changeYearsAMonths (ctx) {
    const body = ctx.request.body()
     if (body.type === "form") {
    const pairs = await body.value
    const date = {}
    for (const [key, value] of pairs) {
        date[key] = value
    }
    let d = date.date.split("-");
    nowDate = [(d[0]),(d[1]),(d[2])];
    ctx.response.redirect('/' + DateToPath(nowDate));
    } 
}

async function post (ctx) {
    ctx.response.body = await renderer.show(posts[ctx.params.id]);
}

async function add (ctx) {
    ctx.response.body = await renderer.newPost(nowDate);
}

async function create(ctx) {
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      const post = {}
      let str ="";
      for (let [key, value] of pairs) {
        if(key == "d"){
            let d = value.split("/");
            str += d[0] + "s" +d[1] + "s" +d[2];
        }else{
            if(key == "appt-time"){
                let d = value.split(":");
                str += "s" + d[0] + "s" +d[1];
                key = "Date";
                post[key] = str;
            }else{post[key] = value}
            
        }
    }
    const id = posts.push(post) - 1;
    console.log(posts);
    ctx.response.redirect('/'+post.Date);
    }
  }


app.use(router.routes());
app.use(router.allowedMethods());

console.log("Start at :http://127.0.0.1:8542")
await app.listen({port: 8542})
