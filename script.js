document.addEventListener('DOMContentLoaded', function () {

  // ORIGINAL ADNYAN PAGE LOADER
  const loader = document.getElementById("page-loader");
  window.setTimeout(function () {
    if (loader) {
      loader.classList.add("hide");
    }
    document.body.classList.add("loaded");
  }, 1600);


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

  // Animate all impact figures when the impact section enters the screen.
  const impactSection = document.getElementById('impact');
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function startImpactCounters() {
    if (countersStarted || !counters.length) return;
    countersStarted = true;

    counters.forEach(function (counter) {
      const target = Number(counter.dataset.target);
      if (!Number.isFinite(target)) return;

      const duration = 1800;
      const startTime = performance.now();

      function updateCounter(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(target * easedProgress);

        counter.textContent = currentValue.toLocaleString('en-IN');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString('en-IN');
        }
      }

      counter.textContent = '0';
      requestAnimationFrame(updateCounter);
    });
  }

  function checkImpactVisibility() {
    if (!impactSection || countersStarted) return;
    const sectionPosition = impactSection.getBoundingClientRect();
    if (sectionPosition.top < window.innerHeight - 40 && sectionPosition.bottom > 0) {
      startImpactCounters();
    }
  }

  // Wait until the original page loader has finished before observing the section.
  window.setTimeout(function () {
    if (!impactSection || !counters.length) return;

    if ('IntersectionObserver' in window) {
      const impactObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startImpactCounters();
            impactObserver.disconnect();
          }
        });
      }, { threshold: 0.15 });

      impactObserver.observe(impactSection);
    }

    // Fallback and initial check for browsers or layouts where observation is delayed.
    checkImpactVisibility();
    window.addEventListener('scroll', checkImpactVisibility, { passive: true });
    window.addEventListener('resize', checkImpactVisibility);
  }, 1700);

  // Donation amount and summary.
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customAmount = document.getElementById('customAmount');
  const purpose = document.getElementById('donationPurpose');
  const summaryAmount = document.getElementById('summaryAmount');
  const summaryPurpose = document.getElementById('summaryPurpose');
  const summaryTotal = document.getElementById('summaryTotal');
  const payNowBtn = document.getElementById('payNowBtn');
  let selectedAmount = 500;

  function formatRupees(value) {
    return '₹' + Number(value || 0).toLocaleString('en-IN');
  }

  function updateSummary(amount) {
    selectedAmount = Math.max(0, Number(amount) || 0);
    summaryAmount.textContent = formatRupees(selectedAmount);
    summaryTotal.textContent = formatRupees(selectedAmount);
    summaryPurpose.textContent = purpose.value;
    const paymentAmount = document.getElementById('paymentAmount');
    const paymentPurpose = document.getElementById('paymentPurpose');
    if (paymentAmount) paymentAmount.textContent = formatRupees(selectedAmount);
    if (paymentPurpose) paymentPurpose.textContent = purpose.value;
  }

  amountButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      amountButtons.forEach(function (item) { item.classList.remove('active'); });
      button.classList.add('active');
      customAmount.value = '';
      updateSummary(button.dataset.amount);
    });
  });

  customAmount.addEventListener('input', function () {
    amountButtons.forEach(function (button) { button.classList.remove('active'); });
    updateSummary(customAmount.value);
  });

  purpose.addEventListener('change', function () {
    updateSummary(selectedAmount);
  });

  const phoneInput = document.getElementById('donorPhone');
  phoneInput.addEventListener('input', function () {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  });

  payNowBtn.addEventListener('click', function () {
    const name = document.getElementById('donorName').value.trim();
    const email = document.getElementById('donorEmail').value.trim();
    const phone = phoneInput.value.trim();
    if (!selectedAmount || selectedAmount < 1) {
      alert('Please select or enter a donation amount.');
      customAmount.focus();
      return;
    }
    if (!name || !email || !phone) {
      alert('Please complete your name, email address and mobile number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      document.getElementById('donorEmail').focus();
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit mobile number.');
      phoneInput.focus();
      return;
    }
    // The QR code is already visible above the Pay Now button.
    document.getElementById('paymentAmount').textContent = formatRupees(selectedAmount);
    document.getElementById('paymentPurpose').textContent = purpose.value;
    document.getElementById('paymentDonor').textContent = name;
    document.getElementById('paymentStep').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
