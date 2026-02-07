const { db } = require("../Config/firebase");

class Donation {
  constructor(id, name, country, contact, date, amount) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.contact = contact;
    this.date = date;
    this.amount = amount;
  }
}

export default Donation;