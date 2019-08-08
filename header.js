/*
let userID = localStorage.getItem("isptutor_userID");
let collectionID = localStorage.getItem("isptutor_collectionID");
if (userID == null) {
    userID = "dummy_ignoreme";
}
if (collectionID == null) {
    collectionID = "STUDY1"
}*/



// controls research question text
// TODO: use sessionStorage to set the research question
let rq = "Your Research Question:\nDoes the water temperature affect the weight of crystal growth on a string in water after two weeks?";
document.getElementById("research-question").innerHTML = rq;

// header button control
document.getElementById("home-btn").addEventListener("click", e => {
    location.href = "../home";
});
document.getElementById("forces-btn").addEventListener("click", e => {
    location.href = "../area_forcesmotion";
});
document.getElementById("plant-btn").addEventListener("click", e => {
    location.href = "../Area_PlantReproduction";
});
document.getElementById("chemical-btn").addEventListener("click", e => {
    location.href = "../areachemphys";
});
document.getElementById("heat-btn").addEventListener("click", e => {
    location.href = "../area_heattemp";
});

// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyD7zIk-8V20QqJNSs0cAV0uNL3qjeqLMdM",
    authDomain: "isptutor.firebaseapp.com",
    projectId: "isptutor"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
// https://firestore.googleapis.com/v1beta1/projects/isptutor/databases/(default)/documents/STUDY1/RICHARDGU_JAN_1
/*
let xhr = new XMLHttpRequest();
xhr.open("PATCH", 'https://firestore.googleapis.com/v1beta1/', true);
xhr.setRequestHeader('Content-Type', 'application/json');
let data = {
    updateMask: {
            'fieldPaths': [
            "{'brm': 'meh'}"
        ]
    }
}
let doc = {
    'name': 'projects/isptutor/databases/(default)/documents/STUDY1/RICHARDGU_JAN_1',
    'fields': {
        'brm': 'meh'
    }
}
xhr.send(doc);*/

// logging functions
function logEntry(entry) {
    let brmStr = localStorage.getItem("isptutor_brmHistory");
    if (brmStr == null) {
        brmStr = "[]";
    }
    
    let brmHistory = JSON.parse(brmStr);
    brmHistory.push(entry);
    localStorage.setItem("isptutor_brmHistory", JSON.stringify(brmHistory));
}


function logLink(link) {
    let brmHistory = localStorage.getItem("isptutor_brmHistory");
    if (brmHistory == null) {
        brmHistory = [];
    }
    brmHistory.push({
        type: "LINK",
        link: link
    });
    localStorage.setItem("isptutor_brmHistory", brmHistory);
    /*
    db.collection(collectionID).doc(userID).get().then(doc => {
        let brmStr = doc.data().brm;
        let brmData;
        if (brmStr == undefined) {
            brmData = {};
            brmData.linkHistory = [];
            brmData.quizHistory = [];
        }
        else {
            brmData = JSON.parse(brmStr);
        }
        brmData.linkHistory.push(link);
        console.log(brmData);
        return brmData;
    }).then(brmData => {
        db.collection(collectionID).doc(userID).update({
            brm: JSON.stringify(brmData)
        });
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });*/
}
//logLink(location.href);
logEntry({
    type: "LINK",
    link: location.href
});

function logQuizEntry(quizEntry) {
    let brmHistory = localStorage.getItem("isptutor_brmHistory");
    if (brmHistory == null) {
        brmHistory = [];
    }
    quizEntry.type = "QUIZ";
    brmHistory.push(quizEntry);
    localStorage.setItem("isptutor_brmHistory", brmHistory);
    /*
    db.collection(collectionID).doc(userID).get().then(doc => {
        let brmStr = doc.data().brm;
        let brmData;
        if (brmStr == undefined) {
            brmData = {};
            brmData.linkHistory = [];
            brmData.quizHistory = [];
        }
        else {
            brmData = JSON.parse(brmStr);
        }
        brmData.quizHistory.push(quizEntry);
        console.log(brmData);
        return brmData;
    }).then(brmData => {
        db.collection(collectionID).doc(userID).update({
            brm: JSON.stringify(brmData)
        });
    }).catch((error) => {
        console.error("Error writing document: ", error);
    });*/
}

// quiz control
let quizChoices = document.getElementsByClassName("quiz_choice");
for (let quiz of quizChoices) {
    quiz.addEventListener("submit", e => {
        e.preventDefault();
        let formData = new FormData(quiz);
        let feedbackCorrect = quiz.querySelector(".feedback-correct");
        let feedbackIncorrect = quiz.querySelector(".feedback-incorrect");
        feedbackCorrect.style.display = "none";
        feedbackIncorrect.style.display = "none";
        if (formData.get("question") == "correct") {
            feedbackCorrect.style.display = "block";
            
        }
        else if (formData.get("question") == "incorrect") {
            feedbackIncorrect.style.display = "block";
            
        }
        // else no choice selected, so ignore everything
        else {
            return;
        }
        let choices = quiz.querySelectorAll("input");
        let labels = quiz.querySelectorAll(".label");
        if (choices.length != labels.length) {
            console.error("The number of input elements should match the number of label elements!");
        }
        let selected = "";
        for (let i = 0; i < choices.length; i++) {
            let choice = choices[i];
            if (choice.checked) {
                selected = labels[i].innerHTML;
                break;
            }
        }
        let quizEntry = {
            type: "QUIZ",
            title: quiz.querySelector("b").innerHTML,
            selected: selected,
            isCorrect: (formData.get("question") == "correct")
        }
        console.log(quizEntry);
        //logQuizEntry(quizEntry);
        logEntry(quizEntry);

    });
}
let quizCheckboxes = document.getElementsByClassName("quiz_checkbox");
for (let quiz of quizCheckboxes) {
    quiz.addEventListener("submit", e => {
        e.preventDefault();
        let feedbackCorrect = quiz.querySelector(".feedback-correct");
        let feedbackIncorrect = quiz.querySelector(".feedback-incorrect");
        feedbackCorrect.style.display = "none";
        feedbackIncorrect.style.display = "none";
        let correctness = true;
        let choices = quiz.querySelectorAll("input");
        for (let choice of choices) {
            if ((choice.checked && choice.value == "incorrect") || (!choice.checked && choice.value == "correct")) {
                correctness = false;
                break;
            }
        }
        if (correctness) {
            feedbackCorrect.style.display = "block";
        }
        else {
            feedbackIncorrect.style.display = "block";
        }
        let labels = quiz.querySelectorAll(".label");
        if (choices.length != labels.length) {
            console.error("The number of input elements should match the number of label elements!");
        }
        let selected = "";
        for (let i = 0; i < choices.length; i++) {
            let choice = choices[i];
            if (choice.checked) {
                selected += labels[i].innerHTML + "; ";
            }
        }
        let quizEntry = {
            type: "QUIZ",
            title: quiz.querySelector("b").innerHTML,
            selected: selected,
            isCorrect: correctness
        }
        console.log(quizEntry);
        logEntry(quizEntry);
    });
}
let quizOpens = document.getElementsByClassName("quiz_open");
for (let quiz of quizOpens) {
    quiz.addEventListener("submit", e => {
        e.preventDefault();
        let feedbackCorrect = quiz.querySelector(".feedback-correct");
        feedbackCorrect.style.display = "block";
        let quizEntry = {
            type: "QUIZ",
            title: quiz.querySelector("b").innerHTML,
            selected: quiz.querySelector("textarea").value,
            isCorrect: true
        }
        console.log(quizEntry);
        logEntry(quizEntry);
    });
}


// to make sure beforeunload event doesn't trigger on link

/*let links = document.querySelectorAll("a");
for (let link of links) {
    link.addEventListener("click", e => {
        linkOrButton = true;
    })
}*/

/*
window.addEventListener("beforeunload", function (e) {
    if (!linkOrButton) {
        e.preventDefault();
        console.log("hi");
        db.collection("STUDY1").doc("testinguserboy4").set({
            brmtest: "cool",
            brmcode: 1
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

        e.returnValue = "";
    }
});
window.addEventListener("unload", function (e) {
    db.collection("STUDY1").doc("testinguserboy4").set({
        brmtest: "done",
        brmcode: 2
    })
    .catch(function (error) {
        console.error("Error writing document: ", error);
    });  
});
*/

