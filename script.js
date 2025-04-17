document.getElementById('add-row-button').addEventListener('click', function(e) {
  e.preventDefault();

  // Get values from the form
  const sector = document.getElementById('sector').value;
  const ofpBlockHours = document.getElementById('ofp-block-hours').value;
  const ofpBlockMinutes = document.getElementById('ofp-block-minutes').value;
  const actualBlockHours = document.getElementById('actual-block-hours').value;
  const actualBlockMinutes = document.getElementById('actual-block-minutes').value;
  const corrected = document.getElementById('corrected').checked;

  // Convert OFP Block and Actual Block to minutes
  const ofpBlockMinutesTotal = convertToMinutes(ofpBlockHours, ofpBlockMinutes);
  const actualBlockMinutesTotal = convertToMinutes(actualBlockHours, actualBlockMinutes);

  // Calculate Delta (difference between Actual Block and OFP Block)
  const deltaMinutes = actualBlockMinutesTotal - ofpBlockMinutesTotal;
  const delta = convertToTimeFormat(deltaMinutes); // Convert back to hours and minutes

  // Calculate Productivity Discrepancy
  const productivityDiscrepancyMinutes = corrected ? 0 : deltaMinutes;
  const productivityDiscrepancy = convertToTimeFormat(productivityDiscrepancyMinutes);

  // Create a new row in the table
  const table = document.getElementById('tour-table').getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();

  // Insert cells in the new row and set their content
  newRow.insertCell(0).textContent = sector;
  newRow.insertCell(1).textContent = `${ofpBlockHours}h ${ofpBlockMinutes}m`;
  newRow.insertCell(2).textContent = `${actualBlockHours}h ${actualBlockMinutes}m`;
  newRow.insertCell(3).textContent = delta;
  newRow.insertCell(4).textContent = corrected ? 'TRUE' : 'FALSE';
  newRow.insertCell(5).textContent = productivityDiscrepancy;

  // Add delete button to the new row
  const deleteButtonCell = newRow.insertCell(6);
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-row');
  deleteButton.addEventListener('click', function() {
    table.deleteRow(newRow.rowIndex - 1);
    recalculateTotals(); // Recalculate totals after row deletion
  });
  deleteButtonCell.appendChild(deleteButton);

  // Reset the form after submission
  document.getElementById('tour-form').reset();

  // Recalculate the totals (for the entire table)
  recalculateTotals();
});

// Function to convert time in hours and minutes to total minutes
function convertToMinutes(hours, minutes) {
  return (parseInt(hours) * 60) + parseInt(minutes);
}

// Function to convert minutes to hh:mm format
function convertToTimeFormat(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

// Function to recalculate the totals
function recalculateTotals() {
  const rows = document.querySelectorAll('#tour-table tbody tr');
  let totalOFPBlock = 0;
  let totalActualBlock = 0;
  let totalDelta = 0;
  let totalProductivity = 0;

  rows.forEach(row => {
    const ofpBlock = row.cells[1].textContent;
    const actualBlock = row.cells[2].textContent;
    const delta = row.cells[3].textContent;
    const productivity = row.cells[5].textContent;

    totalOFPBlock += convertToMinutesFromTimeString(ofpBlock);
    totalActualBlock += convertToMinutesFromTimeString(actualBlock);
    totalDelta += convertToMinutesFromTimeString(delta);
    totalProductivity += convertToMinutesFromTimeString(productivity);
  });

  document.getElementById('total-ofp-block').textContent = convertToTimeFormat(totalOFPBlock);
  document.getElementById('total-actual-block').textContent = convertToTimeFormat(totalActualBlock);
  document.getElementById('total-delta').textContent = convertToTimeFormat(totalDelta);
  document.getElementById('total-productivity').textContent = convertToTimeFormat(totalProductivity);
}

// Function to convert time format (hh:mm) back to minutes
function convertToMinutesFromTimeString(time) {
  const [hours, minutes] = time.split('h').map(num => parseInt(num.trim(), 10));
  return (hours * 60) + minutes;
}
