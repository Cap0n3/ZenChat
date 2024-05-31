import { serverPage } from "./modules/home/serverPage";
import { roomPage } from "./modules/room/roomPage";
import { scrollDown } from "./modules/common/chat_utils";

function initialize() {
    console.log("Sanity check from main.js.");
    const currentPage = window.location.pathname;
    
    if(currentPage.match(/^\/server\/\d+\/$/)) {
        serverPage(currentPage);
    }
    else if(currentPage.match(/^\/server\/\d+\/\w+\/$/)) {
        console.log("Room page.");
        roomPage();
        scrollDown(document.querySelector("#chatFeed"));
    }
    else {
        console.log("Page not found.");
    }
}

window.onload = initialize;