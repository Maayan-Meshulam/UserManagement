let usersArr = [];
let tempUser = {};
let isEditOpen = false;

//פונקציות שמטפלות בהצגה של טפסי ההתחברות והרשמה
function signUpForm(){
    document.getElementById('signUp').style.display = "block";
    document.getElementById('logIn').style.display = "none";

     //  למקרה שמילאו את הטופס ועברו להתחברות- איפוס תיבות קלט
     document.getElementById('firstNameSingUp').value = '';
     document.getElementById('lastNameSingUp').value = '';
     document.getElementById('passSingUp').value = '';
     document.getElementById('emailSingUp').value = '';
     document.getElementById('confirmSingUp').checked = false;

}

function logInForm(){
    document.getElementById('signUp').style.display = "none";
    document.getElementById('logIn').style.display = "block";

     //למקרה שמילאו את הטופס ועברו להתחברות- איפוס תיבות קלט
     document.getElementById('passLogIn').value  = '';
     document.getElementById('emailLogIn').value = '';
}



//פונקציה שמטפלת במשתמש שנרשם
function signUp(){
    
    console.log(usersArr);
    //נבדוק האם המשתמש אישר את תנאי השימוש
    let confirmVal = document.getElementById('confirmSingUp').checked; 
    if(!confirmVal){
        alert('נא אשר את תנאי השימוש');
        return; //נצא מהפונקציה ולא נמשיך
    }

    
    let fNameVal = document.getElementById('firstNameSingUp').value;
    let lNameVal = document.getElementById('lastNameSingUp').value;
    let passVal = document.getElementById('passSingUp').value;
    let emailVal = document.getElementById('emailSingUp').value;
       
    tempUser = {
        fName: fNameVal, 
        lName: lNameVal,
        pass: passVal,
        email: emailVal,
        confirm: confirmVal,
        status: 'לא מחובר'
    };

    if(!olreadySign()){
        usersArr.push(tempUser);//שמירת המשתמש החדש במערך 
        saveInStorage()//נשמור את המערך המעודכן בזיכרון     
        addUsersTable(tempUser);
        alert("משתמש נוסף בהצלחה");
    }
   

     //איפוס תיבות קלט
     document.getElementById('firstNameSingUp').value = '';
     document.getElementById('lastNameSingUp').value = '';
     document.getElementById('passSingUp').value = '';
     document.getElementById('emailSingUp').value = '';
     document.getElementById('confirmSingUp').checked = false;

}


//טיפול במקרה של משתמש רשום מנסה להירשם שוב
function olreadySign(){
    if(usersArr != null && usersArr.length > 0){    
        for(user of usersArr) {
            if(user.email == tempUser.email){ //האימייל הוא המזהה של המשתמש                
                alert("המשתמש רשום, נא התחבר");
                return true;
            }
        }         
    }
}



//פונקציה שמחברת משתמש רשום
function logIn(){
    console.log(usersArr);
    
    let passVal = document.getElementById('passLogIn').value;
    let emailVal = document.getElementById('emailLogIn').value;

    if(usersArr != null && usersArr.length > 0){
        for(user of usersArr)
            if((user.email == emailVal) && (user.pass == passVal)){//האימייל הוא המזהה של המשתמש         
                alert("משתמש התחבר בהצלחה");
                getIn(user.email);//לאחר ההתחברות נקרא לפונקציה שמשנה את הסטטוס למחובר
                 //איפוס השדות
                document.getElementById('passLogIn').value  = '';
                document.getElementById('emailLogIn').value = '';
                return;//נצא מהלולאה
            }   
            
        alert("משתמש לא רשום, נא הירשם קודם\n / סיסמא ו/או אימייל אינם נכונים");

    }
    else{
        alert("משתמש לא רשום, נא הירשם קודם");
    }


    //איפוס השדות
    document.getElementById('passLogIn').value  = '';
    document.getElementById('emailLogIn').value = '';
    
}



//פונקציה שאחראית לשמור בזיכרון
function saveInStorage(){       
    if(Storage != 'undefined'){
        sessionStorage.setItem("users", JSON.stringify(usersArr)); //נשמור את המערך שוב, לאחר שהתעדכן    
    }
}



//פונקציה שמוסיפה לטבלת משתמשים
function addUsersTable(userInfo){    
    console.log(usersArr);
    
    let tableOb = document.getElementById('usersTb');
    console.log(usersArr.length);
    
    tableOb.innerHTML += `
        <tr>
            <td>${userInfo.fName}</td>
            <td>${userInfo.lName}</td>
            <td>${userInfo.email}</td>
            <td>${userInfo.pass}</td>
            <td>לא מחובר</td>
            <td><button class="btnSignIOut" onclick="getOut('${userInfo.email}')"><i class="fa fa-sign-out" aria-hidden="true"></i></button></td>
            <td><button class="btnExit" onclick="removeUser('${userInfo.email}')"><i class="fa fa-times-circle" aria-hidden="true"></i></button></td>
            <td><button class="btnEdit" onclick="editUser(${usersArr.length - 1})"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>
        </tr>
    `
}


//פונקציה שמעדכנת את מערך המשתמשים לאחר עדכון / רענון הדפדפן
function importAfterUpdate(){
    usersArr = JSON.parse(sessionStorage.getItem("users"));
    if(usersArr == null)
        usersArr = [];
    else
        resetTable();     
}

    
//פונקציה שמאפסת את הטבלה אחרי שינוי / בעת כניסה לעמוד
function resetTable(){
    let tableOb = document.getElementById('usersTb');
    //נאפס את הטבלה
    tableOb.innerHTML = ` 
    <caption>טבלת משתמשים</caption>
    <tr>
        <th>שם פרטי</th>
        <th>שם משפחה</th>
        <th>אימייל</th>
        <th>סיסמא</th>
        <th>סטטוס</th>
        <th>התנתקות</th>
        <th>מחיקה</th>
        <th>עריכה</th>
    </tr>`; 
    

    for(userIndex in usersArr){               
       
        tableOb.innerHTML += `
        <tr>
            <td>${usersArr[userIndex].fName}</td>
            <td>${usersArr[userIndex].lName}</td>
            <td>${usersArr[userIndex].email}</td>
            <td>${usersArr[userIndex].pass}</td>
            <td>${usersArr[userIndex].status}</td>
            <td><button class="btnSignIOut" onclick="getOut('${usersArr[userIndex].email}')"><i class="fa fa-sign-out" aria-hidden="true"></i></button></td>
            <td><button class="btnExit" onclick="removeUser('${usersArr[userIndex].email}')"><i class="fa fa-times-circle" aria-hidden="true"></i></button></td>
            <td><button class="btnEdit" onclick="editUser(${userIndex})"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>
        </tr>
    `
    }

}


window.onload = importAfterUpdate();



//פונקציות שאחראיות על התנתקות / התחברות למערכת
function getOut(emailToGetOut){
    let userToChange = usersArr.find(user => user.email == emailToGetOut);
    userToChange.status = 'לא מחובר';//נשנה את הסטטוס ללא מחובר
    sessionStorage.setItem('users', JSON.stringify(usersArr));//נעדכן את המערך המעודכן בזיכרון
    alert("בחרת להתנתק מהמערכת");
    resetTable();
}

function getIn(emailToGetIn){
    let userToChange = usersArr.find(user => user.email == emailToGetIn);
    userToChange.status = 'מחובר';//נשנה את הסטטוס  למחובר
    sessionStorage.setItem('users', JSON.stringify(usersArr));//נעדכן את המערך המעודכן בזיכרון
    resetTable()
}


//פונקציה שמוחקת משתמש
function removeUser(emailToRemvoe){       
    for(let i = 0; i < usersArr.length; i++){
        if(usersArr[i].email == emailToRemvoe){
            usersArr.splice(i, 1); // נמחק את המשתמש מהמערך
            break;
        }
    }

    //מצב בו רוצים למחוק משתמש שטופס העריכה שלו פתוח
    if(isEditOpen)
        if(document.getElementById('emailEdit').value == emailToRemvoe)           
            closeEdit();    


    sessionStorage.setItem("users", JSON.stringify(usersArr)); //נעדכן את הזיכרון עם המערך החדש    
    resetTable();

}


function editUser(userIndex){
    if(isEditOpen){ //אם כבר יש קלף עריכה פתוח 
        alert("ניתן לערוך משתמש אחד בכל פעם");
        return;
    }
    isEditOpen = true;

    document.getElementById('signUp').style.display = "none";
    document.getElementById('logIn').style.display = "none";    
        
    document.getElementById('aboveContainer').innerHTML += `
    <div class="container" id="edit" style="position:relative">
        <span class="closeX" onclick="closeEdit()">X</span>
        <div class="contentDiv">
                <h1>עדכון</h1> 
                <div class="inputsDiv">
                    <input id="firstNameEdit" type="text" placeholder="first name" style="margin-bottom: 5px;" value="${usersArr[userIndex].fName}">
                    <input id="lastNameEdit" type="text" placeholder="last name" style="margin-bottom: 5px;" value="${usersArr[userIndex].lName}">
                    <input id="emailEdit" type="email" placeholder="email" style="margin-bottom: 5px; background-color: lightgray;" value="${usersArr[userIndex].email}" readonly>
                    <input id="passEdit" type="text" placeholder="password" style="margin-bottom: 5px;" value="${usersArr[userIndex].pass}">
                </div>
                <button onclick="editOnScreen(${userIndex})" id="editBtn">עדכן</button>
        </div>
    </div>`;

    //מאזין להגשת הטוספ באמצעות אנטר
    document.getElementById('edit').addEventListener("keypress", (event) => {        
        if(event.key == "Enter")            
            editOnScreen(userIndex);
    });
}

//פונקציה שמעדכנת על המסך את הנתונים 
function editOnScreen(userIndex){
    console.log(userIndex);
    
    let elemntToUpdate = document.getElementById('edit');
    console.log(elemntToUpdate);
    let newFName = document.getElementById('firstNameEdit').value;
    let newLName = document.getElementById('lastNameEdit').value;
    let newPass = document.getElementById('passEdit').value;

    console.log(newFName);
    console.log(newLName);
    console.log(newPass);

    

    let userToUpdate = usersArr[userIndex];
    console.log(userToUpdate);

    userToUpdate.fName = newFName;
    userToUpdate.lName = newLName;
    userToUpdate.pass = newPass;

    console.log(userToUpdate);

    usersArr.splice(userIndex, 1, userToUpdate);
    console.log(usersArr);
    saveInStorage();

    resetTable();
    closeEdit();
}
    
function closeEdit(){
    document.getElementById('edit').remove();
    isEditOpen = false;
    document.getElementById('logIn').style.display = "block";
}



//לחיצה על אנטר במקום על הכפתור כדי להגיש את הטפסים
document.getElementById('signUp').addEventListener("keypress", (event) => {
    if(event.key == "Enter"){
        signUp();
    }
});
document.getElementById('logIn').addEventListener("keypress", (event) => {
    if(event.key == "Enter"){
        logIn();
    }
});

