document.addEventListener('DOMContentLoaded', function () {

  // PAGE LOADER
  const loader = document.getElementById('page-loader');

  window.setTimeout(function () {
    if (loader) loader.classList.add('hide');
    document.body.classList.add('loaded');
  }, 1600);


  // MOBILE NAVIGATION
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');

  if (menuToggle && navbar) {

    menuToggle.addEventListener('click', function () {

      const isOpen = navbar.classList.toggle('open');

      menuToggle.setAttribute('aria-expanded', String(isOpen));

      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';

    });

    navbar.querySelectorAll('a').forEach(function (link) {

      link.addEventListener('click', function () {

        navbar.classList.remove('open');

        menuToggle.setAttribute('aria-expanded', 'false');

        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';

      });

    });

  }


  // REVEAL ANIMATION
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add('is-visible');

            observer.unobserve(entry.target);

          }

        });

      },
      { threshold: 0.12 }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });

  } else {

    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });

  }


  // DONATION DASHBOARD
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customAmount = document.getElementById('customAmount');
  const purpose = document.getElementById('donationPurpose');
  const summaryAmount = document.getElementById('summaryAmount');
  const summaryPurpose = document.getElementById('summaryPurpose');
  const summaryTotal = document.getElementById('summaryTotal');
  const payNowBtn = document.getElementById('payNowBtn');
  const phoneInput = document.getElementById('donorPhone');

  let selectedAmount = 500;


  // FORMAT AMOUNT
  function formatRupees(value) {
    return '₹' + Number(value || 0).toLocaleString('en-IN');
  }


  // UPDATE DONATION SUMMARY
  function updateSummary(amount) {

    selectedAmount = Math.max(0, Number(amount) || 0);

    if (summaryAmount) {
      summaryAmount.textContent = formatRupees(selectedAmount);
    }

    if (summaryTotal) {
      summaryTotal.textContent = formatRupees(selectedAmount);
    }

    if (summaryPurpose && purpose) {
      summaryPurpose.textContent = purpose.value;
    }

  }


  // PRESET AMOUNT BUTTONS
  amountButtons.forEach(function (button) {

    button.addEventListener('click', function () {

      amountButtons.forEach(function (item) {
        item.classList.remove('active');
      });

      button.classList.add('active');

      if (customAmount) {
        customAmount.value = '';
      }

      updateSummary(button.dataset.amount);

      const paymentAmount = document.getElementById('paymentAmount');

      if (paymentAmount) {
        paymentAmount.textContent = formatRupees(selectedAmount);
      }

    });

  });


  // CUSTOM AMOUNT
  if (customAmount) {

    customAmount.addEventListener('input', function () {

      amountButtons.forEach(function (button) {
        button.classList.remove('active');
      });

      updateSummary(customAmount.value);

      const paymentAmount = document.getElementById('paymentAmount');

      if (paymentAmount) {
        paymentAmount.textContent = formatRupees(selectedAmount);
      }

    });

  }


  // DONATION PURPOSE
  if (purpose) {

    purpose.addEventListener('change', function () {

      updateSummary(selectedAmount);

      const paymentPurpose = document.getElementById('paymentPurpose');

      if (paymentPurpose) {
        paymentPurpose.textContent = purpose.value;
      }

    });

  }


  // MOBILE NUMBER: ALLOW ONLY 10 DIGITS
  if (phoneInput) {

    phoneInput.addEventListener('input', function () {

      phoneInput.value = phoneInput.value
        .replace(/\D/g, '')
        .slice(0, 10);

    });

  }


  // PAY NOW BUTTON
  if (payNowBtn) {

    payNowBtn.addEventListener('click', function () {

      const donorName = document.getElementById('donorName');
      const donorEmail = document.getElementById('donorEmail');

      const name = donorName ? donorName.value.trim() : '';
      const email = donorEmail ? donorEmail.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';


      // VALIDATE DONATION AMOUNT
      if (!selectedAmount || selectedAmount < 1) {

        alert('Please select or enter a donation amount.');

        if (customAmount) customAmount.focus();

        return;

      }


      // VALIDATE REQUIRED DETAILS
      if (!name || !email || !phone) {

        alert('Please complete your name, email address and mobile number.');

        if (!name && donorName) donorName.focus();
        else if (!email && donorEmail) donorEmail.focus();
        else if (!phone && phoneInput) phoneInput.focus();

        return;

      }


      // VALIDATE EMAIL
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        alert('Please enter a valid email address.');

        if (donorEmail) donorEmail.focus();

        return;

      }


      // VALIDATE PHONE
      if (!/^\d{10}$/.test(phone)) {

        alert('Please enter a valid 10-digit mobile number.');

        if (phoneInput) phoneInput.focus();

        return;

      }


      // UPDATE PAYMENT DETAILS
      const paymentAmount = document.getElementById('paymentAmount');
      const paymentPurpose = document.getElementById('paymentPurpose');
      const paymentDonor = document.getElementById('paymentDonor');
      const paymentStep = document.getElementById('paymentStep');

      if (paymentAmount) {
        paymentAmount.textContent = formatRupees(selectedAmount);
      }

      if (paymentPurpose && purpose) {
        paymentPurpose.textContent = purpose.value;
      }

      if (paymentDonor) {
        paymentDonor.textContent = name;
      }


      // QR CODE REMAINS VISIBLE.
      // SCROLL TO THE QR CODE AFTER VALIDATION.
      if (paymentStep) {

        paymentStep.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

      }

    });

  }


  // INITIAL SUMMARY
  updateSummary(selectedAmount);

});