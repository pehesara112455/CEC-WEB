class reservation {
  // 1. The Constructor now accepts 4 parameters from the frontend
  constructor(CompanyName, Contact, DateFrom, DateTo) {
    // 2. We 'stick' the incoming data to the object using 'this'
    this.CompanyName = CompanyName;
    this.Contact = Contact;
    this.DateFrom = DateFrom;
    this.DateTo = DateTo;
    this.createdAt = new Date(); // We still keep the timestamp automatic
  }

  // 3. This method now returns the ACTUAL data stored in 'this'
  toFirestore() {
    return {
      CompanyName: this.CompanyName,
      Contact: this.Contact,
      DateFrom: this.DateFrom,
      DateTo: this.DateTo,
      createdAt: this.createdAt
    };
  }

  static roomsSubCollection(room){
    return{
      RoomName:room.RoomName|| "None",
      DateFrom:room.DateFrom|| "None",
      DateTo:room.DateTo|| "None"
    }
  }
  static mealsSubCollection(meal){
    return{
      MealName:meal.MealName|| "None",
      Quantity:meal.Quantity || 0,
      Amount:meal.Amount|| 0,
      Description:meal.Description|| "None"
    }
  }
  static othersSubCollection(other){
    return{
      ItemName:other.ItemName|| "None",
      Amount:other.Amount|| 0,
      Description:other.Description|| "None"
    }
  }
}

module.exports = reservation;