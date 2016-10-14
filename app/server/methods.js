// functions
addSync = function (a, b) {
  return a + b;
}
blockFor3s = function (value) {
  var waitUntil = new Date().getTime() + 3000;
  while (new Date().getTime() < waitUntil) {}; // If return inside while block it the Method becomes non-blocking asynchrnous method
  return value;
}
setTimeoutFor3s = function (value) {
  var result = value;
  setTimeout(function () {
    result += 3;
    console.log('Result after timeout', result);
  }, 3000);
  return result;
}
setTimeoutFor3sCb = function (value, cb) {
  var result = value;
  Meteor.setTimeout(function () {
    console.log('Result after timeout', result);
    cb(null, result + 3)
  }, 3000);
}
block = function (value, cb) {
  Meteor.setTimeout(function () {
    cb(null, value + 3);
  }, 3000);
}

// methods
Meteor.methods({
  // blockingMethod
  'blockingMethod': function (value) {
    console.log('Method.blockingMethod called');
    var returnValue = value;
    console.log(value);
    resultComputation = blockFor3s(value);
    returnValue = addSync(resultComputation, 3);
    console.log(returnValue);
    return returnValue;
  },
  // nonBlockingMethod
  'nonBlockingMethod': function (value) {
    console.log('Method.nonBlockingMethod');
    var returnValue = value;
    returnValue = setTimeoutFor3s(returnValue);
    console.log('resultComputation', returnValue);
    return returnValue;
  },
  // wrapAsyncMethod
  'wrapAsyncMethod': function (value) {
    console.log('Method.wrapAsyncMethod');
    var returnValue = value;
    returnValue = Meteor.wrapAsync(setTimeoutFor3sCb)(returnValue);
    console.log('resultComputation', returnValue);
    return returnValue;
  },
  // sequential
  'sequential': function (value) {
    console.log('Method.sequential', value);
    Meteor.wrapAsync(block)(value);
    console.log('Method.sequential returns', value);
    return value;
  },
  // unblock
  'unblock': function (value) {
    console.log('Method.unblock', value);
    this.unblock();
    Meteor.wrapAsync(block)(value);
    console.log('Method.unblock returns', value);
    return value;
  },
  // unboundEnvironment
  'unboundEnvironment': function (value) {
    console.log('Method.unboundEnvironment: ', Meteor.userId());

    setTimeoutFor3sCb(value, function () {
      console.log('3s later: ', Meteor.userId());
    });
      return value;
  },
  // bindEnvironment
  'bindEnvironment': function (value) {
    console.log('Method.bindEnvironment: ', Meteor.userId());

    setTimeoutFor3sCb(value, Meteor.bindEnvironment(function () {
      console.log('Method.unboundEnvironment (3s delay): ', Meteor.userId());
    }));

    return value;
  }

});
