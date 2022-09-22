/** List of the nine box elements */
const boxes = document.querySelectorAll(".box");
/** List of user clicked boxes */
const selected = [];
const drainBtn = document.getElementById('drainBtn');
const AUTO_DRAIN_CLICKS = 9;
/** A Text Node.
 * Changing it mutates DOM.
 */
let selectedCount = document.querySelector("h1").appendChild(new Text(0));
/** Whether accepting user click on boxes or not. */
let canInput = true;
/** Holds the color alpha values */
const selectStates = new Map([...Array(9)].map((v, i) => {
  return [boxes[i], 0];
}));

// Adding eventlisteners
for (const box of boxes) {
  box.onclick = () => {
    if (!canInput) return;
    selected.push(box);
    selectedCount.data++;
    if (selectedCount.data == AUTO_DRAIN_CLICKS) {
      canInput = false;
      drain().then(() => {
        canInput = true;
      });
    }
  };
}

drainBtn.onclick = () => {
  canInput = false;
  drainBtn.disabled = true;
  drainBtn.style.opacity = 0;
  drainBtn.nextElementSibling.style.opacity = 1;
  drain().then(() => {
    canInput = true;
    drainBtn.disabled = false;
    drainBtn.removeAttribute('style');
    drainBtn.nextElementSibling.removeAttribute('style');
  })
}

/** Apply the user clicks.
 * Happens automatically after user selects nine boxes.
 * Can also be called manually (ex. call it in the console after clicking 6 times).
 * 
 * Is an async function 
 * @resolves when the "drain" is completed
 */
function drain() {
  return new Promise((res) => {
    if (!selected.length) res('Already Drained');
    let convertedCount = 0;
    let i = 0;
    while (selected.length) {
      const box = selected.shift();
      setTimeout(() => {
        selectStates.set(box, selectStates.get(box) + 1);
        box.style.backgroundColor = `rgba(0,0,0,${
          ((100 / 9) * selectStates.get(box)) / 100
        }`;
        selectedCount.data--;
        convertedCount++;
        if (selectedCount.data === '0') {
          res("Converted All");
        }
      }, (i + 1) * 500);
      i++;
    }
  });
}
