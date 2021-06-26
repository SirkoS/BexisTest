import Browser from '../../../util/Browser';
import util from '../../../util/common';
import { assert } from 'chai';
import elements from '../../../util/common/elements';
import EMMElements from '../EMMElements';

describe('Edit Registration', () => {

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

  it('should edit a registered event', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if (!(await util.login.isLoggedIn(page))) {
      await assert.isFulfilled(util.login.loginUser(page), 'should login');
    }

    // navigate to "Event Registration"
    await assert.isFulfilled(util.menu.select(page, 'Event Registration'), 'should open event registration page');

    // filter event by name
    await assert.isFulfilled(EMMElements.filterEventByName(page, 'register.event.test.name'), 'should filter the event by name');

    // wait for Edit icon
    await assert.isFulfilled(page.waitForSelector('#Events > table > tbody > tr > td:nth-child(1) > div.bx.bx-grid-function.bx-edit'), 'should wait for edit icon');

    // click Edit icon
    await assert.isFulfilled(page.click('#Events > table > tbody > tr > td:nth-child(1) > div.bx.bx-grid-function.bx-edit'), 'should click edit icon');

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

    // wait for Last name input field
    await assert.isFulfilled(page.waitForSelector('#\\38 5_27_1_1_1_4_Input'), 'should wait for last name input field');

    // type Last name
    await assert.isFulfilled(page.type('#\\38 5_27_1_1_1_4_Input', 'edit.'), 'should type last name');

    // wait for First name input field
    await assert.isFulfilled(page.waitForSelector('#\\38 6_27_1_1_1_4_Input'), 'should wait for first name input field');

    // type First name
    await assert.isFulfilled(page.type('#\\38 6_27_1_1_1_4_Input', 'edit.'), 'should type first name');

    // wait for Email input field
    await assert.isFulfilled(page.waitForSelector('#\\38 7_27_1_1_1_4_Input'), 'should wait for email input field');

    // type Email
    await assert.isFulfilled(page.type('#\\38 7_27_1_1_1_4_Input', 'edit.'), 'should type email');

    // wait for the arrow icon on Position field
    await assert.isFulfilled(page.waitForSelector('#\\38 8_27_1_1_1_4 > table > tbody > tr:nth-child(2) > td.metadataAttributeInput > div > div > span.t-select > span'), 'should wait for arrow icon on position field');

    // click the arrow icon on Position field
    await assert.isFulfilled(page.click('#\\38 8_27_1_1_1_4 > table > tbody > tr:nth-child(2) > td.metadataAttributeInput > div > div > span.t-select > span'), 'should click down arrow on position field');

    // after clicking the arrow icon wait for dropdown to appear (margin-top: 0px)
    await assert.isFulfilled(page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div.t-popup.t-group')).getPropertyValue('margin-top') === '0px'), 'should wait for dropdown to be visible');

    // click a position
    await assert.isFulfilled(page.click('body > div.t-animation-container > div > ul > li:nth-child(3)'), 'should click Postdoc for position');

    // after clicking a random position wait for dropdown to be hidden (margin-top: -177px)
    await assert.isFulfilled(page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div.t-popup.t-group')).getPropertyValue('margin-top') === '-177px'), 'should wait for dropdown to be hidden');

    // wait for Additional information
    await assert.isFulfilled(page.waitForSelector('#\\38 9_28_1_1_1_6_Input'), 'should wait for additional information field');

    // type additional information
    await assert.isFulfilled(page.type('#\\38 9_28_1_1_1_6_Input', 'edit.'), 'should type additional information');

    // click Save button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#save'),
    ]);

    // navigate to "Show Reservations"
    await assert.isFulfilled(util.menu.select(page, 'Show Reservations'), 'should open show reservations page');

    // wait for the first event in Event contents
    await assert.isFulfilled(page.waitForSelector('#Content_Events > div > ul > li > ul > li > div > a.t-link.t-in.event'), 'should wait for the first event in event contents');

    // click registration event on its name to show it on the Event Registration Results table and wait for navigation
    await assert.isFulfilled(elements.clickAnyElementByText(page, 'register.event.test.name'), 'should click registration event');
    await assert.isFulfilled(page.waitForNavigation(), 'should wait for navigation after the click on the registration event');

    // wait for the first event in Event contents
    await assert.isFulfilled(page.waitForSelector('#Content_Events > div > ul > li > ul > li > div > a.t-link.t-in.event'), 'should wait for the first event in event contents');

    // store content which typed manually to edit the registered event
    const typedEditContent = ['edit.Doe','edit.Jane','edit.janedoe@example.com', 'Postdoc', 'edit.additionalInfo'];

    // get the content of the edited registered event and store it in a 2D array
    const registrationContent = await elements.tableContent2D(page, 'body > div.main-content.container-fluid > table > tbody > tr > td:nth-child(3)');

    // make a new array from Last Name, First Name, Position, and Additional Information of the edited registered event from the reservation table
    const editedContent = registrationContent[0].splice(5);

    // check if the registered event edited correctly
    assert.equal(JSON.stringify(editedContent), JSON.stringify(typedEditContent), 'edited content of the registered event from the reservation table should be equal the typed edit content');
  });
});