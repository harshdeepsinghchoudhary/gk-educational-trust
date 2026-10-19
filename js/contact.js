'use strict';
const enquiryForm = document.getElementById('enquiry-form');
const formStatus = document.getElementById('form-status');
// No field has a name attribute. No fetch, storage or submission service is used.
// The submit control is enabled only after the prevention handler is installed.
enquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;
  formStatus.textContent = 'This is a demonstration form. Your information has not been submitted or stored.';
  formStatus.hidden = false;
  formStatus.setAttribute('tabindex', '-1');
  formStatus.focus();
  enquiryForm.reset();
});
enquiryForm.addEventListener('input', () => { formStatus.hidden = true; });
document.getElementById('demo-submit').disabled = false;
