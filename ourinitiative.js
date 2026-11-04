
document.addEventListener("DOMContentLoaded", function () {

  /* =====================================================
     PAGE LOADER
  ===================================================== */

  const pageLoader = document.getElementById("page-loader");

  if (pageLoader) {
    setTimeout(function () {
      document.body.classList.add("loaded");
      pageLoader.classList.add("hide");

      setTimeout(function () {
        pageLoader.style.display = "none";
      }, 900);

    }, 1600);
  }


  /* =====================================================
     RESPONSIVE MOBILE NAVIGATION
  ===================================================== */

  const menuToggle = document.getElementById("menuToggle");
  const navbar = document.getElementById("navbar");

  function closeMenu() {
    if (!menuToggle || !navbar) return;

    navbar.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  if (menuToggle && navbar) {

    menuToggle.addEventListener("click", function () {

      const isOpen = navbar.classList.toggle("active");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';

    });

    navbar.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 650) {
        closeMenu();
      }
    });

  }


  /* =====================================================
     GALLERY FILTER
  ===================================================== */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const photoCards = document.querySelectorAll(".initiative-photo-card");
  const galleryCount = document.getElementById("galleryCount");
  const galleryEmpty = document.getElementById("galleryEmpty");

  function filterGallery(category) {

    let visibleCount = 0;

    photoCards.forEach(function (card) {

      const cardCategory = card.dataset.category;

      const shouldShow =
        category === "all" || cardCategory === category;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      }

    });

    filterButtons.forEach(function (button) {

      const isActive = button.dataset.filter === category;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));

    });

    if (galleryCount) {
      galleryCount.textContent =
        "Showing " + visibleCount +
        (visibleCount === 1 ? " photograph" : " photographs");
    }

    if (galleryEmpty) {
      galleryEmpty.hidden = visibleCount !== 0;
    }

  }

  filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {
      filterGallery(button.dataset.filter);
    });

  });

  /* DEFAULT CATEGORY */
  filterGallery("education");


  /* =====================================================
     IMAGE FALLBACK
  ===================================================== */

  const galleryImages = document.querySelectorAll(
    ".initiative-photo-wrap img"
  );

  galleryImages.forEach(function (img) {

    const fallback = img.parentElement.querySelector(
      ".initiative-photo-fallback"
    );

    function showFallback() {

      img.style.display = "none";

      if (fallback) {
        fallback.hidden = false;
      }

    }

    function showImage() {

      img.style.display = "block";

      if (fallback) {
        fallback.hidden = true;
      }

    }

    img.addEventListener("error", showFallback);
    img.addEventListener("load", showImage);

    if (img.complete) {

      if (img.naturalWidth === 0) {
        showFallback();
      } else {
        showImage();
      }

    }

  });


  /* =====================================================
     YOUTUBE VIDEO
  ===================================================== */

  const youtubeVideo = document.getElementById(
    "adnyanYoutubeVideo"
  );

  if (youtubeVideo) {

    youtubeVideo.addEventListener("error", function () {
      console.log(
        "YouTube video could not be loaded. Check the video embedding settings."
      );
    });

  }


  /* =====================================================
     DONATION DASHBOARD
  ===================================================== */

  let selectedAmount = 500;

  const amountButtons = document.querySelectorAll(".amount-btn");

  const customAmount = document.getElementById("customAmount");
  const donationPurpose = document.getElementById("donationPurpose");

  const summaryAmount = document.getElementById("summaryAmount");
  const summaryTotal = document.getElementById("summaryTotal");
  const summaryPurpose = document.getElementById("summaryPurpose");

  const donorName = document.getElementById("donorName");
  const donorEmail = document.getElementById("donorEmail");
  const donorPhone = document.getElementById("donorPhone");

  const payNowBtn = document.getElementById("payNowBtn");
  const backToDonationBtn = document.getElementById(
    "backToDonationBtn"
  );

  const paymentStep = document.getElementById("paymentStep");
  const paymentAmount = document.getElementById("paymentAmount");
  const paymentPurpose = document.getElementById("paymentPurpose");
  const paymentDonor = document.getElementById("paymentDonor");

  const donationFormView = document.getElementById(
    "donationFormView"
  );

  const donationTitle = document.getElementById("donation-title");


  /* FORMAT AMOUNT */

  function formatAmount(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
  }


  /* GET CURRENT AMOUNT */

  function getDonationAmount() {

    if (customAmount && customAmount.value.trim() !== "") {
      return Number(customAmount.value);
    }

    return selectedAmount;

  }


  /* UPDATE DONATION SUMMARY */

  function updateDonationSummary() {

    const amount = getDonationAmount();

    const validAmount =
      Number.isFinite(amount) && amount > 0 ? amount : 0;

    const purpose = donationPurpose
      ? donationPurpose.value
      : "General Donation";

    if (summaryAmount) {
      summaryAmount.textContent = formatAmount(validAmount);
    }

    if (summaryTotal) {
      summaryTotal.textContent = formatAmount(validAmount);
    }

    if (summaryPurpose) {
      summaryPurpose.textContent = purpose;
    }

  }


  /* =====================================================
     PRESET AMOUNT BUTTONS
  ===================================================== */

  amountButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      selectedAmount = Number(button.dataset.amount);

      amountButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");

      if (customAmount) {
        customAmount.value = "";
      }

      updateDonationSummary();

    });

  });


  /* =====================================================
     CUSTOM AMOUNT
  ===================================================== */

  if (customAmount) {

    customAmount.addEventListener("input", function () {

      amountButtons.forEach(function (button) {
        button.classList.remove("active");
      });

      updateDonationSummary();

    });

  }


  /* =====================================================
     DONATION PURPOSE
  ===================================================== */

  if (donationPurpose) {

    donationPurpose.addEventListener("change", function () {
      updateDonationSummary();
    });

  }


  /* =====================================================
     MOBILE NUMBER VALIDATION
  ===================================================== */

  if (donorPhone) {

    donorPhone.addEventListener("input", function () {

      this.value = this.value.replace(/\D/g, "").slice(0, 10);

    });

  }


  /* =====================================================
     CONTINUE TO PAYMENT
  ===================================================== */

  if (payNowBtn) {

    payNowBtn.addEventListener("click", function () {

      const name = donorName
        ? donorName.value.trim()
        : "";

      const email = donorEmail
        ? donorEmail.value.trim()
        : "";

      const phone = donorPhone
        ? donorPhone.value.trim()
        : "";

      const amount = getDonationAmount();


      /* AMOUNT VALIDATION */

      if (!Number.isFinite(amount) || amount <= 0) {

        alert("Please enter a valid donation amount.");

        if (customAmount) {
          customAmount.focus();
        }

        return;

      }


      /* NAME VALIDATION */

      if (!name) {

        alert("Please enter your name.");

        if (donorName) {
          donorName.focus();
        }

        return;

      }


      /* EMAIL VALIDATION */

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");

        if (donorEmail) {
          donorEmail.focus();
        }

        return;

      }


      /* PHONE VALIDATION */

      if (!/^[0-9]{10}$/.test(phone)) {

        alert("Please enter a valid 10-digit mobile number.");

        if (donorPhone) {
          donorPhone.focus();
        }

        return;

      }


      /* DONATION PURPOSE */

      const purpose = donationPurpose
        ? donationPurpose.value
        : "General Donation";


      /* UPDATE PAYMENT DETAILS */

      if (paymentAmount) {
        paymentAmount.textContent = formatAmount(amount);
      }

      if (paymentPurpose) {
        paymentPurpose.textContent = purpose;
      }

      if (paymentDonor) {
        paymentDonor.textContent = name;
      }


      /* HIDE FORM AND SHOW QR PAYMENT SCREEN */

      if (donationFormView) {
        donationFormView.hidden = true;
      }

      if (paymentStep) {
        paymentStep.hidden = false;
      }

      if (donationTitle) {
        donationTitle.textContent = "Complete Your Donation";
      }


      /* SCROLL TO PAYMENT */

      if (paymentStep) {

        paymentStep.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }

    });

  }


  /* =====================================================
     BACK TO DONATION FORM
  ===================================================== */

  if (backToDonationBtn) {

    backToDonationBtn.addEventListener("click", function () {

      if (paymentStep) {
        paymentStep.hidden = true;
      }

      if (donationFormView) {
        donationFormView.hidden = false;
      }

      if (donationTitle) {
        donationTitle.textContent = "Make a Donation";
      }

      const donationDashboard = document.getElementById(
        "donation-dashboard"
      );

      if (donationDashboard) {

        donationDashboard.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  }


  /* =====================================================
     INITIAL SUMMARY
  ===================================================== */

  updateDonationSummary();

});
