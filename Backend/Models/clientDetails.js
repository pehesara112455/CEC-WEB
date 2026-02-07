class ClientDetails {
  constructor(companyName, contactNumber, address, email, type, contactPerson, secondaryContact, nic, clientId) {
    this.companyName = companyName;
    this.contactNumber = contactNumber;
    this.address = address;
    this.email = email;
    this.type = type;
    this.contactPerson = contactPerson;
    this.secondaryContact = secondaryContact;
    this.nic = nic;
    this.clientId = clientId; // e.g., CL-2026-001
    this.createdAt = new Date();
  }

  // This method prepares the object to be saved in Firestore
  toFirestore() {
    return {
      companyName: this.companyName,
      contactNumber: this.contactNumber,
      address: this.address,
      email: this.email,
      type: this.type,
      contactPerson: this.contactPerson,
      secondaryContact: this.secondaryContact,
      nic: this.nic,
      clientId: this.clientId,
      createdAt: this.createdAt,
    };
  }

  // If you want to link specific projects or bookings to this client later
  static clientBookingMapping(booking, clientId) {
    return {
      ...booking,
      parentClientId: clientId,
      mappedAt: new Date()
    };
  }
}

module.exports = ClientDetails;