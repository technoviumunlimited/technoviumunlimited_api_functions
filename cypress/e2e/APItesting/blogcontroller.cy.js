
describe('API-test', () => {
  it('moet een GET-verzoek naar een lokale API maken', () => {
    cy.request('GET', 'http://127.0.0.1:5001/technoviumunlimited/us-central1/app/v1/blogs') 
      .should((response) => {
        expect(response.status).to.eq(200); // Controleer of de statuscode 200 is
               // Controleer of het JSON-responslichaam een 'blogs' eigenschap heeft
               expect(response.body).to.have.property('blogs');

               // Controleer of de lijst met blogs niet leeg is
               expect(response.body.blogs).to.be.an('array').to.not.be.empty;
       
               // Controleer of elk blogobject de vereiste eigenschappen heeft
               response.body.blogs.forEach((blog) => {
                 expect(blog).to.have.property('_id');
                 expect(blog).to.have.property('_thumb');
                 expect(blog).to.have.property('title');
                 expect(blog).to.have.property('discription');
                 expect(blog).to.have.property('author');
                 expect(blog).to.have.property('position');
               });
      });
  });
});
