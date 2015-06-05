module.exports = (function() {
  'use strict';

  var GenericHystrixCommand = Java.type('io.pivotal.GenericHystrixCommand');

  function HystrixCommand(name, group, runMethod, fallbackMethod) {

    // enforces new
    if (!(this instanceof HystrixCommand)) {
      return new HystrixCommand(args);
    }

    var ScriptableHystrixCommand = Java.extend(GenericHystrixCommand, {
      run: runMethod,
      getFallback : fallbackMethod
    });

    this.instance = new ScriptableHystrixCommand(name, group);

  }

  HystrixCommand.prototype.execute = function(){
    return this.instance.execute();
  };


  return HystrixCommand;

}());