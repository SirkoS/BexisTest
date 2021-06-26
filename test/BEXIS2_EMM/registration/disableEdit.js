import Browser from '../../../util/Browser';
import util from '../../../util/common';
import { assert } from 'chai';
import elements from '../../../util/common/elements';
import EMMElements from '../EMMElements';

describe('Disable Edit', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // creates an event
    await assert.isFulfilled(EMMElements.createEvent(page, util, elements, assert, 'register.event.test.name', false, false), 'should create a new event without allow edit');

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

  it('should make all metadata input texts disabled', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Event Registration"
    await assert.isFulfilled(util.menu.select(page, 'Event Registration'), 'should open event registration page');

    // filter event by name
    await assert.isFulfilled(EMMElements.filterEventByName(page, 'register.event.test.name'), 'should filter the event by name');

    // after registration there should be two icons, view and delete icons, instead of Register button
    const viewIconClass = await page.evaluate(() => document.querySelector('#Events > table > tbody > tr:nth-child(1) > td:nth-child(2)').previousSibling.firstElementChild.className.trim());
    assert.strictEqual(viewIconClass, 'bx bx-grid-function fa-eye', 'the first element child should have bx bx-grid-function fa-eye class name for view icon');

    // wait for View icon
    await assert.isFulfilled(page.waitForSelector('#Events > table > tbody > tr > td:nth-child(1) > div.bx.bx-grid-function.fa-eye'), 'should wait for view icon');

    // click View icon
    await assert.isFulfilled(page.click('#Events > table > tbody > tr > td:nth-child(1) > div.bx.bx-grid-function.fa-eye'), 'should click view icon');

    // wait for Event Registration window to be visible
    await assert.isFulfilled(page.waitForSelector('#Window_LogInToEvent', {visible:true}), 'should wait for event registration window to be visible');

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

    // wait for Download Metadata Button
    await assert.isFulfilled(page.waitForSelector('#dropdownMenu2'), 'should wait for download metadata button');

    //get all the classes of metadata form text inputs (eg., Last name, First name, Email)
    const classMetadataTextInput = await page.$$eval('.metadataAttributeLabel', el => el.map((td) => td.nextElementSibling.firstElementChild.className.trim()));

    // all the metadata form text inputs should be disabled
    for (let index = 0; index < classMetadataTextInput.length; index++) {

      assert.strictEqual(classMetadataTextInput[index], 'bx-input bx-metadataFormTextInput  bx-disabled', 'all the metadata form text inputs should be disabled');
    }
  });
});