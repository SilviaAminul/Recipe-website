//Points to a div element where user combo will be inserted.
let userDiv;
let addUserResultDiv;

//Set up page when window has loaded
window.onload = init;
 
//Get pointers to parts of the DOM after the page has loaded.
function init(){
    userDiv = document.getElementById("UserDiv");
    addUserResultDiv = document.getElementById("AddUserResult");
    loadUsers();
    loadTestimonial();
}

/* Loads current users and adds them to the page. */
function loadUsers() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            let usrArr = JSON.parse(xhttp.responseText);

            //Return if no users
            if(usrArr.length === 0)
                return;

            //Build string with user data
            let htmlStr = "<table><tr><th>Name</th></tr>";
            for(let key in usrArr){
                htmlStr += ("<tr><td>" + key + "</td><td>" + usrArr[key].name + "</td>");
                
            }
            //Add users to page.
            htmlStr += "</table>";
            userDiv.innerHTML = htmlStr;
        }
    };

    //Request data from all users
    xhttp.open("GET", "/users", true);
    xhttp.send();
}


/* Posts a new user to the server. */
function addUser() {
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let usrName = document.getElementById("NameInput").value;
    let usrEmail = document.getElementById("EmailInput").value;
    let usrPassword = document.getElementById("PasswordInput").value;

    //Create object with user data
    let usrObj = {
        name: usrName,
        email: usrEmail,
        password: usrPassword
    };
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            addUserResultDiv.innerHTML = "User added successfully";
        }
        else{
            addUserResultDiv.innerHTML = "<span style='color: red'>Error adding user</span>.";
        }
        //Refresh list of users
        loadUsers();
    };

    //Send new user data to server
    xhttp.open("POST", "/users", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(usrObj) );
}
 
// displays the testimonials in the front page under the carousel slider

function loadTestimonial() {
    $.getJSON('/testimonials', (data) => {
        $('#test-one-description').text(data[0]['comment']);
        $('#test-one-name').text(data[0]['username']);

        $('#test-two-description').text(data[1]['comment']);
        $('#test-two-name').text(data[1]['username']);

        $('#test-three-description').text(data[2]['comment']);
        $('#test-three-name').text(data[2]['username']);
    });
}