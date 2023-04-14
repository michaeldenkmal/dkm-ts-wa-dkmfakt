import fetch from 'node-fetch';

function build_api_path(action:string) {
    return `http://localhost:5000/kundenhonorar/${action}`
}


async function fetchAndPrint(action:string){
    const response = await fetch(build_api_path(action));
    const data = await response.json();
    
    console.log(data);

}

async function testPost() {
    const url = build_api_path("post_test");
    const data = {
        x: 1920,
        y: 1080,
    };
    const customHeaders = {
        "Content-Type": "application/json",
    }
    const resp = await fetch(url, {
        method:"POST",
        headers: customHeaders,
        body:JSON.stringify(data)
    })
    console.log(resp);
}

async function testit() {

    fetchAndPrint("list")
    fetchAndPrint("edit/170")

}

//testit();
testPost();



