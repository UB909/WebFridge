$(document).ready(function () {
  if ('wakeLock' in navigator) {
    var btn = document.getElementById('noSleepButton');
    btn.style.color = 'darkred';

    let wakeLock = null;

    // create an async function to request a wake lock
    const requestWakeLock = async () => {
      try {
        wakeLock = await navigator.wakeLock.request('screen');

        btn.style.color = 'yellow';

        // listen for our release event
        wakeLock.addEventListener('release', () => {
          btn.style.color = 'darkred';
        });

      } catch (err) {
        // if wake lock request fails - usually system related, such as battery
        btn.style.color = 'grey';
      }
    } 

    btn.addEventListener('click', () => {
      if (btn.style.color === 'darkred') {
        requestWakeLock()
      } else { // if it's on release it
        wakeLock.release()
          .then(() => {
            wakeLock = null;
          })
      }
    })
  }
});

