import Browser from '../../../util/Browser';
import util from '../../../util/common';
import { assert } from 'chai';
import elements from '../../../util/common/elements';
import EMMElements from '../EMMElements';

describe('Register Event', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // creates an event
    await assert.isFulfilled(EMMElements.createEvent(page, util, elements, assert, 'register.event.test.name', true, false), 'should create a new event for registration test');
  });

  after(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // removes an event
    await assert.isFulfilled(EMMElements.removeEvent(page, util, elements, assert, 'register.event.test.name'), 'should remove a registered event');
  });

  createRegistrationTest('password');
  createRegistrationTest('lastName');
  createRegistrationTest('firstName');
  createRegistrationTest('email');
  createRegistrationTest('position');
  createRegistrationTest('additionalInformation');

  it('should register an event', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // registers an event
    await assert.isFulfilled(EMMElements.registerEvent(page, util, assert), 'should register an event');
  });
});

/**
   * create a test for Registration Event with required field not filled until all fields filled
   *
   * @param   {String}    skipped     field to be left empty
   */

async function createRegistrationTest(skipped) {

  it(`should show an error message when ${skipped} is missing`, async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Event Registration"
    await assert.isFulfilled(util.menu.select(page, 'Event Registration'), 'should open event registration page');

    // filter event by name
    await assert.isFulfilled(EMMElements.filterEventByName(page, 'register.event.test.name'), 'should filter the event by name');

    // wait for Register button
    await assert.isFulfilled(page.waitForSelector('#Events > table > tbody > tr > td:nth-child(1) > div'), 'should wait for register button');

    // click Register button
    await assert.isFulfilled(page.click('#Events > table > tbody > tr > td:nth-child(1) > div'), 'should click register button');

    // wait for Event Registration window to be visible
    await assert.isFulfilled(page.waitForSelector('#Window_LogInToEvent', {visible:true}), 'should wait for event registration window to be visible');

    if('password' == skipped) {

      // list of passwords
      const passwordList = ['','password'];
      const random = Math.floor(Math.random() * passwordList.length);

      // wait for Event password input field
      await assert.isFulfilled(page.waitForSelector('#LogInPassword'), 'should wait for event password input field');

      // type Event password
      await assert.isFulfilled(page.type('#LogInPassword', passwordList[random].toString()), 'should type event password');

      // click Continue registration button
      await assert.isFulfilled(page.click('#logInToEvent > div > button:nth-child(1)'), 'should click continue registration button');

      // wait for error box to be loaded in view model
      await assert.isFulfilled(page.waitForSelector('#logInToEvent > table > tbody > tr > td:nth-child(2) > span', {visible:true}), 'should wait for error box to be visible');

      // check error messages of the event registration window
      // field validation error box should contain an error
      const checkErrMsg = await elements.hasErrors(page, '#logInToEvent > table > tbody > tr > td >  span.field-validation-error');
      assert.isTrue(checkErrMsg, 'should show an error');

    } else {

      // wait for Event password input field
      await assert.isFulfilled(page.waitForSelector('#LogInPassword'), 'should wait for event password input field');

      // type Event password
      await assert.isFulfilled(page.type('#LogInPassword', 'eventPass'), 'should type event password');

      // wait for Continue registration button
      await assert.isFulfilled(page.waitForSelector('#logInToEvent > div > button:nth-child(1)'), 'should wait for continue registration button');

      // click Continue registration button
      await Promise.all([
        page.waitForNavigation(),
        page.click('#logInToEvent > div > button:nth-child(1)'),
      ]);

      if(!('lastName' == skipped)){

        // wait for Last name input field
        await assert.isFulfilled(page.waitForSelector('#\\38 5_27_1_1_1_4_Input'), 'should wait for last name input field');

        // type Last name
        await assert.isFulfilled(page.type('#\\38 5_27_1_1_1_4_Input', 'Doe'), 'should type last name');
      }

      if(!('firstName' == skipped)){

        // wait for First name input field
        await assert.isFulfilled(page.waitForSelector('#\\38 6_27_1_1_1_4_Input'), 'should wait for first name input field');

        // type First name
        await assert.isFulfilled(page.type('#\\38 6_27_1_1_1_4_Input', 'Jane'), 'should type first name');
      }

      if(!('email' == skipped)){

        // wait for Email input field
        await assert.isFulfilled(page.waitForSelector('#\\38 7_27_1_1_1_4_Input'), 'should wait for email input field');

        // type Email
        await assert.isFulfilled(page.type('#\\38 7_27_1_1_1_4_Input', 'janedoe@example.com'), 'should type email');
      }

      if(!('position' == skipped)){

        // wait for the arrow icon on Position field
        await assert.isFulfilled(page.waitForSelector('#\\38 8_27_1_1_1_4 > table > tbody > tr:nth-child(2) > td.metadataAttributeInput > div > div > span.t-select > span'), 'should wait for arrow icon on position field');

        // click the arrow icon on Position field
        await assert.isFulfilled(page.click('#\\38 8_27_1_1_1_4 > table > tbody > tr:nth-child(2) > td.metadataAttributeInput > div > div > span.t-select > span'), 'should click down arrow on position field');

        // after clicking the arrow icon wait for dropdown to appear (margin-top: 0px)
        await assert.isFulfilled(page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div.t-popup.t-group')).getPropertyValue('margin-top') === '0px'), 'should wait for dropdown to be visible');

        // set max from length of position list
        const maxLength = await page.evaluate(() => {
          const rows = document.querySelectorAll('body > div.t-animation-container > div > ul > li');
          return rows.length;
        });

        // choose a random Position value
        const randomPosition = Math.floor(Math.random() * (maxLength - 2 + 1) + 2); // todo
        await assert.isFulfilled(page.click(`body > div.t-animation-container > div > ul > li:nth-child(${randomPosition})`), 'should click a random position');

        // after clicking a random position wait for dropdown to be hidden (margin-top: -177px)
        await assert.isFulfilled(page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div.t-popup.t-group')).getPropertyValue('margin-top') === '-177px'), 'should wait for dropdown to be hidden');
      }

      if(!('additionalInformation' == skipped)){

        // wait for Additional information
        await assert.isFulfilled(page.waitForSelector('#\\38 9_28_1_1_1_6_Input'), 'should wait for additional information field');

        // type additional information
        await assert.isFulfilled(page.type('#\\38 9_28_1_1_1_6_Input', 'additionalInfo'), 'should type additional information');
      }

      // click Save button
      await assert.isFulfilled(page.click('#save'), 'should click save button');

      await assert.isFulfilled(page.waitFor(1000));

      // check error messages of the event registration form
      // field validation error box should contain an error
      const checkErrMsg = await elements.hasErrors(page, 'table > tbody > tr > td > div.error');
      assert.isTrue(checkErrMsg, 'should show an error');
    }
  });
}