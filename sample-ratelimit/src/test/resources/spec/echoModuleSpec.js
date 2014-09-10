var echoModule = require('/modules/echoModule.js');
describe("echoModule", function() {
  describe("#echo", function() {
    it("returns an object containing the message it recieved ", function() {
      expect(echoModule.echo("someMessage")).toEqual({echo:"someMessage"});
    });
  });
});
