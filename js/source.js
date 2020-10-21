// jscs:disable validateLineBreaks
// jscs:disable validateQuoteMarks
// jscs:disable disallowMultipleLineBreaks
// jscs:disable requirePaddingNewLinesBeforeLineComments
// jscs:disable requireTrailingComma
// jscs:disable disallowQuotedKeysInObjects
// jscs:disable requireShorthandArrowFunctions
/* jshint esversion: 8 */

document.addEventListener("DOMContentLoaded", () => {

  /* ============================================= */
  /*              Declarations                     */
  /* ============================================= */

  Chart.defaults.global.defaultFontColor = "rgb(102, 102, 102, 0.6)";

  const trafficChartConfig = {
    type: "line",
    data: {
      datasets: [{
        label: "visitors",
        fill: "origin",
        backgroundColor: "rgba(116, 119, 191, 0.2)",
        borderColor: "rgba(116, 119, 191)",
        borderWidth: 0,
        lineTension: 0,
        pointBackgroundColor: "#fff",
        pointRadius: 5,
        pointBorderWidth: 2
      }]
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          type: "time",
          bounds: "ticks",
          time: {
            displayFormats: {
              week: 'MMM D'
            }
          },
          ticks: {
            source: "auto"
          },
          distribution: "linear"
        }],
        yAxes: [{
          ticks: {
            source: "auto"
          }
        }]
      },
      animation: {
        duration: 0 // general animation time
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  };

  const dailyTrafficChartConfig = {
    type: "bar",
    data: {
      datasets: [{
        label: "visitors",
        backgroundColor: "rgba(116, 119, 191, 1)",
        hoverBackgroundColor: "rgba(116, 119, 191, 1)",
        borderColor: "rgba(116, 119, 191)",
        barPercentage: 0.6,
        minBarLength: 20
      }]
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 800,
            source: "auto"
          }
        }]
      },
      animation: {
        duration: 0 // general animation time
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  };

  const mobileUsersChartConfig = {
    type: "doughnut",
    data: {
      datasets: [{
        label: "visitors",
        backgroundColor: ["#7477bf", "#81c98f", "#74b1bf"],
        borderColor: "#fff",
        borderWidth: 2
      }]
    },
    options: {
      maintainAspectRatio: false,
      cutoutPercentage: 55,
      legend: {
        display: true,
        position: "right",
        reverse: true,
        labels: {
          padding: 20,
          fontSize: 15
        }
      },
      animation: {
        duration: 0 // general animation time
      },
      responsiveAnimationDuration: 0 // animation duration after a resize
    }
  };

  function colorSelect(select) {
    select.style.color = "#000";
  }

  function getSeries(ajson, what) {
    return ajson.data.map(el => el[what]);
  }

  function updateTrafficChart(newScope) {
    const trafficJSONs = {
      hourly: {
        json: hourlyVisitorsJSON,
        unit: "hour"
      },
      daily: {
        json: dailyVisitorsJSON,
        unit: "day"
      },
      weekly: {
        json: weeklyVisitorsJSON,
        unit: "week"
      },
      monthly: {
        json: monthlyVisitorsJSON,
        unit: "month"
      }
    };
    const newDataset = trafficJSONs[newScope].json.data
      .map((dp) => {
        return {
          x: moment(dp.date, "MM/DD/YY HH:mm"),
          y: dp.visitors
        };
      });
    trafficChart.data.datasets[0].data = newDataset;
    trafficChart.options.scales.xAxes[0].time.unit = trafficJSONs[newScope].unit;
    trafficChart.update();
  }

  function updateDailyTrafficChart() {
    const dataLength = dailyVisitorsJSON.data.length;
    const newLabels = getSeries(dailyVisitorsJSON, "date")
      .slice(dataLength - 7, dataLength)
        .map((el) => {
          return moment(el, "MM/DD/YY HH:mm").format("ddd");
        });
    const newSeries = getSeries(dailyVisitorsJSON, "visitors")
      .slice(dataLength - 7, dataLength);
    dailyTrafficChart.data.labels = newLabels;
    dailyTrafficChart.data.datasets[0].data = newSeries;
    dailyTrafficChart.update();
  }

  function updateMobileUsersChart() {
    const newLabels = getSeries(mobileUsersJSON, "category")
      .map(el => el.charAt(0).toUpperCase() + el.slice(1));
    const newSeries = getSeries(mobileUsersJSON, "percentage")
      .map(el => el.substring(0, el.length - 1));
    mobileUsersChart.data.labels = newLabels;
    mobileUsersChart.data.datasets[0].data = newSeries;
    mobileUsersChart.update();
  }

  function toggleHeight(element) {
    const height = element.style.height;
    if (height === "0px") {
      requestAnimationFrame(() => {
        const contentHeight = element.scrollHeight + "px";
        element.style.height = contentHeight;
      });
    } else {
      requestAnimationFrame(() => {
        element.style.height = "0px";
      });
    }
  }

  function snapHeight(element) {
    element.style.height = null;
    const contentHeight = element.scrollHeight + "px";
    element.style.height = contentHeight;
  }

  function addTempTransition(element, transition) {
    element.style.transition = transition;
    element.addEventListener("transitionend", function handler() {
      element.removeEventListener("transitionend", handler);
      element.style.transition = null;
    });
  }

  // jshint ignore: start
  // function below comes from www.w3schools.com
  function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
      var a = this.value;
      var b = this.value;
      var i = this.value;
      var val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) {
        return false;
      }

      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });

          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });

    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }
  // jshint ignore: end

  function showPopup(type) {
    const popup = document.createElement("p");
    popup.classList.add("popup");
    body.appendChild(popup);

    if (type === "Empty name") {
      popup.innerHTML = "Recipients field can't be blank";
      popup.style.backgroundColor = "rgb(219, 179, 91)";
    } else if (type === "Empty message") {
      popup.innerHTML = "Message field can't be blank";
      popup.style.backgroundColor = "rgb(219, 179, 91)";
    } else if (type === "Success") {
      popup.innerHTML = "Message sent";
      popup.style.backgroundColor = "#7477bf";
    } else if (type === "No local storage") {
      popup.innerHTML = "Please enable local storage";
      popup.style.backgroundColor = "rgb(219, 179, 91)";
    }

    requestAnimationFrame(() => {
      popup.style.transform = "translate3d(-50%, 30px, 0)";
      popup.style.opacity = "1";
    });

    window.setTimeout(() => {
      popup.style.opacity = "0";
      window.setTimeout(() => {
        popup.remove();
      }, 1000);
    }, 2000);
  }

  function localStorageAvailable() {
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadSettings(storage) {
    if (localStorageAvailable) {
      emailNotifToggle.checked = (
        storage.getItem("email notifications") === "true"
      );
      profilePublicToggle.checked = (
        storage.getItem("user profile set to public") === "true"
      );
      const options = userTimeZone.querySelectorAll("option");
      for (let i = 0; i < options.length; i++) {
        if (storage.getItem("user time zone id") === options[i].getAttribute("data-timeZoneId")) {
          options[i].selected = true;
        }
      }
    }
  }

  /* ============================================= */
  /*              Selectors                        */
  /* ============================================= */

  const body = document.querySelector("body");
  const header = document.querySelector("header.app-header");
  const alertSpace = document.querySelector("div.alert-space");
  const oldAlerts = alertSpace.querySelector("div.old-alerts");
  const ctx1 = document.querySelector("#traffic-canvas").getContext("2d");
  const ctx2 = document.querySelector("#daily-traffic-canvas").getContext("2d");
  const ctx3 = document.querySelector("#mobile-users-canvas").getContext("2d");
  const settings = document.querySelector(".widget.settings");
  const traffic = document.querySelector(".widget.traffic");
  const messageUser = document.querySelector(".widget.message-user");
  const msgForm = messageUser.querySelector("form#msg-form");
  const userNameInput = messageUser.querySelector("input#user-name-input");
  const emailNotifToggle = settings.querySelector("input#email-notif-toggle");
  const profilePublicToggle = settings.querySelector("input#profile-public-toggle");
  const userTimeZone = settings.querySelector("select[name='user-time-zone']");

  /* ============================================= */
  /*              Example data                     */
  /* ============================================= */

  // jscs: disable
  const hourlyVisitorsJSON = {"data":[{"date":"10/14/20 0:00","visitors":"93"},{"date":"10/14/20 1:00","visitors":"102"},{"date":"10/14/20 2:00","visitors":"109"},{"date":"10/14/20 3:00","visitors":"111"},{"date":"10/14/20 4:00","visitors":"99"},{"date":"10/14/20 5:00","visitors":"98"},{"date":"10/14/20 6:00","visitors":"105"},{"date":"10/14/20 7:00","visitors":"95"},{"date":"10/14/20 8:00","visitors":"100"},{"date":"10/14/20 9:00","visitors":"98"},{"date":"10/14/20 10:00","visitors":"110"},{"date":"10/14/20 11:00","visitors":"101"},{"date":"10/14/20 12:00","visitors":"119"},{"date":"10/14/20 13:00","visitors":"110"},{"date":"10/14/20 14:00","visitors":"95"},{"date":"10/14/20 15:00","visitors":"99"},{"date":"10/14/20 16:00","visitors":"93"},{"date":"10/14/20 17:00","visitors":"105"},{"date":"10/14/20 18:00","visitors":"131"},{"date":"10/14/20 19:00","visitors":"143"},{"date":"10/14/20 20:00","visitors":"144"},{"date":"10/14/20 21:00","visitors":"129"},{"date":"10/14/20 22:00","visitors":"111"},{"date":"10/14/20 23:00","visitors":"95"}]};

  const dailyVisitorsJSON = {"data":[{"date":"10/1/20 23:00","visitors":"670"},{"date":"10/2/20 23:00","visitors":"684"},{"date":"10/3/20 23:00","visitors":"688"},{"date":"10/4/20 23:00","visitors":"680"},{"date":"10/5/20 23:00","visitors":"698"},{"date":"10/6/20 23:00","visitors":"711"},{"date":"10/7/20 23:00","visitors":"781"},{"date":"10/8/20 23:00","visitors":"841"},{"date":"10/9/20 23:00","visitors":"885"},{"date":"10/10/20 23:00","visitors":"880"},{"date":"10/11/20 23:00","visitors":"867"},{"date":"10/12/20 23:00","visitors":"856"},{"date":"10/13/20 23:00","visitors":"895"},{"date":"10/14/20 23:00","visitors":"922"}]};

  const weeklyVisitorsJSON = {"data":[{"date":"8/12/20 23:00","visitors":"1986"},{"date":"8/19/20 23:00","visitors":"2236"},{"date":"8/26/20 23:00","visitors":"2211"},{"date":"9/2/20 23:00","visitors":"2357"},{"date":"9/9/20 23:00","visitors":"2408"},{"date":"9/16/20 23:00","visitors":"2440"},{"date":"9/23/20 23:00","visitors":"2711"},{"date":"9/30/20 23:00","visitors":"2898"},{"date":"10/7/20 23:00","visitors":"2695"},{"date":"10/14/20 23:00","visitors":"3122"}]};

  const monthlyVisitorsJSON = {"data":[{"date":"6/30/20 23:00","visitors":"4"},{"date":"7/31/20 23:00","visitors":"938"},{"date":"8/31/20 23:00","visitors":"3104"},{"date":"9/30/20 23:00","visitors":"6519"},{"date":"10/14/20 23:00","visitors":"4471"}]};

  const mobileUsersJSON = {"data":[{"category":"desktop","percentage":"71%"},{"category":"tablets","percentage":"16%"},{"category":"phones","percentage":"13%"}]};

  const members = ["Amir Nicholson", "Andrew Wall", "Arnold Schwarzenegger", "Brad Pitt", "Dale Byrd", "Dan Oliver", "Dawn Wood", "Henry Leonard", "Jane Doe", "Jennifer Lee", "John Smith", "Saul Dillon", "Victoria Chambers"];
  // jscs: enable

  /* ============================================= */
  /*              Event handlers                   */
  /* ============================================= */

  // on DOMContentLoaded
  oldAlerts.style.height = "0px";

  let trafficChart = new Chart(ctx1, trafficChartConfig);
  updateTrafficChart("weekly");
  let dailyTrafficChart = new Chart(ctx2, dailyTrafficChartConfig);
  updateDailyTrafficChart();
  let mobileUsersChart = new Chart(ctx3, mobileUsersChartConfig);
  updateMobileUsersChart();

  autocomplete(userNameInput, members);
  loadSettings(localStorage);

  header.addEventListener("click", (event) => {
    if (event.target.classList.contains("notifications-link")) {
      toggleHeight(oldAlerts);
      addTempTransition(oldAlerts, "height .2s ease-out");
    }
  });

  alertSpace.addEventListener("click", (event) => {
    if (event.target.classList.contains("close-alert")) {
      const alert = event.target.parentNode;
      if (alert.parentNode.classList.contains("old-alerts")) {
        alert.parentNode.removeChild(alert);
        snapHeight(oldAlerts);
      } else {
        alert.parentNode.removeChild(alert);
      }
    }
  });

  traffic.addEventListener("change", (event) => {
    if (event.target.type === "radio") {
      let chartScope = event.target.id;
      updateTrafficChart(chartScope);
    }
  });

  userNameInput.addEventListener("focusout", (event) => {
    if (event.target.id === "user-name-input") {
      if (!members.includes(userNameInput.value)) {
        userNameInput.value = null;
      }
    }
  });

  msgForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const messageInput = msgForm.children[1];
    userNameInput.style.border = null;
    messageInput.style.border = null;

    // required attr set in markup
    if (userNameInput.validity.valueMissing) {
      showPopup("Empty name");
      userNameInput.style.border = "1px solid red";
    } else if (messageInput.validity.valueMissing) {
      showPopup("Empty message");
      messageInput.style.border = "1px solid red";
    } else {
      // submit form code here
      showPopup("Success");
      userNameInput.value = "";
      messageInput.value = "";
    }
  });

  settings.addEventListener("change", (event) => {
    if (event.target.tagName === "SELECT") {
      colorSelect(event.target);
    }
  });

  settings.addEventListener("click", (event) => {
    if (event.target.classList.contains("confirm")) {
      if (localStorageAvailable()) {
        localStorage.setItem("email notifications", emailNotifToggle.checked);
        localStorage.setItem("user profile set to public", profilePublicToggle.checked);
        const options = userTimeZone.querySelectorAll("option");
        for (let i = 0; i < options.length; i++) {
          if (options[i].selected) {
            localStorage.setItem("user time zone id", options[i].getAttribute("data-timeZoneId"));
          }
        }
      } else {
        showPopup("No local storage");
      }
    } else if (event.target.classList.contains("cancel")) {
      emailNotifToggle.checked = false;
      profilePublicToggle.checked = false;
      userTimeZone.value = "";
      userTimeZone.style.color = null;
      if (localStorageAvailable()) {
        localStorage.removeItem("email notifications");
        localStorage.removeItem("user profile set to public");
        localStorage.removeItem("user time zone id");
      }
    }
  });

});
