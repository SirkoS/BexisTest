import Browser from '../../../util/Browser';
import util from '../../../util/common';
import { assert } from 'chai';
import elements from '../../../util/common/elements';
import EMMElements from '../EMMElements';

describe('Delete Registration', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // creates an event
    await assert.isFulfilled(EMMElements.createEvent(page, util, elements, assert, 'register.event.test.name', true, false), 'should create a new event for registration test');

    // registers an event
    await assert.isFulfilled(EMMElements.registerEvent(page, util, assert), 'should register an event');
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

  deleteRegistrationTest('cancel');
  deleteRegistrationTest('confirm');
});

/**
 * delete and don't delete the registered event
 *
 * @param   {String}    action     action message
 */

async function deleteRegistrationTest(action) {

  it(`should ${action} deletion of the registration`, async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Event Registration"
    await assert.isFulfilled(util.menu.select(page, 'Event Registration'), 'should open event registration page');

    // filter event by name
    await assert.isFulfilled(EMMElements.filterEventByName(page, 'register.event.test.name'), 'should filter the event by name');

    // wait for delete icon
    await assert.isFulfilled(page.waitForSelector('#Events > table > tbody > tr > td:nth-child(1) > div.bx.bx-grid-function.bx-trash'), 'should wait for delete icon');

    // after clicking delete icon. alert box is shown -> click Cancel
    if ('cancel' == action) {
      page.on('dialog', async dialog => { await dialog.dismiss(); });
    }

    // after clicking delete icon, alert box is shown -> click Ok
    if ('confirm' == action) {
      page.on('dialog', async dialog => { await dialog.accept(); });
    }

    // click Delete icon
    await assert.isFulfilled(page.click('#Events > table > tbody > tr > td:nth-child(1) > div.bx.bx-grid-function.bx-trash'), 'should click delete icon');

    // wait for event table
    await assert.isFulfilled(page.waitForSelector('#Events > table'), 'should wait for event table');

    // check if Register Button exists or not
    let registerButton = await page.evaluate(() => !!document.querySelector('div[title="Register for event"]'));

    // check if the deletion happened or not
    if ('cancel' == action) {

      // Register button shouldn't exist because deletion cancelled
      assert.isFalse(registerButton, 'should not contain register button in the table');
    } else if ('confirm' == action) {

      // Register button should exist because deletion confirmed
      assert.isFalse(registerButton, 'should contain register button in the table');
    }
  });
}