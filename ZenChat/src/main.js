import { serverPage } from "./modules/home/serverPage";
import { roomPage } from "./modules/room/roomPage";

function initialize() {
    console.log("Sanity check from main.js.");
    const currentPage = window.location.pathname;

    console.log(currentPage);
    
    if(currentPage.match(/^\/server\/\d+\/$/)) {
        serverPage(currentPage);
    }
    else if(currentPage.match(/^\/server\/\d+\/\w+\/$/)) {
        roomPage();
    }
    else {
        console.log("Page not found.");
    }
}

window.onload = initialize;