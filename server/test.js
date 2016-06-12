var docs = [
  {
    "_id": "575c87c1748eb90017b26363",
    "ended": false,
    "appid": 8,
    "email": "test3@gmail.com",
    "clinicName": "Church Wellesley Medical Clinic",
    "checkedIn": false,
    "distance": 0,
    "month": 6,
    "day": 12,
    "time": 10,
    "__v": 0
  },
  {
    "_id": "575c8857651ee82117f59464",
    "ended": false,
    "appid": 9,
    "email": "test3@gmail.com",
    "clinicName": "Church Wellesley Medical Clinic",
    "checkedIn": false,
    "distance": 0,
    "month": 6,
    "day": 12,
    "time": 11,
    "__v": 0
  },
  {
    "_id": "575c8881e74c6932171d6bb4",
    "ended": false,
    "appid": 10,
    "email": "test3@gmail.com",
    "clinicName": "Markham Family Health Team",
    "doctorName": "Falcon",
    "checkedIn": true,
    "distance": 5875.341469851397,
    "month": 6,
    "day": 12,
    "time": 9,
    "__v": 0
  }
];







    
    docs.sort(function(a,b){
        if (a.time < b.time){
            return -1;
        } else if (a.time > b.time) {
            return 1;
        } else {
            return 0;
        }
    });
    
        
    console.log(docs);
    
    
