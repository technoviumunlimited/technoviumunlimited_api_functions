describe('JSON Data Test', () => {
  let jsonData;

  before(() => {
    // Fetch the JSON data
    cy.request('http://api.technoviumunlimited.nl/v1/blogs')
      .its('body') 
      .then((body) => {
        jsonData = body;
      });
  });

  it('Should have a valid JSON response', () => {
    expect(jsonData).to.not.be.undefined;
  });

  it('Should have an array of blogs', () => {
    expect(jsonData).to.have.property('blogs').and.to.be.an('array');
  });

  it('Should validate the properties of each blog', () => {
    jsonData.blogs.forEach((blog) => {
      expect(blog).to.have.property('_id').and.to.be.a('string');
      expect(blog).to.have.property('title').and.to.be.a('string');
      expect(blog).to.have.property('description').and.to.be.a('string');
      expect(blog).to.have.property('author').and.to.be.a('string');


    });
  });


});
