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
}

module.exports = reservation;