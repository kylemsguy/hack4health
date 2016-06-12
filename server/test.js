var docs = [
  {
    "_id": "575cb6201fd1c7191d10a80b",
    "appid": 1,
    "email": "violetyueguo@gmail.com",
    "clinicName": "Markham Family Health Team",
    "doctorName": "Mrs. Li",
    "checkedIn": false,
    "distance": 0,
    "month": 6,
    "day": 12,
    "time": 9,
    "estimateTime": 20,
    "__v": 0
  },
  {
    "_id": "575cb6731fd1c7191d10a80c",
    "appid": 2,
    "email": "cherylliat@gmail.com",
    "clinicName": "Markham Family Health Team",
    "doctorName": "Mrs. Li",
    "checkedIn": true,
    "distance": 0,
    "month": 6,
    "day": 12,
    "time": 9,
    "estimateTime": 20,
    "__v": 0
  },
  {
    "_id": "575cb6adc725a82b1d63cc1f",
    "appid": 3,
    "email": "jeremy.guan11@gmail.com",
    "clinicName": "Markham Family Health Team",
    "doctorName": "Mrs. Li",
    "checkedIn": false,
    "distance": 0,
    "month": 6,
    "day": 12,
    "time": 9,
    "estimateTime": 20,
    "__v": 0
  },
  {
    "_id": "575cb6c6c725a82b1d63cc20",
    "appid": 4,
    "email": "kylemsguy@gmail.com",
    "clinicName": "Markham Family Health Team",
    "doctorName": "Mrs. Li",
    "checkedIn": false,
    "distance": 0,
    "month": 6,
    "day": 12,
    "time": 9,
    "estimateTime": 20,
    "__v": 0
  }
];





    
function sortedDocs(docs){
    var checkedIn = [];
    var notCheckedIn = [];
    docs.forEach(function(doc){
        if (doc.checkedIn === true){
            checkedIn.push(doc);
        } else {
            notCheckedIn.push(doc);
        }
    });
    sortList(checkedIn);
    sortList(notCheckedIn);

    notCheckedIn.forEach(function(app){
      checkedIn.push(app);
    });
    
    return checkedIn;
}

function sortList(list){
  list.sort(function(a, b){
    if (a.time < b.time){
            return -1;
        } else if (a.time > b.time) {
            return 1;
        } else {
            return 0;
        }
  });
}
    



    
        var finalStuff = sortedDocs(docs);
console.log(finalStuff);

    
    
