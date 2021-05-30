/**
 * handle resource management
 */


export default {
  createBooking,
  deleteBooking,
  navigationToList,
  unCheck,
  tableContent2D,
  eventContent
};

/**
 * Create booking
 *
 * @param   {object}    page
 * @param   {object}    util
 * @param   {object}    elements
 * @param   {object}    assert
 */

async function createBooking(page, util, elements, assert) {

  // navigate to "Calendar"
  await util.menu.select(page, 'Calendar');

  // wait for Book Resource button is loaded in view model
  await page.waitForSelector('#Content_Filter > a', { visible: true });

  // click Book Resource button
  await Promise.all([
    page.waitForNavigation(),
    page.click('#Content_Filter > a'),
  ]);

  // wait for the first Select Resource button is loaded in view model
  await page.waitForSelector('#Grid_Resource > table > tbody > tr:nth-child(1) > td:nth-child(3) > span', {visible: true});

  // get a random Resource
  const resourceSelect = await page.$$('span[title="Select resource"]');
  const randomResourceSelector = Math.floor(Math.random() * resourceSelect.length) + 1;

  // click a random Resource
  await page.click(`#Grid_Resource > table > tbody > tr:nth-child(${randomResourceSelector}) > td:nth-child(3) > span`);

  // wait for Continue Booking button is loaded in view model
  await page.waitForSelector('#ResourceCart > a', {visible:true});

  // click Continue Booking button
  await Promise.all([
    page.waitForNavigation(),
    page.click('#ResourceCart > a'),
  ]);

  // wait for Open Calendar icon is loaded in view model
  await page.waitForSelector('#timePeriod_1 > tr:nth-child(1) > td:nth-child(2) > div > div > span > span', {visible:true});

  // click Calendar icon for a start date
  await page.click('#timePeriod_1 > tr:nth-child(1) > td:nth-child(2) > div > div > span > span');

  // wait for calendar container to be visible (margin-top: 0px)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '0px');

  // click a random day on current month for a start date
  const startDays = await page.$$('body > div.t-animation-container > div > table > tbody > tr > td:not(.t-other-month)');

  // startDays.length - 2 --> it is for a gap between start and end date
  const randomStartDays = Math.floor(Math.random() * (startDays.length - 2));
  startDays[randomStartDays].click();

  // after a clicking a random date on calendar wait for calendar container to be hidden (margin-top: -316px)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '-316px');

  // click Calendar icon for an end date
  await page.click('#timePeriod_1 > tr:nth-child(2) > td:nth-child(2) > div > div > span > span');

  // wait for calendar container to be visible (margin-top: 0px)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '0px');

  // click a random day on current month for an end date
  const endDays = await page.$$('body > div.t-animation-container > div > table > tbody > tr > td:not(.t-other-month)');

  // remove days until the start date for not picking a past date
  const splicedEndDays = endDays.splice(randomStartDays);
  splicedEndDays[Math.floor(Math.random() * splicedEndDays.length)].click();

  // after a clicking a random date on calendar wait for calendar container to be hidden (margin-top: -316px)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('body > div.t-animation-container > div')).getPropertyValue('margin-top') === '-316px');

  // add Reason to the booking
  const reasonSelector = '.fa-plus';
  if (await page.$(reasonSelector) !== null) {

    // click add reason button
    await page.click('.fa-plus');

    // wait for Select Activities window is loaded in view model
    await page.waitForSelector('#Window_ChooseActivities', {visible:true});

    // click a random checkbox for Select column
    const selectCheckbox = await page.$$('input[type="checkbox"]');
    const randomCheckbox = Math.floor(Math.random() * selectCheckbox.length) + 1;
    selectCheckbox[randomCheckbox].click();

    // click Add activities to schedule
    await page.click('#Content_ChooseActivities > div > div.bx-rpm-submit.bx-rpm-buttons > button');

    // wait for Select Activities window is not found in view model
    await page.waitForSelector('#Window_ChooseActivities', {hidden:true});
  }

  // find Name field
  await page.type('#Name', 'booking.test.name');

  // find Description field
  await page.type('#Description', 'booking.test.desc');

  // screenshot the the window before clicking book
  await page.screenshot({path:'beforeLast.png'});

  // click Book button
  await Promise.all([
    page.waitForNavigation(),
    page.click('#Content_Event > div.bx-footer.right > a:nth-child(2)'),
  ]);

  // click Month button
  await page.click('#calendar > div.fc-toolbar > div.fc-right > div > button.fc-month-button.fc-button.fc-state-default.fc-corner-left');

  // wait for Calendar to appear
  await page.waitForSelector( '#calendar .fc-event' );

  // wait that the controls are active
  await page.waitForSelector( '#displayView.ready' );

  // click List button
  const listSwitch = await page.evaluateHandle( () => document.querySelector( '#displayView input[value="List"]' ).parentNode );
  await listSwitch.asElement().click();

  // wait for Resource Table Filter is loaded in view model
  await page.waitForSelector('#scheduleList #resources_table > tbody > tr', {visible:true});

  // click Show without history button
  await page.click('#history_no');

  // wait for Show with history to be visible
  await page.waitForSelector('#history_yes', {visible:true});

  // check for an entry by Description Name in the list of bookings
  const checkEntry = await elements.hasEntry(page, '#resources_table > tbody > tr', 'booking.test.desc', '2');
  assert.isTrue(checkEntry, 'should contain the new booking in the table');
}

/**
 * Delete booking
 *
 * @param   {object}    page
 * @param   {object}    util
 * @param   {object}    RBMElements
 * @param   {object}    assert
 */

async function deleteBooking(page, util, elements, assert) {

  // navigate to "Calendar"
  await util.menu.select(page, 'Calendar');

  // wait for Book Resource button is loaded in view model
  await page.waitForSelector('#Content_Filter > a', { visible: true });

  // click List button
  const listSwitch = await page.evaluateHandle( () => document.querySelector( '#displayView input[value="List"]' ).parentNode );
  await listSwitch.asElement().click();

  // wait for Resource Table Filter is loaded in view model
  await page.waitForSelector('#scheduleList #resources_table > tbody > tr', {visible:true});

  // click Show without history button
  await page.click('#history_no');

  // wait for Show with history to be active
  await page.waitForSelector('#history_yes');

  // search for the booking by name
  await page.type('#resources_table_filter > label > input[type=search]', 'booking.test.name');

  // click the booked resource on its name
  await Promise.all([
    page.waitForNavigation(),
    page.click('#resources_table > tbody > tr > td:nth-child(1) > a'),
  ]);

  // wait for Open Calendar icon is loaded in view model
  await page.waitForSelector('#Content_Event > div.bx-footer.right > a:nth-child(3)', {visible:true});

  // click Delete button
  await Promise.all([
    page.waitForNavigation(),
    page.click('#Content_Event > div.bx-footer.right > a:nth-child(3)'),
  ]);

  // wait that the controls are active
  await page.waitForSelector( '#displayView.ready' );

  // click List button
  const listHandle = await page.evaluateHandle( () => document.querySelector( '#displayView input[value="List"]' ).parentNode );
  await listHandle.asElement().click();

  // wait for Resource Table Filter is loaded in view model
  await page.waitForSelector('#scheduleList #resources_table > tbody > tr', {visible:true});

  // click Show without history button
  await page.click('#history_no');

  // wait for Show with history to be visible
  await page.waitForSelector('#history_yes', {visible:true});

  // check for an entry by Description Name in the list of bookings
  const checkBooking= await elements.hasListing(page, '#resources_table > tbody > tr', 'booking.test.desc');
  assert.isFalse(checkBooking, 'should not contain the new booking in the table');
}

async function navigationToList(page, util){

  // navigate to "Calendar"
  await util.menu.select(page, 'Calendar');

  // wait for Book Resource button is loaded in view model
  await page.waitForSelector('#Content_Filter > a', { visible: true });

  // click List button
  const listSwitch = await page.evaluateHandle(() => document.querySelector( '#displayView input[value="List"]' ).parentNode);
  await listSwitch.asElement().click();

  // wait for Resource Table Filter is loaded in view model
  await page.waitForSelector('#scheduleList #resources_table > tbody > tr', {visible:true});

  // click Show without history button
  await page.click('#history_no');

  // wait for Show with history to be active
  await page.waitForSelector('#history_yes');
}

async function unCheck(page) {

  // uncheck the checkboxes
  await page.$$eval('input[type="checkbox"]',
                    checkBoxes => checkBoxes
                      .forEach(checkBox => checkBox.checked = false));
}

/**
 * Returns table content in two dimensional array
 *
 * @param   {object}    page
 * @param   {string}    tableID
 */

async function tableContent2D(page, tableID) {
  const result = await page.evaluate((tableID) => {
    const rows = document.querySelectorAll(tableID);
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td');
      return Array.from(columns, column => column.textContent.trim());
    });
  }, tableID);
  return result;
}

/**
 * Returns event content from the calendar
 *
 * @param   {object}    page
 * @param   {string}    tableID
 */
async function eventContent(page, elementID) {
  const result = await page.evaluate((elementID) => {
    const element = document.querySelectorAll(elementID);
    return Array.from(element, element => element.textContent.trim());
  }, elementID);
  return result;
}

