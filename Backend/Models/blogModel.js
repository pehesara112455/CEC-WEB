class Blog {
  constructor(data) {
    this.title = data.title;
    this.subTitle = data.subTitle;
    this.paragraph1 = data.paragraph1;
    this.paragraph2 = data.paragraph2 || "";
    this.paragraph3 = data.paragraph3 || "";
    this.thumbnail = data.thumbnail || null;
    this.images = data.images || [];
    this.status = data.status || "draft";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = new Date();
  }
}

module.exports = Blog;
