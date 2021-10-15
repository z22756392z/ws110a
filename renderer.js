export function layout(title,content){
    return `<html>
    <head>
        <link rel="shortcut icon" href="#">
        <title>${title}</title>
        <style>p ,h1{
            text-align: center;
          }
        a {
            font-size: 20px;
            
            text-decoration: none;
        }
        a:hover {
            color: #f1356d;
        }
        table {
            margin: 0 auto;
            width: 500px;
            border-collapse:collapse;
            border:1px solid black;
            padding: 10px;
          }
          th {
            text-align:center;
            background-color:black;
            color:white;
            padding: 10px;
          }
          td {
            border-bottom:1px solid black;
            padding: 10px;
          }</style>
    </head>
    <body>
    ${content}
    </body>
    <html/>`
}

export function dayUpdate (date,posts){
    let d = date.split("s");
    let arr = [d[0],d[1],d[2]];
    return schedule(arr,posts);
}

export function schedule(date,posts){
    
    let table = "<table><tr><th> </th><th>D</th>";
    for(let i = 1 ; i <32 ; i++){
        let str;
        if(i < 10){
            str = date[0] + "s" + date[1] + "s" + "0"+(i).toString();
        }else{
            str = date[0] + "s" + date[1] + "s" +(i).toString();
        }
        table += `<th><a href= "/${str}">${i}</a></th>`
    }
    table += `</tr><tr><th>T</th></tr>`
    for(let i = 0 ; i < 24 ; i+=2){
        table += `<tr><th>${i}:00 ~ ${i+1}:59</th>`;
        let counter = 0;
        for(let k = 0 ; k < posts.length ; k++){
            let pD = posts[k].Date.split("s");
            if(date[0] != pD[0] ) continue;
            if(date[1] !=  parseInt(pD[1])) continue;
            if(date[2] != parseInt(pD[2])) continue;
            if(i == parseInt(pD[3]) || parseInt(pD[3]) == i+1){
                table +=`<td><a href = "/schedule/${k}">${posts[k].title}</a></td>`
                counter++;
            }
        } 
        for(let j = 0 ; j < 32 - counter ; j++){
            table += `<td></td>`;
        }
        table += '<tr/>'
    }
    table +=`</table>`;

    let content = `
    <p>
    <form action="/date" method="post">
        <p><input type="date" value="${date[0]}-${date[1]}-${date[2]}" name = "date"></p>
        <p><input type="submit" value="change"></p>
    </form>
    <p><button id = "button" onclick = "click()"></button></p>
    <p><a href="/schedule/new">Create a schedule</a></p>` + table;
    return layout("Schedule",content);
}

export function show(post){
    let d = post.Date.split("s");
    let str = d[0]+ "/" + d[1] + "/" + d[2] + " Time: " + d[3] + " : " + d[4];
    return layout(post.title, `
    <h1>${post.title}</h1>
    <p>${post.body}</p>
    <p>${str}</p>`)
}

export function newPost(nowDate) {
    let d = nowDate.split("s");
    let str = `${d[0]}/${d[1]}/${d[2]}`;
    return layout("New schedule", `
    <h1>New schedule</h1>
    <p>Create a new schedule.</p>
    <form action="/post" method="post">
      <p><input type="text" placeholder="Title" name="title"></p>
      <p><textarea placeholder="Contents" name="body"></textarea></p>
      <p><input type="text" name="d" value = "${str}" readonly ></p>
      <p><input type="time" name="appt-time"></p>
      <p><input type="submit" value="Create"></p>
    </form>`)
}
