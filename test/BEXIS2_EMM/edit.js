import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import EMMElements from './EMMElements';

describe('Edit Event', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // creates an event
    await assert.isFulfilled(EMMElements.createEvent(page, util, elements, assert, 'event.test.name', true, true), 'should create a new event');
  });

  after( async() => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled(util.login.loginUser(page), 'should log in');
    }

    // deletes an event
    await assert.isFulfilled(EMMElements.deleteEvent(page, util, assert, elements, 'edit.event.test.name'), 'should delete the event');
  });

  it('should edit an event', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Events"
    await assert.isFulfilled(util.menu.select(page, 'Manage Events'), 'should open manage events page');

    // wait for button Create new Event is loaded in view model
    await assert.isFulfilled(page.waitForSelector('body > div.main-content.container-fluid > table > tbody > tr > td > div > a', { visible: true }), 'should wait for button create new event');

    // wait for the edit icon
    await assert.isFulfilled(page.waitForSelector('div[title="Edit Unit \\"event.test.name\\""]'), 'should wait for the edit icon');

    // click Edit icon
    const editButton = await page.$('div[title="Edit Unit \\"event.test.name\\""]');
    await editButton.click();

    // wait for Event name field
    await assert.isFulfilled(page.waitForSelector('#Name'), 'should wait for event name field');

    // find Event name field
    await assert.isFulfilled(page.type('#Name', 'edit.'), 'should enter a name');

    // wait for Event time period and time field
    await assert.isFulfilled(page.waitForSelector('#EventDate'), 'should wait for event time period and time field');

    // find Event time period and time field
    await assert.isFulfilled(page.type('#EventDate', 'edit.'), 'should enter an event time period and time');

    // wait for Important information field
    await assert.isFulfilled(page.waitForSelector('#ImportantInformation'), 'should wait for important information field');

    // find Important information field
    await assert.isFulfilled(page.type('#ImportantInformation', 'edit.'), 'should enter an important information');

    // wait for Event language field
    await assert.isFulfilled(page.waitForSelector('#EventLanguage'), 'should wait for event language field');

    // find Event language field
    await assert.isFulfilled(page.type('#EventLanguage', 'edit.'), 'should enter an event language');

    // wait for Participants limitation field
    await assert.isFulfilled(page.waitForSelector('#ParticipantsLimitation'), 'should wait for participants limitation field');

    // find Participants limitation field
    await assert.isFulfilled(page.type('#ParticipantsLimitation', '2'), 'should enter a participants limitation');

    // click Save button
    await Promise.all([
      page.waitForNavigation(),
      page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > form > div > button'),
    ]);

    // wait for Event table is loaded in view model
    await page.waitForSelector('#Grid_Event > table > tbody > tr > td:nth-child(2)');

    // check for an entry by Event name in the list of events
    const checkEntry = await elements.hasEntry(page, '#Grid_Event > table > tbody > tr', 'edit.event.test.name', '2');
    assert.isTrue(checkEntry, 'should contain the new event in the table');
  });
});