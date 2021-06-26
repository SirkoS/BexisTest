import Browser from '../../../util/Browser';
import util from '../../../util/common';
import { assert } from 'chai';
import elements from '../../../util/common/elements';
import EMMElements from '../EMMElements';

describe('Remove Registered Event', () => {

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

  removeRegisteredEventTest('cancel');
  removeRegisteredEventTest('confirm');
});


/**
 * delete and don't delete the registered event
 *
 * @param   {String}    action     action message
 */

async function removeRegisteredEventTest(action) {

  it(`should ${action} removal of the registered event`, async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Show Reservations"
    await assert.isFulfilled(util.menu.select(page, 'Show Reservations'), 'should open show reservations page');

    // wait for the first event in Event contents
    await assert.isFulfilled(page.waitForSelector('#Content_Events > div > ul > li > ul > li > div > a.t-link.t-in.event'), 'should wait for the first event in event contents');

    // click registration event on its name to show it on the Event Registration Results table and wait for navigation
    await assert.isFulfilled(elements.clickAnyElementByText(page, 'register.event.test.name'), 'should click registration event');
    await assert.isFulfilled(page.waitForNavigation(), 'should wait for navigation after the click on the registration event');

    // wait for the first event in Event contents
    await assert.isFulfilled(page.waitForSelector('#Content_Events > div > ul > li > ul > li > div > a.t-link.t-in.event'), 'should wait for the first event in event contents');

    // wait for Delete button
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td:nth-child(3) > div > span'), 'should wait for delete button');

    // after clicking the delete button, alert box is shown -> click Cancel
    if ('cancel' == action) {
      page.on('dialog', async dialog => { await dialog.dismiss(); });

      // click Delete button
      await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td:nth-child(3) > div > span'), 'should click delete button');
    }

    // after clicking delete button, alert box is shown -> click Ok
    if ('confirm' == action) {
      page.on('dialog', async dialog => { await dialog.accept(); });

      // click Delete button
      await Promise.all([
        page.waitForNavigation(),
        page.click('body > div.main-content.container-fluid > table > tbody > tr > td:nth-child(3) > div > span'),
      ]);
    }

    // get the list of events from tree view under open
    let treeViewContent = await elements.returnContent(page, '#TreeView > ul > li.t-item.t-first > ul > li > div > a');

    // check if the removal of event the happened or not
    if ('cancel' == action) {

      // registered event should be included in the array because the deletion was cancelled
      assert.isTrue(treeViewContent.includes('register.event.test.name'), 'should contain the registered event in the tree view of events');
    } else if ('confirm' == action) {

      // registered event should not be included in the array because the deletion was confirmed
      assert.isFalse(treeViewContent.includes('register.event.test.name'), 'should not contain the registered event in the tree view of events');
    }
  });
}